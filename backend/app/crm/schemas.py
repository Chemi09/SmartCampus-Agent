from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, Field


class StudentBrief(BaseModel):
    id: int
    matricule: str
    first_name: str
    last_name: str
    phone: str

    model_config = {"from_attributes": True}


class PaymentRead(BaseModel):
    id: int
    student_id: int
    semester_id: int
    fee_type_id: int
    amount: Decimal
    paid_amount: Decimal
    status: str
    due_date: date
    fee_label: str | None = None
    semester_label: str | None = None
    student: StudentBrief | None = None

    model_config = {"from_attributes": True}


class BalanceRead(BaseModel):
    student_id: int
    semester: str
    total_due: Decimal
    paid: Decimal
    remaining: Decimal
    status: str
    currency: str = "CDF"


class PaymentRecordRequest(BaseModel):
    amount: Decimal = Field(gt=0, description="Montant encaissé (CDF)")
    method: str = Field(default="mobile_money", max_length=50)
    reference: str | None = Field(default=None, max_length=100)


class PaymentRecordResponse(BaseModel):
    payment: PaymentRead
    transaction_id: int
    message: str


class RelanceRequest(BaseModel):
    payment_ids: list[int] | None = None
    student_ids: list[int] | None = None
    channel: str = Field(default="whatsapp", pattern="^(whatsapp|sms|email)$")
    message: str | None = Field(default=None, max_length=2000)


class CommunicationRead(BaseModel):
    id: int
    student_id: int
    channel: str
    direction: str
    body: str
    created_at: datetime
    student: StudentBrief | None = None

    model_config = {"from_attributes": True}


class RelanceResponse(BaseModel):
    sent: int
    communications: list[CommunicationRead]
