from datetime import UTC, datetime, timedelta
from uuid import UUID

from app.core.otp import (
    generate_otp,
    hash_otp,
    verify_otp_hash,
)
from app.models.enums import OTPPurpose
from app.models.otp import OTPVerification
from app.repositories.otp import (
    OTPVerificationRepository,
)
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession


class OTPService:

    OTP_EXPIRY_MINUTES = 5
    MAX_ATTEMPTS = 5

    def __init__(
        self,
        session: AsyncSession,
    ):
        self.otps = OTPVerificationRepository(
            session,
        )

    async def issue(
        self,
        *,
        user_uid: UUID,
        purpose: OTPPurpose,
    ) -> str:
        """
        Create a new OTP challenge.

        Any previous unused OTP for the
        same user and purpose is invalidated.

        Returns the plaintext OTP once so
        the caller can send it to the user.
        """

        await self.otps.invalidate_active(
            user_uid=user_uid,
            purpose=purpose,
        )

        otp = generate_otp()

        verification = OTPVerification(
            user_uid=user_uid,
            purpose=purpose,
            otp_hash=hash_otp(otp),
            expires_at=(
                datetime.now(UTC)
                + timedelta(
                    minutes=self.OTP_EXPIRY_MINUTES,
                )
            ),
            attempts=0,
            max_attempts=self.MAX_ATTEMPTS,
        )

        await self.otps.create(
            verification,
        )

        return otp

    async def verify(
        self,
        *,
        user_uid: UUID,
        purpose: OTPPurpose,
        otp: str,
    ) -> OTPVerification:
        """
        Verify an OTP challenge.

        Successful verification consumes
        the OTP so it cannot be reused.
        """

        verification = (
            await self.otps.get_latest_active(
                user_uid=user_uid,
                purpose=purpose,
            )
        )

        if verification is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired OTP.",
            )

        if verification.is_expired:
            await self.otps.mark_used(
                verification,
            )

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired OTP.",
            )

        if verification.attempts >= verification.max_attempts:
            await self.otps.mark_used(
                verification,
            )

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Maximum OTP attempts exceeded. "
                    "Request a new code."
                ),
            )

        if not verify_otp_hash(
            otp,
            verification.otp_hash,
        ):
            verification = (
                await self.otps.increment_attempts(
                    verification,
                )
            )

            if (
                verification.attempts
                >= verification.max_attempts
            ):
                await self.otps.mark_used(
                    verification,
                )

                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=(
                        "Maximum OTP attempts exceeded. "
                        "Request a new code."
                    ),
                )

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired OTP.",
            )

        await self.otps.mark_used(
            verification,
        )

        return verification

    async def resend(
        self,
        *,
        user_uid: UUID,
        purpose: OTPPurpose,
    ) -> str:
        """
        Invalidate the previous OTP and
        issue a completely new one.
        """

        return await self.issue(
            user_uid=user_uid,
            purpose=purpose,
        )