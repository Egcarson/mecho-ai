from uuid import UUID

from app.api.dependencies import get_project_service
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.common import SuccessResponse
from app.schemas.project import (
    ProjectCreate,
    ProjectDetailResponse,
    ProjectListResponse,
    ProjectResponse,
    ProjectUpdate,
)
from app.services.project_service import ProjectService
from fastapi import APIRouter, Depends, File, Query, UploadFile, status

router = APIRouter(
    prefix="/projects",
    tags=["Projects"],
)


@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_project(
    data: ProjectCreate,
    current_user: User = Depends(get_current_user),
    service: ProjectService = Depends(get_project_service),
):
    return await service.create_project(
        current_user,
        data,
    )


@router.get(
    "",
    response_model=ProjectListResponse,
)
async def get_projects(
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
    service: ProjectService = Depends(get_project_service),
):
    return await service.get_projects(
        current_user,
        limit=limit,
        offset=offset,
    )


@router.get(
    "/{project_uid}",
    response_model=ProjectDetailResponse,
)
async def get_project(
    project_uid: UUID,
    current_user: User = Depends(get_current_user),
    service: ProjectService = Depends(get_project_service),
):
    return await service.get_project(
        current_user,
        project_uid,
    )


@router.patch(
    "/{project_uid}",
    response_model=ProjectResponse,
)
async def update_project(
    project_uid: UUID,
    data: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    service: ProjectService = Depends(get_project_service),
):
    return await service.update_project(
        current_user,
        project_uid,
        data,
    )


@router.post(
    "/{project_uid}/archive",
    response_model=ProjectResponse,
)
async def archive_project(
    project_uid: UUID,
    current_user: User = Depends(get_current_user),
    service: ProjectService = Depends(get_project_service),
):
    return await service.archive_project(
        current_user,
        project_uid,
    )


@router.post(
    "/{project_uid}/favorite",
    response_model=ProjectResponse,
)
async def toggle_favorite(
    project_uid: UUID,
    current_user: User = Depends(get_current_user),
    service: ProjectService = Depends(get_project_service),
):
    return await service.toggle_favorite(
        current_user,
        project_uid,
    )


@router.delete(
    "/{project_uid}",
    response_model=SuccessResponse,
)
async def delete_project(
    project_uid: UUID,
    current_user: User = Depends(get_current_user),
    service: ProjectService = Depends(get_project_service),
):
    await service.delete_project(
        current_user,
        project_uid,
    )

    return SuccessResponse(
        message="Project deleted successfully.",
    )


@router.post(
    "/{project_uid}/document",
    response_model=ProjectDetailResponse,
    status_code=status.HTTP_200_OK,
    
)
async def upload_project_document(
    project_uid: UUID,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    service: ProjectService = Depends(get_project_service),
) -> ProjectDetailResponse:


    return await service.upload_document(
        current_user=current_user,
        project_uid=project_uid,
        file=file,
    )