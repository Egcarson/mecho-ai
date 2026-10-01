from datetime import datetime
from typing import TYPE_CHECKING, Optional

from app.models.base import BaseModel
from app.models.enums import AuthProvider, UserRole
from sqlalchemy import DateTime
from sqlalchemy import Enum as pgEnum
from sqlmodel import Column, Field, Relationship

if TYPE_CHECKING:
    from app.models.asset import Asset
    from app.models.project import Project
    from app.models.refresh_token import RefreshToken
    from app.models.usage_analytics import UsageAnalytics
    from app.models.user_preference import UserPreference


class User(BaseModel, table=True):
    __tablename__ = "users"  # type: ignore

    first_name: str
    
    middle_name: None | str = None
    
    last_name: str
    
    phone: str

    email: str = Field(
        unique=True,
        index=True,
        max_length=255,
    )

    password_hash: str

    profile_picture_url: str | None = Field(
        default=None,
    )

    profile_picture_public_id: str | None = Field(
        default=None,
    )
    

    provider: AuthProvider = Field(default=AuthProvider.LOCAL, sa_column=Column(pgEnum(AuthProvider, values_callable=lambda enum: [e.value for e in enum], name="auth_provider"), nullable=False))

    role: UserRole = Field(default=UserRole.USER, sa_column=Column(pgEnum(UserRole, values_callable=lambda enum: [e.value for e in enum], name="user_role"), nullable=False))

    is_active: bool = True

    is_verified: bool = False

    last_login: datetime | None = Field(default=None, sa_type=DateTime(timezone=True), nullable=True,) #type: ignore

    # Relationships

    projects: list["Project"] = Relationship(back_populates="user")

    assets: list["Asset"] = Relationship(back_populates="user")

    analytics: Optional["UsageAnalytics"] = Relationship(back_populates="user", sa_relationship_kwargs={"lazy": "selectin"})

    preferences: Optional["UserPreference"] = Relationship(back_populates="user", sa_relationship_kwargs={"lazy": "selectin"})

    refresh_tokens: list["RefreshToken"] = Relationship(back_populates="user")