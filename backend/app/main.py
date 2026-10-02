from app.api.v1.assets import router as asset_router
from app.api.v1.auth import router as auth_router
from app.api.v1.generation import history_router
from app.api.v1.generation import router as gen_router
from app.api.v1.image_generation import image_route as image_access_router
from app.api.v1.image_generation import router as image_router
from app.api.v1.library import router as library_router
from app.api.v1.project import router as projects_router
from app.api.v1.user import router as user_router
from app.api.v1.voice_generation import router as voice_router
from app.api.v1.voice_generation import voice_route
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Mecho AI", description="One message. More ways to make it matter.", version="1.0.0", docs_url="/api/v1/docs", redoc_url="/api/v1/redoc")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(user_router, prefix="/api/v1")
app.include_router(library_router)
app.include_router(image_access_router, prefix="/api/v1")
app.include_router(history_router, prefix="/api/v1")
app.include_router(asset_router, prefix="/api/v1")
app.include_router(image_router, prefix="/api/v1")
app.include_router(gen_router, prefix="/api/v1")
app.include_router(projects_router, prefix="/api/v1")
app.include_router(voice_router)
app.include_router(voice_route)


@app.get("/api/v1")
def root():
    return {"message": "Mecho AI Backend", "status": "running", "version": "1.0.0"}