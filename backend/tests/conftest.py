"""Fixtures pytest — SmartCampus backend."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from app.main import app

DEMO_PHONE = "+243810000001"
DEMO_ADMIN = {"email": "admin@smartcampus.local", "password": "demo1234"}


@pytest.fixture(scope="session")
def client() -> TestClient:
    return TestClient(app)


@pytest.fixture(scope="session")
def db_available(client: TestClient) -> bool:
    response = client.get("/health")
    if response.status_code != 200:
        return False
    data = response.json()
    return data.get("database") == "connected"


@pytest.fixture(scope="session")
def admin_token(client: TestClient, db_available: bool) -> str:
    if not db_available:
        pytest.skip("MySQL non connecté — lancer Laragon et alembic upgrade head")
    response = client.post("/api/v1/auth/login", json=DEMO_ADMIN)
    if response.status_code != 200:
        pytest.skip("Login admin impossible — exécuter python -m seeds.demo_data")
    return response.json()["access_token"]


@pytest.fixture
def admin_headers(admin_token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {admin_token}"}


@pytest.fixture
def demo_student_id(client: TestClient, admin_headers: dict[str, str]) -> int:
    response = client.get(
        f"/api/v1/erp/students/by-phone/{DEMO_PHONE}",
        headers=admin_headers,
    )
    if response.status_code != 200:
        pytest.skip("Étudiant démo +243810000001 introuvable — seed requis")
    return response.json()["id"]
