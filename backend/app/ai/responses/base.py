from enum import Enum

from pydantic import BaseModel, Field


class PlatformType(str, Enum):
    INSTAGRAM = "instagram"
    LINKEDIN = "linkedin"
    FACEBOOK = "facebook"
    YOUTUBE = "youtube"
    X = "x"
    TIKTOK = "tiktok"


class LanguageType(str, Enum):
    ENGLISH = "english"
    PIDGIN = "pidgin"
    YORUBA = "yoruba"
    IGBO = "igbo"
    HAUSA = "hausa"

class PlatformContent(BaseModel):
    platform: PlatformType
    hook: str
    content: str
    call_to_action: str
    hashtags: list[str] = Field(
        default_factory=list,
    )


class LanguageContent(BaseModel):
    language: LanguageType
    contents: list[PlatformContent]