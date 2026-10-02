from uuid import UUID

from app.models.enums import (
    ProjectWorkflow,
)
from app.models.project import Project
from app.models.user import User
from app.repositories.voice_generation import (
    VoiceGenerationRepository,
)
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


class VoiceAccessService:

    SOCIAL_FREE_LIMIT = 2

    def __init__(
        self,
        session: AsyncSession,
    ):
        self.session = session

        self.voices = (
            VoiceGenerationRepository(
                session
            )
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
                    "Voice generation for Campaign "
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
                    "Voice generation for Speech "
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
                    "Voice generation is not "
                    "currently available for "
                    "this workflow."
                ),
            )

    async def ensure_new_social_attempt_available(
        self,
        *,
        current_user: User,
    ) -> None:

        # Serialize simultaneous quota checks
        # for the same user.
        #
        # Without this lock, two concurrent
        # requests could both see "1 of 2 used"
        # and both create another generation.

        statement = (
            select(
                User
            )
            .where(
                User.uid
                == current_user.uid
            )
            .with_for_update()
        )

        await self.session.execute(
            statement
        )

        attempts = (
            await self.voices
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
                    "current voice generation limit."
                ),
            )

    async def get_social_usage(
        self,
        *,
        user_uid: UUID,
    ) -> tuple[int, int]:

        used = (
            await self.voices
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