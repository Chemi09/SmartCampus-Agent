from sqlalchemy.orm import Session

from app.agent.handlers.context import HandlerContext
from app.config import get_settings
from app.crm.services import CrmService


def handle_payment_status(db: Session, ctx: HandlerContext) -> str:
    service = CrmService(db)
    balance = service.get_student_balance(ctx.student.id)
    settings = get_settings()
    currency = balance.currency
    name = f"{ctx.student.first_name} {ctx.student.last_name}"

    if balance.status == "paid":
        if ctx.language == "ln":
            return (
                f"Mbote {name}. Ofongoli frais na semestre {balance.semester} "
                f"({balance.total_due} {currency})."
            )
        return (
            f"Bonjour {name}. Vos frais du semestre {balance.semester} sont entièrement "
            f"réglés ({balance.total_due} {currency})."
        )

    if ctx.language == "ln":
        return (
            f"Mbote {name}. Na semestre {balance.semester}, ofuti {balance.paid} {currency} "
            f"na {balance.total_due} {currency}. Ezali kofanda {balance.remaining} {currency} "
            f"(statut : {balance.status})."
        )
    return (
        f"Bonjour {name}. Pour le semestre {balance.semester} : vous avez payé "
        f"{balance.paid} {currency} sur {balance.total_due} {currency}. "
        f"Il reste {balance.remaining} {currency} (statut : {balance.status})."
    )
