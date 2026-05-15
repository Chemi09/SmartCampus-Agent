from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Course(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    program_id: Mapped[int] = mapped_column(ForeignKey("programs.id"), index=True)
    code: Mapped[str] = mapped_column(String(20))
    name: Mapped[str] = mapped_column(String(150))
    credits: Mapped[int] = mapped_column(Integer, default=3)

    program: Mapped["Program"] = relationship(back_populates="courses")
    grades: Mapped[list["Grade"]] = relationship(back_populates="course")
    schedules: Mapped[list["Schedule"]] = relationship(back_populates="course")
