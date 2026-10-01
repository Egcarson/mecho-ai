from uuid import UUID

from app.api.dependencies import get_image_service
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.image_generation import (
    CreateImageGenerationRequest,
    ImageGenerationResponse,
)
from app.services.image_generation import (
    ImageGenerationService,
)
from fastapi import (
    APIRouter,
    Depends,
    status,
)
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(
    prefix="/generations",
    tags=["Image Generation"],
)


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