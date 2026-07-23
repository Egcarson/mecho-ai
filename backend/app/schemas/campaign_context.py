from pydantic import BaseModel, ConfigDict


class CampaignContext(BaseModel):
    """
    A normalized representation of everything required to generate
    campaign content.

    Every downstream service (trends, prompt builder, AI generation)
    receives this object instead of the raw request.
    """

    model_config = ConfigDict(frozen=True)

    workflow: str

    source_text: str

    content: str | None = None
    brief: str | None = None

    campaign_title: str | None = None
    campaign_goal: str | None = None
    target_audience: str | None = None
    key_message: str | None = None
    call_to_action: str | None = None
    additional_notes: str | None = None

    tone: str

    languages: list[str]
    platforms: list[str]
    audiences: list[str]

    include_emojis: bool
    include_hashtags: bool

    optimize_for_trends: bool

    country: str