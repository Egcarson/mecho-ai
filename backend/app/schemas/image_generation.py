from datetime import datetime
from uuid import UUID

from app.models.enums import (
    ImageDesignStyle,
    ImageFormat,
    ImageGenerationStatus,
)
from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class CreateImageGenerationRequest(BaseModel):
    source_language: str | None = Field(
        default=None,
        max_length=50,
    )

    source_variant: str | None = Field(
        default=None,
        max_length=100,
    )

    # Brand

    brand_name: str | None = None

    tagline: str | None = None

    brand_colors: list[str] = Field(
        default_factory=list,
    )

    # Optional copy overrides

    headline: str | None = None

    subheadline: str | None = None

    call_to_action: str | None = None

    price_text: str | None = None

    promo_text: str | None = None

    # Contact / social

    whatsapp: str | None = None

    phone: str | None = None

    instagram: str | None = None

    tiktok: str | None = None

    twitter: str | None = None

    facebook: str | None = None

    website: str | None = None

    address: str | None = None

    # Design

    design_style: ImageDesignStyle = (
        ImageDesignStyle.AUTO
    )

    format: ImageFormat = (
        ImageFormat.AUTO
    )

    design_notes: str | None = None

    # OFF by default.
    # Only the guided/custom flow should normally expose this.
    include_hashtags: bool = False

    # Assets

    logo_asset_uid: UUID | None = None

    primary_asset_uids: list[UUID] = Field(
        default_factory=list,
    )

    reference_asset_uids: list[UUID] = Field(
        default_factory=list,
    )


class ImageGenerationResponse(BaseModel):
    uid: UUID

    generation_uid: UUID

    source_language: str | None = None

    source_variant: str | None = None

    provider: str

    status: ImageGenerationStatus

    image_url: str | None = None

    error_message: str | None = None

    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )