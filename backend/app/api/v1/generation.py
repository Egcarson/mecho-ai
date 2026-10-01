from uuid import UUID

from app.api.dependencies import get_generation_service
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.common import SuccessResponse
from app.schemas.generation import (
    CreateGenerationRequest,
    GenerationHistoryPage,
    GenerationHistoryResponse,
    GenerationListResponse,
    GenerationResponse,
)
from app.services.generation_service import GenerationService
from fastapi import APIRouter, Depends, Query, status

router = APIRouter(
    prefix="/projects/{project_uid}/generations",
    tags=["Generations"],
)

history_router = APIRouter(prefix="/generations", tags=["History"])


@router.post(
    "",
    response_model=GenerationResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_generation(
    project_uid: UUID,
    data: CreateGenerationRequest,
    current_user: User = Depends(get_current_user),
    service: GenerationService = Depends(get_generation_service),
):
    return await service.create_generation(
        current_user,
        project_uid,
        data,
    )


@router.get(
    "",
    response_model=GenerationListResponse,
)
async def get_generations(
    project_uid: UUID,
    limit: int = Query(
        default=20,
        ge=1,
        le=100,
    ),
    offset: int = Query(
        default=0,
        ge=0,
    ),
    current_user: User = Depends(get_current_user),
    service: GenerationService = Depends(get_generation_service),
):
    return await service.get_generations(
        current_user,
        project_uid,
        limit=limit,
        offset=offset,
    )


@router.get(
    "/latest",
    response_model=GenerationResponse,
)
async def get_latest_generation(
    project_uid: UUID,
    current_user: User = Depends(get_current_user),
    service: GenerationService = Depends(get_generation_service),
):
    return await service.get_latest_generation(
        current_user,
        project_uid,
    )


@router.get(
    "/{generation_uid}",
    response_model=GenerationResponse,
)
async def get_generation(
    project_uid: UUID,
    generation_uid: UUID,
    current_user: User = Depends(get_current_user),
    service: GenerationService = Depends(get_generation_service),
):
    return await service.get_generation(
        current_user,
        project_uid,
        generation_uid,
    )


@router.delete(
    "/{generation_uid}",
    response_model=SuccessResponse,
)
async def delete_generation(
    project_uid: UUID,
    generation_uid: UUID,
    current_user: User = Depends(get_current_user),
    service: GenerationService = Depends(get_generation_service),
):
    await service.delete_generation(
        current_user,
        project_uid,
        generation_uid,
    )

    return SuccessResponse(
        message="Generation deleted successfully.",
    )

@history_router.get(
    "/history",
    response_model=GenerationHistoryPage,
    status_code=status.HTTP_200_OK,
)
async def get_generation_history(
    page: int = Query(
        default=1,
        ge=1,
    ),
    limit: int = Query(
        default=20,
        ge=1,
        le=100,
    ),
    current_user: User = Depends(get_current_user),
    service: GenerationService = Depends(get_generation_service),
) -> GenerationHistoryPage:


    return await service.get_user_history(
        current_user=current_user,
        page=page,
        limit=limit,
    )