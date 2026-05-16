from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    phone: str = Field(min_length=8, max_length=20)
    message: str = Field(min_length=1, max_length=2000)


class ChatResponse(BaseModel):
    reply: str
    intent: str
    student_id: int | None = None
    language: str = "fr"
    demo_mode: bool = True


class AgentHealthResponse(BaseModel):
    status: str
    module: str
    demo_mode: bool
    llm_endpoint: str
    llm_reachable: bool | None = None
