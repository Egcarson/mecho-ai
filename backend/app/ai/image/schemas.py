from pydantic import BaseModel, Field


class CreativeSourceContent(BaseModel):
    # Source intelligence.
    # These fields do NOT automatically mean
    # "print this text on the artwork."

    title: str | None = None

    body: str

    subheadline: str | None = None

    call_to_action: str | None = None

    price_text: str | None = None

    promo_text: str | None = None

    supporting_text: list[str] = Field(
        default_factory=list,
    )

    hashtags: list[str] = Field(
        default_factory=list,
    )


class CreativeBrandContext(BaseModel):
    brand_name: str | None = None

    tagline: str | None = None

    brand_colors: list[str] = Field(
        default_factory=list,
    )

    logo_url: str | None = None

    whatsapp: str | None = None

    phone: str | None = None

    instagram: str | None = None

    tiktok: str | None = None

    twitter: str | None = None

    facebook: str | None = None

    website: str | None = None

    address: str | None = None


class CreativeDesignContext(BaseModel):
    language: str | None = None

    platform: str | None = None

    objective: str | None = None

    tone: str | None = None

    audience: list[str] = Field(
        default_factory=list,
    )

    content_format: str | None = None

    design_style: str | None = None

    format: str | None = None

    design_notes: str | None = None

    include_hashtags: bool = False

    # Determines which professional prompt is used.
    is_custom_design: bool = False


class CreativeBrief(BaseModel):
    source: CreativeSourceContent

    brand: CreativeBrandContext

    design: CreativeDesignContext

    primary_image_urls: list[str] = Field(
        default_factory=list,
    )

    reference_image_urls: list[str] = Field(
        default_factory=list,
    )