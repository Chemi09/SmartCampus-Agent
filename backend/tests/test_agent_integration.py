"""9.5 — Tests intégration : agent interroge ERP + CRM."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

DEMO_PHONE = "+243810000001"

pytestmark = pytest.mark.integration


@pytest.mark.parametrize(
    ("message", "expected_intent", "snippet"),
    [
        ("Quelle est ma moyenne du semestre ?", "grades.average", "72.5"),
        ("Ai-je payé mes frais S2 ?", "payment.status", "300"),
        ("Quand ferme l'inscription en Master ?", "enrollment.dates", "juillet"),
        ("Mon dossier est-il actif ?", "student.status", "actif"),
        ("Bonjour", "unknown", "Bonjour"),
    ],
)
def test_agent_chat_intents(
    client: TestClient,
    message: str,
    expected_intent: str,
    snippet: str,
) -> None:
    response = client.post(
        "/api/v1/agent/chat",
        json={"phone": DEMO_PHONE, "message": message},
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["intent"] == expected_intent
    assert snippet.lower() in data["reply"].lower()
    if expected_intent != "unknown":
        assert data["student_id"] is not None


def test_agent_health(client: TestClient) -> None:
    response = client.get("/api/v1/agent/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_agent_unknown_phone(client: TestClient) -> None:
    response = client.post(
        "/api/v1/agent/chat",
        json={"phone": "+243999999999", "message": "Ma moyenne ?"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "unknown"
    assert data["student_id"] is None
