from typing import TYPE_CHECKING
from uuid import UUID

from app.models.base import BaseModel
from app.models.enums import VoiceGenerationStatus
from app.models.voice_provider import VoiceProviderJob
from sqlalchemy import Enum as pgEnum
from sqlmodel import Column, Field, Relationship, UniqueConstraint

if TYPE_CHECKING:
    from app.models.generation import Generation


class VoiceGeneration(BaseModel, table=True):
    __tablename__ = "voice_generations" #type: ignore

    __table_args__ = (
        UniqueConstraint(
            "generation_uid",
            "language",
            "platform",
            "voice",
            name="uq_voice_generation_content_voice",
        ),
    )

    generation_uid: UUID = Field(
        foreign_key="generations.uid",
        index=True,
        nullable=False,
    )

    language: str = Field(
        nullable=False,
        max_length=50,
    )

    platform: str = Field(
        nullable=False,
        max_length=50,
    )

    voice: str = Field(
        nullable=False,
        max_length=100,
    )

    status: VoiceGenerationStatus = Field(default=VoiceGenerationStatus.PENDING, sa_column=Column(pgEnum(VoiceGenerationStatus, values_callable=lambda enum: [e.value for e in enum], name="voice_generation_status"), nullable=False))

    audio_url: str | None = Field(
        default=None,
    )

    cloudinary_public_id: str | None = Field(
        default=None,
    )

    provider: str = Field(
        nullable=False,
        max_length=50,
    )

    response_format: str = Field(
        default="mp3",
        nullable=False,
        max_length=10,
    )

    duration_seconds: float | None = Field(
        default=None,
    )

    error_message: str | None = Field(
        default=None,
    )


    # Relationships

    generation: "Generation" = Relationship(
        back_populates="voice_generations",
    )

    provider_jobs: list["VoiceProviderJob"] = Relationship(
        back_populates="voice_generation",
        cascade_delete=True,
    )