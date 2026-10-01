from uuid import UUID

from app.models.asset import Asset
from app.models.enums import ProjectStatus, ProjectWorkflow
from app.models.project import Project
from app.repositories.base_repository import BaseRepository
from sqlalchemy import desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import func, select


class ProjectRepository(BaseRepository[Project]):
    def __init__(self, session: AsyncSession):
        super().__init__(Project, session)

    async def get_user_projects(
        self,
        user_uid: UUID,
        *,
        limit: int = 20,
        offset: int = 0,
    ) -> list[Project]:
        statement = (
            select(Project)
            .where(Project.user_uid == user_uid)
            .order_by(desc(Project.created_at))
            .offset(offset)
            .limit(limit)
        )

        result = await self.session.execute(statement)

        return list(result.scalars().all())

    async def get_by_uid_and_user(
        self,
        project_uid: UUID,
        user_uid: UUID,
    ) -> Project | None:
        statement = select(Project).where(
            Project.uid == project_uid,
            Project.user_uid == user_uid,
        )

        result = await self.session.execute(statement)

        return result.scalars().first()

    async def get_by_status(
        self,
        user_uid: UUID,
        status: ProjectStatus,
    ) -> list[Project]:
        statement = (
            select(Project)
            .where(
                Project.user_uid == user_uid,
                Project.status == status,
            )
            .order_by(desc(Project.created_at))
        )

        result = await self.session.execute(statement)

        return list(result.scalars().all())

    async def get_by_workflow(
        self,
        user_uid: UUID,
        workflow: ProjectWorkflow,
    ) -> list[Project]:
        statement = (
            select(Project)
            .where(
                Project.user_uid == user_uid,
                Project.workflow == workflow,
            )
            .order_by(desc(Project.created_at))
        )

        result = await self.session.execute(statement)

        return list(result.scalars().all())

    async def search(
        self,
        user_uid: UUID,
        keyword: str,
    ) -> list[Project]:
        statement = (
            select(Project)
            .where(
                Project.user_uid == user_uid,
                Project.name.ilike(f"%{keyword}%"),
            )
            .order_by(desc(Project.created_at))
        )

        result = await self.session.execute(statement)

        return list(result.scalars().all())

    async def count_user_projects(
        self,
        user_uid: UUID,
    ) -> int:
        statement = (
            select(func.count())
            .select_from(Project)
            .where(Project.user_uid == user_uid)
        )

        result = await self.session.execute(statement)

        return result.scalar_one()

