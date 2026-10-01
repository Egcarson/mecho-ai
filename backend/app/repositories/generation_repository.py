from uuid import UUID

from app.models.enums import GenerationStatus
from app.models.generation import Generation
from app.models.project import Project
from app.repositories.base_repository import BaseRepository
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select


class GenerationRepository(BaseRepository[Generation]):
    def __init__(self, session: AsyncSession):
        super().__init__(Generation, session)

    async def get_by_uid_and_project(
        self,
        generation_uid: UUID,
        project_uid: UUID,
    ) -> Generation | None:
        statement = select(Generation).where(
            Generation.uid == generation_uid,
            Generation.project_uid == project_uid,
        )

        result = await self.session.execute(statement)

        return result.scalars().first()

    async def get_project_generations(
        self,
        project_uid: UUID,
        *,
        limit: int = 20,
        offset: int = 0,
    ) -> list[Generation]:
        statement = (
            select(Generation)
            .where(
                Generation.project_uid == project_uid,
            )
            .order_by(
                Generation.created_at.desc(),
            )
            .offset(offset)
            .limit(limit)
        )

        result = await self.session.execute(statement)

        return list(result.scalars().all())

    async def count_project_generations(
        self,
        project_uid: UUID,
    ) -> int:
        statement = select(func.count(Generation.uid)).where(
            Generation.project_uid == project_uid,
        )

        result = await self.session.execute(statement)

        return result.scalar_one()

    async def get_latest(
        self,
        project_uid: UUID,
    ) -> Generation | None:
        statement = (
            select(Generation)
            .where(
                Generation.project_uid == project_uid,
            )
            .order_by(
                Generation.created_at.desc(),
            )
            .limit(1)
        )

        result = await self.session.execute(statement)

        return result.scalars().first()

    async def get_by_status(
        self,
        project_uid: UUID,
        status: GenerationStatus,
    ) -> list[Generation]:
        statement = (
            select(Generation)
            .where(
                Generation.project_uid == project_uid,
                Generation.status == status,
            )
            .order_by(
                Generation.created_at.desc(),
            )
        )

        result = await self.session.execute(statement)

        return list(result.scalars().all())

    async def get_for_user(
        self,
        user_uid: UUID,
        *,
        page: int,
        limit: int,
    ):
        offset = (page - 1) * limit

        result = await self.session.execute(
            select(
                Generation,
                Project,
            )
            .join(
                Project,
                Generation.project_uid
                == Project.uid,
            )
            .where(
                Project.user_uid == user_uid,
            )
            .order_by(
                Generation.created_at.desc(),
            )
            .offset(offset)
            .limit(limit)
        )

        return result.all()

    async def count_for_user(
        self,
        user_uid: UUID,
    ) -> int:

        result = await self.session.execute(
            select(
                func.count(Generation.uid)
            )
            .join(
                Project,
                Generation.project_uid
                == Project.uid,
            )
            .where(
                Project.user_uid == user_uid,
            )
        )

        return result.scalar_one()