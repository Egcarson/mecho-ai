from app.ai.tts.base import TTSProvider
from app.ai.tts.chunker import VoiceScriptChunker
from app.ai.tts.composer import AudioComposer
from app.ai.tts.director import VoiceDirector
from app.ai.tts.models import VoiceScript


class TTSService:

    def __init__(
        self,
        provider: TTSProvider,
    ):
        self.provider = provider
        self.director = VoiceDirector()
        self.chunker = VoiceScriptChunker()
        self.composer = AudioComposer()

    async def synthesize(
        self,
        *,
        text: str,
        language: str,
        voice: str | None = None,
        response_format: str = "mp3",
    ) -> bytes:

        script = self.director.create_script(
            text=text,
            language=language,
        )

        max_characters = (
            self.provider.capabilities.max_characters
        )

        if max_characters:
            scripts = self.chunker.chunk(
                script,
                max_characters=max_characters,
            )
        else:
            scripts = [script]

        audio_chunks: list[
            tuple[bytes, VoiceScript]
        ] = []

        for script_chunk in scripts:

            audio = await self.provider.synthesize(
                script=script_chunk,
                voice=voice,
                response_format=response_format,
            )

            audio_chunks.append(
                (
                    audio,
                    script_chunk,
                )
            )

        if len(audio_chunks) == 1:
            return audio_chunks[0][0]

        return self.composer.combine(
            audio_chunks,
            response_format=response_format,
        )