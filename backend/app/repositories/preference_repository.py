from uuid import UUID

from app.models.user_preference import UserPreference
from app.repositories.base_repository import BaseRepository
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select


class PreferenceRepository(BaseRepository[UserPreference]):
    def __init__(self, session: AsyncSession):
        super().__init__(UserPreference, session)

    async def get_user_preferences(
        self,
        user_uid: UUID,
    ) -> UserPreference | None:
        statement = select(UserPreference).where(
            UserPreference.user_uid == user_uid
        )

        result = await self.session.execute(statement)

        return result.scalars().first()