from __future__ import annotations

from datetime import datetime
from uuid import UUID

from app.models.enums import (
    ContentLength,
    ContentObjective,
    ContentTone,
    ProjectStatus,
    ProjectWorkflow,
)
from pydantic import BaseModel, ConfigDict, Field


class ProjectCreate(BaseModel):
    name: str

    workflow: ProjectWorkflow

    objective: ContentObjective = (
        ContentObjective.PROMOTION
    )

    tone: ContentTone = (
        ContentTone.PROFESSIONAL
    )

    audiences: list[str] = Field(
        default_factory=list,
    )

    languages: list[str] = Field(
        default_factory=list,
    )

    length: ContentLength = (
        ContentLength.MEDIUM
    )

    target_duration_minutes: int | None = None

    platforms: list[str] | None = None

    source_document_url: str | None = None

    source_document_text: str | None = None

    thumbnail_url: str | None = None

    description: str | None = None



class ProjectUpdate(BaseModel):
    name: str | None = None

    workflow: ProjectWorkflow | None = None

    objective: ContentObjective | None = None

    tone: ContentTone | None = None

    audiences: list[str] | None = None

    languages: list[str] | None = None

    platforms: list[str] | None = None

    source_document_url: str | None = None
    
    source_document_text: str | None = None

    thumbnail_url: str | None = None

    description: str | None = None

    length: ContentLength | None = None

    target_duration_minutes: int | None = None

    is_favorite: bool | None = None

    is_archived: bool | None = None


class ProjectResponse(BaseModel):
    uid: UUID

    created_at: datetime

    updated_at: datetime

    name: str

    workflow: ProjectWorkflow

    status: ProjectStatus

    objective: ContentObjective

    tone: ContentTone

    audiences: list[str]

    languages: list[str]

    platforms: list[str] | None

    source_document_url: str | None

    source_document_text: str | None

    thumbnail_url: str | None

    description: str | None

    generation_count: int
    
    length: ContentLength | None = None

    target_duration_minutes: int | None

    last_generated_at: datetime | None

    last_opened_at: datetime | None

    is_favorite: bool

    is_archived: bool

    model_config = ConfigDict(
        from_attributes=True,
    )


class ProjectDetailResponse(ProjectResponse):
    source_content: str | None = None

    source_file: str | None = None

    last_generated_at: datetime | None

    last_opened_at: datetime | None


class ProjectListResponse(BaseModel):
    items: list[ProjectResponse]

    total: int