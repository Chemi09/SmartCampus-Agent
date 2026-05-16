from dataclasses import dataclass

from app.models.student import Student


@dataclass
class HandlerContext:
    student: Student
    message: str
    language: str
