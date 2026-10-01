from io import BytesIO

from pydub import AudioSegment

from app.ai.tts.models import VoiceScript


class AudioComposer:

    def combine(
        self,
        audio_chunks: list[tuple[bytes, VoiceScript]],
        *,
        response_format: str = "mp3",
    ) -> bytes:

        if not audio_chunks:
            raise ValueError(
                "No audio chunks were provided."
            )

        combined = AudioSegment.empty()

        for audio_bytes, script in audio_chunks:

            audio = AudioSegment.from_file(
                BytesIO(audio_bytes),
                format=response_format,
            )

            combined += audio

            pause = self._pause_after_script(
                script,
            )

            if pause > 0:
                combined += AudioSegment.silent(
                    duration=pause,
                )

        output = BytesIO()

        combined.export(
            output,
            format=response_format,
        )

        return output.getvalue()

    @staticmethod
    def _pause_after_script(
        script: VoiceScript,
    ) -> int:

        if not script.segments:
            return 0

        return script.segments[-1].pause_after_ms