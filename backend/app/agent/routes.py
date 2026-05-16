from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.agent.orchestrator import AgentOrchestrator
from app.agent.schemas import AgentHealthResponse, ChatRequest, ChatResponse
from app.config import get_settings
from app.database import get_db

router = APIRouter(prefix="/agent", tags=["agent"])
settings = get_settings()


def get_orchestrator(db: Annotated[Session, Depends(get_db)]) -> AgentOrchestrator:
    return AgentOrchestrator(db)


@router.get("/health", response_model=AgentHealthResponse, summary="Santé agent + LLM")
async def agent_health(
    orchestrator: Annotated[AgentOrchestrator, Depends(get_orchestrator)],
) -> AgentHealthResponse:
    llm_ok = await orchestrator.check_llm()
    return AgentHealthResponse(
        status="ok",
        module="agent",
        demo_mode=settings.demo_mode,
        llm_endpoint=settings.llm_endpoint,
        llm_reachable=llm_ok,
    )


@router.post("/chat", response_model=ChatResponse, summary="Chat étudiant (WhatsApp mock)")
async def agent_chat(
    payload: ChatRequest,
    orchestrator: Annotated[AgentOrchestrator, Depends(get_orchestrator)],
) -> ChatResponse:
    """Identifie l'étudiant par téléphone, route l'intent, interroge ERP/CRM, répond en FR/Lingala."""
    return await orchestrator.chat(payload.phone, payload.message)


@router.post("/webhook/whatsapp", response_model=ChatResponse)
async def whatsapp_webhook(
    payload: ChatRequest,
    orchestrator: Annotated[AgentOrchestrator, Depends(get_orchestrator)],
) -> ChatResponse:
    """Entrée mock WhatsApp (Joel) — même contrat que /chat."""
    return await orchestrator.chat(payload.phone, payload.message)
