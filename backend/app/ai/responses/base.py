from enum import Enum

from pydantic import BaseModel, Field


class PlatformType(str, Enum):
    INSTAGRAM = "Instagram"
    LINKEDIN = "LinkedIn"
    FACEBOOK = "Facebook"
    YOUTUBE = "YouTube"
    X = "X"
    TIKTOK = "TIKTOK"


class LanguageType(str, Enum):
    ENGLISH = "English"
    PIDGIN = "Pidgin"
    YORUBA = "Yoruba"
    IGBO = "Igbo"
    HAUSA = "Hausa"

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