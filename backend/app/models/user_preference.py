from typing import TYPE_CHECKING, Optional
from uuid import UUID

from app.models.base import BaseModel
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, Relationship

if TYPE_CHECKING:
    from app.models.user import User


class UserPreference(BaseModel, table=True):
    __tablename__ = "user_preferences" #type: ignore

    user_uid: UUID = Field(
        foreign_key="users.uid",
        unique=True,
        index=True,
    )

    default_language: str | None = Field(
        default=None,
        max_length=50,
    )

    default_tone: str | None = Field(
        default=None,
        max_length=50,
    )

    default_voice: str | None = Field(
        default=None,
        max_length=50,
    )

    default_workflow: str | None = Field(
        default=None,
        max_length=30,
    )

    preferences: dict = Field(
        default_factory=dict,
        sa_column=Column(
            JSONB,
            nullable=False,
        ),
    )

    # Relationship

    user: Optional["User"] = Relationship(
        back_populates="preferences", sa_relationship_kwargs={"lazy": "selectin"} )