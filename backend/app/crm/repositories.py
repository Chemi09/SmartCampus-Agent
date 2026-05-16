from datetime import date
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.communication import Communication
from app.models.fee_type import FeeType
from app.models.payment import Payment
from app.models.payment_transaction import PaymentTransaction
from app.models.semester import Semester
from app.models.student import Student


class CrmRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_active_semester(self) -> Semester | None:
        return self.db.scalar(select(Semester).where(Semester.is_active.is_(True)))

    def get_student(self, student_id: int) -> Student | None:
        return self.db.get(Student, student_id)

    def get_payment(self, payment_id: int) -> Payment | None:
        return self.db.scalar(
            select(Payment)
            .options(
                joinedload(Payment.student),
                joinedload(Payment.fee_type),
                joinedload(Payment.semester),
            )
            .where(Payment.id == payment_id)
        )

    def list_payments(
        self,
        *,
        status: str | None = None,
        student_id: int | None = None,
        semester_id: int | None = None,
    ) -> list[Payment]:
        stmt = (
            select(Payment)
            .options(
                joinedload(Payment.student),
                joinedload(Payment.fee_type),
                joinedload(Payment.semester),
            )
            .order_by(Payment.due_date.desc(), Payment.id.desc())
        )
        if status is not None:
            stmt = stmt.where(Payment.status == status)
        if student_id is not None:
            stmt = stmt.where(Payment.student_id == student_id)
        if semester_id is not None:
            stmt = stmt.where(Payment.semester_id == semester_id)
        return list(self.db.scalars(stmt).unique().all())

    def list_student_payments_for_semester(self, student_id: int, semester_id: int) -> list[Payment]:
        return self.list_payments(student_id=student_id, semester_id=semester_id)

    def list_communications(self, student_id: int | None = None) -> list[Communication]:
        stmt = (
            select(Communication)
            .options(joinedload(Communication.student))
            .order_by(Communication.created_at.desc())
        )
        if student_id is not None:
            stmt = stmt.where(Communication.student_id == student_id)
        return list(self.db.scalars(stmt).unique().all())

    def create_transaction(
        self,
        *,
        payment_id: int,
        amount: Decimal,
        method: str,
        reference: str | None,
    ) -> PaymentTransaction:
        tx = PaymentTransaction(
            payment_id=payment_id,
            amount=amount,
            method=method,
            reference=reference,
        )
        self.db.add(tx)
        self.db.flush()
        return tx

    def create_communication(
        self,
        *,
        student_id: int,
        channel: str,
        direction: str,
        body: str,
    ) -> Communication:
        comm = Communication(
            student_id=student_id,
            channel=channel,
            direction=direction,
            body=body,
        )
        self.db.add(comm)
        self.db.flush()
        return comm

    def save_payment(self, payment: Payment) -> Payment:
        self.db.commit()
        self.db.refresh(payment)
        return payment

    def commit(self) -> None:
        self.db.commit()

    def refresh_communication(self, comm: Communication) -> Communication:
        self.db.commit()
        self.db.refresh(comm)
        return comm
