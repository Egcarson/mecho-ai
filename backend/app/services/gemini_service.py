# import json

# import google.generativeai as genai
# # from google.generativeai.types import GenerationConfig
# from fastapi import HTTPException

# from app.core.config import GEMINI_API_KEY
# from app.schemas.request import GenerateRequest
# from app.schemas.response import GenerateResponse
# from app.services.prompt_builder import build_prompt
# from app.services.system_prompt import SYSTEM_PROMPT

# genai.configure(api_key=GEMINI_API_KEY)

# # for model in genai.list_models():
# #     if "generateContent" in model.supported_generation_methods:
# #         print(model.name)

# # model = genai.GenerativeModel(
# #     model_name="models/gemini-3.5-flash",
# #     system_instruction=SYSTEM_PROMPT,
# #     generation_config=GenerationConfig(
# #         temperature=0.8,
# #         top_p=0.95,
# #         response_mime_type="application/json",
# #         response_schema=GenerateResponse,
# #     ),
# # )

# def get_model():
#     return genai.GenerativeModel(
#         model_name="models/gemini-3.5-flash",
#         system_instruction=SYSTEM_PROMPT,
#         generation_config={
#             "temperature": 1.0,
#             "top_p": 0.95,
#             "response_mime_type": "application/json",
#         },
#     )

# model = get_model()

# # def clean_json_response(text: str) -> str:
# #     text = text.strip()

# #     if text.startswith("```json"):
# #         text = text.replace("```json", "", 1)

# #     if text.startswith("```"):
# #         text = text.replace("```", "", 1)

# #     if text.endswith("```"):
# #         text = text[:-3]

# #     return text.strip()


# async def generate_content(
#     request: GenerateRequest,
#     extracted_text: str,
# ) -> GenerateResponse:

#     prompt = build_prompt(
#         request=request,
#         source_text=extracted_text,
#     )

#     try:

#         response = model.generate_content(prompt)

#         return GenerateResponse.model_validate_json(
#             response.text
#         )

#     except Exception as e:

#         raise HTTPException(
#             status_code=500,
#             detail=f"AI Generation Failed: {e}"
#         )

from fastapi import HTTPException
from google import genai
from google.genai import types
from app.schemas.campaign_context import CampaignContext
from app.core.config import GEMINI_API_KEY
from app.schemas.request import GenerateRequest
from app.schemas.response import GenerateResponse
from app.services.prompt_builder import build_prompt
from app.services.system_prompt import SYSTEM_PROMPT
from app.services.trend_service import build_trend_context



client = genai.Client(api_key=GEMINI_API_KEY)

print({"GEMINI API KEY": GEMINI_API_KEY})


def get_generation_config():
    return types.GenerateContentConfig(
        system_instruction=SYSTEM_PROMPT,
        temperature=1.0,
        top_p=0.95,
        response_mime_type="application/json",
        response_schema=GenerateResponse,
    )


async def generate_content(
    context: CampaignContext,
) -> GenerateResponse:

    trends = await build_trend_context(context)

    prompt = build_prompt(
        context=context,
        trends=trends,
    )

    try:

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
            config=get_generation_config(),
        )

        if not response.text:
            raise HTTPException(
                status_code=500,
                detail="Gemini returned an empty response.",
            )

        return GenerateResponse.model_validate_json(
            response.text
        )

    except HTTPException:
        raise

    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"AI Generation Failed: {e}",
        )
