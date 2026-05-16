"""9.4 — Tests unitaires : statut paiement CRM."""

from datetime import date
from decimal import Decimal

from app.crm.services import aggregate_balance_status, compute_payment_status


def test_payment_status_paid() -> None:
    assert compute_payment_status(Decimal("500000"), Decimal("500000"), date(2026, 12, 31)) == "paid"


def test_payment_status_partial() -> None:
    assert compute_payment_status(Decimal("500000"), Decimal("200000"), date(2026, 12, 31)) == "partial"


def test_payment_status_unpaid_future_due() -> None:
    future = date.today().replace(year=date.today().year + 1)
    assert compute_payment_status(Decimal("500000"), Decimal("0"), future) == "unpaid"


def test_payment_status_overdue() -> None:
    past = date(2020, 1, 1)
    assert compute_payment_status(Decimal("500000"), Decimal("0"), past) == "overdue"


class _FakePayment:
    def __init__(self, status: str) -> None:
        self.status = status


def test_aggregate_balance_all_paid() -> None:
    assert aggregate_balance_status([_FakePayment("paid")]) == "paid"


def test_aggregate_balance_overdue_priority() -> None:
    payments = [_FakePayment("paid"), _FakePayment("overdue")]
    assert aggregate_balance_status(payments) == "overdue"
