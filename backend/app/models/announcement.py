from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Announcement(Base):
    __tablename__ = "announcements"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200))
    body: Mapped[str] = mapped_column(Text)
    target_program_id: Mapped[int | None] = mapped_column(ForeignKey("programs.id"), nullable=True)
    published_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
