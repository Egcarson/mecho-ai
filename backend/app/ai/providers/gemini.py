# from typing import Any

# from app.ai.providers.base import AIProvider
# from app.core.config import settings
# from fastapi import HTTPException
# from google import genai
# from google.genai import types
# from pydantic import BaseModel


# class GeminiProvider(AIProvider):

#     def __init__(self):
#         self.client = genai.Client(
#             api_key=settings.GEMINI_API_KEY,
#         )

#         self.default_model = settings.GEMINI_MODEL

#     async def generate(
#         self,
#         *,
#         system_prompt: str,
#         prompt: str,
#         response_schema: type[BaseModel],
#         model: str | None = None,
#         temperature: float = 1.0,
#         top_p: float = 0.95,
#     ) -> Any:

#         config = types.GenerateContentConfig(
#             system_instruction=system_prompt,
#             temperature=temperature,
#             top_p=top_p,
#             response_mime_type="application/json",
#             response_schema=response_schema,
#         )

#         try:
#             response = await self.client.aio.models.generate_content(
#                 model=model or self.default_model,
#                 contents=prompt,
#                 config=config,
#             )

#             if not response.text:
#                 raise RuntimeError(
#                     "Gemini returned an empty response."
#                 )

#             return response_schema.model_validate_json(
#                 response.text,
#             )

#         except HTTPException:
#                 raise
        
#         except Exception as e:
#             import traceback
        
#             traceback.print_exc()
#             raise HTTPException(
#                 status_code=500,
#                 detail=f"AI Generation Failed: {e}",
#             )
    
# from typing import Any, Literal

# from app.ai.providers.base import AIProvider
# from app.core.config import settings
# from fastapi import HTTPException
# from google import genai
# from google.genai import types
# from pydantic import BaseModel

# ThinkingLevel = Literal[
#     "low",
#     "medium",
#     "high",
# ]


# class GeminiProvider(AIProvider):

#     def __init__(self):
#         self.client = genai.Client(
#             api_key=settings.GEMINI_API_KEY,
#         )

#         self.default_model = (
#             settings.GEMINI_MODEL
#         )

#     async def generate(
#         self,
#         *,
#         system_prompt: str,
#         prompt: str,
#         response_schema: type[BaseModel],
#         model: str | None = None,
#         thinking_level: ThinkingLevel = "medium",
#     ) -> Any:

#         config = types.GenerateContentConfig(
#             system_instruction=system_prompt,

#             thinking_config=types.ThinkingConfig(
#                 thinking_level=thinking_level, #type: ignore
#             ),

#             response_mime_type="application/json",
#             response_schema=response_schema,
#         )

#         try:
#             response = (
#                 await self.client.aio.models.generate_content(
#                     model=(
#                         model
#                         or self.default_model
#                     ),
#                     contents=prompt,
#                     config=config,
#                 )
#             )

#             if not response.text:
#                 raise RuntimeError(
#                     "Gemini returned an empty response."
#                 )

#             return (
#                 response_schema
#                 .model_validate_json(
#                     response.text
#                 )
#             )

#         except HTTPException:
#             raise

#         except Exception as exc:
#             import traceback

#             traceback.print_exc()

#             raise HTTPException(
#                 status_code=500,
#                 detail=(
#                     "AI Generation Failed: "
#                     f"{exc}"
#                 ),
#             ) from exc


import asyncio
import traceback
from typing import Any

from app.ai.providers.base import AIProvider
from app.core.config import settings
from fastapi import HTTPException, status
from google import genai
from google.genai import types
from google.genai.errors import ServerError
from pydantic import BaseModel


class GeminiProvider(AIProvider):

    # Number of attempts on each model before
    # moving to the next fallback.
    RETRIES_PER_MODEL = 2

    # Small exponential retry delays.
    RETRY_DELAYS = (
        2,
        5,
    )

    # Fallback order.
    #
    # The configured GEMINI_MODEL is always tried first,
    # so changing the environment variable still controls
    # Mecho's primary model.
    FALLBACK_MODELS = (
        "gemini-3.5-flash-lite",
        "gemini-2.5-flash",
    )

    def __init__(self):
        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY,
        )

        self.default_model = (
            settings.GEMINI_MODEL
        )

    async def generate(
        self,
        *,
        system_prompt: str,
        prompt: str,
        response_schema: type[BaseModel],
        model: str | None = None,
        thinking_level: types.ThinkingLevel = "medium",  # type: ignore
    ) -> Any:

        models_to_try = self._build_model_chain(
            preferred_model=model,
        )

        last_error: Exception | None = None

        for model_name in models_to_try:

            for attempt in range(
                self.RETRIES_PER_MODEL
            ):

                try:
                    config = self._build_config(
                        system_prompt=system_prompt,
                        response_schema=response_schema,
                        thinking_level=thinking_level,
                    )

                    response = (
                        await self.client
                        .aio
                        .models
                        .generate_content(
                            model=model_name,
                            contents=prompt,
                            config=config,
                        )
                    )

                    if not response.text:
                        raise RuntimeError(
                            "Gemini returned an empty response."
                        )

                    return (
                        response_schema
                        .model_validate_json(
                            response.text
                        )
                    )

                except ServerError as exc:
                    last_error = exc

                    # We only retry/fallback automatically
                    # for temporary upstream failures.
                    if not self._is_retryable_server_error(
                        exc
                    ):
                        traceback.print_exc()

                        raise HTTPException(
                            status_code=(
                                status
                                .HTTP_502_BAD_GATEWAY
                            ),
                            detail=(
                                "AI generation failed "
                                "because the provider "
                                "returned an unexpected "
                                "server error."
                            ),
                        ) from exc

                    # Retry same model first.
                    if (
                        attempt
                        < self.RETRIES_PER_MODEL - 1
                    ):
                        delay = self._retry_delay(
                            attempt
                        )

                        await asyncio.sleep(
                            delay
                        )

                        continue

                    # Attempts for this model are exhausted.
                    # Break to the next fallback model.
                    break

                except HTTPException:
                    raise

                except Exception as exc:
                    traceback.print_exc()

                    raise HTTPException(
                        status_code=(
                            status
                            .HTTP_500_INTERNAL_SERVER_ERROR
                        ),
                        detail=(
                            "AI generation failed."
                        ),
                    ) from exc

        # Every available model returned a
        # retryable upstream availability failure.
        raise HTTPException(
            status_code=(
                status.HTTP_503_SERVICE_UNAVAILABLE
            ),
            detail=(
                "AI generation is temporarily "
                "unavailable. Please try again shortly."
            ),
        ) from last_error

    def _build_config(
        self,
        *,
        system_prompt: str,
        response_schema: type[BaseModel],
        thinking_level: types.ThinkingLevel,
    ) -> types.GenerateContentConfig:

        return types.GenerateContentConfig(
            system_instruction=system_prompt,

            thinking_config=types.ThinkingConfig(
                thinking_level=thinking_level,  # type: ignore
            ),

            response_mime_type=(
                "application/json"
            ),

            response_schema=response_schema,
        )

    def _build_model_chain(
        self,
        *,
        preferred_model: str | None,
    ) -> list[str]:

        primary_model = (
            preferred_model
            or self.default_model
        )

        models = [
            primary_model,
            *self.FALLBACK_MODELS,
        ]

        # Remove duplicates while keeping
        # the original order.
        return list(
            dict.fromkeys(
                models
            )
        )

    @staticmethod
    def _is_retryable_server_error(
        exc: ServerError,
    ) -> bool:

        code = getattr(
            exc,
            "code",
            None,
        )

        return code in {
            500,
            502,
            503,
            504,
        }

    def _retry_delay(
        self,
        attempt: int,
    ) -> int:

        if attempt < len(
            self.RETRY_DELAYS
        ):
            return self.RETRY_DELAYS[
                attempt
            ]

        return self.RETRY_DELAYS[-1]