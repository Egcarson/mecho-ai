from uuid import UUID

from app.models.asset import Asset
from app.models.enums import (
    AssetProvider,
    AssetType,
)
from app.repositories.base_repository import (
    BaseRepository,
)
from sqlalchemy import desc, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select


class AssetRepository(
    BaseRepository[Asset]
):
    def __init__(
        self,
        session: AsyncSession,
    ):
        super().__init__(
            Asset,
            session,
        )

        self.session = session

    async def create_asset(
        self,
        asset: Asset,
    ) -> Asset:

        try:
            self.session.add(
                asset
            )

            await self.session.commit()

            await self.session.refresh(
                asset
            )

            return asset

        except Exception:
            await self.session.rollback()
            raise

    # async def get_by_uid_user_and_project(
    #     self,
    #     asset_uid: UUID,
    #     user_uid: UUID,
    #     project_uid: UUID,
    # ) -> Asset | None:

    #     statement = (
    #         select(Asset)
    #         .where(
    #             Asset.uid
    #             == asset_uid,
    #             Asset.user_uid
    #             == user_uid,
    #             Asset.project_uid
    #             == project_uid,
    #         )
    #     )

    #     result = (
    #         await self.session.execute(
    #             statement
    #         )
    #     )

    #     return (
    #         result.scalar_one_or_none()
    #     )
    
    async def get_project_assets(
        self,
        project_uid: UUID,
    ) -> list[Asset]:

        statement = (
            select(Asset)
            .where(
                Asset.project_uid
                == project_uid
            )
            .order_by(
                desc(
                    Asset.created_at
                )
            )
        )

        result = await self.session.execute(
            statement
        )

        return list(
            result.scalars().all()
        )

    async def get_user_image_assets(
        self,
        user_uid: UUID,
    ) -> list[Asset]:

        statement = (
            select(Asset)
            .where(
                Asset.user_uid
                == user_uid,
                Asset.asset_type
                == AssetType.IMAGE,
            )
            .order_by(
                desc(
                    Asset.created_at
                )
            )
        )

        result = await self.session.execute(
            statement
        )

        return list(
            result.scalars().all()
        )

    async def get_by_type(
        self,
        project_uid: UUID,
        asset_type: AssetType,
    ) -> list[Asset]:

        statement = (
            select(Asset)
            .where(
                Asset.project_uid
                == project_uid,
                Asset.asset_type
                == asset_type,
            )
            .order_by(
                desc(
                    Asset.created_at
                )
            )
        )

        result = await self.session.execute(
            statement
        )

        return list(
            result.scalars().all()
        )

    async def get_by_provider(
        self,
        provider: AssetProvider,
    ) -> list[Asset]:

        statement = (
            select(Asset)
            .where(
                Asset.provider
                == provider
            )
            .order_by(
                desc(
                    Asset.created_at
                )
            )
        )

        result = await self.session.execute(
            statement
        )

        return list(
            result.scalars().all()
        )

    async def get_latest_audio(
        self,
        project_uid: UUID,
    ) -> Asset | None:

        statement = (
            select(Asset)
            .where(
                Asset.project_uid
                == project_uid,
                Asset.asset_type
                == AssetType.AUDIO,
            )
            .order_by(
                desc(
                    Asset.created_at
                )
            )
            .limit(1)
        )

        result = await self.session.execute(
            statement
        )

        return result.scalars().first()

    async def get_by_uid_and_user(
        self,
        asset_uid: UUID,
        user_uid: UUID,
    ) -> Asset | None:

        statement = (
            select(Asset)
            .where(
                Asset.uid
                == asset_uid,
                Asset.user_uid
                == user_uid,
            )
        )

        result = await self.session.execute(
            statement
        )

        return result.scalar_one_or_none()

    async def count_project_assets(
        self,
        project_uid: UUID,
    ) -> int:

        statement = (
            select(
                func.count()
            )
            .select_from(
                Asset
            )
            .where(
                Asset.project_uid
                == project_uid
            )
        )

        result = await self.session.execute(
            statement
        )

        return result.scalar_one()

    async def count_user_assets(
        self,
        user_uid: UUID,
    ) -> int:

        statement = (
            select(
                func.count()
            )
            .select_from(
                Asset
            )
            .where(
                Asset.user_uid
                == user_uid
            )
        )

        result = await self.session.execute(
            statement
        )

        return result.scalar_one()

    async def count_audio_assets(
        self,
        user_uid: UUID,
    ) -> int:

        statement = (
            select(
                func.count()
            )
            .select_from(
                Asset
            )
            .where(
                Asset.user_uid
                == user_uid,
                Asset.asset_type
                == AssetType.AUDIO,
            )
        )

        result = await self.session.execute(
            statement
        )

        return result.scalar_one()