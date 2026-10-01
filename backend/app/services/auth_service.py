from __future__ import annotations

import logging
from datetime import UTC, datetime, timedelta
from uuid import UUID, uuid4

from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    hash_token,
    verify_password,
)
from app.email.service import EmailService
from app.models.enums import AuthProvider, OTPPurpose
from app.models.refresh_token import RefreshToken
from app.models.user import User
from app.repositories.refresh_token_repository import RefreshTokenRepository
from app.repositories.user_repository import UserRepository
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
)
from app.schemas.user import UserProfileResponse
from app.services.otp import OTPService
from fastapi import HTTPException, status
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)

class AuthService:
    def __init__(
        self,
        session: AsyncSession,
    ):
        self.session = session

        self.users = UserRepository(session)

        self.refresh_tokens = RefreshTokenRepository(session)

        self.otp = OTPService(session)
        
        self.email = EmailService()

    async def register(
        self,
        data: RegisterRequest,
    ) -> User:

        if await self.users.email_exists(
            data.email,
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email address already exists.",
            )

        if await self.users.phone_exists(
            data.phone,
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Phone number already exists.",
            )

        user = User(
            first_name=data.first_name,
            middle_name=data.middle_name,
            last_name=data.last_name,
            email=data.email.lower(),
            phone=data.phone,
            password_hash=hash_password(
                data.password,
            ),
            provider=AuthProvider.LOCAL,
            is_verified=False,
        )

        user = await self.users.create(
            user,
        )

        otp = await self.otp.issue(
            user_uid=user.uid,
            purpose=OTPPurpose.EMAIL_VERIFICATION,
        )

        try:
            await self.email.send_verification_otp(
                email=user.email,
                first_name=user.first_name,
                otp=otp,
            )

        except Exception:
            logger.exception(
                "Failed to send verification OTP to %s",
                user.email,
            )

        return user

    
    async def login(
        self,
        data: LoginRequest,
    ) -> TokenResponse:

        user = await self.users.get_by_email(
            data.email,
        )

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        if user.provider != AuthProvider.LOCAL:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Please sign in using {user.provider.value}.",
            )

        if not verify_password(
            data.password,
            user.password_hash,
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        if (
            user.provider == AuthProvider.LOCAL
            and not user.is_verified
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Please verify your email address.",
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your account has been disabled.",
            )

        return await self.login_user(user)

    async def login_user(
        self,
        user: User,
        *,
        family_id: UUID | None = None,
        ip_address: str | None = None,
        user_agent: str | None = None,
        device_name: str | None = None,
    ) -> TokenResponse:

        access_token = create_access_token(
            str(user.uid),
        )

        refresh_token = create_refresh_token(
            str(user.uid),
        )

        db_token = RefreshToken(
            user_uid=user.uid,
            token_hash=hash_token(refresh_token),
            expires_at=datetime.now(UTC)
            + timedelta(
                days=settings.REFRESH_TOKEN_EXPIRE_DAYS,
            ),
            family_id = family_id or uuid4(),
            ip_address=ip_address,
            user_agent=user_agent,
            device_name=device_name,
        )

        # The newly issued refresh token must remain active.
        # It should only be revoked during rotation or logout.
        await self.refresh_tokens.create(
            db_token,
        )

        await self.users.update(
            user,
            last_login=datetime.now(UTC),
        )

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=UserProfileResponse.model_validate(user),
        )


    async def refresh(
        self,
        refresh_token: str,
    ) -> TokenResponse:

        try:
            payload = decode_token(refresh_token)

        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token.",
            )

        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token.",
            )

        db_token = await self.refresh_tokens.get_by_token(
            refresh_token,
        )

        if db_token is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token not found.",
            )

        if db_token.is_revoked:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token has been revoked.",
            )

        if db_token.expires_at < datetime.now(UTC):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token expired.",
            )

        user = await self.users.get_by_uid(
            db_token.user_uid,
        )

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found.",
            )

        # The current token has now been consumed.
        await self.refresh_tokens.revoke(db_token)

        # Issue the replacement token in the same token family.
        return await self.login_user(
            user,
            family_id=db_token.family_id,
            ip_address=db_token.ip_address,
            user_agent=db_token.user_agent,
            device_name=db_token.device_name,
        )


    async def logout(
        self,
        refresh_token: str,
    ) -> None:

        db_token = await self.refresh_tokens.get_by_token(
            refresh_token,
        )

        if db_token is None:
            return

        if db_token.is_revoked:
            return

        await self.refresh_tokens.revoke(db_token)


    async def logout_all(
        self,
        current_user: User,
    ) -> None:

        await self.refresh_tokens.revoke_all(
            current_user.uid,
        )


    async def get_current_user(
        self,
        current_user: User,
    ) -> UserProfileResponse:

        return UserProfileResponse.model_validate(
            current_user,
        )