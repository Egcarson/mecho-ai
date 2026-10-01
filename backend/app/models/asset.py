from typing import TYPE_CHECKING
from uuid import UUID

from app.models.base import BaseModel
from app.models.enums import AssetProvider, AssetType
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Column, Field, Relationship

if TYPE_CHECKING:
    from app.models.project import Project
    from app.models.user import User


class Asset(BaseModel, table=True):
    __tablename__ = "assets" #type: ignore

    project_uid: UUID | None = Field(
        default=None,
        foreign_key="projects.uid",
        index=True,
        nullable=True
    )

    user_uid: UUID = Field(
            foreign_key="users.uid",
            index=True,
        )

    asset_type: AssetType
    # audio
    # image
    # video
    # pdf
    # document
    # thumbnail
    # cover

    provider: AssetProvider
    # yarngpt
    # cloudinary
    # openai
    # runway
    # upload

    file_name: str | None = None

    url: str

    mime_type: str | None = None

    size_bytes: int | None = None

    language: str | None = None

    extra_data: dict | None = Field(
        default=None,
        sa_column=Column(JSONB),
    )

    # Relationship
    project: "Project" = Relationship(
        back_populates="assets",
    )

    user: "User" = Relationship(
        back_populates="assets",
    )