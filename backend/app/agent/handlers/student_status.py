from sqlalchemy.orm import Session

from app.agent.handlers.context import HandlerContext


_STATUS_LABELS_FR = {
    "active": "actif",
    "inactive": "inactif",
    "suspended": "suspendu",
    "graduated": "diplômé",
}


def handle_student_status(db: Session, ctx: HandlerContext) -> str:
    _ = db
    name = f"{ctx.student.first_name} {ctx.student.last_name}"
    status_key = ctx.student.status
    status_fr = _STATUS_LABELS_FR.get(status_key, status_key)
    program_name = ctx.student.program.name if ctx.student.program else "—"
    matricule = ctx.student.matricule

    if ctx.language == "ln":
        return (
            f"Mbote {name}. Dossier na yo ({matricule}) ezali {status_fr}. "
            f"Programme : {program_name}."
        )
    return (
        f"Bonjour {name}. Votre dossier ({matricule}) est {status_fr}. "
        f"Programme inscrit : {program_name}."
    )
