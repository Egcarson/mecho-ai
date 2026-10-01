from dataclasses import dataclass


@dataclass(frozen=True)
class VoiceDefinition:
    name: str
    description: str


YARNGPT_VOICES: tuple[VoiceDefinition, ...] = (
    VoiceDefinition(
        name="Idera",
        description="Melodic, gentle.",
    ),
    VoiceDefinition(
        name="Emma",
        description="Authoritative, deep.",
    ),
    VoiceDefinition(
        name="Zainab",
        description="Soothing, gentle.",
    ),
    VoiceDefinition(
        name="Osagie",
        description="Smooth, calm.",
    ),
    VoiceDefinition(
        name="Wura",
        description="Young, sweet.",
    ),
    VoiceDefinition(
        name="Jude",
        description="Warm, confident.",
    ),
    VoiceDefinition(
        name="Chinenye",
        description="Engaging, warm.",
    ),
    VoiceDefinition(
        name="Tayo",
        description="Upbeat, energetic.",
    ),
    VoiceDefinition(
        name="Regina",
        description="Mature, warm.",
    ),
    VoiceDefinition(
        name="Femi",
        description="Rich, reassuring.",
    ),
    VoiceDefinition(
        name="Adaora",
        description="Warm, engaging.",
    ),
    VoiceDefinition(
        name="Umar",
        description="Calm, smooth.",
    ),
    VoiceDefinition(
        name="Mary",
        description="Energetic, youthful.",
    ),
    VoiceDefinition(
        name="Nonso",
        description="Bold, resonant.",
    ),
    VoiceDefinition(
        name="Remi",
        description="Melodious, warm.",
    ),
    VoiceDefinition(
        name="Adam",
        description="Deep, clear.",
    ),
)