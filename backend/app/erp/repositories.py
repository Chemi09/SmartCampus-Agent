from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.grade import Grade
from app.models.program import Program
from app.models.semester import Semester
from app.models.student import Student


class ErpRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_active_semester(self) -> Semester | None:
        return self.db.scalar(select(Semester).where(Semester.is_active.is_(True)))

    def get_semester(self, semester_id: int) -> Semester | None:
        return self.db.get(Semester, semester_id)

    def list_students(
        self,
        *,
        program_id: int | None = None,
        status: str | None = None,
    ) -> list[Student]:
        stmt = select(Student).options(joinedload(Student.program)).order_by(Student.last_name)
        if program_id is not None:
            stmt = stmt.where(Student.program_id == program_id)
        if status is not None:
            stmt = stmt.where(Student.status == status)
        return list(self.db.scalars(stmt).unique().all())

    def get_student(self, student_id: int) -> Student | None:
        return self.db.scalar(
            select(Student)
            .options(joinedload(Student.program))
            .where(Student.id == student_id)
        )

    def get_student_by_phone(self, phone: str) -> Student | None:
        return self.db.scalar(
            select(Student)
            .options(joinedload(Student.program))
            .where(Student.phone == phone)
        )

    def get_student_by_matricule(self, matricule: str) -> Student | None:
        return self.db.scalar(select(Student).where(Student.matricule == matricule))

    def get_enrollment(self, student_id: int, semester_id: int) -> Enrollment | None:
        return self.db.scalar(
            select(Enrollment).where(
                Enrollment.student_id == student_id,
                Enrollment.semester_id == semester_id,
            )
        )

    def list_grades_for_enrollment(self, enrollment_id: int) -> list[tuple[Grade, Course]]:
        rows = self.db.execute(
            select(Grade, Course)
            .join(Course, Grade.course_id == Course.id)
            .where(Grade.enrollment_id == enrollment_id)
        ).all()
        return [(grade, course) for grade, course in rows]

    def create_student(self, data: dict) -> Student:
        student = Student(**data)
        self.db.add(student)
        self.db.commit()
        self.db.refresh(student)
        return student

    def update_student(self, student: Student, data: dict) -> Student:
        for key, value in data.items():
            setattr(student, key, value)
        self.db.commit()
        self.db.refresh(student)
        return student

    def create_grade(self, data: dict) -> Grade:
        grade = Grade(**data)
        self.db.add(grade)
        self.db.commit()
        self.db.refresh(grade)
        return grade

    def get_program(self, program_id: int) -> Program | None:
        return self.db.get(Program, program_id)
