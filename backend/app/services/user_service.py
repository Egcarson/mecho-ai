from __future__ import annotations

from app.core.security import (
    create_password_reset_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.email.service import EmailService
from app.models.enums import OTPPurpose
from app.models.user import User
from app.repositories.asset_repository import AssetRepository
from app.repositories.project_repository import ProjectRepository
from app.repositories.refresh_token_repository import RefreshTokenRepository
from app.repositories.user_preference import UserPreferenceRepository
from app.repositories.user_repository import UserRepository
from app.schemas.user import (
    ChangePasswordRequest,
    DashboardSummaryResponse,
    ForgotPasswordRequest,
    ResendResetOTPRequest,
    ResendVerificationOTPRequest,
    ResetPasswordRequest,
    UpdateProfileRequest,
    UserPreferenceResponse,
    UserPreferenceUpdate,
    UserProfileResponse,
    UserProfileUpdate,
    VerifyEmailRequest,
    VerifyResetOTPRequest,
)
from app.services.cloudinary_service import CloudinaryService
from app.services.otp import OTPService
from fastapi import HTTPException, UploadFile, status
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user_preference import UserPreference


class UserService:

    ALLOWED_AVATAR_TYPES = {
        "image/jpeg",
        "image/png",
        "image/webp",
    }

    MAX_AVATAR_SIZE = 5 * 1024 * 1024

    def __init__(
        self,
        session: AsyncSession,
    ):
        self.session = session

        self.users = UserRepository(session)

        self.projects = ProjectRepository(session)

        self.assets = AssetRepository(session)

        self.refresh_tokens = RefreshTokenRepository(session)

        self.otp = OTPService(session)

        self.email = EmailService()

        self.preferences = (
            UserPreferenceRepository(
                session,
            )
        )

    async def get_profile(
        self,
        current_user: User,
    ) -> UserProfileResponse:

        return UserProfileResponse.model_validate(
            current_user,
        )

    async def update_profile(
        self,
        current_user: User,
        data: UserProfileUpdate,
    ) -> UserProfileResponse:

        values = data.model_dump(
            exclude_none=True,
        )

        if not values:
            return UserProfileResponse.model_validate(
                current_user,
            )

        if "phone" in values:
            existing = await self.users.get_by_phone(
                values["phone"],
            )

            if (
                existing is not None
                and existing.uid
                != current_user.uid
            ):
                raise HTTPException(
                    status_code=(
                        status.HTTP_409_CONFLICT
                    ),
                    detail=(
                        "Phone number is already in use."
                    ),
                )

        user = await self.users.update(
            current_user,
            **values,
        )

        return UserProfileResponse.model_validate(
            user,
        )

    async def upload_avatar(
        self,
        current_user: User,
        file: UploadFile,
    ) -> UserProfileResponse:

        if (
            file.content_type
            not in self.ALLOWED_AVATAR_TYPES
        ):
            raise HTTPException(
                status_code=(
                    status.HTTP_400_BAD_REQUEST
                ),
                detail=(
                    "Only JPEG, PNG, and WEBP "
                    "images are supported."
                ),
            )

        content = await file.read()

        if not content:
            raise HTTPException(
                status_code=(
                    status.HTTP_400_BAD_REQUEST
                ),
                detail="Uploaded image is empty.",
            )

        if len(content) > self.MAX_AVATAR_SIZE:
            raise HTTPException(
                status_code=(
                    status.HTTP_400_BAD_REQUEST
                ),
                detail=(
                    "Profile image must not exceed 5 MB."
                ),
            )

        from io import BytesIO

        uploaded = (
            CloudinaryService
            .upload_profile_picture(
                BytesIO(content),
            )
        )

        old_public_id = (
            current_user
            .profile_picture_public_id
        )

        user = await self.users.update(
            current_user,
            profile_picture_url=(
                uploaded["url"]
            ),
            profile_picture_public_id=(
                uploaded["public_id"]
            ),
        )

        if old_public_id:
            try:
                CloudinaryService.delete(
                    old_public_id,
                    resource_type="image",
                )
            except Exception:
                pass

        return UserProfileResponse.model_validate(
            user,
        )

    async def remove_avatar(
        self,
        current_user: User,
    ) -> UserProfileResponse:

        public_id = (
            current_user
            .profile_picture_public_id
        )

        if public_id:
            try:
                CloudinaryService.delete(
                    public_id,
                    resource_type="image",
                )
            except Exception:
                pass

        user = await self.users.update(
            current_user,
            profile_picture_url=None,
            profile_picture_public_id=None,
        )

        return UserProfileResponse.model_validate(
            user,
        )

    async def get_preferences(
        self,
        current_user: User,
    ) -> UserPreferenceResponse:

        preference = (
            await self.preferences
            .get_by_user_uid(
                current_user.uid,
            )
        )

        if preference is None:
            preference = UserPreference(
                user_uid=current_user.uid,
            )

            preference = (
                await self.preferences.create(
                    preference,
                )
            )

        return (
            UserPreferenceResponse
            .model_validate(
                preference,
            )
        )

    async def update_preferences(
        self,
        current_user: User,
        data: UserPreferenceUpdate,
    ) -> UserPreferenceResponse:

        preference = (
            await self.preferences
            .get_by_user_uid(
                current_user.uid,
            )
        )

        values = data.model_dump(
            exclude_none=True,
        )

        if preference is None:

            nested_preferences = values.pop(
                "preferences",
                {},
            )

            preference = UserPreference(
                user_uid=current_user.uid,
                preferences=nested_preferences,
                **values,
            )

            preference = (
                await self.preferences.create(
                    preference,
                )
            )

        else:

            if "preferences" in values:
                values["preferences"] = {
                    **(
                        preference.preferences
                        or {}
                    ),
                    **values["preferences"],
                }

            preference = (
                await self.preferences.update(
                    preference,
                    **values,
                )
            )

        return (
            UserPreferenceResponse
            .model_validate(
                preference,
            )
        )


    async def change_password(
        self,
        current_user: User,
        data: ChangePasswordRequest,
    ) -> None:

        if not verify_password(
            data.current_password,
            current_user.password_hash,
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect.",
            )

        if verify_password(
            data.new_password,
            current_user.password_hash,
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="New password must be different from the old one.",
            )

        await self.users.update(
            current_user,
            password_hash=hash_password(
                data.new_password,
            ),
        )

        # await self.refresh_tokens.revoke_all(
        #     current_user.uid,
        # )


    async def delete_account(
        self,
        current_user: User,
        password: str,
    ) -> None:

        if not verify_password(
            password,
            current_user.password_hash,
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password is incorrect.",
            )

        await self.users.update(
            current_user,
            is_active=False,
        )

        await self.refresh_tokens.revoke_all(
            current_user.uid,
        )


    async def dashboard_summary(
        self,
        current_user: User,
    ) -> DashboardSummaryResponse:

        total_projects = await self.projects.count_user_projects(
            current_user.uid,
        )

        total_assets = await self.assets.count_user_assets(
            current_user.uid,
        )

        audio_files = await self.assets.count_audio_assets(
            current_user.uid,
        )

        return DashboardSummaryResponse(
            total_projects=total_projects,
            total_assets=total_assets,
            total_generations=total_assets,
            total_audio_files=audio_files,
            storage_used=0,
        ) #type: ignore


    async def issue_email_verification_otp(
        self,
        user: User,
    ) -> str:

        if user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already verified.",
            )

        otp = await self.otp.issue(
            user_uid=user.uid,
            purpose=OTPPurpose.EMAIL_VERIFICATION,
        )

        return otp


    async def verify_email(
        self,
        data: VerifyEmailRequest,
    ) -> None:

        user = await self.users.get_by_email(
            data.email.lower(),
        )

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired OTP.",
            )

        if user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already verified.",
            )

        await self.otp.verify(
            user_uid=user.uid,
            purpose=OTPPurpose.EMAIL_VERIFICATION,
            otp=data.otp,
        )

        await self.users.update(
            user,
            is_verified=True,
        )

    async def resend_verification_otp(
        self,
        data: ResendVerificationOTPRequest,
    ) -> None:

        user = await self.users.get_by_email(
            data.email.lower(),
        )

        if user is None:
            return

        if user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already verified.",
            )

        otp = await self.otp.resend(
            user_uid=user.uid,
            purpose=OTPPurpose.EMAIL_VERIFICATION,
        )

        await self.email.send_verification_otp(
            email=user.email,
            first_name=user.first_name,
            otp=otp,
        )

    async def forgot_password(
        self,
        data: ForgotPasswordRequest,
    ) -> None:

        user = await self.users.get_by_email(
            data.email.lower(),
        )

        if user is None:
            return

        otp = await self.otp.issue(
            user_uid=user.uid,
            purpose=OTPPurpose.PASSWORD_RESET,
        )

        await self.email.send_password_reset_otp(
            email=user.email,
            first_name=user.first_name,
            otp=otp,
        )


    async def verify_reset_otp(
        self,
        data: VerifyResetOTPRequest,
    ) -> str:

        user = await self.users.get_by_email(
            data.email.lower(),
        )

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired OTP.",
            )

        await self.otp.verify(
            user_uid=user.uid,
            purpose=OTPPurpose.PASSWORD_RESET,
            otp=data.otp,
        )

        return create_password_reset_token(
            subject=str(user.uid),
        )


    async def resend_reset_otp(
        self,
        data: ResendResetOTPRequest,
    ) -> None:

        user = await self.users.get_by_email(
            data.email.lower(),
        )

        if user is None:
            return

        otp = await self.otp.resend(
            user_uid=user.uid,
            purpose=OTPPurpose.PASSWORD_RESET,
        )

        await self.email.send_password_reset_otp(
            email=user.email,
            first_name=user.first_name,
            otp=otp,
        )


    async def reset_password(
        self,
        data: ResetPasswordRequest,
    ) -> None:

        try:
            payload = decode_token(
                data.reset_token,
            )

        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired password reset token.",
            )

        if payload.get("type") != "password_reset":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid password reset token.",
            )

        user_uid = payload.get("sub")

        if not user_uid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid password reset token.",
            )

        user = await self.users.get_by_uid(
            user_uid,
        )

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid password reset token.",
            )

        if verify_password(
            data.new_password,
            user.password_hash,
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="New password must be different from the old one.",
            )

        await self.users.update(
            user,
            password_hash=hash_password(
                data.new_password,
            ),
        )

        await self.refresh_tokens.revoke_all(
            user.uid,
        )

    