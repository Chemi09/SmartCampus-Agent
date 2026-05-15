from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BACKEND_DIR.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=BACKEND_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "SmartCampus AgentAI"
    debug: bool = True

    database_url: str = f"sqlite:///{BACKEND_DIR / 'smartcampus.db'}"

    jwt_secret: str = "change-me-in-development"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440

    agent_service_key: str = "agent-demo-key"
    llm_endpoint: str = "http://localhost:11434/v1"
    demo_mode: bool = True

    whatsapp_token: str = ""
    currency_default: str = "CDF"

    @property
    def frontend_dir(self) -> Path:
        return PROJECT_ROOT / "frontend"


@lru_cache
def get_settings() -> Settings:
    return Settings()
