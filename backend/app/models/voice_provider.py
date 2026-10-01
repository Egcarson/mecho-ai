from typing import TYPE_CHECKING
from uuid import UUID

from app.models.base import BaseModel
from app.models.enums import VoiceProviderJobStatus
from sqlalchemy import Enum as pgEnum
from sqlmodel import Column, Field, Relationship

if TYPE_CHECKING:
    from app.models.voice_generation import VoiceGeneration


class VoiceProviderJob(BaseModel, table=True):
    __tablename__ = "voice_provider_jobs" #type: ignore

    voice_generation_uid: UUID = Field(
        foreign_key="voice_generations.uid",
        index=True,
        nullable=False,
    )

    provider: str = Field(
        nullable=False,
        max_length=50,
    )

    chunk_index: int = Field(
        nullable=False,
    )

    idempotency_key: str = Field(
        nullable=False,
        max_length=100,
        unique=True,
        index=True,
    )

    provider_job_id: str | None = Field(
        default=None,
        max_length=255,
        index=True,
    )

    status: VoiceProviderJobStatus = Field(default=VoiceProviderJobStatus.PENDING, sa_column=Column(pgEnum(VoiceProviderJobStatus, values_callable=lambda enum: [e.value for e in enum], name="voice_provider_job_status"), nullable=False))

    error_message: str | None = Field(
        default=None,
    )

    voice_generation: "VoiceGeneration" = Relationship(
        back_populates="provider_jobs",
    )