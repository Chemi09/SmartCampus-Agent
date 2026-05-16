from sqlalchemy.orm import Session

from app.agent.handlers.context import HandlerContext
from app.erp.services import ErpService

# Dates démo hackathon (Master / campus Kinshasa)
MASTER_ENROLLMENT_CLOSE = "15 juillet 2026"
MASTER_ENROLLMENT_OPEN = "1er juin 2026"


def handle_enrollment_dates(db: Session, ctx: HandlerContext) -> str:
    service = ErpService(db)
    semester = service.get_active_semester()
    name = f"{ctx.student.first_name} {ctx.student.last_name}"
    program_name = ctx.student.program.name if ctx.student.program else "votre programme"

    if ctx.language == "ln":
        return (
            f"Mbote {name}. Inscription Master : efungwami {MASTER_ENROLLMENT_OPEN}, "
            f"ekokanga {MASTER_ENROLLMENT_CLOSE}. Semestre actif : {semester.label} "
            f"({semester.start_date} — {semester.end_date}). Programme : {program_name}."
        )
    return (
        f"Bonjour {name}. Inscriptions Master : ouverture le {MASTER_ENROLLMENT_OPEN}, "
        f"clôture le {MASTER_ENROLLMENT_CLOSE}. Semestre actif : {semester.label} "
        f"({semester.start_date} au {semester.end_date}). Votre programme actuel : {program_name}."
    )
