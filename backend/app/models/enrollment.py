from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Enrollment(Base):
    __tablename__ = "enrollments"
    __table_args__ = (UniqueConstraint("student_id", "semester_id", name="uq_enrollment_student_semester"),)

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id"), index=True)
    semester_id: Mapped[int] = mapped_column(ForeignKey("semesters.id"), index=True)
    program_id: Mapped[int] = mapped_column(ForeignKey("programs.id"), index=True)

    student: Mapped["Student"] = relationship(back_populates="enrollments")
    semester: Mapped["Semester"] = relationship(back_populates="enrollments")
    program: Mapped["Program"] = relationship()
    grades: Mapped[list["Grade"]] = relationship(back_populates="enrollment")
