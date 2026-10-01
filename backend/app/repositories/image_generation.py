from uuid import UUID

from app.models.image_generation import ImageGeneration
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


class ImageGenerationRepository:

    def __init__(
        self,
        session: AsyncSession,
    ):
        self.session = session

    async def create(
        self,
        image_generation: ImageGeneration,
    ) -> ImageGeneration:

        try:
            self.session.add(
                image_generation,
            )

            await self.session.commit()

            await self.session.refresh(
                image_generation,
            )

            return image_generation

        except Exception:
            await self.session.rollback()
            raise

    async def update(
        self,
        image_generation: ImageGeneration,
        **values,
    ) -> ImageGeneration:

        try:
            for key, value in values.items():
                setattr(
                    image_generation,
                    key,
                    value,
                )

            self.session.add(
                image_generation,
            )

            await self.session.commit()

            await self.session.refresh(
                image_generation,
            )

            return image_generation

        except Exception:
            await self.session.rollback()
            raise

    async def get_by_uid(
        self,
        uid: UUID,
    ) -> ImageGeneration | None:

        result = await self.session.execute(
            select(
                ImageGeneration
            ).where(
                ImageGeneration.uid == uid,
            )
        )

        return result.scalars().first()

    async def get_for_generation(
        self,
        generation_uid: UUID,
    ) -> list[ImageGeneration]:

        result = await self.session.execute(
            select(
                ImageGeneration
            )
            .where(
                ImageGeneration.generation_uid
                == generation_uid,
            )
            .order_by(
                ImageGeneration.created_at.desc(),
            )
        )

        return list(
            result.scalars().all()
        )