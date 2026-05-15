from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Program(Base):
    __tablename__ = "programs"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    faculty_id: Mapped[int] = mapped_column(ForeignKey("faculties.id"), index=True)
    name: Mapped[str] = mapped_column(String(150))
    level: Mapped[str] = mapped_column(String(20))  # L1, L2, L3, Master

    faculty: Mapped["Faculty"] = relationship(back_populates="programs")
    students: Mapped[list["Student"]] = relationship(back_populates="program")
    courses: Mapped[list["Course"]] = relationship(back_populates="program")
