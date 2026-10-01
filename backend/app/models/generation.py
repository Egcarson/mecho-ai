from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID

from app.models.base import BaseModel
from app.models.enums import GenerationStatus
from sqlalchemy import DateTime
from sqlalchemy import Enum as pgEnum
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Column, Field, Relationship

if TYPE_CHECKING:
    from app.models.image_generation import ImageGeneration
    from app.models.project import Project
    from app.models.voice_generation import VoiceGeneration


class Generation(BaseModel, table=True):
    __tablename__ = "generations" #type: ignore

    project_uid: UUID = Field(
        foreign_key="projects.uid",
        index=True,
        nullable=False,
    )

    status: GenerationStatus = Field(
        default=GenerationStatus.PENDING,
        sa_column=Column(pgEnum(GenerationStatus, values_callable=lambda enum: [e.value for e in enum], name="generation_status"), nullable=False))

    prompt: str = Field(
        nullable=False,
    )

    system_prompt: str | None = Field(
        default=None,
    )

    input_content: str | None = Field(
        default=None,
    )

    memories: list[dict] = Field(default_factory=list, sa_column=Column(JSONB, nullable=False, default=list,),)

    output_content: str | None = Field(
        default=None,
    )

    model: str | None = Field(
        default=None,
    )

    provider: str | None = Field(
        default=None,
    )

    error_message: str | None = Field(
        default=None,
    )

    completed_at: datetime | None = Field(default=None, sa_type=DateTime(timezone=True), nullable=True,) #type: ignore

    # Relationship

    project: "Project" = Relationship(back_populates="generations",)
    voice_generations: list["VoiceGeneration"] = Relationship(back_populates="generation", cascade_delete=True)
    image_generations: list["ImageGeneration"] = Relationship(back_populates="generation", cascade_delete=True)