from typing import Literal

from pydantic import BaseModel, Field


Workflow = Literal["social", "professional"]


class GenerateRequest(BaseModel):
    workflow: Workflow

    # Social
    content: str = ""
    brief: str = ""

    # Professional Campaign
    campaignTitle: str = ""
    campaignGoal: str = ""
    targetAudience: str = ""
    keyMessage: str = ""
    callToAction: str = ""
    additionalNotes: str = ""

    # AI
    languages: list[str] = Field(default_factory=list)
    tone: str = "Professional"
    audiences: list[str] = Field(default_factory=list)
    platforms: list[str] = Field(default_factory=list)

    includeEmojis: bool = True
    includeHashtags: bool = True
    optimizeForTrends: bool = False
    country: str = "Nigeria"