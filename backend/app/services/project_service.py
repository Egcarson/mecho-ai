from __future__ import annotations

import os
import tempfile
from datetime import UTC, datetime
from pathlib import Path
from uuid import UUID

from app.ai.document.downloader import (
    DocumentDownloader,
)
from app.ai.document.extractor import (
    DocumentExtractorService,
)
from app.models.enums import ProjectStatus, ProjectWorkflow
from app.models.project import Project
from app.models.user import User
from app.repositories.project_repository import ProjectRepository
from app.schemas.project import (
    ProjectCreate,
    ProjectDetailResponse,
    ProjectListResponse,
    ProjectResponse,
    ProjectUpdate,
)
from app.services.cloudinary_service import CloudinaryService
from fastapi import HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession


class ProjectService:
    def __init__(self, session: AsyncSession):
        self.projects = ProjectRepository(session)

    async def create_project(
        self,
        current_user: User,
        data: ProjectCreate,
    ) -> ProjectResponse:

        document_text = await self.extract_document(data.source_document_url,)

        project = Project(
            user_uid=current_user.uid,
            name=data.name,
            workflow=data.workflow,
            objective=data.objective,
            tone=data.tone,
            audiences=data.audiences,
            languages=data.languages,
            length=data.length,
            platforms=data.platforms,
            source_document_url=data.source_document_url,
            source_document_text=document_text,
            description=data.description,
            target_duration_minutes=data.target_duration_minutes
        )

        project = await self.projects.create(project)

        project.status = ProjectStatus.PUBLISHED

       
        return ProjectResponse.model_validate(project)

    async def get_projects(
        self,
        current_user: User,
        *,
        limit: int = 20,
        offset: int = 0,
    ) -> ProjectListResponse:

        projects = await self.projects.get_user_projects(
            current_user.uid,
            limit=limit,
            offset=offset,
        )

        total = await self.projects.count_user_projects(
            current_user.uid,
        )

        return ProjectListResponse(
            items=[ProjectResponse.model_validate(project) for project in projects],
            total=total,
        )

    async def get_project(
        self,
        current_user: User,
        project_uid: UUID,
    ) -> ProjectDetailResponse:

        project = await self.projects.get_by_uid_and_user(
            project_uid,
            current_user.uid,
        )

        if project is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found.",
            )

        project.last_opened_at = datetime.now(UTC)

        project = await self.projects.update(project)

        return ProjectDetailResponse.model_validate(project)

    async def update_project(
        self,
        current_user: User,
        project_uid: UUID,
        data: ProjectUpdate,
    ) -> ProjectResponse:

        project = await self.projects.get_by_uid_and_user(
            project_uid,
            current_user.uid,
        )

        if project is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found.",
            )

        if (
            data.source_document_url
            and data.source_document_url != project.source_document_url
        ):

            project.source_document_url = data.source_document_url

            project.source_document_text = await self.extract_document(
                data.source_document_url,
            )

        updates = data.model_dump(
            exclude_none=True,
        )

        project = await self.projects.update(
            project,
            **updates,
        )

        return ProjectResponse.model_validate(project)

    async def archive_project(
        self,
        current_user: User,
        project_uid: UUID,
    ) -> ProjectResponse:

        project = await self.projects.get_by_uid_and_user(
            project_uid,
            current_user.uid,
        )

        if project is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found.",
            )

        project = await self.projects.update(
            project,
            is_archived=not project.is_archived,
        )

        return ProjectResponse.model_validate(project)

    async def toggle_favorite(
        self,
        current_user: User,
        project_uid: UUID,
    ) -> ProjectResponse:

        project = await self.projects.get_by_uid_and_user(
            project_uid,
            current_user.uid,
        )

        if project is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found.",
            )

        project = await self.projects.update(
            project,
            is_favorite=not project.is_favorite,
        )

        return ProjectResponse.model_validate(project)

    async def delete_project(
        self,
        current_user: User,
        project_uid: UUID,
    ) -> None:

        project = await self.projects.get_by_uid_and_user(
            project_uid,
            current_user.uid,
        )

        if project is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found.",
            )

        await self.projects.delete(project)

    async def extract_document(
        self,
        document_url: str | None,
    ) -> str | None:

        if document_url is None:
            return None

        file_path = await DocumentDownloader.download(
            document_url,
        )

        return await DocumentExtractorService.extract(
            file_path,
        )

    async def upload_document(
        self,
        *,
        current_user: User,
        project_uid: UUID,
        file: UploadFile,
    ) -> ProjectDetailResponse:

        project = await self.projects.get_by_uid_and_user(
            project_uid,
            current_user.uid,
        )

        if project is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found.",
            )

        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid file.",
            )

        extension = Path(
            file.filename,
        ).suffix.lower()

        allowed_extensions = {
            ".pdf",
            ".docx",
            ".txt",
        }

        if extension not in allowed_extensions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Unsupported file type. "
                    "Only PDF, DOCX and TXT are allowed."
                ),
            )

        temp_path: str | None = None

        try:
            with tempfile.NamedTemporaryFile(
                delete=False,
                suffix=extension,
            ) as temp_file:

                content = await file.read()

                temp_file.write(content)

                temp_path = temp_file.name

            extracted_text = (
                await DocumentExtractorService.extract(
                    temp_path,
                )
            )

            if not extracted_text.strip():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=(
                        "No readable text could be "
                        "extracted from the document."
                    ),
                )

            with open(
                temp_path,
                "rb",
            ) as document_file:

                uploaded = (
                    CloudinaryService.upload_document(
                        document_file,
                        filename=Path(
                            file.filename,
                        ).stem,
                    )
                )

            project = await self.projects.update(
                project,
                source_document_url=uploaded["url"],
                source_document_text=extracted_text,
            )

            return ProjectDetailResponse.model_validate(
                project,
            )

        finally:
            if (
                temp_path
                and os.path.exists(temp_path)
            ):
                os.remove(temp_path)
