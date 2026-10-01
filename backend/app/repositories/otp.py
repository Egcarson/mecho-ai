from datetime import UTC, datetime
from uuid import UUID

from app.models.enums import OTPPurpose
from app.models.otp import OTPVerification
from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select


class OTPVerificationRepository:

    def __init__(
        self,
        session: AsyncSession,
    ):
        self.session = session

    async def create(
        self,
        verification: OTPVerification,
    ) -> OTPVerification:

        self.session.add(
            verification,
        )

        await self.session.commit()

        await self.session.refresh(
            verification,
        )

        return verification

    async def get_latest_active(
        self,
        user_uid: UUID,
        purpose: OTPPurpose,
    ) -> OTPVerification | None:

        result = await self.session.execute(
            select(OTPVerification)
            .where(
                OTPVerification.user_uid
                == user_uid,

                OTPVerification.purpose
                == purpose,

                OTPVerification.used_at
                .is_(None),
            )
            .order_by(
                OTPVerification.created_at.desc(),
            )
            .limit(1)
        )

        return result.scalars().first()

    async def increment_attempts(
        self,
        verification: OTPVerification,
    ) -> OTPVerification:

        verification.attempts += 1

        self.session.add(
            verification,
        )

        await self.session.commit()

        await self.session.refresh(
            verification,
        )

        return verification

    async def mark_used(
        self,
        verification: OTPVerification,
    ) -> OTPVerification:

        verification.used_at = datetime.now(
            UTC,
        )

        self.session.add(
            verification,
        )

        await self.session.commit()

        await self.session.refresh(
            verification,
        )

        return verification

    async def invalidate_active(
        self,
        user_uid: UUID,
        purpose: OTPPurpose,
    ) -> None:

        await self.session.execute(
            update(OTPVerification)
            .where(
                OTPVerification.user_uid
                == user_uid,

                OTPVerification.purpose
                == purpose,

                OTPVerification.used_at
                .is_(None),
            )
            .values(
                used_at=datetime.now(
                    UTC,
                ),
            )
        )

        await self.session.commit()