from typing import TYPE_CHECKING
from uuid import UUID

from app.models.base import BaseModel
from app.models.enums import ImageGenerationStatus
from sqlalchemy import Enum as pgEnum
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Column, Field, Relationship, UniqueConstraint

if TYPE_CHECKING:
    from app.models.generation import Generation



class ImageGeneration(BaseModel, table=True):
    __tablename__ = "image_generations" #type: ignore

    generation_uid: UUID = Field(
        foreign_key="generations.uid",
        index=True,
        nullable=False,
    )

    provider: str = Field(
        default="openai",
        max_length=50,
        nullable=False,
    )

    status: ImageGenerationStatus = Field(
        default=ImageGenerationStatus.PENDING,
        sa_column=Column(
            pgEnum(
                ImageGenerationStatus,
                values_callable=lambda enum: [
                    item.value for item in enum
                ],
                name="image_generation_status",
            ),
            nullable=False,
        ),
    )

    source_language: str | None = Field(
        default=None,
        max_length=50,
    )

    source_variant: str | None = Field(
        default=None,
        max_length=100,
    )

    design_brief: dict = Field(
        default_factory=dict,
        sa_column=Column(
            JSONB,
            nullable=False,
        ),
    )

    prompt: str | None = None

    image_url: str | None = None

    cloudinary_public_id: str | None = Field(
        default=None,
        max_length=255,
    )

    error_message: str | None = None


    # Relationships
    generation: "Generation" = Relationship(
            back_populates="image_generations",
        )