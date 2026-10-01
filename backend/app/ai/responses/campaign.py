from pydantic import BaseModel, Field


class CampaignLanguageContent(BaseModel):
    language: str

    title: str

    theme: str

    main_message: str

    supporting_content: list[str] = Field(
        default_factory=list,
    )

    next_step: str


class CampaignGenerateResponse(BaseModel):
    generated: list[CampaignLanguageContent]