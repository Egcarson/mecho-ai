from app.api.dependencies import get_asset_service
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.asset import (
    AssetRole,
    AssetUploadResponse,
    UserImageAssetResponse,
)
from app.services.asset_service import (
    AssetService,
)
from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    Query,
    UploadFile,
    status,
)

router = APIRouter(
    prefix="/assets",
    tags=["Assets"],
)


@router.post(
    "/images",
    response_model=AssetUploadResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_image_asset(
    role: AssetRole = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    service: AssetService = Depends(get_asset_service)
) -> AssetUploadResponse:

    return await service.upload_image(
        current_user=current_user,
        file=file,
        role=role,
    )


@router.get(
    "/images",
    response_model=list[
        UserImageAssetResponse
    ],
)
async def get_user_image_assets(
    role: AssetRole | None = Query(default=None,),
    current_user: User = Depends(get_current_user),
    service: AssetService = Depends(get_asset_service)
) -> list[
    UserImageAssetResponse
]:
    
    return await service.get_user_images(
        current_user=current_user,
        role=role,
    )