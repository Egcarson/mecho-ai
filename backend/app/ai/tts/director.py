from app.ai.tts.models import (
    VoiceExpression,
    VoiceScript,
    VoiceSegment,
)


class VoiceDirector:

    def create_script(
        self,
        *,
        text: str,
        language: str,
    ) -> VoiceScript:

        segments = self._segment_text(
            text,
        )

        return VoiceScript(
            language=language,
            segments=segments,
        )

    def _segment_text(
        self,
        text: str,
    ) -> list[VoiceSegment]:

        paragraphs = [
            paragraph.strip()
            for paragraph in text.split("\n\n")
            if paragraph.strip()
        ]

        segments: list[VoiceSegment] = []

        for paragraph in paragraphs:

            sentences = self._split_sentences(
                paragraph,
            )

            for sentence in sentences:

                segments.append(
                    VoiceSegment(
                        text=sentence,
                        expression=(
                            VoiceExpression.NEUTRAL
                        ),
                        pause_after_ms=300,
                    )
                )

        return segments

    @staticmethod
    def _split_sentences(
        text: str,
    ) -> list[str]:

        import re

        return [
            sentence.strip()
            for sentence in re.split(
                r"(?<=[.!?])\s+",
                text,
            )
            if sentence.strip()
        ]