"""Modèles SQLAlchemy — import central pour Alembic et l'application."""

from app.models.announcement import Announcement
from app.models.communication import Communication
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.faculty import Faculty
from app.models.fee_type import FeeType
from app.models.grade import Grade
from app.models.payment import Payment
from app.models.payment_transaction import PaymentTransaction
from app.models.program import Program
from app.models.schedule import Schedule
from app.models.semester import Semester
from app.models.student import Student
from app.models.user import User

__all__ = [
    "Faculty",
    "Program",
    "Student",
    "Semester",
    "Course",
    "Enrollment",
    "Grade",
    "Schedule",
    "FeeType",
    "Payment",
    "PaymentTransaction",
    "Communication",
    "Announcement",
    "User",
]
