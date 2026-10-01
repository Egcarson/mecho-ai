from app.models.user import User
from app.repositories.library_repository import (
    LibraryRepository,
)
from app.schemas.library import (
    LibraryMediaResponse,
    LibraryMediaType,
)
from sqlalchemy.ext.asyncio import AsyncSession


class LibraryService:

    def __init__(
        self,
        session: AsyncSession,
    ):
        self.session = session

        self.repository = LibraryRepository(
            session
        )

    async def get_library(
        self,
        *,
        current_user: User,
        media_type: LibraryMediaType | None = None,
    ) -> list[LibraryMediaResponse]:

        items: list[
            LibraryMediaResponse
        ] = []

        if (
            media_type is None
            or media_type
            == LibraryMediaType.VOICE
        ):
            voice_items = (
                await self.repository
                .get_voice_assets(
                    user_uid=current_user.uid,
                )
            )

            for (
                project,
                generation,
                voice,
            ) in voice_items:

                items.append(
                    LibraryMediaResponse(
                        uid=voice.uid,
                        media_type=(
                            LibraryMediaType
                            .VOICE
                        ),
                        url=voice.audio_url,
                        project_uid=project.uid,
                        generation_uid=(
                            generation.uid
                        ),
                        project_name=(
                            project.name
                        ),
                        workflow=(
                            project.workflow.value
                            if hasattr(
                                project.workflow,
                                "value",
                            )
                            else str(
                                project.workflow
                            )
                        ),
                        language=(
                            voice.language
                        ),
                        platform=(
                            voice.platform
                        ),
                        voice_name=(
                            voice.voice
                        ),
                        created_at=(
                            voice.created_at
                        ),
                    )
                )

        if (
            media_type is None
            or media_type
            == LibraryMediaType.IMAGE
        ):
            image_items = (
                await self.repository
                .get_image_assets(
                    user_uid=current_user.uid,
                )
            )

            for (
                project,
                generation,
                image,
            ) in image_items:

                items.append(
                    LibraryMediaResponse(
                        uid=image.uid,
                        media_type=(
                            LibraryMediaType
                            .IMAGE
                        ),
                        url=image.image_url,
                        project_uid=project.uid,
                        generation_uid=(
                            generation.uid
                        ),
                        project_name=(
                            project.name
                        ),
                        workflow=(
                            project.workflow.value
                            if hasattr(
                                project.workflow,
                                "value",
                            )
                            else str(
                                project.workflow
                            )
                        ),
                        language=(
                            image.source_language
                        ),
                        platform=(
                            image.source_variant
                        ),
                        voice_name=None,
                        created_at=(
                            image.created_at
                        ),
                    )
                )

        items.sort(
            key=lambda item: (
                item.created_at
            ),
            reverse=True,
        )

        return items