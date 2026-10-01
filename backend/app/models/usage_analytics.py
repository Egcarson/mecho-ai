from typing import TYPE_CHECKING, Optional
from uuid import UUID

from app.models.base import BaseModel
from sqlmodel import Field, Relationship

if TYPE_CHECKING:
    from app.models.user import User


class UsageAnalytics(BaseModel, table=True):
    __tablename__ = "usage_analytics" #type: ignore

    user_uid: UUID = Field(
        foreign_key="users.uid",
        unique=True,
        index=True,
    )

    total_projects: int = Field(default=0)

    ai_requests: int = Field(default=0)

    tts_requests: int = Field(default=0)

    image_requests: int = Field(default=0)

    video_requests: int = Field(default=0)

    pdf_exports: int = Field(default=0)

    content_shares: int = Field(default=0)

    audio_shares: int = Field(default=0)

    storage_used_mb: float = Field(default=0)

    # Relationship

    user: Optional["User"] = Relationship(back_populates="analytics", sa_relationship_kwargs={"lazy": "selectin"})