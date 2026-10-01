import logging

import resend
from app.core.config import settings
from fastapi import HTTPException, status

logger = logging.getLogger(__name__)


class EmailService:

    def __init__(self):
        resend.api_key = settings.RESEND_API_KEY

    async def send_email(
        self,
        *,
        to: str,
        subject: str,
        html: str,
    ) -> None:

        try:
            response = await resend.Emails.send_async(
                {
                    "from": settings.EMAIL_FROM,
                    "to": [to],
                    "subject": subject,
                    "html": html,
                }
            )

            logger.info(
                "Email sent successfully to %s. Resend response: %s",
                to,
                response,
            )

        except Exception as exc:
            logger.exception(
                "Resend email failed for %s: %r",
                to,
                exc,
            )

            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Email service is temporarily unavailable.",
            ) from exc


    async def send_verification_otp(
        self,
        *,
        email: str,
        first_name: str,
        otp: str,
    ) -> None:

        html = f"""
        <h2>Verify your Mecho AI account</h2>

        <p>Hi {first_name},</p>

        <p>
            Use the code below to verify your email address:
        </p>

        <h1>{otp}</h1>

        <p>
            This code expires in 5 minutes.
        </p>

        <p>
            If you did not create a Mecho AI account,
            you can ignore this email.
        </p>
        """

        await self.send_email(
            to=email,
            subject="Verify your Mecho AI account",
            html=html,
        )


    async def send_password_reset_otp(
        self,
        *,
        email: str,
        first_name: str,
        otp: str,
    ) -> None:

        html = f"""
        <h2>Reset your Mecho AI password</h2>

        <p>Hi {first_name},</p>

        <p>
            Use the code below to reset your password:
        </p>

        <h1>{otp}</h1>

        <p>
            This code expires in 5 minutes.
        </p>

        <p>
            If you did not request a password reset,
            you can ignore this email.
        </p>
        """

        await self.send_email(
            to=email,
            subject="Reset your Mecho AI password",
            html=html,
        )


email_service = EmailService()
