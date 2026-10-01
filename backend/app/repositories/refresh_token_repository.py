from datetime import UTC, datetime
from uuid import UUID

from app.core.security import hash_token
from app.models.refresh_token import RefreshToken
from app.repositories.base_repository import BaseRepository
from sqlalchemy import desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select


class RefreshTokenRepository(BaseRepository[RefreshToken]):
    def __init__(self, session: AsyncSession):
        super().__init__(RefreshToken, session)

    async def get_by_token(
        self,
        token: str,
    ) -> RefreshToken | None:
        statement = select(RefreshToken).where(
            RefreshToken.token_hash == hash_token(token)
        )

        result = await self.session.execute(statement)

        return result.scalars().first()

    async def get_user_tokens(
        self,
        user_uid: UUID,
    ) -> list[RefreshToken]:
        statement = (
            select(RefreshToken)
            .where(
                RefreshToken.user_uid == user_uid
            )
            .order_by(desc(RefreshToken.created_at))
        )

        result = await self.session.execute(statement)

        return list(result.scalars().all())

    async def revoke_all(
        self,
        user_uid: UUID,
    ) -> None:
        tokens = await self.get_user_tokens(user_uid)

        for token in tokens:
            token.is_revoked = True

        await self.session.commit()

    async def revoke(
        self,
        refresh_token: RefreshToken,
    ) -> RefreshToken:
        return await self.update(
            refresh_token,
            is_revoked=True,
            revoked_at=datetime.now(UTC),
        )
