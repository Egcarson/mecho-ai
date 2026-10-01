from uuid import UUID

from app.models.user import User
from app.repositories.asset_repository import AssetRepository
from fastapi import HTTPException, status


class ImageAssetResolver:

    def __init__(
        self,
        assets: AssetRepository,
    ):
        self.assets = assets

    async def resolve_one(
        self,
        *,
        asset_uid: UUID | None,
        current_user: User,
    ) -> str | None:

        if asset_uid is None:
            return None

        asset = (
            await self.assets.get_by_uid_and_user(
                asset_uid=asset_uid,
                user_uid=current_user.uid,
            )
        )

        if asset is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Asset not found.",
            )

        return asset.url

    async def resolve_many(
        self,
        *,
        asset_uids: list[UUID],
        current_user: User,
    ) -> list[str]:

        urls: list[str] = []

        for asset_uid in asset_uids:

            asset = (
                await self.assets.get_by_uid_and_user(
                    asset_uid=asset_uid,
                    user_uid=current_user.uid,
                )
            )

            if asset is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=(
                        f"Asset '{asset_uid}' "
                        "was not found."
                    ),
                )

            urls.append(
                asset.url
            )

        return urls