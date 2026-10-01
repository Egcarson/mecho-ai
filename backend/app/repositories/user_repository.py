from app.models.user import User
from app.repositories.base_repository import BaseRepository
from sqlmodel import select


class UserRepository(BaseRepository[User]):
    def __init__(self, session):
        super().__init__(User, session)

    async def get_by_email(
        self,
        email: str,
    ) -> User | None:
        statement = select(User).where(
            User.email == email.lower()
        )

        result = await self.session.execute(statement)

        return result.scalars().first()

    async def get_by_phone(
        self,
        phone: str,
    ) -> User | None:
        statement = select(User).where(
            User.phone == phone
        )

        result = await self.session.execute(statement)

        return result.scalars().first()

    async def email_exists(
        self,
        email: str,
    ) -> bool:
        return (
            await self.get_by_email(email)
        ) is not None

    async def phone_exists(
        self,
        phone: str,
    ) -> bool:
        return (
            await self.get_by_phone(phone)
        ) is not None