from datetime import datetime
from uuid import UUID

from app.models.enums import AuthProvider, UserRole
from app.schemas.asset import AssetCardResponse
from app.schemas.project import ProjectResponse
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UpdateProfileRequest(BaseModel):
    first_name: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
    )

    middle_name: str | None = Field(
        default=None,
        max_length=50,
    )

    last_name: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
    )

    phone: str | None = None

    avatar: str | None = None


class ChangePasswordRequest(BaseModel):
    current_password: str

    new_password: str = Field(
        min_length=8,
        max_length=128,
    )


class DashboardSummaryResponse(BaseModel):
    total_projects: int

    total_assets: int

    total_generations: int

    total_audio_files: int

    storage_used: int

    recent_projects: list[ProjectResponse]

    recent_assets: list[AssetCardResponse]

    monthly_generations: int

    favorite_language: str | None

    favorite_platform: str | None


class DeleteAccountRequest(BaseModel):
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class VerifyResetOTPRequest(BaseModel):
    email: EmailStr

    otp: str = Field(
        min_length=6,
        max_length=6,
    )


class VerifyResetOTPResponse(BaseModel):
    reset_token: str


class ResendResetOTPRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    reset_token: str

    new_password: str = Field(
        min_length=8,
    )


class VerifyEmailRequest(BaseModel):
    email: EmailStr

    otp: str = Field(
        min_length=6,
        max_length=6,
    )


class ResendVerificationOTPRequest(BaseModel):
    email: EmailStr


class UserPreferenceUpdate(BaseModel):
    default_language: str | None = None
    default_tone: str | None = None
    default_voice: str | None = None
    default_workflow: str | None = None
    preferences: dict | None = None


class UserPreferenceResponse(BaseModel):
    default_language: str | None = None
    default_tone: str | None = None
    default_voice: str | None = None
    default_workflow: str | None = None

    preferences: dict = Field(
        default_factory=dict,
    )

    model_config = ConfigDict(
        from_attributes=True,
    )


class UserProfileUpdate(BaseModel):
    first_name: str | None = None
    middle_name: str | None = None
    last_name: str | None = None
    phone: str | None = None


class UserProfileResponse(BaseModel):
    uid: UUID

    first_name: str
    middle_name: str | None = None
    last_name: str

    email: str
    phone: str | None = None

    profile_picture_url: str | None = None

    is_verified: bool

    is_active: bool

    preferences: UserPreferenceResponse | None = None

    model_config = ConfigDict(
        from_attributes=True,
    )