from uuid import UUID

from app.models.enums import (
    ProjectWorkflow,
    VoiceGenerationStatus,
)
from app.models.generation import Generation
from app.models.project import Project
from app.models.voice_generation import (
    VoiceGeneration,
)
from app.repositories.base_repository import (
    BaseRepository,
)
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession


class VoiceGenerationRepository(
    BaseRepository[VoiceGeneration]
):

    def __init__(
        self,
        session: AsyncSession,
    ):
        super().__init__(
            VoiceGeneration,
            session,
        )

    async def update(
        self,
        voice_generation: VoiceGeneration,
        **values,
    ) -> VoiceGeneration:

        for key, value in values.items():
            setattr(
                voice_generation,
                key,
                value,
            )

        self.session.add(
            voice_generation,
        )

        await self.session.commit()

        await self.session.refresh(
            voice_generation,
        )

        return voice_generation

    async def get_by_uid(
        self,
        uid: UUID,
    ) -> VoiceGeneration | None:

        statement = (
            select(
                VoiceGeneration
            )
            .where(
                VoiceGeneration.uid == uid
            )
        )

        result = await self.session.execute(
            statement
        )

        return result.scalars().first()

    async def get_by_generation_content_voice(
        self,
        generation_uid: UUID,
        language: str,
        platform: str,
        voice: str,
    ) -> VoiceGeneration | None:

        statement = (
            select(
                VoiceGeneration
            )
            .where(
                VoiceGeneration.generation_uid
                == generation_uid,
                VoiceGeneration.language
                == language,
                VoiceGeneration.platform
                == platform,
                VoiceGeneration.voice
                == voice,
            )
        )

        result = await self.session.execute(
            statement
        )

        return result.scalars().first()

    async def get_generation_voices(
        self,
        generation_uid: UUID,
    ) -> list[VoiceGeneration]:

        statement = (
            select(
                VoiceGeneration
            )
            .where(
                VoiceGeneration.generation_uid
                == generation_uid,
            )
            .order_by(
                VoiceGeneration.created_at.desc(),
            )
        )

        result = await self.session.execute(
            statement
        )

        return list(
            result.scalars().all()
        )

    async def count_social_attempts_for_user(
        self,
        user_uid: UUID,
    ) -> int:

        statement = (
            select(
                func.count(
                    VoiceGeneration.uid
                )
            )
            .join(
                Generation,
                VoiceGeneration.generation_uid
                == Generation.uid,
            )
            .join(
                Project,
                Generation.project_uid
                == Project.uid,
            )
            .where(
                Project.user_uid == user_uid,
                Project.workflow
                == ProjectWorkflow.SOCIAL,
            )
        )

        result = await self.session.execute(
            statement
        )

        return result.scalar_one()

    async def delete_voice(
        self,
        voice_generation: VoiceGeneration,
    ) -> None:

        await self.session.delete(
            voice_generation,
        )

        await self.session.commit()

    async def get_completed_for_user(
        self,
        user_uid: UUID,
    ):

        statement = (
            select(
                VoiceGeneration,
                Generation,
                Project,
            )
            .join(
                Generation,
                VoiceGeneration.generation_uid
                == Generation.uid,
            )
            .join(
                Project,
                Generation.project_uid
                == Project.uid,
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
                VoiceGeneration.created_at.desc(),
            )
        )

        result = await self.session.execute(
            statement
        )

        return result.all()