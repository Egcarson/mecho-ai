import base64
import logging
import mimetypes
import tempfile
from pathlib import Path

import httpx
from app.ai.image.providers.base import (
    ImageProvider,
    ImageQuality,
    ImageSize,
)
from app.core.config import settings
from fastapi import HTTPException, status
from openai import (
    APIConnectionError,
    APIError,
    AsyncOpenAI,
    AuthenticationError,
    BadRequestError,
    PermissionDeniedError,
    RateLimitError,
)

logger = logging.getLogger(__name__)


class OpenAIImageProvider(ImageProvider):

    MODEL = "gpt-image-2.5-sunburst"

    DEFAULT_SIZE: ImageSize = "1024x1024"
    DEFAULT_QUALITY: ImageQuality = "high"

    MAX_INPUT_IMAGES = 10

    def __init__(self) -> None:

        self.client = AsyncOpenAI(
            api_key=settings.IMAGE_PROVIDER_API_KEY,
        )

        self.download_timeout = httpx.Timeout(
            connect=15.0,
            read=60.0,
            write=30.0,
            pool=15.0,
        )

    async def generate(
        self,
        *,
        prompt: str,
        input_image_urls: list[str] | None = None,
        reference_image_urls: list[str] | None = None,
        size: ImageSize | None = None,
        quality: ImageQuality | None = None,
    ) -> bytes:

        input_image_urls = (
            input_image_urls or []
        )

        reference_image_urls = (
            reference_image_urls or []
        )

        all_image_urls = [
            *input_image_urls,
            *reference_image_urls,
        ]

        if len(all_image_urls) > self.MAX_INPUT_IMAGES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"A maximum of "
                    f"{self.MAX_INPUT_IMAGES} "
                    "image assets can be supplied."
                ),
            )

        resolved_size: ImageSize = (
            size or self.DEFAULT_SIZE
        )

        resolved_quality: ImageQuality = (
            quality or self.DEFAULT_QUALITY
        )

        try:

            if not all_image_urls:

                return await self._generate_from_text(
                    prompt=prompt,
                    size=resolved_size,
                    quality=resolved_quality,
                )

            return await self._generate_with_images(
                prompt=prompt,
                input_image_urls=(
                    input_image_urls
                ),
                reference_image_urls=(
                    reference_image_urls
                ),
                size=resolved_size,
                quality=resolved_quality,
            )

        except HTTPException:
            raise

        except AuthenticationError as exc:

            logger.exception(
                "OpenAI authentication failed."
            )

            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=(
                    "OpenAI authentication failed. "
                    "Check OPENAI_API_KEY."
                ),
            ) from exc

        except PermissionDeniedError as exc:

            logger.exception(
                "OpenAI image permission denied."
            )

            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=(
                    "OpenAI denied access to the "
                    "requested image model."
                ),
            ) from exc

        except RateLimitError as exc:

            logger.exception(
                "OpenAI image generation rate limit."
            )

            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=(
                    "OpenAI image generation "
                    "rate limit reached."
                ),
            ) from exc

        except BadRequestError as exc:

            logger.exception(
                "OpenAI image generation bad request."
            )

            message = (
                self._get_openai_error_message(
                    exc
                )
            )

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=message,
            ) from exc

        except APIConnectionError as exc:

            logger.exception(
                "Could not connect to OpenAI."
            )

            raise HTTPException(
                status_code=(
                    status.HTTP_503_SERVICE_UNAVAILABLE
                ),
                detail=(
                    "Could not connect to "
                    "OpenAI image service."
                ),
            ) from exc

        except APIError as exc:

            logger.exception(
                "OpenAI API error."
            )

            message = (
                self._get_openai_error_message(
                    exc
                )
            )

            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=message,
            ) from exc

        except Exception as exc:

            logger.exception(
                "Unexpected image generation error."
            )

            raise HTTPException(
                status_code=(
                    status.HTTP_500_INTERNAL_SERVER_ERROR
                ),
                detail=(
                    f"Unexpected image generation error: "
                    f"{type(exc).__name__}: {exc}"
                ),
            ) from exc

    async def _generate_from_text(
        self,
        *,
        prompt: str,
        size: ImageSize,
        quality: ImageQuality,
    ) -> bytes:

        result = await self.client.images.generate(
            model=self.MODEL,
            prompt=prompt,
            size=size,
            quality=quality,
            output_format="png",
        )

        return self._extract_image_bytes(
            result
        )

    async def _generate_with_images(
        self,
        *,
        prompt: str,
        input_image_urls: list[str],
        reference_image_urls: list[str],
        size: ImageSize,
        quality: ImageQuality,
    ) -> bytes:

        image_urls = [
            *input_image_urls,
            *reference_image_urls,
        ]

        downloaded_images = (
            await self._download_images(
                image_urls
            )
        )

        temporary_paths: list[str] = []
        open_files = []

        try:

            for image in downloaded_images:

                temp_file = (
                    tempfile.NamedTemporaryFile(
                        delete=False,
                        suffix=image["suffix"],
                    )
                )

                temp_file.write(
                    image["content"]
                )

                temp_file.flush()
                temp_file.close()

                temporary_paths.append(
                    temp_file.name
                )

            open_files = [
                open(path, "rb")
                for path in temporary_paths
            ]

            result = await self.client.images.edit(
                model=self.MODEL,
                image=open_files,
                prompt=prompt,
                size=size,
                quality=quality,
                output_format="png",
            )

            return self._extract_image_bytes(
                result
            )

        finally:

            for file in open_files:

                try:
                    file.close()
                except Exception:
                    pass

            for path in temporary_paths:

                try:
                    Path(path).unlink(
                        missing_ok=True
                    )
                except Exception:
                    pass

    async def _download_images(
        self,
        urls: list[str],
    ) -> list[dict]:

        downloaded: list[dict] = []

        async with httpx.AsyncClient(
            timeout=self.download_timeout,
            follow_redirects=True,
        ) as client:

            for url in urls:

                try:

                    response = await client.get(
                        url
                    )

                    response.raise_for_status()

                except httpx.TimeoutException as exc:

                    raise HTTPException(
                        status_code=(
                            status
                            .HTTP_503_SERVICE_UNAVAILABLE
                        ),
                        detail=(
                            "An image asset timed out "
                            "while downloading."
                        ),
                    ) from exc

                except httpx.HTTPStatusError as exc:

                    raise HTTPException(
                        status_code=(
                            status
                            .HTTP_400_BAD_REQUEST
                        ),
                        detail=(
                            "An image asset could "
                            "not be accessed."
                        ),
                    ) from exc

                except httpx.RequestError as exc:

                    raise HTTPException(
                        status_code=(
                            status
                            .HTTP_503_SERVICE_UNAVAILABLE
                        ),
                        detail=(
                            "Unable to download "
                            "an image asset."
                        ),
                    ) from exc

                if not response.content:

                    raise HTTPException(
                        status_code=(
                            status
                            .HTTP_400_BAD_REQUEST
                        ),
                        detail=(
                            "One of the supplied "
                            "image assets is empty."
                        ),
                    )

                content_type = (
                    response.headers.get(
                        "content-type",
                        "",
                    )
                    .split(";")[0]
                    .strip()
                    .lower()
                )

                if not content_type.startswith(
                    "image/"
                ):
                    raise HTTPException(
                        status_code=(
                            status
                            .HTTP_400_BAD_REQUEST
                        ),
                        detail=(
                            "One of the supplied "
                            "assets is not an image."
                        ),
                    )

                suffix = (
                    mimetypes.guess_extension(
                        content_type
                    )
                    or ".png"
                )

                if suffix == ".jpe":
                    suffix = ".jpg"

                downloaded.append(
                    {
                        "content": (
                            response.content
                        ),
                        "content_type": (
                            content_type
                        ),
                        "suffix": suffix,
                    }
                )

        return downloaded

    @staticmethod
    def _extract_image_bytes(
        result,
    ) -> bytes:

        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=(
                    "OpenAI returned no "
                    "generated image."
                ),
            )

        image = result.data[0]

        encoded = image.b64_json

        if not encoded:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=(
                    "OpenAI returned empty "
                    "image data."
                ),
            )

        try:

            return base64.b64decode(
                encoded
            )

        except Exception as exc:

            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=(
                    "Unable to decode "
                    "generated image."
                ),
            ) from exc

    @staticmethod
    def _get_openai_error_message(
        exc: Exception,
    ) -> str:

        body = getattr(
            exc,
            "body",
            None,
        )

        if isinstance(
            body,
            dict,
        ):

            message = body.get(
                "message"
            )

            if message:
                return str(
                    message
                )

            error = body.get(
                "error"
            )

            if isinstance(
                error,
                dict,
            ):

                message = error.get(
                    "message"
                )

                if message:
                    return str(
                        message
                    )

        return str(exc)