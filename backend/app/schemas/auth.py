from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    email: str = Field(min_length=5)
    password: str = Field(min_length=4)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserRead(BaseModel):
    id: int
    email: str
    role: str
    student_id: int | None = None

    model_config = {"from_attributes": True}
