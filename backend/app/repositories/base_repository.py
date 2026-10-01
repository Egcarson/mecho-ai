from __future__ import annotations

from datetime import UTC, datetime
from typing import Any
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import SQLModel, select


class BaseRepository[ModelType: SQLModel]:
    def __init__(
        self,
        model: type[ModelType],
        session: AsyncSession,
    ):
        self.model = model
        self.session = session

    # -----------------------------
    # CREATE
    # -----------------------------

    async def create(
        self,
        obj: ModelType,
    ) -> ModelType:
        self.session.add(obj)

        await self.session.commit()

        await self.session.refresh(obj)

        return obj

    async def bulk_create(
        self,
        objects: list[ModelType],
    ) -> list[ModelType]:
        self.session.add_all(objects)

        await self.session.commit()

        for obj in objects:
            await self.session.refresh(obj)

        return objects

    # -----------------------------
    # READ
    # -----------------------------

    async def get_by_uid(
        self,
        uid: UUID,
    ) -> ModelType | None:
        return await self.session.get(
            self.model,
            uid,
        )

    async def get_or_404(
        self,
        uid: UUID,
        message: str | None = None,
    ) -> ModelType:
        obj = await self.get_by_uid(uid)

        if obj is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=message or f"{self.model.__name__} not found.",
            )

        return obj

    async def exists(
        self,
        uid: UUID,
    ) -> bool:
        statement = select(self.model).where(
            self.model.uid == uid #type: ignore
        )

        result = await self.session.execute(statement)

        return result.scalar_one_or_none() is not None

    async def list(
        self,
        *,
        limit: int = 20,
        offset: int = 0,
    ) -> list[ModelType]:
        statement = (
            select(self.model)
            .offset(offset)
            .limit(limit)
        )

        result = await self.session.execute(statement)

        return list(result.scalars().all())

    async def count(self) -> int:
        statement = select(func.count()).select_from(
            self.model
        )

        result = await self.session.execute(statement)

        return result.scalar_one()

    # -----------------------------
    # UPDATE
    # -----------------------------

    async def update(
        self,
        obj: ModelType,
        **kwargs: Any,
    ) -> ModelType:
        for key, value in kwargs.items():
            setattr(obj, key, value)

        if hasattr(obj, "updated_at"):
            obj.updated_at = datetime.now(UTC)

        self.session.add(obj)

        await self.session.commit()

        await self.session.refresh(obj)

        return obj

    # -----------------------------
    # DELETE
    # -----------------------------

    async def delete(
        self,
        obj: ModelType,
    ) -> None:
        await self.session.delete(obj)

        await self.session.commit()