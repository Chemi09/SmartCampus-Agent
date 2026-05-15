from sqlalchemy import Float, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Grade(Base):
    __tablename__ = "grades"
    __table_args__ = (
        UniqueConstraint("enrollment_id", "course_id", name="uq_grade_enrollment_course"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    enrollment_id: Mapped[int] = mapped_column(ForeignKey("enrollments.id"), index=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"), index=True)
    score: Mapped[float] = mapped_column(Float)
    session: Mapped[str] = mapped_column(String(20), default="normal")

    enrollment: Mapped["Enrollment"] = relationship(back_populates="grades")
    course: Mapped["Course"] = relationship(back_populates="grades")
