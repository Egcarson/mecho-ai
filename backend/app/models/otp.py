from datetime import UTC, datetime
from uuid import UUID

from app.models.base import BaseModel
from app.models.enums import OTPPurpose
from sqlalchemy import DateTime
from sqlalchemy import Enum as pgEnum
from sqlmodel import Column, Field


class OTPVerification(BaseModel, table=True):
    __tablename__ = "otp_verification" # type: ignore

    user_uid: UUID = Field(
        foreign_key="users.uid",
        index=True,
        nullable=False,
        ondelete="CASCADE"
    )

    otp_hash: str = Field(
        nullable=False,
        max_length=255,
    )

    expires_at: datetime = Field(
        sa_type=DateTime(timezone=True), # type: ignore
        nullable=False,
    ) 

    purpose: OTPPurpose = Field(
        sa_column=Column(
            pgEnum(
                OTPPurpose,
                values_callable=lambda enum: [
                    e.value for e in enum
                ],
                name="otp_purpose",
            ),
            nullable=False,
        ),
    )

    used_at: datetime | None = Field(
        default=None,
        sa_type=DateTime(timezone=True), # type: ignore
        nullable=True,
    )
    attempts: int = Field(
        default=0,
        nullable=False,
    )

    max_attempts: int = Field(
        default=5,
        nullable=False,
    )

    @property
    def is_expired(self) -> bool:
        return datetime.now(UTC) >= self.expires_at

    @property
    def is_used(self) -> bool:
        return self.used_at is not None