from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.enums import ProjectWorkflow
from app.models.project import Project
from app.models.user import User
from app.repositories.image_generation import (
    ImageGenerationRepository,
)


class ImageAccessService:

    SOCIAL_FREE_LIMIT = 2

    def __init__(
        self,
        session: AsyncSession,
    ):
        self.session = session

        self.images = ImageGenerationRepository(
            session
        )

    def ensure_workflow_allowed(
        self,
        *,
        project: Project,
    ) -> None:

        if (
            project.workflow
            == ProjectWorkflow.CAMPAIGN
        ):
            raise HTTPException(
                status_code=(
                    status.HTTP_403_FORBIDDEN
                ),
                detail=(
                    "Image generation for Campaign "
                    "is currently available on "
                    "paid plans only."
                ),
            )

        if (
            project.workflow
            == ProjectWorkflow.SPEECH
        ):
            raise HTTPException(
                status_code=(
                    status.HTTP_403_FORBIDDEN
                ),
                detail=(
                    "Image generation for Speech "
                    "is currently available on "
                    "paid plans only."
                ),
            )

        if (
            project.workflow
            != ProjectWorkflow.SOCIAL
        ):
            raise HTTPException(
                status_code=(
                    status.HTTP_403_FORBIDDEN
                ),
                detail=(
                    "Image generation is not "
                    "currently available for "
                    "this workflow."
                ),
            )

    async def ensure_new_social_attempt_available(
        self,
        *,
        current_user: User,
    ) -> None:

        # Lock this user's row so simultaneous
        # requests cannot bypass the quota.
        statement = (
            select(
                User.uid
            )
            .where(
                User.uid == current_user.uid
            )
            .with_for_update()
        )

        await self.session.execute(
            statement
        )

        attempts = (
            await self.images
            .count_social_attempts_for_user(
                current_user.uid
            )
        )

        if (
            attempts
            >= self.SOCIAL_FREE_LIMIT
        ):
            raise HTTPException(
                status_code=(
                    status.HTTP_403_FORBIDDEN
                ),
                detail=(
                    "You have reached your "
                    "current image generation limit."
                ),
            )

    async def get_social_usage(
        self,
        *,
        user_uid: UUID,
    ) -> tuple[int, int]:

        used = (
            await self.images
            .count_social_attempts_for_user(
                user_uid
            )
        )

        return (
            min(
                used,
                self.SOCIAL_FREE_LIMIT,
            ),
            self.SOCIAL_FREE_LIMIT,
        )