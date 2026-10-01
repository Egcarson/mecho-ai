from datetime import datetime
from uuid import UUID

from app.models.enums import GenerationStatus, ProjectWorkflow
from pydantic import BaseModel, ConfigDict, Field


class SpeechMemoryInput(BaseModel):
    memory: str = Field(
        min_length=1,
        description=(
            "A real memory, event, experience, or personal detail "
            "the user wants included in the speech."
        ),
    )

    significance: str | None = Field(
        default=None,
        description=(
            "Why this memory matters to the speaker or occasion."
        ),
    )

    emphasis: bool = Field(
        default=False,
        description=(
            "Whether this memory should receive special emphasis "
            "in the speech."
        ),
    )

class CreateGenerationRequest(BaseModel):
    input_content: str | None = None

    memories: list[SpeechMemoryInput] = Field(
        default_factory=list,
    )


class GenerationResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    uid: UUID
    project_uid: UUID

    status: GenerationStatus

    prompt: str
    system_prompt: str | None = None
    input_content: str | None = None
    output_content: str | None = None

    memories: list[SpeechMemoryInput] = Field(
        default_factory=list,
    )

    model: str | None = None
    provider: str | None = None

    error_message: str | None = None
    completed_at: datetime | None = None

    created_at: datetime
    updated_at: datetime


class GenerationListResponse(BaseModel):
    items: list[GenerationResponse]
    total: int


class GenerationHistoryResponse(BaseModel):
    uid: UUID
    project_uid: UUID

    project_name: str
    workflow: ProjectWorkflow
    status: GenerationStatus
    input_content: str
    output_content: str | None = None

    created_at: datetime

class GenerationHistoryPage(BaseModel):
    items: list[GenerationHistoryResponse]

    page: int

    limit: int

    total: int

    total_pages: int