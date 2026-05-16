import re
from pathlib import Path

import httpx
from sqlalchemy.orm import Session

from app.agent.handlers import (
    handle_enrollment_dates,
    handle_fallback,
    handle_grades_average,
    handle_payment_status,
    handle_student_status,
)
from app.agent.handlers.context import HandlerContext
from app.agent.intents import Intent, classify_intent, detect_language
from app.agent.schemas import ChatResponse
from app.config import get_settings
from app.core.exceptions import NotFoundException
from app.erp.services import ErpService

PROMPTS_DIR = Path(__file__).parent / "prompts"


def normalize_phone(phone: str) -> str:
    cleaned = re.sub(r"[\s\-().]", "", phone.strip())
    if cleaned.startswith("00"):
        cleaned = "+" + cleaned[2:]
    if cleaned.startswith("0") and not cleaned.startswith("+"):
        cleaned = "+243" + cleaned[1:]
    if cleaned.isdigit() and len(cleaned) >= 9:
        if cleaned.startswith("243"):
            cleaned = "+" + cleaned
        elif not cleaned.startswith("+"):
            cleaned = "+243" + cleaned
    return cleaned


class AgentOrchestrator:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.settings = get_settings()
        self.erp = ErpService(db)

    def _unknown_student_reply(self, language: str) -> str:
        if language == "ln":
            return (
                "Numéro ya téléphone ezwami te na système. "
                "Tuna secrétariat ya campus na numéro na yo ya inscription."
            )
        return (
            "Votre numéro de téléphone n'est pas reconnu. "
            "Veuillez contacter le secrétariat du campus avec votre matricule."
        )

    def _dispatch(self, intent: Intent, ctx: HandlerContext) -> str:
        if intent == Intent.GRADES_AVERAGE:
            return handle_grades_average(self.db, ctx)
        if intent == Intent.PAYMENT_STATUS:
            return handle_payment_status(self.db, ctx)
        if intent == Intent.ENROLLMENT_DATES:
            return handle_enrollment_dates(self.db, ctx)
        if intent == Intent.STUDENT_STATUS:
            return handle_student_status(self.db, ctx)
        return handle_fallback(language=ctx.language)

    async def _maybe_enhance_with_llm(self, reply: str, facts: str, language: str) -> str:
        if self.settings.demo_mode:
            return reply
        system_path = PROMPTS_DIR / "system.txt"
        system_prompt = system_path.read_text(encoding="utf-8") if system_path.exists() else ""
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                response = await client.post(
                    f"{self.settings.llm_endpoint.rstrip('/')}/chat/completions",
                    json={
                        "model": "smartcampus",
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {
                                "role": "user",
                                "content": (
                                    f"Langue: {language}. Données vérifiées: {facts}. "
                                    f"Reformule brièvement sans changer les chiffres: {reply}"
                                ),
                            },
                        ],
                        "max_tokens": 200,
                    },
                )
                if response.is_success:
                    data = response.json()
                    content = data["choices"][0]["message"]["content"]
                    if content and content.strip():
                        return content.strip()
        except (httpx.HTTPError, KeyError, IndexError, TypeError):
            pass
        return reply

    async def chat(self, phone: str, message: str) -> ChatResponse:
        normalized = normalize_phone(phone)
        language = detect_language(message)
        intent = classify_intent(message)

        try:
            student = self.erp.get_student_by_phone(normalized)
        except NotFoundException:
            return ChatResponse(
                reply=self._unknown_student_reply(language),
                intent=Intent.UNKNOWN.value,
                student_id=None,
                language=language,
                demo_mode=self.settings.demo_mode,
            )

        ctx = HandlerContext(student=student, message=message, language=language)
        reply = self._dispatch(intent, ctx)
        reply = await self._maybe_enhance_with_llm(
            reply,
            facts=f"intent={intent.value}, student_id={student.id}",
            language=language,
        )

        return ChatResponse(
            reply=reply,
            intent=intent.value,
            student_id=student.id,
            language=language,
            demo_mode=self.settings.demo_mode,
        )

    async def check_llm(self) -> bool | None:
        if self.settings.demo_mode:
            return None
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                response = await client.get(self.settings.llm_endpoint.rstrip("/"))
                return response.status_code < 500
        except httpx.HTTPError:
            return False
