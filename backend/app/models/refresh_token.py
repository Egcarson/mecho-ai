from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID

from app.models.base import BaseModel
from sqlalchemy import DateTime
from sqlmodel import Field, Relationship

if TYPE_CHECKING:
    from app.models.user import User


class RefreshToken(BaseModel, table=True):
    __tablename__ = "refresh_tokens" #type: ignore

    user_uid: UUID = Field(
        foreign_key="users.uid",
        index=True,
        ondelete="CASCADE",
    )

    token_hash: str = Field(
        index=True,
        unique=True,
    )

    family_id: UUID = Field(index=True,  nullable=True)

    device_name: str | None = Field(
        default=None,
        max_length=255,
    )

    ip_address: str | None = Field(
        default=None,
        max_length=45,
    )

    is_revoked: bool = False

    replaced_by_uid: UUID | None = Field(
        foreign_key="refresh_tokens.uid",
        default=None,
    )
    
    user_agent: str | None = None

    expires_at: datetime = Field(sa_type=DateTime(timezone=True), nullable=False,) #type: ignore

    revoked_at: datetime | None = Field(default=None, sa_type=DateTime(timezone=True), nullable=True,) #type: ignore

    # Relationship
    user: "User" = Relationship(back_populates="refresh_tokens")