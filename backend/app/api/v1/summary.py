from decimal import Decimal
from typing import Annotated

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.crm.services import CrmService
from app.database import get_db
from app.dependencies import require_admin
from app.erp.services import ErpService
from app.models.user import User

router = APIRouter(tags=["summary"])


class StudentSummaryRead(BaseModel):
    """Vue agrégée ERP + CRM pour fiche étudiant / agent."""

    student_id: int
    matricule: str
    name: str
    phone: str
    academic_status: str
    program_name: str | None = None
    semester_label: str
    semester_average: float = Field(description="Moyenne pondérée du semestre actif (%)")
    payment_status: str
    amount_remaining: Decimal
    total_due: Decimal
    paid: Decimal
    currency: str = "CDF"


def get_erp_service(db: Annotated[Session, Depends(get_db)]) -> ErpService:
    return ErpService(db)


def get_crm_service(db: Annotated[Session, Depends(get_db)]) -> CrmService:
    return CrmService(db)


@router.get(
    "/students/{student_id}/summary",
    response_model=StudentSummaryRead,
    summary="Fiche agrégée ERP + CRM",
)
def get_student_summary(
    student_id: int,
    erp: Annotated[ErpService, Depends(get_erp_service)],
    crm: Annotated[CrmService, Depends(get_crm_service)],
    _: Annotated[User, Depends(require_admin)],
) -> StudentSummaryRead:
    """Fusionne identité, moyenne semestre active et solde paiements (un appel)."""
    student = erp.get_student(student_id)
    grades = erp.get_grades_summary(student_id, semester_id=None)
    balance = crm.get_student_balance(student_id)

    program_name = student.program.name if student.program else None

    return StudentSummaryRead(
        student_id=student.id,
        matricule=student.matricule,
        name=f"{student.first_name} {student.last_name}",
        phone=student.phone,
        academic_status=student.status,
        program_name=program_name,
        semester_label=balance.semester,
        semester_average=grades.average,
        payment_status=balance.status,
        amount_remaining=balance.remaining,
        total_due=balance.total_due,
        paid=balance.paid,
        currency=balance.currency,
    )
