from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BACKEND_DIR.parent

# MySQL (Laragon) — chaîne par défaut dev
DEFAULT_DATABASE_URL = (
    "mysql+pymysql://root:@localhost:3306/smartcampus?charset=utf8mb4"
)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=BACKEND_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "SmartCampus AgentAI"
    debug: bool = True

    database_url: str = DEFAULT_DATABASE_URL

    # Origines CORS additionnelles (virgules) — ex. https://campus.yamify.cd
    cors_origins: str = ""

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

    @property
    def cors_origin_list(self) -> list[str]:
        defaults = [
            "http://localhost",
            "http://localhost:8000",
            "http://127.0.0.1",
            "http://127.0.0.1:8000",
            "http://smartcampus-agent.test",
        ]
        extra = [o.strip() for o in self.cors_origins.split(",") if o.strip()]
        return list(dict.fromkeys(defaults + extra))


@lru_cache
def get_settings() -> Settings:
    return Settings()
