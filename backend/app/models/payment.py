from datetime import date
from decimal import Decimal

from sqlalchemy import Date, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id"), index=True)
    semester_id: Mapped[int] = mapped_column(ForeignKey("semesters.id"), index=True)
    fee_type_id: Mapped[int] = mapped_column(ForeignKey("fee_types.id"), index=True)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    paid_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    status: Mapped[str] = mapped_column(String(20), default="unpaid", index=True)
    due_date: Mapped[date] = mapped_column(Date)

    student: Mapped["Student"] = relationship(back_populates="payments")
    semester: Mapped["Semester"] = relationship(back_populates="payments")
    fee_type: Mapped["FeeType"] = relationship(back_populates="payments")
    transactions: Mapped[list["PaymentTransaction"]] = relationship(back_populates="payment")
