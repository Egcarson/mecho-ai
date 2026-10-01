import asyncio

from app.email.service import EmailService


async def main():
    email_service = EmailService()

    await email_service.send_email(
        to="esehgodprevail@gmail.com",
        subject="Mecho AI email test",
        html="<h1>Email is working 🎉</h1>",
    )

    print("Email sent successfully.")


if __name__ == "__main__":
    asyncio.run(main())