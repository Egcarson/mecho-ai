from uuid import UUID

from app.models.usage_analytics import UsageAnalytics
from app.repositories.base_repository import BaseRepository
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select


class AnalyticsRepository(BaseRepository[UsageAnalytics]):
    def __init__(self, session: AsyncSession):
        super().__init__(UsageAnalytics, session)

    async def get_user_events(
        self,
        user_uid: UUID,
    ) -> list[UsageAnalytics]:
        statement = (
            select(UsageAnalytics)
            .where(
                UsageAnalytics.user_uid == user_uid
            )
            .order_by(
                UsageAnalytics.created_at.desc()
            )
        )

        result = await self.session.execute(statement)

        return list(result.scalars().all())

    async def count_events(
        self,
        user_uid: UUID,
    ) -> int:
        statement = (
            select(func.count())
            .select_from(UsageAnalytics)
            .where(
                UsageAnalytics.user_uid == user_uid
            )
        )

        result = await self.session.execute(statement)

        return result.scalar_one()