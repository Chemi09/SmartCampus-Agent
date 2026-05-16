"""9.3 — Tests unitaires : moyenne pondérée ERP."""

from app.erp.services import compute_weighted_average


def test_weighted_average_seed_demo_grades() -> None:
    """Notes démo Jean Mukendi : INF201 75×4, INF202 70×4, INF203 72.5×3 → 72.5 %."""
    grades = [(75.0, 4), (70.0, 4), (72.5, 3)]
    assert compute_weighted_average(grades) == 72.5


def test_weighted_average_empty() -> None:
    assert compute_weighted_average([]) == 0.0


def test_weighted_average_single_course() -> None:
    assert compute_weighted_average([(16.0, 5)]) == 16.0


def test_weighted_average_equal_weights() -> None:
    assert compute_weighted_average([(10.0, 2), (20.0, 2)]) == 15.0
