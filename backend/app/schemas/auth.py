from __future__ import annotations

from app.schemas.user import UserProfileResponse
from pydantic import BaseModel, EmailStr, Field

# --------------------------------------------------
# Register
# --------------------------------------------------


class RegisterRequest(BaseModel):
    first_name: str = Field(
        min_length=2,
        max_length=50,
    )

    middle_name: str | None = Field(
        default=None,
        max_length=50,
    )

    last_name: str = Field(
        min_length=2,
        max_length=50,
    )

    email: EmailStr

    phone: str = Field(
        min_length=10,
        max_length=20,
    )

    password: str = Field(
        min_length=8,
        max_length=128,
    )


# --------------------------------------------------
# Login
# --------------------------------------------------


class LoginRequest(BaseModel):
    email: EmailStr

    password: str


# --------------------------------------------------
# Refresh Token
# --------------------------------------------------


class RefreshTokenRequest(BaseModel):
    refresh_token: str


# --------------------------------------------------
# User Response
# --------------------------------------------------

# --------------------------------------------------
# Auth Response
# --------------------------------------------------


class TokenResponse(BaseModel):
    access_token: str

    refresh_token: str

    token_type: str = "Bearer"

    user: UserProfileResponse

# --------------------------------------------------
# Message Response
# --------------------------------------------------


class SuccessResponse(BaseModel):
    success: bool = True
    message: str
