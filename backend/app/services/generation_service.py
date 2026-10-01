import json
from datetime import UTC, datetime
import math
from uuid import UUID

from app.ai.prompt.builder import PromptBuilder
from app.ai.providers.gemini import GeminiProvider
from app.ai.workflows.registry import WorkflowRegistry
from app.models.enums import GenerationStatus, ProjectStatus
from app.models.generation import Generation
from app.models.user import User
from app.repositories.generation_repository import GenerationRepository
from app.repositories.project_repository import ProjectRepository
from app.schemas.generation import (
    CreateGenerationRequest,
    GenerationHistoryPage,
    GenerationHistoryResponse,
    GenerationListResponse,
    GenerationResponse,
)
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession


class GenerationService:
    def __init__(self, session: AsyncSession):
        self.generations = GenerationRepository(session)
        self.projects = ProjectRepository(session)
        self.ai = GeminiProvider()

    async def create_generation(
        self,
        current_user: User,
        project_uid: UUID,
        data: CreateGenerationRequest,
    ) -> GenerationResponse:

        project = await self.projects.get_by_uid_and_user(
            project_uid,
            current_user.uid,
        )

        if project is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found.",
            )

        generation = Generation(
            project_uid=project.uid,
            prompt="",
            input_content=data.input_content,
            memories=[
            memory.model_dump()
            for memory in data.memories
        ],
        )

        generation = await self.generations.create(
            generation,
        )

        workflow = WorkflowRegistry.get(
            project.workflow,
        )

        context = await workflow.build_context(
            project=project,
            generation=generation,
        )

        builder = PromptBuilder()

        system_prompt = builder.build_system_prompt()

        prompt = builder.build_user_prompt(
            project.workflow,
            context,
        )

        generation.system_prompt = system_prompt
        generation.prompt = prompt

        generation = await self.generations.update(
            generation,
        )

        try:

            response_schema = workflow.response_schema

            response = await self.ai.generate(
                system_prompt=system_prompt,
                prompt=prompt,
                response_schema=response_schema,
            )

            generation.output_content = (
                response.model_dump_json()
            )

            generation.status = GenerationStatus.COMPLETED
            
            generation.model = self.ai.default_model
            generation.provider = "gemini"
            generation.completed_at = datetime.now(
                tz=UTC,
            )

        except Exception as e:

            generation.status = GenerationStatus.FAILED
            generation.error_message = str(e)

            await self.generations.update(
                generation,
            )

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="AI generation failed.",
            )

        generation = await self.generations.update(
            generation,
        )

        project.generation_count += 1
        project.last_generated_at = datetime.now(
            tz=UTC,
        )
        project.status = ProjectStatus.COMPLETED

        await self.projects.update(
            project,
        )

        return GenerationResponse.model_validate(
            generation,
        )

    async def get_generation(
        self,
        current_user: User,
        project_uid: UUID,
        generation_uid: UUID,
    ) -> GenerationResponse:

        project = await self.projects.get_by_uid_and_user(
            project_uid,
            current_user.uid,
        )

        if project is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found.",
            )

        generation = await self.generations.get_by_uid_and_project(
            generation_uid,
            project_uid,
        )

        if generation is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Generation not found.",
            )

        return GenerationResponse.model_validate(
            generation,
        )

    async def get_generations(
        self,
        current_user: User,
        project_uid: UUID,
        *,
        limit: int = 20,
        offset: int = 0,
    ) -> GenerationListResponse:

        project = await self.projects.get_by_uid_and_user(
            project_uid,
            current_user.uid,
        )

        if project is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found.",
            )

        generations = await self.generations.get_project_generations(
            project_uid,
            limit=limit,
            offset=offset,
        )

        total = await self.generations.count_project_generations(
            project_uid,
        )

        return GenerationListResponse(
            items=[
                GenerationResponse.model_validate(
                    generation,
                )
                for generation in generations
            ],
            total=total,
        )

    async def get_latest_generation(
        self,
        current_user: User,
        project_uid: UUID,
    ) -> GenerationResponse:

        project = await self.projects.get_by_uid_and_user(
            project_uid,
            current_user.uid,
        )

        if project is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found.",
            )

        generation = await self.generations.get_latest(
            project_uid,
        )

        if generation is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No generations found for this project.",
            )

        return GenerationResponse.model_validate(
            generation,
        )

    async def get_user_history(
        self,
        current_user: User,
        *,
        page: int,
        limit: int,
    ) -> GenerationHistoryPage:

        rows = await self.generations.get_for_user(
            current_user.uid,
            page=page,
            limit=limit,
        )

        total = await self.generations.count_for_user(
            current_user.uid,
        )

        items = [
            GenerationHistoryResponse(
                uid=generation.uid,
                project_uid=project.uid,
                project_name=project.name,
                workflow=project.workflow,
                status=generation.status,
                input_content=generation.input_content,
                output_content=generation.output_content,
                created_at=generation.created_at,
            )
            for generation, project in rows
        ]

        total_pages = (
            math.ceil(total / limit)
            if total > 0
            else 0
        )

        return GenerationHistoryPage(
            items=items,
            page=page,
            limit=limit,
            total=total,
            total_pages=total_pages,
        )

    async def delete_generation(
        self,
        current_user: User,
        project_uid: UUID,
        generation_uid: UUID,
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

        generation = await self.generations.get_by_uid_and_project(
            generation_uid,
            project_uid,
        )

        if generation is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Generation not found.",
            )

        await self.generations.delete(
            generation,
        )
