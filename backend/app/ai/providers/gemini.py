from typing import Any

from app.ai.providers.base import AIProvider
from app.core.config import settings
from fastapi import HTTPException
from google import genai
from google.genai import types
from pydantic import BaseModel


class GeminiProvider(AIProvider):

    def __init__(self):
        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY,
        )

        self.default_model = settings.GEMINI_MODEL

    async def generate(
        self,
        *,
        system_prompt: str,
        prompt: str,
        response_schema: type[BaseModel],
        model: str | None = None,
        temperature: float = 1.0,
        top_p: float = 0.95,
    ) -> Any:

        config = types.GenerateContentConfig(
            system_instruction=system_prompt,
            temperature=temperature,
            top_p=top_p,
            response_mime_type="application/json",
            response_schema=response_schema,
        )

        try:
            response = await self.client.aio.models.generate_content(
                model=model or self.default_model,
                contents=prompt,
                config=config,
            )

            if not response.text:
                raise RuntimeError(
                    "Gemini returned an empty response."
                )

            return response_schema.model_validate_json(
                response.text,
            )

        except HTTPException:
                raise
        
        except Exception as e:
            import traceback
        
            traceback.print_exc()
            raise HTTPException(
                status_code=500,
                detail=f"AI Generation Failed: {e}",
            )
        