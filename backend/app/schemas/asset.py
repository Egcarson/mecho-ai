from datetime import datetime
from enum import StrEnum
from uuid import UUID

from app.models.enums import (
    AssetProvider,
    AssetType,
)
from pydantic import (
    BaseModel,
    ConfigDict,
)


class AssetRole(StrEnum):
    LOGO = "logo"
    PRIMARY = "primary"
    REFERENCE = "reference"


class AssetUploadResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    uid: UUID
    project_uid: UUID | None
    user_uid: UUID

    asset_type: AssetType
    provider: AssetProvider

    file_name: str | None

    url: str

    mime_type: str | None
    size_bytes: int | None

    role: AssetRole

    created_at: datetime

class UserImageAssetResponse(BaseModel):
    uid: UUID

    project_uid: UUID | None

    file_name: str | None

    url: str

    mime_type: str | None

    size_bytes: int | None

    role: AssetRole | None

    created_at: datetime

class AssetCardResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    uid: UUID
    project_uid: UUID | None
    generation_uid: UUID | None

    name: str
    asset_type: AssetType
    provider: AssetProvider

    url: str
    thumbnail_url: str | None

    created_at: datetime