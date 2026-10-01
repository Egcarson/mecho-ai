from io import BytesIO
from uuid import UUID

from app.ai.image.adapters.brief_builder import CreativeBriefBuilder
from app.ai.image.adapters.extractor import (
    CreativeSourceExtractor,
)
from app.ai.image.assets import (
    ImageAssetResolver,
)
from app.ai.image.prompt_builder import (
    ImagePromptBuilder,
)
from app.ai.image.providers.base import ImageSize
from app.ai.image.providers.openai import (
    OpenAIImageProvider,
)
from app.models.enums import (
    ImageGenerationStatus,
)
from app.models.image_generation import (
    ImageGeneration,
)
from app.models.user import User
from app.repositories.asset_repository import AssetRepository
from app.repositories.generation_repository import GenerationRepository
from app.repositories.image_generation import (
    ImageGenerationRepository,
)
from app.repositories.project_repository import ProjectRepository
from app.schemas.image_generation import (
    CreateImageGenerationRequest,
    ImageGenerationResponse,
)
from app.services.cloudinary_service import (
    CloudinaryService,
)
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession


class ImageGenerationService:

    def __init__(
        self,
        session: AsyncSession,
    ):
        self.session = session

        self.projects = ProjectRepository(
            session,
        )

        self.generations = GenerationRepository(
            session,
        )

        self.images = ImageGenerationRepository(
            session,
        )

        self.assets = AssetRepository(
            session,
        )

        self.asset_resolver = (
            ImageAssetResolver(
                self.assets,
            )
        )

        self.source_extractor = (
            CreativeSourceExtractor()
        )

        self.brief_builder = (
            CreativeBriefBuilder()
        )

        self.prompt_builder = (
            ImagePromptBuilder()
        )

        self.provider = (
            OpenAIImageProvider()
        )

    async def create_image_generation(
        self,
        *,
        current_user: User,
        generation_uid: UUID,
        data: CreateImageGenerationRequest,
    ) -> ImageGenerationResponse:

        generation = (
            await self.generations
            .get_by_uid(
                generation_uid,
            )
        )

        if generation is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Generation not found.",
            )

        project = (
            await self.projects
            .get_by_uid_and_user(
                generation.project_uid,
                current_user.uid,
            )
        )

        if project is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found.",
            )

        if not generation.output_content:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Generation has no generated "
                    "content to design from."
                ),
            )

        try:
            source = (
                self.source_extractor.extract(
                    workflow=project.workflow,
                    output_content=(
                        generation.output_content
                    ),
                    source_language=(
                        data.source_language
                    ),
                    source_variant=(
                        data.source_variant
                    ),
                )
            )

        except ValueError as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(exc),
            ) from exc

        logo_url = (
            await self.asset_resolver.resolve_one(
                asset_uid=(
                    data.logo_asset_uid
                ),
                current_user=current_user,
            )
        )

        primary_image_urls = (
            await self.asset_resolver.resolve_many(
                asset_uids=(
                    data.primary_asset_uids
                ),
                current_user=current_user,
            )
        )

        reference_image_urls = (
            await self.asset_resolver.resolve_many(
                asset_uids=(
                    data.reference_asset_uids
                ),
                current_user=current_user,
            )
        )

        brief = (
            self.brief_builder.build(
                project=project,
                source=source,
                data=data,
                logo_url=logo_url,
                primary_image_urls=(
                    primary_image_urls
                ),
                reference_image_urls=(
                    reference_image_urls
                ),
            )
        )

        prompt = (
            self.prompt_builder.build(
                brief,
            )
        )

        design_brief = (
            data.model_dump(
                mode="json",
            )
        )

        image_generation = (
            ImageGeneration(
                generation_uid=(
                    generation.uid
                ),
                provider="openai",
                status=(
                    ImageGenerationStatus
                    .PENDING
                ),
                source_language=(
                    data.source_language
                ),
                source_variant=(
                    data.source_variant
                ),
                design_brief=(
                    design_brief
                ),
                prompt=prompt,
            )
        )

        image_generation = (
            await self.images.create(
                image_generation,
            )
        )

        image_generation = (
            await self.images.update(
                image_generation,
                status=(
                    ImageGenerationStatus
                    .PROCESSING
                ),
                error_message=None,
            )
        )

        try:

            input_images: list[str] = []

            if logo_url:
                input_images.append(
                    logo_url,
                )

            input_images.extend(
                primary_image_urls
            )

            size = self._resolve_size(
                data.format.value
                if data.format
                else None,
            )

            image_bytes = (
                await self.provider.generate(
                    prompt=prompt,
                    input_image_urls=(
                        input_images
                    ),
                    reference_image_urls=(
                        reference_image_urls
                    ),
                    size=size,
                    quality="high",
                )
            )

            uploaded = (
                CloudinaryService
                .upload_image(
                    BytesIO(
                        image_bytes
                    ),
                    folder=(
                        "mecho-ai/generated-images"
                    ),
                )
            )

            image_generation = (
                await self.images.update(
                    image_generation,
                    status=(
                        ImageGenerationStatus
                        .COMPLETED
                    ),
                    image_url=(
                        uploaded["url"]
                    ),
                    cloudinary_public_id=(
                        uploaded[
                            "public_id"
                        ]
                    ),
                    error_message=None,
                )
            )

            return (
                ImageGenerationResponse
                .model_validate(
                    image_generation,
                )
            )

        except HTTPException as exc:

            await self.images.update(
                image_generation,
                status=(
                    ImageGenerationStatus
                    .FAILED
                ),
                error_message=str(
                    exc.detail,
                ),
            )

            raise

        except Exception as exc:

            await self.images.update(
                image_generation,
                status=(
                    ImageGenerationStatus
                    .FAILED
                ),
                error_message=str(
                    exc,
                ),
            )

            raise HTTPException(
                status_code=(
                    status
                    .HTTP_500_INTERNAL_SERVER_ERROR
                ),
                detail=(
                    "Image generation failed."
                ),
            ) from exc

    async def get_generation_images(
        self,
        *,
        current_user: User,
        generation_uid: UUID,
    ) -> list[ImageGenerationResponse]:

        generation = (
            await self.generations
            .get_by_uid(
                generation_uid,
            )
        )

        if generation is None:
            raise HTTPException(
                status_code=(
                    status.HTTP_404_NOT_FOUND
                ),
                detail="Generation not found.",
            )

        project = (
            await self.projects
            .get_by_uid_and_user(
                generation.project_uid,
                current_user.uid,
            )
        )

        if project is None:
            raise HTTPException(
                status_code=(
                    status.HTTP_404_NOT_FOUND
                ),
                detail="Project not found.",
            )

        images = (
            await self.images
            .get_for_generation(
                generation_uid,
            )
        )

        return [
            ImageGenerationResponse
            .model_validate(
                image,
            )
            for image in images
        ]

    @staticmethod
    def _resolve_size(
        image_format: str | None,
    ) -> ImageSize:

        match image_format:

            case "square":
                return "1024x1024"

            case "portrait":
                return "1024x1536"

            case "story":
                return "1024x1536"

            case "landscape":
                return "1536x1024"

            case _:
                return "1024x1024"