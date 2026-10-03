from app.api.dependencies import get_auth_service
from app.core.dependencies import get_current_user
from app.db.session import get_session
from app.models.user import User
from app.schemas.auth import (
    GoogleAuthRequest,
    LoginRequest,
    RefreshTokenRequest,
    RegisterRequest,
    SuccessResponse,
    TokenResponse,
)
from app.schemas.user import (
    ForgotPasswordRequest,
    ResendResetOTPRequest,
    ResendVerificationOTPRequest,
    ResetPasswordRequest,
    UserProfileResponse,
    VerifyEmailRequest,
    VerifyResetOTPRequest,
    VerifyResetOTPResponse,
)
from app.services.auth_service import AuthService
from app.services.user_service import UserService
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    data: RegisterRequest,
    service: AuthService = Depends(get_auth_service)
):

    user = await service.register(data)

    return await service.login_user(user)


@router.post(
    "/google",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
)
async def google_auth(
    data: GoogleAuthRequest,
    service: AuthService = Depends(get_auth_service),
) -> TokenResponse:

    return await service.google_login(
        data
    )


@router.post(
    "/login",
    response_model=TokenResponse,
)
async def login(
    data: LoginRequest,
    service: AuthService = Depends(get_auth_service)
):

    return await service.login(data)


@router.post(
    "/refresh",
    response_model=TokenResponse,
)
async def refresh(
    data: RefreshTokenRequest,
    session: AsyncSession = Depends(get_session),
):
    service = AuthService(session)

    return await service.refresh(
        data.refresh_token,
    )


@router.post(
    "/logout",
    response_model=SuccessResponse,
)
async def logout(
    data: RefreshTokenRequest,
    service: AuthService = Depends(get_auth_service)
):

    await service.logout(
        data.refresh_token,
    )

    return SuccessResponse(
        success=True,
        message="Logged out successfully.",
    )


@router.post(
    "/logout-all",
    response_model=SuccessResponse,
)
async def logout_all(
    current_user: User = Depends(get_current_user),
    service: AuthService = Depends(get_auth_service)
):

    await service.logout_all(
        current_user,
    )

    return SuccessResponse(
        success=True,
        message="Logged out from all devices.",
    )


@router.get(
    "/me",
    response_model=UserProfileResponse,
)
async def me(
    current_user: User = Depends(get_current_user),
):
    return UserProfileResponse.model_validate(
        current_user,
    )


@router.post(
    "/verify-email",
    status_code=status.HTTP_200_OK,
)
async def verify_email(
    data: VerifyEmailRequest,
    session: AsyncSession = Depends(get_session),
):
    service = UserService(session)

    await service.verify_email(
        data,
    )

    return {
        "message": "Email verified successfully."
    }


@router.post(
    "/resend-verification-otp",
    status_code=status.HTTP_200_OK,
)
async def resend_verification_otp(
    data: ResendVerificationOTPRequest,
    session: AsyncSession = Depends(get_session),
):
    service = UserService(session)

    await service.resend_verification_otp(
        data,
    )

    return {
        "message": "Verification code sent successfully."
    }


@router.post(
    "/forgot-password",
    status_code=status.HTTP_200_OK,
)
async def forgot_password(
    data: ForgotPasswordRequest,
    session: AsyncSession = Depends(get_session),
):
    service = UserService(session)

    await service.forgot_password(
        data,
    )

    return {
        "message": (
            "If an account exists with this email, "
            "a password reset code has been sent."
        )
    }


@router.post(
    "/verify-reset-otp",
    response_model=VerifyResetOTPResponse,
    status_code=status.HTTP_200_OK,
)
async def verify_reset_otp(
    data: VerifyResetOTPRequest,
    session: AsyncSession = Depends(get_session),
) -> VerifyResetOTPResponse:

    service = UserService(session)

    reset_token = await service.verify_reset_otp(
        data,
    )

    return VerifyResetOTPResponse(
        reset_token=reset_token,
    )


@router.post(
    "/resend-reset-otp",
    status_code=status.HTTP_200_OK,
)
async def resend_reset_otp(
    data: ResendResetOTPRequest,
    session: AsyncSession = Depends(get_session),
):
    service = UserService(session)

    await service.resend_reset_otp(
        data,
    )

    return {
        "message": (
            "If an account exists with this email, "
            "a new password reset code has been sent."
        )
    }


@router.post(
    "/reset-password",
    status_code=status.HTTP_200_OK,
)
async def reset_password(
    data: ResetPasswordRequest,
    session: AsyncSession = Depends(get_session),
):
    service = UserService(session)

    await service.reset_password(
        data,
    )

    return {
        "message": "Password reset successfully."
    }