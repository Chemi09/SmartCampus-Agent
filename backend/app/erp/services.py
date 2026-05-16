from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundException
from app.models.enrollment import Enrollment
from app.erp.repositories import ErpRepository
from app.erp.schemas import (
    GradeItemRead,
    GradesSummaryRead,
    GradeCreate,
    StudentCreate,
    StudentRead,
    StudentUpdate,
)
from app.models.student import Student


def compute_weighted_average(grades: list[tuple[float, int]]) -> float:
    """Moyenne pondérée par crédits : [(score, credits), ...]."""
    if not grades:
        return 0.0
    weighted_sum = sum(score * credits for score, credits in grades)
    total_credits = sum(credits for _, credits in grades)
    if total_credits == 0:
        return 0.0
    return round(weighted_sum / total_credits, 1)


class ErpService:
    def __init__(self, db: Session) -> None:
        self.repo = ErpRepository(db)

    def get_active_semester(self):
        semester = self.repo.get_active_semester()
        if semester is None:
            raise NotFoundException("Aucun semestre actif")
        return semester

    def list_students(self, program_id: int | None, status: str | None) -> list[Student]:
        return self.repo.list_students(program_id=program_id, status=status)

    def get_student(self, student_id: int) -> Student:
        student = self.repo.get_student(student_id)
        if student is None:
            raise NotFoundException("Étudiant introuvable")
        return student

    def get_student_by_phone(self, phone: str) -> Student:
        student = self.repo.get_student_by_phone(phone)
        if student is None:
            raise NotFoundException("Étudiant introuvable pour ce numéro")
        return student

    def create_student(self, payload: StudentCreate) -> Student:
        if self.repo.get_student_by_matricule(payload.matricule):
            raise NotFoundException("Matricule déjà utilisé")
        if self.repo.get_program(payload.program_id) is None:
            raise NotFoundException("Programme introuvable")
        return self.repo.create_student(payload.model_dump())

    def update_student(self, student_id: int, payload: StudentUpdate) -> Student:
        student = self.get_student(student_id)
        data = payload.model_dump(exclude_unset=True)
        if "program_id" in data and self.repo.get_program(data["program_id"]) is None:
            raise NotFoundException("Programme introuvable")
        return self.repo.update_student(student, data)

    def get_grades_summary(self, student_id: int, semester_id: int | None) -> GradesSummaryRead:
        student = self.get_student(student_id)
        if semester_id is None:
            semester = self.repo.get_active_semester()
            if semester is None:
                raise NotFoundException("Aucun semestre actif")
        else:
            semester = self.repo.get_semester(semester_id)
            if semester is None:
                raise NotFoundException("Semestre introuvable")

        enrollment = self.repo.get_enrollment(student.id, semester.id)
        if enrollment is None:
            return GradesSummaryRead(
                student_id=student.id,
                semester=semester.label,
                average=0.0,
                grades=[],
            )

        rows = self.repo.list_grades_for_enrollment(enrollment.id)
        items: list[GradeItemRead] = []
        grade_pairs: list[tuple[float, int]] = []
        for grade, course in rows:
            items.append(
                GradeItemRead(course=course.name, score=grade.score, credits=course.credits)
            )
            grade_pairs.append((grade.score, course.credits))

        average = compute_weighted_average(grade_pairs)
        return GradesSummaryRead(
            student_id=student.id,
            semester=semester.label,
            average=average,
            grades=items,
        )

    def create_grade(self, payload: GradeCreate):
        enrollment = self.repo.db.get(Enrollment, payload.enrollment_id)
        if enrollment is None:
            raise NotFoundException("Inscription introuvable")
        return self.repo.create_grade(payload.model_dump())
