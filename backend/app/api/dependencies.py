from app.db.session import get_session
from app.services.asset_service import AssetService
from app.services.auth_service import AuthService
from app.services.generation_service import GenerationService
from app.services.image_generation import ImageGenerationService
from app.services.library_service import LibraryService
from app.services.project_service import ProjectService
from app.services.user_service import UserService
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession


async def get_auth_service(
    session: AsyncSession = Depends(get_session),
) -> AuthService:
    return AuthService(session)

async def get_project_service(
    session: AsyncSession = Depends(get_session),
) -> ProjectService:
    return ProjectService(session)


async def get_generation_service(
    session: AsyncSession = Depends(get_session),
) -> GenerationService:
    return GenerationService(session)


async def get_library_service(
    session: AsyncSession = Depends(get_session),
) -> LibraryService:
    return LibraryService(session)

async def get_user_service(
    session: AsyncSession = Depends(get_session),
) -> UserService:
    return UserService(session)

async def get_image_service(
    session: AsyncSession = Depends(get_session),
) -> ImageGenerationService:
    return ImageGenerationService(session)

async def get_asset_service(
    session: AsyncSession = Depends(get_session),
) -> AssetService:
    return AssetService(session)