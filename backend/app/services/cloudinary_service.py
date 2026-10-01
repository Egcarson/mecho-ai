from io import BytesIO
from typing import BinaryIO

import cloudinary.uploader
from app.core.cloudinary import *


async def upload_audio(
    audio: BytesIO,
):
    audio.seek(0)

    result = cloudinary.uploader.upload(
        audio,
        resource_type="video",
        folder="mecho-ai/audio",
        format="mp3",
    )

    return result["secure_url"]



class CloudinaryService:

    @staticmethod
    def upload_document(
        file: BinaryIO,
        *,
        filename: str,
    ) -> dict:

        result = cloudinary.uploader.upload(
            file,
            resource_type="raw",
            folder="mecho-ai/documents",
            public_id=filename,
            use_filename=True,
            unique_filename=True,
        )

        return {
            "url": result["secure_url"],
            "public_id": result["public_id"],
        }

    @staticmethod
    def upload_audio(
        audio: BytesIO,
    ) -> dict:

        audio.seek(0)

        result = cloudinary.uploader.upload(
            audio,
            resource_type="video",
            folder="mecho-ai/audio",
            format="mp3",
        )

        return {
            "url": result["secure_url"],
            "public_id": result["public_id"],
        }

    @staticmethod
    def upload_image(
        file: BinaryIO,
        *,
        folder: str = "mecho-ai/images",
    ) -> dict:

        result = cloudinary.uploader.upload(
            file,
            resource_type="image",
            folder=folder,
        )

        return {
            "url": result["secure_url"],
            "public_id": result["public_id"],
        }

    @staticmethod
    def upload_video(
        file: BinaryIO,
    ) -> dict:

        result = cloudinary.uploader.upload(
            file,
            resource_type="video",
            folder="mecho-ai/videos",
        )

        return {
            "url": result["secure_url"],
            "public_id": result["public_id"],
        }

    @classmethod
    def upload_profile_picture(
        cls,
        file: BinaryIO,
    ) -> dict:

        return cls.upload_image(
            file,
            folder="mecho-ai/profile-pictures",
        )


    @staticmethod
    def delete(
        public_id: str,
        *,
        resource_type: str = "image",
    ) -> None:

        cloudinary.uploader.destroy(
            public_id,
            resource_type=resource_type,
        )