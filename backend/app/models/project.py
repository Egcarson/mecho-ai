from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID

from app.models.base import BaseModel
from app.models.enums import (
    ContentLength,
    ContentObjective,
    ContentTone,
    ProjectStatus,
    ProjectWorkflow,
)
from sqlalchemy import ARRAY, Column, DateTime, String, Text
from sqlalchemy import Enum as pgEnum
from sqlmodel import Field, Relationship

if TYPE_CHECKING:
    from app.models.asset import Asset
    from app.models.generation import Generation
    from app.models.user import User


class Project(BaseModel, table=True):
    __tablename__ = "projects"  # type: ignore

    user_uid: UUID = Field(
        foreign_key="users.uid",
        index=True,
    )

    name: str = Field(
        max_length=255,
    )

    workflow: ProjectWorkflow = Field(sa_column=Column(pgEnum(ProjectWorkflow, values_callable=lambda enum: [e.value for e in enum], name="project_workflow"), nullable=False,),)
    # social | campaign

    status: ProjectStatus = Field(default=ProjectStatus.DRAFT, sa_column=Column(pgEnum(ProjectStatus, values_callable=lambda enum: [e.value for e in enum], name="project_status"), nullable=False))
    # draft | completed | archived

    objective: ContentObjective = Field(default=ContentObjective.PROMOTION, sa_column=Column(pgEnum(ContentObjective, values_callable=lambda enum: [e.value for e in enum], name="content_objective"), nullable=False,),)

    tone: ContentTone = Field(default=ContentTone.PROFESSIONAL, sa_column=Column(pgEnum(ContentTone, values_callable=lambda enum: [e.value for e in enum], name="content_tone"), nullable=False))

    audiences: list[str] = Field(default_factory=list, sa_column=Column(ARRAY(String), nullable=False,),)

    languages: list[str] = Field(default_factory=list, sa_column=Column(ARRAY(String), nullable=False,),)

    platforms: list[str] | None = Field(default=None, sa_column=Column(ARRAY(String), nullable=True,),)

    source_document_url: str | None = None

    source_document_text: str | None = Field(
        default=None,
        sa_column=Column(Text, nullable=True),
    )

    thumbnail_url: str | None = None

    description: str | None = None

    generation_count: int = Field(
        default=0,
    )

    length: ContentLength = Field(
        default=ContentLength.MEDIUM,
        sa_column=Column(
            pgEnum(
                ContentLength,
                values_callable=lambda enum: [e.value for e in enum],
                name="content_length",
            ),
            nullable=True,
        ),
    )

    target_duration_minutes: int | None = Field(
        default=None,
        ge=1,
        le=120,
    )

    last_generated_at: datetime | None = Field(default=None, sa_type=DateTime(timezone=True), nullable=True,) #type: ignore

    last_opened_at: datetime | None = Field(default=None, sa_type=DateTime(timezone=True), nullable=True,) #type: ignore

    is_favorite: bool = Field(
        default=False,
    )

    is_archived: bool = Field(
        default=False,
    )

    # Relationship

    user: "User" = Relationship(back_populates="projects")

    assets: list["Asset"] | None = Relationship(back_populates="project")

    generations: list["Generation"] = Relationship(back_populates="project", cascade_delete=True,)
