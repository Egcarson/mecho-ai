# api/v1/library.py

from app.api.dependencies import get_library_service
from app.core.dependencies import get_current_user
from app.models.enums import LibraryMediaType
from app.models.user import User
from app.schemas.library import LibraryMediaResponse
from app.services.library_service import LibraryService
from fastapi import APIRouter, Depends, Query

router = APIRouter(
    prefix="/api/v1/library",
    tags=["Library"],
)


@router.get(
    "",
    response_model=list[
        LibraryMediaResponse
    ],
)
async def get_library(
    media_type: LibraryMediaType | None = Query(default=None),
    current_user: User = Depends(get_current_user,),
    service: LibraryService = Depends(get_library_service)
) -> list[LibraryMediaResponse]:

    return await service.get_library(
        current_user=current_user,
        media_type=media_type,
    )