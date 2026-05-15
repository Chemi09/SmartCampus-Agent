from datetime import time

from sqlalchemy import ForeignKey, Integer, String, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Schedule(Base):
    __tablename__ = "schedules"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"), index=True)
    day_of_week: Mapped[int] = mapped_column(Integer)  # 0=lundi … 6=dimanche
    start_time: Mapped[time] = mapped_column(Time)
    room: Mapped[str] = mapped_column(String(50))

    course: Mapped["Course"] = relationship(back_populates="schedules")
