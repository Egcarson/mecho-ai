from app.ai.context.content import ContentPromptContext


class CampaignPromptContext(ContentPromptContext):
    campaign_brief: str | None = None

    document_content: str | None = None


