from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.crm.schemas import (
    BalanceRead,
    CommunicationRead,
    PaymentRead,
    PaymentRecordRequest,
    PaymentRecordResponse,
    RelanceRequest,
    RelanceResponse,
)
from app.crm.services import CrmService
from app.database import get_db
from app.dependencies import require_admin
from app.models.user import User

router = APIRouter(prefix="/crm", tags=["crm"])


def get_crm_service(db: Annotated[Session, Depends(get_db)]) -> CrmService:
    return CrmService(db)


@router.get("/status")
def crm_status(_: Annotated[User, Depends(require_admin)]) -> dict:
    return {"module": "crm", "status": "ok"}


@router.get("/payments", response_model=list[PaymentRead])
def list_payments(
    service: Annotated[CrmService, Depends(get_crm_service)],
    _: Annotated[User, Depends(require_admin)],
    status: str | None = Query(
        default=None,
        description="paid|partial|unpaid|overdue|outstanding (unpaid+overdue+partial)",
    ),
    student_id: int | None = Query(default=None),
) -> list[PaymentRead]:
    return service.list_payments(status=status, student_id=student_id)


@router.get("/students/{student_id}/balance", response_model=BalanceRead)
def get_student_balance(
    student_id: int,
    service: Annotated[CrmService, Depends(get_crm_service)],
    _: Annotated[User, Depends(require_admin)],
) -> BalanceRead:
    return service.get_student_balance(student_id)


@router.get("/students/{student_id}/payments", response_model=list[PaymentRead])
def list_student_payments(
    student_id: int,
    service: Annotated[CrmService, Depends(get_crm_service)],
    _: Annotated[User, Depends(require_admin)],
) -> list[PaymentRead]:
    return service.list_student_payments(student_id)


@router.post("/payments/{payment_id}/record", response_model=PaymentRecordResponse)
def record_payment(
    payment_id: int,
    payload: PaymentRecordRequest,
    service: Annotated[CrmService, Depends(get_crm_service)],
    _: Annotated[User, Depends(require_admin)],
) -> PaymentRecordResponse:
    return service.record_payment(payment_id, payload)


@router.post("/relances", response_model=RelanceResponse)
def send_relances(
    payload: RelanceRequest,
    service: Annotated[CrmService, Depends(get_crm_service)],
    _: Annotated[User, Depends(require_admin)],
) -> RelanceResponse:
    return service.send_relances(payload)


@router.get("/communications", response_model=list[CommunicationRead])
def list_communications(
    service: Annotated[CrmService, Depends(get_crm_service)],
    _: Annotated[User, Depends(require_admin)],
    student_id: int | None = Query(default=None),
) -> list[CommunicationRead]:
    return service.list_communications(student_id=student_id)
