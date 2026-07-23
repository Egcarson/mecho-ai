from pydantic import BaseModel, ConfigDict


class TrendContext(BaseModel):
    """
    Relevant trends to enrich AI-generated content.
    """

    model_config = ConfigDict(frozen=True)

    enabled: bool

    country: str

    topics: list[str] = []

    hashtags: list[str] = []

    guidance: str = ""