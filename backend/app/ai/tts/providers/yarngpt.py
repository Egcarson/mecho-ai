import asyncio

import httpx
from app.ai.tts.base import TTSProvider
from app.ai.tts.models import (
    TTSProviderCapabilities,
    VoiceScript,
)
from app.core.config import settings
from fastapi import HTTPException, status


class YarnGPTProvider(TTSProvider):

    BASE_URL = settings.VOICE_PROVIDER_BASE_URL

    POLL_INTERVAL_SECONDS = 2
    MAX_POLL_ATTEMPTS = 60

    def __init__(self):
        self.timeout = httpx.Timeout(
            connect=15.0,
            read=60.0,
            write=30.0,
            pool=15.0,
        )

    @property
    def capabilities(
        self,
    ) -> TTSProviderCapabilities:

        return TTSProviderCapabilities(
            supports_ssml=False,
            supports_emotions=False,
            supports_events=False,
            supports_pronunciation=False,
            supports_prosody=False,
            max_characters=10_000,
        )

    # async def synthesize(
    #     self,
    #     *,
    #     script: VoiceScript,
    #     voice: str | None = None,
    #     response_format: str = "mp3",
    # ) -> bytes:

    #     text = self._prepare_text(
    #         script,
    #     )

    #     if not text.strip():
    #         raise HTTPException(
    #             status_code=status.HTTP_400_BAD_REQUEST,
    #             detail="No text provided for voice generation.",
    #         )

    #     if len(text) > 10_000:
    #         raise HTTPException(
    #             status_code=status.HTTP_400_BAD_REQUEST,
    #             detail=(
    #                 "Voice content exceeds YarnGPT's "
    #                 "10,000 character limit."
    #             ),
    #         )

    #     if response_format not in {
    #         "mp3",
    #         "wav",
    #     }:
    #         raise HTTPException(
    #             status_code=status.HTTP_400_BAD_REQUEST,
    #             detail=(
    #                 "YarnGPT job generation currently "
    #                 "supports only mp3 and wav."
    #             ),
    #         )

    #     api_key = (
    #         settings.VOICE_PROVIDER_API_KEY.strip()
    #     )

    #     if not api_key:
    #         raise HTTPException(
    #             status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
    #             detail="Voice provider is not configured.",
    #         )

    #     idempotency_key = str(
    #         uuid.uuid4()
    #     )

    #     payload: dict = {
    #         "text": text,
    #         "output_format": response_format,
    #     }

    #     # Do NOT send a hardcoded default voice.
    #     # YarnGPT will use its current catalogue default
    #     # when this field is omitted.
    #     if voice:
    #         payload["voice"] = voice

    #     headers = {
    #         "Authorization": (
    #             f"Bearer {api_key}"
    #         ),
    #         "Idempotency-Key": (
    #             idempotency_key
    #         ),
    #     }

    #     timeout = httpx.Timeout(
    #         connect=15.0,
    #         read=60.0,
    #         write=30.0,
    #         pool=15.0,
    #     )

    #     try:
    #         async with httpx.AsyncClient(
    #             timeout=timeout,
    #             follow_redirects=True,
    #         ) as client:

    #             job = await self._create_job(
    #                 client=client,
    #                 headers=headers,
    #                 payload=payload,
    #             )

    #             job_id = job.get(
    #                 "job_id",
    #             )

    #             if not job_id:
    #                 raise HTTPException(
    #                     status_code=status.HTTP_502_BAD_GATEWAY,
    #                     detail=(
    #                         "Voice provider did not "
    #                         "return a job ID."
    #                     ),
    #                 )

    #             audio_url = await self._wait_for_job(
    #                 client=client,
    #                 job_id=job_id,
    #                 api_key=api_key,
    #             )

    #             return await self._download_audio(
    #                 client=client,
    #                 audio_url=audio_url,
    #             )

    #     except HTTPException:
    #         raise

    #     except httpx.TimeoutException as exc:
    #         raise HTTPException(
    #             status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
    #             detail=(
    #                 "Voice generation service timed out. "
    #                 "Please try again."
    #             ),
    #         ) from exc

    #     except httpx.RequestError as exc:
    #         raise HTTPException(
    #             status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
    #             detail=(
    #                 "Unable to connect to the "
    #                 "voice generation service."
    #             ),
    #         ) from exc

    async def synthesize(
        self,
        *,
        script: VoiceScript,
        voice: str | None = None,
        response_format: str = "mp3",
    ) -> bytes:

        raise RuntimeError(
            "YarnGPT uses asynchronous provider jobs. "
            "Use create_job(), get_job_status(), "
            "and download_audio()."
        )

    async def create_job(
        self,
        *,
        script: VoiceScript,
        idempotency_key: str,
        voice: str | None = None,
        response_format: str = "mp3",
    ) -> dict:

        text = self._prepare_text(
            script,
        )

        payload: dict = {
            "text": text,
            "output_format": response_format,
        }

        if voice:
            payload["voice"] = voice

        headers = {
            "Authorization": (
                f"Bearer "
                f"{settings.VOICE_PROVIDER_API_KEY.strip()}"
            ),
            "Idempotency-Key": idempotency_key,
        }

        try:
            async with httpx.AsyncClient(
                timeout=self.timeout,
            ) as client:

                response = await client.post(
                    f"{self.BASE_URL}/tts",
                    headers=headers,
                    json=payload,
                )

                if response.is_error:
                    self._raise_provider_error(
                        response,
                    )

                return response.json()

        except HTTPException:
            raise

        except httpx.TimeoutException as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=(
                    "Voice generation service timed out."
                ),
            ) from exc

        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=(
                    "Unable to connect to the "
                    "voice generation service."
                ),
            ) from exc

    async def get_job_status(
        self,
        job_id: str,
    ) -> dict:

        headers = {
            "Authorization": (
                f"Bearer "
                f"{settings.VOICE_PROVIDER_API_KEY.strip()}"
            ),
        }

        try:
            async with httpx.AsyncClient(
                timeout=self.timeout,
            ) as client:

                response = await client.get(
                    (
                        f"{self.BASE_URL}"
                        f"/status/{job_id}"
                    ),
                    headers=headers,
                )

                if response.is_error:
                    self._raise_provider_error(
                        response,
                    )

                return response.json()

        except HTTPException:
            raise

        except httpx.TimeoutException as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=(
                    "Voice generation status check "
                    "timed out."
                ),
            ) from exc

        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=(
                    "Unable to connect to the "
                    "voice generation service."
                ),
            ) from exc
        
    # async def _create_job(
    #     self,
    #     *,
    #     client: httpx.AsyncClient,
    #     headers: dict[str, str],
    #     payload: dict,
    # ) -> dict:

    #     response = await client.post(
    #         f"{self.BASE_URL}/tts",
    #         headers=headers,
    #         json=payload,
    #     )

    #     if response.is_error:
    #         self._raise_provider_error(
    #             response,
    #         )

    #     return response.json()
    
    async def _wait_for_job(
        self,
        *,
        client: httpx.AsyncClient,
        job_id: str,
        api_key: str,
    ) -> str:

        headers = {
            "Authorization": (
                f"Bearer {api_key}"
            ),
        }

        for _ in range(
            self.MAX_POLL_ATTEMPTS
        ):
            response = await client.get(
                (
                    f"{self.BASE_URL}"
                    f"/status/{job_id}"
                ),
                headers=headers,
            )

            if response.is_error:
                self._raise_provider_error(
                    response,
                )

            data = response.json()

            job_status = data.get(
                "status",
            )

            if job_status == "completed":

                audio_url = data.get(
                    "audio_url",
                )

                if not audio_url:
                    raise HTTPException(
                        status_code=(
                            status.HTTP_502_BAD_GATEWAY
                        ),
                        detail=(
                            "Voice generation completed "
                            "without an audio URL."
                        ),
                    )

                return audio_url

            if job_status == "failed":
                raise HTTPException(
                    status_code=(
                        status.HTTP_502_BAD_GATEWAY
                    ),
                    detail=(
                        data.get(
                            "user_message"
                        )
                        or
                        "Voice generation failed."
                    ),
                )

            await asyncio.sleep(
                self.POLL_INTERVAL_SECONDS
            )

        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail=(
                "Voice generation took too long "
                "to complete."
            ),
        )

    # async def _download_audio(
    #     self,
    #     *,
    #     client: httpx.AsyncClient,
    #     audio_url: str,
    # ) -> bytes:

    #     response = await client.get(
    #         audio_url,
    #     )

    #     response.raise_for_status()

    #     if not response.content:
    #         raise HTTPException(
    #             status_code=status.HTTP_502_BAD_GATEWAY,
    #             detail=(
    #                 "Voice provider returned "
    #                 "empty audio."
    #             ),
    #         )

    #     return response.content

    async def download_audio(
        self,
        audio_url: str,
    ) -> bytes:

        try:
            async with httpx.AsyncClient(
                timeout=self.timeout,
                follow_redirects=True,
            ) as client:

                response = await client.get(
                    audio_url,
                )

                response.raise_for_status()

                if not response.content:
                    raise HTTPException(
                        status_code=status.HTTP_502_BAD_GATEWAY,
                        detail=(
                            "Voice provider returned "
                            "empty audio."
                        ),
                    )

                return response.content

        except HTTPException:
            raise

        except httpx.TimeoutException as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=(
                    "Audio download timed out."
                ),
            ) from exc

        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=(
                    "Unable to download generated audio."
                ),
            ) from exc

    async def get_voices(
        self,
    ) -> list[dict]:

        api_key = settings.VOICE_PROVIDER_API_KEY

        headers = {
            "Authorization": f"Bearer {api_key}",
        }

        timeout = httpx.Timeout(
            connect=15.0,
            read=30.0,
            write=30.0,
            pool=15.0,
        )

        try:
            async with httpx.AsyncClient(
                timeout=timeout,
            ) as client:

                response = await client.get(
                    f"{self.BASE_URL}/voices",
                    headers=headers,
                )

                print("VOICE RESPONSE:", response.json())

                if response.is_error:
                    self._raise_provider_error(
                        response,
                    )

                data = response.json()

                return data

        except HTTPException:
            raise

        except httpx.TimeoutException as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Voice catalogue is temporarily unavailable.",
            ) from exc

        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Unable to connect to the voice provider.",
            ) from exc


    @staticmethod
    def _prepare_text(
        script: VoiceScript,
    ) -> str:

        return "\n\n".join(
            segment.text.strip()
            for segment in script.segments
            if segment.text.strip()
        )

          
    @staticmethod
    def _raise_provider_error(
        response: httpx.Response,
    ) -> None:

        try:
            data = response.json()
        except ValueError:
            data = {}

        error_code = (
            data.get("error_code")
            or data.get("code")
        )

        message = (
            data.get("user_message")
            or data.get("message")
            or data.get("detail")
        )

        if response.status_code == 401:
            detail = (
                "Voice provider authentication failed."
            )

        elif response.status_code == 402:
            if error_code == "QUOTA_EXCEEDED":
                detail = (
                    "Voice generation quota "
                    "has been exhausted."
                )

            elif (
                error_code
                == "SUBSCRIPTION_INACTIVE"
            ):
                detail = (
                    "Voice provider subscription "
                    "is inactive."
                )

            else:
                detail = (
                    message
                    or
                    "Voice provider billing "
                    "is unavailable."
                )

        elif response.status_code == 404:
            if error_code == "VOICE_NOT_FOUND":
                detail = (
                    "The selected voice is "
                    "no longer available."
                )
            else:
                detail = (
                    message
                    or
                    "Voice provider resource "
                    "was not found."
                )

        elif response.status_code == 409:
            if error_code == "ALREADY_EXISTS":
                detail = (
                    "This voice generation job "
                    "is already processing."
                )

            elif (
                error_code
                == "IDEMPOTENCY_KEY_REUSED"
            ):
                detail = (
                    "Voice generation request "
                    "could not be safely retried."
                )

            else:
                detail = (
                    message
                    or
                    "Voice generation conflict."
                )

        elif response.status_code == 422:
            detail = (
                message
                or
                "Invalid voice generation request."
            )

        elif (
            response.status_code >= 500
        ):
            detail = (
                "Voice generation service "
                "is temporarily unavailable."
            )

        else:
            detail = (
                message
                or
                "Voice generation failed."
            )

        raise HTTPException(
            status_code=(
                status.HTTP_503_SERVICE_UNAVAILABLE
            ),
            detail=detail,
        )


    