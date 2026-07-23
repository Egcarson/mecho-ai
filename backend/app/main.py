from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.generate import router
from app.api.tts import router as tts_router

app = FastAPI(title="LocalVoice AI", description="Transform once. Reach every audience.", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")
app.include_router(tts_router, prefix="/api",)

@app.get("/")
def root():
    return {"message": "LocalVoice AI Backend", "status": "running", "version": "1.0.0"}