from sqlalchemy.orm import Session

from app.agent.handlers.context import HandlerContext
from app.erp.services import ErpService


def handle_grades_average(db: Session, ctx: HandlerContext) -> str:
    service = ErpService(db)
    summary = service.get_grades_summary(ctx.student.id, semester_id=None)
    name = f"{ctx.student.first_name} {ctx.student.last_name}"

    if ctx.language == "ln":
        if summary.average <= 0:
            return (
                f"Mbote {name}. Nakoki te kozwa moyenne na semestre {summary.semester} "
                f"pona sik'oyo. Tuna secrétariat ya campus."
            )
        return (
            f"Mbote {name}. Moyenne na yo na semestre {summary.semester} ezali "
            f"{summary.average} %."
        )

    if summary.average <= 0:
        return (
            f"Bonjour {name}. Aucune note enregistrée pour le semestre {summary.semester} "
            f"pour le moment. Contactez le secrétariat académique."
        )
    return (
        f"Bonjour {name}. Votre moyenne du semestre {summary.semester} est de "
        f"{summary.average} %."
    )
