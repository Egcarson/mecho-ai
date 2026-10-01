# app/repositories/user_preference.py

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user_preference import UserPreference


class UserPreferenceRepository:

    def __init__(
        self,
        session: AsyncSession,
    ):
        self.session = session

    async def get_by_user_uid(
        self,
        user_uid: UUID,
    ) -> UserPreference | None:

        result = await self.session.execute(
            select(UserPreference).where(
                UserPreference.user_uid == user_uid,
            )
        )

        return result.scalars().first()

    async def create(
        self,
        preference: UserPreference,
    ) -> UserPreference:

        try:
            self.session.add(preference)

            await self.session.commit()
            await self.session.refresh(preference)

            return preference

        except Exception:
            await self.session.rollback()
            raise

    async def update(
        self,
        preference: UserPreference,
        **values,
    ) -> UserPreference:

        try:
            for key, value in values.items():
                setattr(
                    preference,
                    key,
                    value,
                )

            self.session.add(
                preference,
            )

            await self.session.commit()
            await self.session.refresh(
                preference,
            )

            return preference

        except Exception:
            await self.session.rollback()
            raise