from app.ai.context.base import PromptContext
from app.models.enums import ContentObjective, ContentTone
from pydantic import BaseModel


class SpeechMemoryContext(BaseModel):
    memory: str
    significance: str | None = None
    emphasis: bool = False


class SpeechPromptContext(PromptContext):
    event_details: str

    memories: list[SpeechMemoryContext]

    audiences: list[str]

    languages: list[str]

    document_content: str | None
    
    objective: ContentObjective

    tone: ContentTone

    target_duration_minutes: int