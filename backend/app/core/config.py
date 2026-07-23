from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

    GEMINI_API_KEY: str = Field(...)
    GNEWS_API_KEY: str = Field(...)
    YARNGPT_API_KEY: str = Field(...)
    CLOUDINARY_CLOUD_NAME: str = Field(...)
    CLOUDINARY_API_KEY: str = Field(...)
    CLOUDINARY_API_SECRET: str = Field(...)


settings = Settings() #type: ignore

GEMINI_API_KEY = settings.GEMINI_API_KEY
GNEWS_API_KEY = settings.GNEWS_API_KEY
YARNGPT_API_KEY = settings.YARNGPT_API_KEY
CLOUDINARY_CLOUD_NAME = settings.CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY = settings.CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET = settings.CLOUDINARY_API_SECRET