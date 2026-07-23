import json

from fastapi import (
    APIRouter,
    File,
    Form,
    HTTPException,
    UploadFile,
)

from app.schemas.request import GenerateRequest
from app.schemas.response import GenerateResponse
from app.services.extractor import extract_text_from_file
from app.services.gemini_service import generate_content
from app.services.context_builder import build_context

router = APIRouter(tags=["Generate"])


@router.post(
    "/generate",
    response_model=GenerateResponse,
)
async def generate(
    settings: str = Form(...),
    upload: UploadFile | None = File(default=None),
):
    try:
        request = GenerateRequest.model_validate_json(settings)

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid request payload.",
        )

    extracted_text = ""

    if upload:
        extracted_text = await extract_text_from_file(upload)

    context = build_context(
    request=request,
    extracted_text=extracted_text,
)

    result = await generate_content(context)

    return result