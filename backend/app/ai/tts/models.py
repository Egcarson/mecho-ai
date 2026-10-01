from enum import Enum

from pydantic import BaseModel, Field


class VoiceExpression(str, Enum):
    NEUTRAL = "neutral"
    WARM = "warm"
    JOYFUL = "joyful"
    SAD = "sad"
    SERIOUS = "serious"
    REFLECTIVE = "reflective"
    EXCITED = "excited"
    TENDER = "tender"
    HUMOROUS = "humorous"


class VoiceEvent(str, Enum):
    NONE = "none"
    LAUGH = "laugh"
    SIGH = "sigh"
    BREATH = "breath"


class PronunciationHint(BaseModel):
    text: str
    pronunciation: str


class VoiceSegment(BaseModel):
    text: str

    expression: VoiceExpression = (
        VoiceExpression.NEUTRAL
    )

    intensity: float = Field(
        default=0.5,
        ge=0.0,
        le=1.0,
    )

    event: VoiceEvent = VoiceEvent.NONE

    pause_after_ms: int = Field(
        default=0,
        ge=0,
    )

    emphasis: bool = False

    pronunciation: list[PronunciationHint] = Field(
        default_factory=list,
    )


class VoiceScript(BaseModel):
    language: str

    segments: list[VoiceSegment]


class TTSProviderCapabilities(BaseModel):
    supports_ssml: bool = False
    supports_emotions: bool = False
    supports_events: bool = False
    supports_pronunciation: bool = False
    supports_prosody: bool = False
    max_characters: int | None = None