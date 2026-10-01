# schemas/library.py

from datetime import datetime
from uuid import UUID

from app.models.enums import LibraryMediaType
from pydantic import BaseModel


class LibraryMediaResponse(BaseModel):
    uid: UUID

    media_type: LibraryMediaType

    url: str

    project_uid: UUID

    generation_uid: UUID

    project_name: str

    workflow: str

    language: str | None = None

    platform: str | None = None

    voice_name: str | None = None

    created_at: datetime