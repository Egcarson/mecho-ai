from app.ai.context.base import PromptContext
from app.models.enums import ContentLength, ContentObjective


class ContentPromptContext(PromptContext):
    languages: list[str]

    audiences: list[str]

    tone: str

    objective: ContentObjective

    length: ContentLength