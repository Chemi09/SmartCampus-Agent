from datetime import date
from decimal import Decimal

from sqlalchemy.orm import Session

from app.config import get_settings
from app.core.exceptions import BadRequestException, NotFoundException
from app.crm.repositories import CrmRepository
from app.crm.schemas import (
    BalanceRead,
    CommunicationRead,
    PaymentRead,
    PaymentRecordRequest,
    PaymentRecordResponse,
    RelanceRequest,
    RelanceResponse,
    StudentBrief,
)
from app.models.payment import Payment

VALID_STATUSES = frozenset({"paid", "partial", "unpaid", "overdue", "outstanding"})
OUTSTANDING_STATUSES = frozenset({"unpaid", "overdue", "partial"})


def compute_payment_status(amount: Decimal, paid_amount: Decimal, due_date: date) -> str:
    if paid_amount >= amount:
        return "paid"
    if paid_amount > 0:
        return "partial"
    if date.today() > due_date:
        return "overdue"
    return "unpaid"


def aggregate_balance_status(payments: list[Payment]) -> str:
    if not payments:
        return "paid"
    statuses = {p.status for p in payments}
    if statuses == {"paid"}:
        return "paid"
    if "overdue" in statuses:
        return "overdue"
    if "partial" in statuses:
        return "partial"
    return "unpaid"


class CrmService:
    def __init__(self, db: Session) -> None:
        self.repo = CrmRepository(db)
        self.settings = get_settings()

    def _sync_payment_status(self, payment: Payment) -> None:
        payment.status = compute_payment_status(
            payment.amount, payment.paid_amount, payment.due_date
        )

    def _to_payment_read(self, payment: Payment) -> PaymentRead:
        self._sync_payment_status(payment)
        student_brief = None
        if payment.student is not None:
            student_brief = StudentBrief.model_validate(payment.student)
        return PaymentRead(
            id=payment.id,
            student_id=payment.student_id,
            semester_id=payment.semester_id,
            fee_type_id=payment.fee_type_id,
            amount=payment.amount,
            paid_amount=payment.paid_amount,
            status=payment.status,
            due_date=payment.due_date,
            fee_label=payment.fee_type.label if payment.fee_type else None,
            semester_label=payment.semester.label if payment.semester else None,
            student=student_brief,
        )

    def _to_communication_read(self, comm) -> CommunicationRead:
        student_brief = None
        if comm.student is not None:
            student_brief = StudentBrief.model_validate(comm.student)
        return CommunicationRead(
            id=comm.id,
            student_id=comm.student_id,
            channel=comm.channel,
            direction=comm.direction,
            body=comm.body,
            created_at=comm.created_at,
            student=student_brief,
        )

    def list_payments(
        self,
        *,
        status: str | None = None,
        student_id: int | None = None,
    ) -> list[PaymentRead]:
        if status is not None and status not in VALID_STATUSES:
            raise BadRequestException(f"Statut invalide : {status}")
        payments = self.repo.list_payments(student_id=student_id)
        result: list[PaymentRead] = []
        for payment in payments:
            self._sync_payment_status(payment)
            if status is None:
                result.append(self._to_payment_read(payment))
            elif status == "outstanding" and payment.status in OUTSTANDING_STATUSES:
                result.append(self._to_payment_read(payment))
            elif payment.status == status:
                result.append(self._to_payment_read(payment))
        self.repo.commit()
        return result

    def list_student_payments(self, student_id: int) -> list[PaymentRead]:
        if self.repo.get_student(student_id) is None:
            raise NotFoundException("Étudiant introuvable")
        payments = self.repo.list_payments(student_id=student_id)
        return [self._to_payment_read(p) for p in payments]

    def get_student_balance(self, student_id: int) -> BalanceRead:
        student = self.repo.get_student(student_id)
        if student is None:
            raise NotFoundException("Étudiant introuvable")

        semester = self.repo.get_active_semester()
        if semester is None:
            raise NotFoundException("Aucun semestre actif")

        payments = self.repo.list_student_payments_for_semester(student.id, semester.id)
        for payment in payments:
            self._sync_payment_status(payment)
        self.repo.commit()

        total_due = sum((p.amount for p in payments), Decimal("0"))
        paid = sum((p.paid_amount for p in payments), Decimal("0"))
        remaining = total_due - paid
        if remaining < 0:
            remaining = Decimal("0")

        return BalanceRead(
            student_id=student.id,
            semester=semester.label,
            total_due=total_due,
            paid=paid,
            remaining=remaining,
            status=aggregate_balance_status(payments),
            currency=self.settings.currency_default,
        )

    def record_payment(self, payment_id: int, payload: PaymentRecordRequest) -> PaymentRecordResponse:
        payment = self.repo.get_payment(payment_id)
        if payment is None:
            raise NotFoundException("Paiement introuvable")

        remaining = payment.amount - payment.paid_amount
        if remaining <= 0:
            raise BadRequestException("Ce paiement est déjà soldé")

        if payload.amount > remaining:
            raise BadRequestException(
                f"Montant trop élevé : il reste {remaining} {self.settings.currency_default}"
            )

        tx = self.repo.create_transaction(
            payment_id=payment.id,
            amount=payload.amount,
            method=payload.method,
            reference=payload.reference or f"MM-{payment.id}-{int(payment.paid_amount)}",
        )
        payment.paid_amount += payload.amount
        self._sync_payment_status(payment)
        self.repo.save_payment(payment)

        return PaymentRecordResponse(
            payment=self._to_payment_read(payment),
            transaction_id=tx.id,
            message=f"Paiement enregistré via {payload.method} (mock Mobile Money)",
        )

    def send_relances(self, payload: RelanceRequest) -> RelanceResponse:
        payment_ids = set(payload.payment_ids or [])
        if payload.student_ids:
            for sid in payload.student_ids:
                if self.repo.get_student(sid) is None:
                    raise NotFoundException(f"Étudiant {sid} introuvable")
                for payment in self.repo.list_payments(student_id=sid):
                    if payment.status in ("unpaid", "partial", "overdue"):
                        payment_ids.add(payment.id)

        if not payment_ids:
            raise BadRequestException("Aucun paiement à relancer (payment_ids ou student_ids requis)")

        communications: list[CommunicationRead] = []
        for pid in payment_ids:
            payment = self.repo.get_payment(pid)
            if payment is None:
                raise NotFoundException(f"Paiement {pid} introuvable")
            if payment.status == "paid":
                continue

            self._sync_payment_status(payment)
            if payment.status == "paid":
                continue

            student = payment.student
            if student is None:
                continue

            remaining = payment.amount - payment.paid_amount
            semester_label = payment.semester.label if payment.semester else "semestre en cours"
            body = payload.message or (
                f"Bonjour {student.first_name} {student.last_name}, "
                f"nous vous rappelons qu'un solde de {remaining} "
                f"{self.settings.currency_default} est en attente pour {semester_label}. "
                f"Merci de régulariser via Mobile Money ou la caisse du campus."
            )

            comm = self.repo.create_communication(
                student_id=student.id,
                channel=payload.channel,
                direction="out",
                body=body,
            )
            self.repo.refresh_communication(comm)
            communications.append(self._to_communication_read(comm))

        return RelanceResponse(sent=len(communications), communications=communications)

    def list_communications(self, student_id: int | None = None) -> list[CommunicationRead]:
        if student_id is not None and self.repo.get_student(student_id) is None:
            raise NotFoundException("Étudiant introuvable")
        rows = self.repo.list_communications(student_id=student_id)
        return [self._to_communication_read(c) for c in rows]
