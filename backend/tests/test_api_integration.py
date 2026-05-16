"""Tests intégration API — auth, summary, ERP/CRM cohérence."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

pytestmark = pytest.mark.integration


def test_health_ok(client: TestClient, db_available: bool) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    if db_available:
        assert response.json()["database"] == "connected"


def test_erp_requires_auth(client: TestClient) -> None:
    assert client.get("/api/v1/erp/students").status_code == 401


def test_login_admin(client: TestClient, admin_headers: dict[str, str]) -> None:
    response = client.get("/api/v1/auth/me", headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["role"] == "admin"


def test_summary_matches_erp_and_crm(
    client: TestClient,
    admin_headers: dict[str, str],
    demo_student_id: int,
) -> None:
    grades = client.get(
        f"/api/v1/erp/students/{demo_student_id}/grades",
        headers=admin_headers,
    ).json()
    balance = client.get(
        f"/api/v1/crm/students/{demo_student_id}/balance",
        headers=admin_headers,
    ).json()
    summary = client.get(
        f"/api/v1/students/{demo_student_id}/summary",
        headers=admin_headers,
    ).json()

    assert summary["matricule"] == "ETU-2026-001"
    assert summary["semester_average"] == grades["average"]
    assert summary["payment_status"] == balance["status"]
    assert float(summary["amount_remaining"]) == float(balance["remaining"])


def test_crm_unpaid_list_has_demo_entries(
    client: TestClient,
    admin_headers: dict[str, str],
) -> None:
    response = client.get(
        "/api/v1/crm/payments?status=unpaid",
        headers=admin_headers,
    )
    assert response.status_code == 200
    assert len(response.json()) >= 2
