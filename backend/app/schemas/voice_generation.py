from datetime import datetime
from uuid import UUID

from app.models.enums import VoiceGenerationStatus
from pydantic import BaseModel, ConfigDict, Field


class CreateVoiceGenerationRequest(BaseModel):
    language: str = Field(
        min_length=1,
        max_length=50,
    )

    platform: str | None = Field(
        default=None,
        max_length=50,
    )

    voice: str | None = Field(
        default=None,
        max_length=100,
    )

class VoiceGenerationResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    uid: UUID

    generation_uid: UUID

    language: str
    platform: str
    voice: str

    provider: str

    response_format: str

    status: VoiceGenerationStatus

    audio_url: str | None = None

    error_message: str | None = None

    duration_seconds: float | None = None

    created_at: datetime

    updated_at: datetime

class VoiceResponse(BaseModel):
    name: str
    display_name: str
    description: str | None = None
    languages: list[str]
    default: bool