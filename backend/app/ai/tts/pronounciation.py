from dataclasses import dataclass


@dataclass(frozen=True)
class PronunciationEntry:
    phrase: str
    language: str
    pronunciation: str


PRONUNCIATIONS: tuple[PronunciationEntry, ...] = (
    PronunciationEntry(
        phrase="Abamba",
        language="ig",
        pronunciation="...",
    ),
)