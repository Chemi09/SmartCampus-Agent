from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.v1.router import api_router
from app.config import get_settings
from app.core.exceptions import register_exception_handlers
import app.models  # noqa: F401 — métadonnées SQLAlchemy

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(
    title=settings.app_name,
    description="ERP universitaire + CRM campus + agent IA — OpenClaw / Yamify",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

register_exception_handlers(app)

_cors_kwargs: dict = {
    "allow_origins": settings.cors_origin_list,
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
}
if settings.debug:
    _cors_kwargs["allow_origin_regex"] = r"https?://(localhost|127\.0\.0\.1)(:\d+)?"
app.add_middleware(CORSMiddleware, **_cors_kwargs)


@app.get("/health", tags=["health"])
def health_check() -> dict:
    db_status = "unknown"
    try:
        from sqlalchemy import text

        from app.database import engine

        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as exc:
        db_status = f"error: {exc.__class__.__name__}"

    return {"status": "ok", "app": settings.app_name, "database": db_status}


app.include_router(api_router, prefix="/api/v1")

frontend_dir = settings.frontend_dir
if frontend_dir.is_dir():
    app.mount("/", StaticFiles(directory=str(frontend_dir), html=True), name="frontend")
