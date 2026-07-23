from io import BytesIO

import cloudinary.uploader

from app.core.cloudinary import *


async def upload_audio(
    audio: BytesIO,
):
    audio.seek(0)

    result = cloudinary.uploader.upload(
        audio,
        resource_type="video",
        folder="localvoice/audio",
        format="mp3",
    )

    return result["secure_url"]