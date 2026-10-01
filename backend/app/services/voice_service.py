import asyncio
import uuid
from io import BytesIO
from uuid import UUID

from app.ai.tts.chunker import VoiceScriptChunker
from app.ai.tts.composer import AudioComposer
from app.ai.tts.content import VoiceContentExtractor
from app.ai.tts.director import VoiceDirector
from app.ai.tts.models import VoiceScript
from app.ai.tts.providers.yarngpt import YarnGPTProvider
from app.models.enums import (
    VoiceGenerationStatus,
    VoiceProviderJobStatus,
)
from app.models.user import User
from app.models.voice_generation import VoiceGeneration
from app.models.voice_provider import VoiceProviderJob
from app.repositories.generation_repository import GenerationRepository
from app.repositories.project_repository import ProjectRepository
from app.repositories.voice_generation import (
    VoiceGenerationRepository,
)
from app.repositories.voice_provider_job import (
    VoiceProviderJobRepository,
)
from app.schemas.voice_generation import (
    CreateVoiceGenerationRequest,
    VoiceGenerationResponse,
)
from app.services.cloudinary_service import CloudinaryService
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession


class VoiceGenerationService:

    POLL_INTERVAL_SECONDS = 2
    MAX_POLL_ATTEMPTS = 60

    def __init__(
        self,
        session: AsyncSession,
    ):
        self.session = session

        self.projects = ProjectRepository(
            session,
        )

        self.generations = GenerationRepository(
            session,
        )

        self.voices = VoiceGenerationRepository(
            session,
        )

        self.provider_jobs = (
            VoiceProviderJobRepository(
                session,
            )
        )

        self.provider = YarnGPTProvider()

        self.extractor = VoiceContentExtractor()

        self.director = VoiceDirector()

        self.chunker = VoiceScriptChunker()

        self.composer = AudioComposer()

    async def create_voice_generation(
        self,
        current_user: User,
        project_uid: UUID,
        generation_uid: UUID,
        data: CreateVoiceGenerationRequest,
    ) -> VoiceGenerationResponse:

        project = (
            await self.projects.get_by_uid_and_user(
                project_uid,
                current_user.uid,
            )
        )

        if project is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found.",
            )

        generation = (
            await self.generations.get_by_uid_and_project(
                generation_uid,
                project_uid,
            )
        )

        if generation is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Generation not found.",
            )

        if not generation.output_content:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Generation has no generated content."
                ),
            )

        try:
            content = self.extractor.extract(
                workflow=project.workflow,
                output_content=(
                    generation.output_content
                ),
                language=data.language,
                platform=data.platform,
            )

        except ValueError as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(exc),
            ) from exc

        voice = await self._resolve_voice(
            data.voice,
        )

        voice_generation = (
            await self.voices
            .get_by_generation_content_voice(
                generation_uid=(
                    generation.uid
                ),
                language=content.language,
                platform=content.platform,
                voice=voice,
            )
        )

        # Already successfully generated.
        # Return existing Cloudinary audio.
        if (
            voice_generation is not None
            and voice_generation.status
            == VoiceGenerationStatus.COMPLETED
            and voice_generation.audio_url
        ):
            return (
                VoiceGenerationResponse
                .model_validate(
                    voice_generation,
                )
            )

        # First attempt.
        if voice_generation is None:

            voice_generation = (
                VoiceGeneration(
                    generation_uid=(
                        generation.uid
                    ),
                    language=(
                        content.language
                    ),
                    platform=(
                        content.platform
                    ),
                    voice=voice,
                    provider="yarngpt",
                    response_format="mp3",
                    status=(
                        VoiceGenerationStatus
                        .PENDING
                    ),
                )
            )

            voice_generation = (
                await self.voices.create(
                    voice_generation,
                )
            )

        # Could be retrying a previously
        # failed/incomplete generation.
        voice_generation = (
            await self.voices.update(
                voice_generation,
                status=(
                    VoiceGenerationStatus
                    .PROCESSING
                ),
                error_message=None,
            )
        )

        try:
            scripts = self._build_scripts(
                text=content.text,
                language=content.language,
            )

            audio_chunks: list[
                tuple[
                    bytes,
                    VoiceScript,
                ]
            ] = []

            for index, script_chunk in enumerate(
                scripts
            ):
                audio = (
                    await self._process_chunk(
                        voice_generation=(
                            voice_generation
                        ),
                        script_chunk=(
                            script_chunk
                        ),
                        chunk_index=index,
                        voice=voice,
                        response_format="mp3",
                    )
                )

                audio_chunks.append(
                    (
                        audio,
                        script_chunk,
                    )
                )

            final_audio = (
                self._combine_audio_chunks(
                    audio_chunks,
                    response_format="mp3",
                )
            )

            uploaded = (
                CloudinaryService
                .upload_audio(
                    BytesIO(
                        final_audio
                    ),
                )
            )

            voice_generation = (
                await self.voices.update(
                    voice_generation,
                    status=(
                        VoiceGenerationStatus
                        .COMPLETED
                    ),
                    audio_url=(
                        uploaded["url"]
                    ),
                    cloudinary_public_id=(
                        uploaded[
                            "public_id"
                        ]
                    ),
                    error_message=None,
                )
            )

            return (
                VoiceGenerationResponse
                .model_validate(
                    voice_generation,
                )
            )

        except HTTPException as exc:

            await self.voices.update(
                voice_generation,
                status=(
                    VoiceGenerationStatus
                    .FAILED
                ),
                error_message=str(
                    exc.detail,
                ),
            )

            raise

        except Exception as exc:

            await self.voices.update(
                voice_generation,
                status=(
                    VoiceGenerationStatus
                    .FAILED
                ),
                error_message=str(exc),
            )

            raise HTTPException(
                status_code=(
                    status
                    .HTTP_500_INTERNAL_SERVER_ERROR
                ),
                detail=(
                    "Voice generation failed."
                ),
            ) from exc

    async def get_generation_voices(
        self,
        current_user: User,
        project_uid: UUID,
        generation_uid: UUID,
    ) -> list[VoiceGenerationResponse]:

        project = (
            await self.projects.get_by_uid_and_user(
                project_uid,
                current_user.uid,
            )
        )

        if project is None:
            raise HTTPException(
                status_code=(
                    status.HTTP_404_NOT_FOUND
                ),
                detail="Project not found.",
            )

        generation = (
            await self.generations
            .get_by_uid_and_project(
                generation_uid,
                project_uid,
            )
        )

        if generation is None:
            raise HTTPException(
                status_code=(
                    status.HTTP_404_NOT_FOUND
                ),
                detail="Generation not found.",
            )

        voices = (
            await self.voices
            .get_generation_voices(
                generation_uid,
            )
        )

        return [
            VoiceGenerationResponse
            .model_validate(
                voice,
            )
            for voice in voices
        ]

    async def _resolve_voice(
        self,
        voice: str | None,
    ) -> str:

        # User explicitly selected a voice.
        if voice:
            return voice

        voices = (
            await self.provider.get_voices()
        )

        default_voice = next(
            (
                item["name"]
                for item in voices
                if item.get("default")
                is True
            ),
            None,
        )

        if default_voice is None:
            raise HTTPException(
                status_code=(
                    status
                    .HTTP_503_SERVICE_UNAVAILABLE
                ),
                detail=(
                    "No default voice is "
                    "currently available."
                ),
            )

        return default_voice

    def _build_scripts(
        self,
        *,
        text: str,
        language: str,
    ) -> list[VoiceScript]:

        script = (
            self.director.create_script(
                text=text,
                language=language,
            )
        )

        max_characters = (
            self.provider
            .capabilities
            .max_characters
        )

        if not max_characters:
            return [
                script,
            ]

        return self.chunker.chunk(
            script,
            max_characters=(
                max_characters
            ),
        )

    async def _process_chunk(
        self,
        *,
        voice_generation: VoiceGeneration,
        script_chunk: VoiceScript,
        chunk_index: int,
        voice: str,
        response_format: str,
    ) -> bytes:

        provider_job = (
            await self.provider_jobs
            .get_by_chunk_index(
                voice_generation.uid,
                chunk_index,
            )
        )

        # No job has ever been created
        # for this chunk.
        if provider_job is None:

            provider_job = (
                VoiceProviderJob(
                    voice_generation_uid=(
                        voice_generation.uid
                    ),
                    provider="yarngpt",
                    chunk_index=chunk_index,
                    idempotency_key=str(
                        uuid.uuid4()
                    ),
                    status=(
                        VoiceProviderJobStatus
                        .PENDING
                    ),
                )
            )

            # Critical:
            # persist idempotency key BEFORE
            # contacting YarnGPT.
            provider_job = (
                await self.provider_jobs.create(
                    provider_job,
                )
            )

        # There is a persisted idempotency
        # key but no job ID.
        #
        # This can happen if YarnGPT accepted
        # the request and the backend crashed
        # before saving the response.
        #
        # Reusing the same key lets YarnGPT
        # return the original job.
        if not provider_job.provider_job_id:

            job = (
                await self.provider.create_job(
                    script=script_chunk,
                    idempotency_key=(
                        provider_job
                        .idempotency_key
                    ),
                    voice=voice,
                    response_format=(
                        response_format
                    ),
                )
            )

            job_id = job.get(
                "job_id",
            )

            if not job_id:
                raise HTTPException(
                    status_code=(
                        status
                        .HTTP_502_BAD_GATEWAY
                    ),
                    detail=(
                        "Voice provider did "
                        "not return a job ID."
                    ),
                )

            provider_job = (
                await self.provider_jobs.update(
                    provider_job,
                    provider_job_id=job_id,
                    status=(
                        VoiceProviderJobStatus
                        .QUEUED
                    ),
                    error_message=None,
                )
            )

        result = await self._wait_for_job(
            provider_job,
        )

        audio_url = result.get(
            "audio_url",
        )

        if not audio_url:
            raise HTTPException(
                status_code=(
                    status
                    .HTTP_502_BAD_GATEWAY
                ),
                detail=(
                    "Voice generation completed "
                    "without an audio URL."
                ),
            )

        # The signed YarnGPT URL is temporary.
        # Download immediately.
        audio = (
            await self.provider.download_audio(
                audio_url,
            )
        )

        return audio

    async def _wait_for_job(
        self,
        provider_job: VoiceProviderJob,
    ) -> dict:

        if not provider_job.provider_job_id:
            raise HTTPException(
                status_code=(
                    status
                    .HTTP_500_INTERNAL_SERVER_ERROR
                ),
                detail=(
                    "Voice provider job "
                    "is missing its job ID."
                ),
            )

        for _ in range(
            self.MAX_POLL_ATTEMPTS
        ):

            result = (
                await self.provider
                .get_job_status(
                    provider_job
                    .provider_job_id,
                )
            )

            provider_status = (
                result.get("status")
            )

            if (
                provider_status
                == "completed"
            ):
                await (
                    self.provider_jobs
                    .update(
                        provider_job,
                        status=(
                            VoiceProviderJobStatus
                            .COMPLETED
                        ),
                        error_message=None,
                    )
                )

                return result

            if provider_status == "failed":

                message = (
                    result.get(
                        "user_message"
                    )
                    or
                    "Voice generation failed."
                )

                await (
                    self.provider_jobs
                    .update(
                        provider_job,
                        status=(
                            VoiceProviderJobStatus
                            .FAILED
                        ),
                        error_message=(
                            message
                        ),
                    )
                )

                raise HTTPException(
                    status_code=(
                        status
                        .HTTP_502_BAD_GATEWAY
                    ),
                    detail=message,
                )

            # YarnGPT may return
            # queued/processing/etc.
            new_status = (
                VoiceProviderJobStatus
                .PROCESSING
            )

            if provider_status == "queued":
                new_status = (
                    VoiceProviderJobStatus
                    .QUEUED
                )

            await (
                self.provider_jobs.update(
                    provider_job,
                    status=new_status,
                    error_message=None,
                )
            )

            await asyncio.sleep(
                self.POLL_INTERVAL_SECONDS
            )

        raise HTTPException(
            status_code=(
                status.HTTP_504_GATEWAY_TIMEOUT
            ),
            detail=(
                "Voice generation took too "
                "long to complete."
            ),
        )

    def _combine_audio_chunks(
        self,
        audio_chunks: list[
            tuple[
                bytes,
                VoiceScript,
            ]
        ],
        *,
        response_format: str,
    ) -> bytes:

        if not audio_chunks:
            raise HTTPException(
                status_code=(
                    status
                    .HTTP_502_BAD_GATEWAY
                ),
                detail=(
                    "Voice provider returned "
                    "no audio."
                ),
            )

        # Very important:
        # avoid pydub/FFmpeg completely
        # for the normal single-chunk case.
        if len(audio_chunks) == 1:
            return audio_chunks[0][0]

        return self.composer.combine(
            audio_chunks,
            response_format=(
                response_format
            ),
        )