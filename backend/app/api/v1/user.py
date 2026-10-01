from app.api.dependencies import get_user_service
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import (
    ChangePasswordRequest,
    DeleteAccountRequest,
    UserPreferenceResponse,
    UserPreferenceUpdate,
    UserProfileResponse,
    UserProfileUpdate,
)
from app.services.user_service import (
    UserService,
)
from fastapi import (
    APIRouter,
    Depends,
    File,
    UploadFile,
    status,
)

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get(
    "/me",
    response_model=UserProfileResponse,
    status_code=status.HTTP_200_OK,
)
async def get_profile(
    current_user: User = Depends(get_current_user),
) -> UserProfileResponse:

    return UserProfileResponse.model_validate(
        current_user,
    )


@router.patch(
    "/me",
    response_model=UserProfileResponse,
    status_code=status.HTTP_200_OK,
)
async def update_profile(
    data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    service: UserService = Depends(get_user_service)
) -> UserProfileResponse:

    return await service.update_profile(
        current_user=current_user,
        data=data,
    )


@router.post(
    "/me/avatar",
    response_model=UserProfileResponse,
    status_code=status.HTTP_200_OK,
)
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    service: UserService = Depends(get_user_service)
) -> UserProfileResponse:
    
    return await service.upload_avatar(
        current_user=current_user,
        file=file,
    )


@router.delete(
    "/me/avatar",
    response_model=UserProfileResponse,
    status_code=status.HTTP_200_OK,
)
async def remove_avatar(
    current_user: User = Depends(get_current_user),
    service: UserService = Depends(get_user_service)
) -> UserProfileResponse:

    return await service.remove_avatar(
        current_user=current_user,
    )


@router.get(
    "/me/preferences",
    response_model=(
        UserPreferenceResponse
    ),
    status_code=status.HTTP_200_OK,
)
async def get_preferences(
   current_user: User = Depends(get_current_user),
    service: UserService = Depends(get_user_service)
) -> UserPreferenceResponse:

    return await service.get_preferences(
        current_user=current_user,
    )


@router.patch(
    "/me/preferences",
    response_model=(
        UserPreferenceResponse
    ),
    status_code=status.HTTP_200_OK,
)
async def update_preferences(
    data: UserPreferenceUpdate,
    current_user: User = Depends(get_current_user),
    service: UserService = Depends(get_user_service)
) -> UserPreferenceResponse:

    return await service.update_preferences(
        current_user=current_user,
        data=data,
    )



@router.post(
    "/me/change-password",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def change_password(
    data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    service: UserService = Depends(get_user_service)
) -> None:

    await service.change_password(
        current_user=current_user,
        data=data,
    )


@router.delete(
    "/me",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_account(
    data: DeleteAccountRequest,
    current_user: User = Depends(get_current_user),
    service: UserService = Depends(get_user_service)
) -> None:

    await service.delete_account(
        current_user=current_user,
        password=data.password,
    )