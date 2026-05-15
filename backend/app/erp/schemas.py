from datetime import date

from pydantic import BaseModel, Field


class SemesterRead(BaseModel):
    id: int
    label: str
    start_date: date
    end_date: date
    is_active: bool

    model_config = {"from_attributes": True}


class ProgramBrief(BaseModel):
    id: int
    name: str
    level: str

    model_config = {"from_attributes": True}


class StudentRead(BaseModel):
    id: int
    matricule: str
    first_name: str
    last_name: str
    phone: str
    email: str | None
    program_id: int
    status: str
    program: ProgramBrief | None = None

    model_config = {"from_attributes": True}


class StudentCreate(BaseModel):
    matricule: str = Field(min_length=3, max_length=32)
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    phone: str = Field(min_length=8, max_length=20)
    email: str | None = None
    program_id: int
    status: str = "active"


class StudentUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None
    email: str | None = None
    program_id: int | None = None
    status: str | None = None


class GradeItemRead(BaseModel):
    course: str
    score: float
    credits: int


class GradesSummaryRead(BaseModel):
    student_id: int
    semester: str
    average: float
    grades: list[GradeItemRead]


class GradeCreate(BaseModel):
    enrollment_id: int
    course_id: int
    score: float = Field(ge=0, le=100)
    session: str = "normal"


class GradeRead(BaseModel):
    id: int
    enrollment_id: int
    course_id: int
    score: float
    session: str

    model_config = {"from_attributes": True}
