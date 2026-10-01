from app.ai.tts.models import (
    VoiceScript,
    VoiceSegment,
)


class VoiceScriptChunker:

    def chunk(
        self,
        script: VoiceScript,
        *,
        max_characters: int,
    ) -> list[VoiceScript]:

        chunks: list[VoiceScript] = []
        current_segments: list[VoiceSegment] = []
        current_length = 0

        for segment in script.segments:

            segment_length = len(segment.text)

            # Normal case: the whole segment fits.
            if segment_length <= max_characters:

                if (
                    current_segments
                    and current_length
                    + segment_length
                    + 1
                    > max_characters
                ):
                    chunks.append(
                        VoiceScript(
                            language=script.language,
                            segments=current_segments,
                        )
                    )

                    current_segments = []
                    current_length = 0

                current_segments.append(segment)

                current_length += (
                    segment_length + 1
                )

                continue

            # A single segment is larger than the provider limit.
            # Split it by words.
            word_segments = self._split_segment(
                segment,
                max_characters=max_characters,
            )

            for word_segment in word_segments:

                word_length = len(
                    word_segment.text
                )

                if (
                    current_segments
                    and current_length
                    + word_length
                    + 1
                    > max_characters
                ):
                    chunks.append(
                        VoiceScript(
                            language=script.language,
                            segments=current_segments,
                        )
                    )

                    current_segments = []
                    current_length = 0

                current_segments.append(
                    word_segment
                )

                current_length += (
                    word_length + 1
                )

        if current_segments:

            chunks.append(
                VoiceScript(
                    language=script.language,
                    segments=current_segments,
                )
            )

        return chunks

    @staticmethod
    def _split_segment(
        segment: VoiceSegment,
        *,
        max_characters: int,
    ) -> list[VoiceSegment]:

        words = segment.text.split()

        segments: list[VoiceSegment] = []

        current_words: list[str] = []
        current_length = 0

        for word in words:

            word_length = len(word)

            # A single word itself exceeds the limit.
            if word_length > max_characters:
                raise ValueError(
                    "A single word exceeds the TTS "
                    "provider character limit."
                )

            if (
                current_words
                and current_length
                + word_length
                + 1
                > max_characters
            ):
                segments.append(
                    segment.model_copy(
                        update={
                            "text": " ".join(
                                current_words
                            ),
                        }
                    )
                )

                current_words = []
                current_length = 0

            current_words.append(word)

            current_length += (
                word_length + 1
            )

        if current_words:

            segments.append(
                segment.model_copy(
                    update={
                        "text": " ".join(
                            current_words
                        ),
                    }
                )
            )

        return segments