from app.ai.context.content import ContentPromptContext


class SocialPromptContext(ContentPromptContext):
    input_content: str | None = None

    document_content: str | None = None

    platforms: list[str]

    trend_context: str | None = None