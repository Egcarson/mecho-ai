import re

from app.ai.tts.models import (
    SpeechRender,
    SpeechSegment,
)


class SpeechRenderer:

    def render(
        self,
        *,
        text: str,
        language: str,
    ) -> SpeechRender:

        paragraphs = [
            paragraph.strip()
            for paragraph in text.split("\n\n")
            if paragraph.strip()
        ]

        segments: list[SpeechSegment] = []

        for paragraph in paragraphs:

            sentences = re.split(
                r"(?<=[.!?])\s+",
                paragraph,
            )

            for sentence in sentences:

                sentence = sentence.strip()

                if not sentence:
                    continue

                segments.append(
                    SpeechSegment(
                        text=sentence,
                        pause_after_ms=self._pause_for(
                            sentence,
                        ),
                    )
                )

        return SpeechRender(
            language=language,
            segments=segments,
        )

    @staticmethod
    def _pause_for(
        sentence: str,
    ) -> int:

        if sentence.endswith("?"):
            return 500

        if sentence.endswith("!"):
            return 450

        return 300