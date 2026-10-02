from uuid import UUID

from app.ai.tts.providers.yarngpt import (
    YarnGPTProvider,
)
from app.core.dependencies import (
    get_current_user,
)
from app.db.session import (
    get_session,
)
from app.models.user import User
from app.schemas.voice_generation import (
    CreateVoiceGenerationRequest,
    VoiceGenerationResponse,
    VoiceResponse,
    VoiceUsageResponse,
)
from app.services.voice_access_service import (
    VoiceAccessService,
)
from app.services.voice_service import (
    VoiceGenerationService,
)
from fastapi import (
    APIRouter,
    Depends,
    status,
)
from sqlalchemy.ext.asyncio import (
    AsyncSession,
)

router = APIRouter(
    prefix="/api/v1/projects",
    tags=["Voice Generation"],
)

voice_route = APIRouter(
    prefix="/api/v1",
    tags=["Voice Generation"],
)


@router.post(
    "/{project_uid}/generations/"
    "{generation_uid}/voice",
    response_model=(
        VoiceGenerationResponse
    ),
    status_code=status.HTTP_200_OK,
)
async def create_voice_generation(
    project_uid: UUID,
    generation_uid: UUID,
    data: CreateVoiceGenerationRequest,
    current_user: User = Depends(
        get_current_user,
    ),
    session: AsyncSession = Depends(
        get_session,
    ),
) -> VoiceGenerationResponse:

    service = VoiceGenerationService(
        session
    )

    return (
        await service
        .create_voice_generation(
            current_user=current_user,
            project_uid=project_uid,
            generation_uid=(
                generation_uid
            ),
            data=data,
        )
    )


@voice_route.get(
    "/voices",
    response_model=list[
        VoiceResponse
    ],
    status_code=status.HTTP_200_OK,
)
async def get_voices() -> list[
    VoiceResponse
]:

    provider = YarnGPTProvider()

    voices = await provider.get_voices()

    return [
        VoiceResponse(
            name=voice["name"],
            display_name=(
                voice["display_name"]
            ),
            description=(
                voice.get(
                    "description"
                )
            ),
            languages=(
                voice.get(
                    "languages",
                    [],
                )
            ),
            default=(
                voice.get(
                    "default",
                    False,
                )
            ),
        )
        for voice in voices
    ]


@voice_route.get(
    "/voice/usage",
    response_model=VoiceUsageResponse,
    status_code=status.HTTP_200_OK,
)
async def get_voice_usage(
    current_user: User = Depends(
        get_current_user,
    ),
    session: AsyncSession = Depends(
        get_session,
    ),
) -> VoiceUsageResponse:

    service = VoiceAccessService(
        session
    )

    used, limit = (
        await service.get_social_usage(
            user_uid=current_user.uid,
        )
    )

    return VoiceUsageResponse(
        social_used=used,
        social_limit=limit,
        social_available=max(
            limit - used,
            0,
        ),
        social_enabled=(
            used < limit
        ),
        campaign_enabled=False,
        speech_enabled=False,
    )


@router.get(
    "/{project_uid}/generations/"
    "{generation_uid}/voices",
    response_model=list[
        VoiceGenerationResponse
    ],
    status_code=status.HTTP_200_OK,
)
async def get_generation_voices(
    project_uid: UUID,
    generation_uid: UUID,
    current_user: User = Depends(
        get_current_user,
    ),
    session: AsyncSession = Depends(
        get_session,
    ),
) -> list[
    VoiceGenerationResponse
]:

    service = VoiceGenerationService(
        session
    )

    return (
        await service
        .get_generation_voices(
            current_user=current_user,
            project_uid=project_uid,
            generation_uid=(
                generation_uid
            ),
        )
    )