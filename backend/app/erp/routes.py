from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_admin
from app.erp.schemas import (
    GradeCreate,
    GradeRead,
    GradesSummaryRead,
    SemesterRead,
    StudentCreate,
    StudentRead,
    StudentUpdate,
)
from app.erp.services import ErpService
from app.models.user import User

router = APIRouter(prefix="/erp", tags=["erp"])


def get_erp_service(db: Annotated[Session, Depends(get_db)]) -> ErpService:
    return ErpService(db)


@router.get("/status")
def erp_status(_: Annotated[User, Depends(require_admin)]) -> dict:
    return {"module": "erp", "status": "ok"}


@router.get("/semesters/active", response_model=SemesterRead)
def get_active_semester(
    service: Annotated[ErpService, Depends(get_erp_service)],
    _: Annotated[User, Depends(require_admin)],
) -> SemesterRead:
    return service.get_active_semester()


@router.get("/students", response_model=list[StudentRead], summary="Liste des étudiants")
def list_students(
    service: Annotated[ErpService, Depends(get_erp_service)],
    _: Annotated[User, Depends(require_admin)],
    program_id: int | None = None,
    status: str | None = None,
) -> list[StudentRead]:
    return service.list_students(program_id=program_id, status=status)


@router.get(
    "/students/by-phone/{phone}",
    response_model=StudentRead,
    summary="Étudiant par téléphone (agent)",
)
def get_student_by_phone(
    phone: str,
    service: Annotated[ErpService, Depends(get_erp_service)],
    _: Annotated[User, Depends(require_admin)],
) -> StudentRead:
    return service.get_student_by_phone(phone)


@router.get("/students/{student_id}", response_model=StudentRead)
def get_student(
    student_id: int,
    service: Annotated[ErpService, Depends(get_erp_service)],
    _: Annotated[User, Depends(require_admin)],
) -> StudentRead:
    return service.get_student(student_id)


@router.get(
    "/students/{student_id}/grades",
    response_model=GradesSummaryRead,
    summary="Notes et moyenne pondérée",
)
def get_student_grades(
    student_id: int,
    service: Annotated[ErpService, Depends(get_erp_service)],
    _: Annotated[User, Depends(require_admin)],
    semester_id: int | None = Query(default=None),
) -> GradesSummaryRead:
    return service.get_grades_summary(student_id, semester_id)


@router.post("/students", response_model=StudentRead, status_code=201)
def create_student(
    payload: StudentCreate,
    service: Annotated[ErpService, Depends(get_erp_service)],
    _: Annotated[User, Depends(require_admin)],
) -> StudentRead:
    return service.create_student(payload)


@router.put("/students/{student_id}", response_model=StudentRead)
def update_student(
    student_id: int,
    payload: StudentUpdate,
    service: Annotated[ErpService, Depends(get_erp_service)],
    _: Annotated[User, Depends(require_admin)],
) -> StudentRead:
    return service.update_student(student_id, payload)


@router.post("/grades", response_model=GradeRead, status_code=201)
def create_grade(
    payload: GradeCreate,
    service: Annotated[ErpService, Depends(get_erp_service)],
    _: Annotated[User, Depends(require_admin)],
) -> GradeRead:
    return service.create_grade(payload)
