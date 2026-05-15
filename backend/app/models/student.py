from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Student(Base):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    matricule: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100))
    phone: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    program_id: Mapped[int] = mapped_column(ForeignKey("programs.id"), index=True)
    status: Mapped[str] = mapped_column(String(20), default="active", index=True)

    program: Mapped["Program"] = relationship(back_populates="students")
    enrollments: Mapped[list["Enrollment"]] = relationship(back_populates="student")
    payments: Mapped[list["Payment"]] = relationship(back_populates="student")
    communications: Mapped[list["Communication"]] = relationship(back_populates="student")
