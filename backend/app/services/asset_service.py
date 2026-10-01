from io import BytesIO
from uuid import UUID

from app.models.asset import Asset
from app.models.enums import (
    AssetProvider,
    AssetType,
)
from app.models.user import User
from app.repositories.asset_repository import AssetRepository
from app.repositories.project_repository import ProjectRepository
from app.schemas.asset import (
    AssetRole,
    AssetUploadResponse,
    UserImageAssetResponse,
)
from app.services.cloudinary_service import CloudinaryService
from fastapi import (
    HTTPException,
    UploadFile,
    status,
)
from sqlalchemy.ext.asyncio import (
    AsyncSession,
)


class AssetService:

    ALLOWED_IMAGE_TYPES = {
        "image/jpeg",
        "image/png",
        "image/webp",
    }

    MAX_IMAGE_SIZE_BYTES = (
        10 * 1024 * 1024
    )

    def __init__(
        self,
        session: AsyncSession,
    ) -> None:

        self.assets = AssetRepository(
            session
        )


    async def upload_image(
        self,
        *,
        current_user: User,
        # project_uid: UUID,
        file: UploadFile,
        role: AssetRole,
    ) -> AssetUploadResponse:

        # project = (
        #     await self.projects
        #     .get_by_uid_and_user(
        #         project_uid,
        #         current_user.uid,
        #     )
        # )

        # if project is None:
        #     raise HTTPException(
        #         status_code=(
        #             status.HTTP_404_NOT_FOUND
        #         ),
        #         detail="Project not found.",
        #     )

        if (
            file.content_type
            not in self.ALLOWED_IMAGE_TYPES
        ):
            raise HTTPException(
                status_code=(
                    status.HTTP_400_BAD_REQUEST
                ),
                detail=(
                    "Only JPEG, PNG and WEBP "
                    "images are supported."
                ),
            )

        file_bytes = await file.read()

        if not file_bytes:
            raise HTTPException(
                status_code=(
                    status.HTTP_400_BAD_REQUEST
                ),
                detail=(
                    "Uploaded image is empty."
                ),
            )

        if (
            len(file_bytes)
            > self.MAX_IMAGE_SIZE_BYTES
        ):
            raise HTTPException(
                status_code=(
                    status
                    .HTTP_413_REQUEST_ENTITY_TOO_LARGE
                ),
                detail=(
                    "Image must not exceed 10 MB."
                ),
            )

        try:
            uploaded = (
                CloudinaryService
                .upload_image(
                    BytesIO(
                        file_bytes
                    ),
                    folder=(
                        self._resolve_folder(
                            role
                        )
                    ),
                )
            )

        except Exception as exc:
            raise HTTPException(
                status_code=(
                    status.HTTP_502_BAD_GATEWAY
                ),
                detail=(
                    "Unable to upload image asset."
                ),
            ) from exc

        asset = Asset(
            project_uid=None,
            user_uid=current_user.uid,
            asset_type=AssetType.IMAGE,
            provider=(
                AssetProvider.CLOUDINARY
            ),
            file_name=file.filename,
            url=uploaded["url"],
            mime_type=file.content_type,
            size_bytes=len(
                file_bytes
            ),
            extra_data={
                "role": role.value,
                "public_id": (
                    uploaded[
                        "public_id"
                    ]
                ),
                "source": "user_upload",
            },
        )

        asset = (
            await self.assets.create_asset(
                asset
            )
        )

        return AssetUploadResponse(
            uid=asset.uid,
            project_uid=(
                asset.project_uid
            ),
            user_uid=(
                asset.user_uid
            ),
            asset_type=(
                asset.asset_type
            ),
            provider=(
                asset.provider
            ),
            file_name=(
                asset.file_name
            ),
            url=asset.url,
            mime_type=(
                asset.mime_type
            ),
            size_bytes=(
                asset.size_bytes
            ),
            role=role,
            created_at=(
                asset.created_at
            ),
        )

    async def get_user_images(
        self,
        *,
        current_user: User,
        role: AssetRole | None = None,
    ) -> list[
        UserImageAssetResponse
    ]:

        assets = (
            await self.assets
            .get_user_image_assets(
                current_user.uid
            )
        )

        results: list[
            UserImageAssetResponse
        ] = []

        for asset in assets:

            asset_role = (
                self._extract_role(
                    asset
                )
            )

            if (
                role is not None
                and asset_role != role
            ):
                continue

            results.append(
                UserImageAssetResponse(
                    uid=asset.uid,
                    project_uid=(
                        asset.project_uid
                    ),
                    file_name=(
                        asset.file_name
                    ),
                    url=asset.url,
                    mime_type=(
                        asset.mime_type
                    ),
                    size_bytes=(
                        asset.size_bytes
                    ),
                    role=asset_role,
                    created_at=(
                        asset.created_at
                    ),
                )
            )

        return results

    @staticmethod
    def _extract_role(
        asset: Asset,
    ) -> AssetRole | None:

        if not asset.extra_data:
            return None

        value = asset.extra_data.get(
            "role"
        )

        if not value:
            return None

        try:
            return AssetRole(
                value
            )
        except ValueError:
            return None

    @staticmethod
    def _resolve_folder(
        role: AssetRole,
    ) -> str:

        match role:

            case AssetRole.LOGO:
                return (
                    "mecho-ai/assets/logos"
                )

            case AssetRole.PRIMARY:
                return (
                    "mecho-ai/assets/primary"
                )

            case AssetRole.REFERENCE:
                return (
                    "mecho-ai/assets/references"
                )