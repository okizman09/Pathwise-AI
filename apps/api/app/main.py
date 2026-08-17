from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.workflows import router as workflows_router
from app.api.v1.tools import router as tools_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Enable CORS for Next.js / Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include v1 Routers
app.include_router(workflows_router, prefix=settings.API_V1_STR)
app.include_router(tools_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "status": "healthy",
        "service": "Pathwise AI API",
        "version": settings.VERSION,
        "docs": "/docs",
        "gemini_api_configured": bool(settings.GEMINI_API_KEY)
    }

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "ok",
        "environment": settings.ENVIRONMENT,
        "gemini_configured": bool(settings.GEMINI_API_KEY)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
