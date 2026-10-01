from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.generation import Generation
from app.models.image_generation import ImageGeneration
from app.models.project import Project
from app.models.voice_generation import VoiceGeneration

from app.models.enums import (
    ImageGenerationStatus,
    VoiceGenerationStatus,
)


class LibraryRepository:

    def __init__(
        self,
        session: AsyncSession,
    ):
        self.session = session

    async def get_voice_assets(
        self,
        *,
        user_uid: UUID,
    ) -> list[
        tuple[
            Project,
            Generation,
            VoiceGeneration,
        ]
    ]:

        statement = (
            select(
                Project,
                Generation,
                VoiceGeneration,
            )
            .join(
                Generation,
                Generation.project_uid
                == Project.uid,
            )
            .join(
                VoiceGeneration,
                VoiceGeneration.generation_uid
                == Generation.uid,
            )
            .where(
                Project.user_uid == user_uid,
                VoiceGeneration.status
                == VoiceGenerationStatus.COMPLETED,
                VoiceGeneration.audio_url.is_not(
                    None
                ),
            )
            .order_by(
                VoiceGeneration.created_at.desc()
            )
        )

        result = await self.session.execute(
            statement
        )

        rows = result.all()

        return [
            (
                row[0],
                row[1],
                row[2],
            )
            for row in rows
        ]

    async def get_image_assets(
        self,
        *,
        user_uid: UUID,
    ) -> list[
        tuple[
            Project,
            Generation,
            ImageGeneration,
        ]
    ]:

        statement = (
            select(
                Project,
                Generation,
                ImageGeneration,
            )
            .join(
                Generation,
                Generation.project_uid
                == Project.uid,
            )
            .join(
                ImageGeneration,
                ImageGeneration.generation_uid
                == Generation.uid,
            )
            .where(
                Project.user_uid == user_uid,
                ImageGeneration.status
                == ImageGenerationStatus.COMPLETED,
                ImageGeneration.image_url.is_not(
                    None
                ),
            )
            .order_by(
                ImageGeneration.created_at.desc()
            )
        )

        result = await self.session.execute(
            statement
        )

        rows = result.all()

        return [
            (
                row[0],
                row[1],
                row[2],
            )
            for row in rows
        ]