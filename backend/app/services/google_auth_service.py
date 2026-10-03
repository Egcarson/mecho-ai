import asyncio
from dataclasses import dataclass

from app.core.config import settings
from fastapi import HTTPException, status
from google.auth.transport import requests
from google.oauth2 import id_token


@dataclass
class GoogleIdentity:
    sub: str
    email: str
    first_name: str
    last_name: str
    picture: str | None


class GoogleAuthService:

    async def verify(
        self,
        credential: str,
    ) -> GoogleIdentity:

        try:
            payload = await asyncio.to_thread(
                id_token.verify_oauth2_token,
                credential,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID,
            )

        except ValueError as exc:
            raise HTTPException(
                status_code=(
                    status.HTTP_401_UNAUTHORIZED
                ),
                detail=(
                    "Invalid Google credential."
                ),
            ) from exc

        google_sub = payload.get(
            "sub"
        )

        email = payload.get(
            "email"
        )

        email_verified = payload.get(
            "email_verified"
        )

        if not google_sub:
            raise HTTPException(
                status_code=(
                    status.HTTP_401_UNAUTHORIZED
                ),
                detail=(
                    "Google account identifier "
                    "is missing."
                ),
            )

        if not email:
            raise HTTPException(
                status_code=(
                    status.HTTP_401_UNAUTHORIZED
                ),
                detail=(
                    "Google account email "
                    "is missing."
                ),
            )

        if email_verified is not True:
            raise HTTPException(
                status_code=(
                    status.HTTP_401_UNAUTHORIZED
                ),
                detail=(
                    "Google email is not verified."
                ),
            )

        first_name = (
            payload.get("given_name")
            or self._fallback_first_name(
                email
            )
        )

        last_name = (
            payload.get("family_name")
            or ""
        )

        picture = payload.get(
            "picture"
        )

        return GoogleIdentity(
            sub=google_sub,
            email=email.lower(),
            first_name=first_name,
            last_name=last_name,
            picture=picture,
        )

    @staticmethod
    def _fallback_first_name(
        email: str,
    ) -> str:

        local_part = email.split(
            "@",
            1,
        )[0]

        cleaned = (
            local_part
            .replace(".", " ")
            .replace("_", " ")
            .replace("-", " ")
            .strip()
        )

        if not cleaned:
            return "User"

        return cleaned.title()