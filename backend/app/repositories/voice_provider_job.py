from uuid import UUID

from app.models.voice_provider import (
    VoiceProviderJob,
)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select


class VoiceProviderJobRepository:

    def __init__(
        self,
        session: AsyncSession,
    ):
        self.session = session

    async def create(
        self,
        job: VoiceProviderJob,
    ) -> VoiceProviderJob:

        self.session.add(
            job,
        )

        await self.session.commit()

        await self.session.refresh(
            job,
        )

        return job

    async def update(
        self,
        job: VoiceProviderJob,
        **values,
    ) -> VoiceProviderJob:

        for key, value in values.items():
            setattr(
                job,
                key,
                value,
            )

        self.session.add(
            job,
        )

        await self.session.commit()

        await self.session.refresh(
            job,
        )

        return job

    async def get_by_uid(
        self,
        uid: UUID,
    ) -> VoiceProviderJob | None:

        result = await self.session.execute(
            select(VoiceProviderJob).where(
                VoiceProviderJob.uid == uid,
            )
        )

        return result.scalars().first()

    async def get_for_voice_generation(
        self,
        voice_generation_uid: UUID,
    ) -> list[VoiceProviderJob]:

        result = await self.session.execute(
            select(VoiceProviderJob)
            .where(
                VoiceProviderJob.voice_generation_uid
                == voice_generation_uid,
            )
            .order_by(
                VoiceProviderJob.chunk_index.asc(), #type: ignore
            )
        )

        return list(
            result.scalars().all()
        )

    async def get_by_chunk_index(
        self,
        voice_generation_uid: UUID,
        chunk_index: int,
    ) -> VoiceProviderJob | None:

        result = await self.session.execute(
            select(VoiceProviderJob).where(
                VoiceProviderJob.voice_generation_uid
                == voice_generation_uid,

                VoiceProviderJob.chunk_index
                == chunk_index,
            )
        )

        return result.scalars().first()