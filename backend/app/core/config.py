from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

    GEMINI_API_KEY: str = Field(...)
    GNEWS_API_KEY: str = Field(...)
    VOICE_PROVIDER_API_KEY: str = Field(...)
    VOICE_PROVIDER_BASE_URL: str = Field(...)
    CLOUDINARY_CLOUD_NAME: str = Field(...)
    CLOUDINARY_API_KEY: str = Field(...)
    CLOUDINARY_API_SECRET: str = Field(...)
    SECRET_KEY: str = Field(...)
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REFRESH_TOKEN_EXPIRE_DAYS: int
    DATABASE_URL: str = Field(...)
    GEMINI_MODEL: str = Field(...)
    RESEND_API_KEY: str = Field(...)
    EMAIL_FROM: str = Field(...)
    IMAGE_PROVIDER_API_KEY: str = Field(...)
    GOOGLE_CLIENT_ID: str


settings = Settings() #type: ignore

GEMINI_API_KEY = settings.GEMINI_API_KEY
GNEWS_API_KEY = settings.GNEWS_API_KEY
YARNGPT_API_KEY = settings.VOICE_PROVIDER_API_KEY
CLOUDINARY_CLOUD_NAME = settings.CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY = settings.CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET = settings.CLOUDINARY_API_SECRET
SECRET_KEY = settings.SECRET_KEY
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES
REFRESH_TOKEN_EXPIRE_DAYS = settings.REFRESH_TOKEN_EXPIRE_DAYS
DATABASE_URL=settings.DATABASE_URL
