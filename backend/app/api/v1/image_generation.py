from uuid import UUID

from app.api.dependencies import get_image_service, image_access
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.image_generation import (
    CreateImageGenerationRequest,
    ImageGenerationResponse,
    ImageUsageResponse,
)
from app.services.image_access_service import ImageAccessService
from app.services.image_generation import (
    ImageGenerationService,
)
from fastapi import (
    APIRouter,
    Depends,
    status,
)

router = APIRouter(
    prefix="/generations",
    tags=["Image Generation"],
)

image_route = APIRouter(tags=["Image Generation"])


@router.post(
    "/{generation_uid}/images",
    response_model=ImageGenerationResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_image_generation(
    generation_uid: UUID,
    data: CreateImageGenerationRequest,
    current_user: User = Depends(get_current_user),
    service: ImageGenerationService = Depends(get_image_service)
) -> ImageGenerationResponse:

    return await service.create_image_generation(
        current_user=current_user,
        generation_uid=generation_uid,
        data=data,
    )


@router.get(
    "/{generation_uid}/images",
    response_model=list[ImageGenerationResponse],
    status_code=status.HTTP_200_OK,
)
async def get_generation_images(
    generation_uid: UUID,
    current_user: User = Depends(get_current_user),
    service: ImageGenerationService = Depends(get_image_service)
) -> list[ImageGenerationResponse]:

    return await service.get_generation_images(
        current_user=current_user,
        generation_uid=generation_uid,
    )


@image_route.get(
    "/image/usage",
    response_model=ImageUsageResponse,
    status_code=status.HTTP_200_OK,
)
async def get_image_usage(
    current_user: User = Depends(get_current_user),
    service: ImageAccessService = Depends(image_access)
) -> ImageUsageResponse:

    used, limit = (
        await service.get_social_usage(
            user_uid=current_user.uid,
        )
    )

    return ImageUsageResponse(
        social_used=used,
        social_limit=limit,
        social_available=max(
            limit - used,
            0,
        ),
        social_enabled=(
            used < limit
        ),
        campaign_enabled=False,
        speech_enabled=False,
    )