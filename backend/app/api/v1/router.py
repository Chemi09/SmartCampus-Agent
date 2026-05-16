from fastapi import APIRouter

from app.api.v1 import auth
from app.agent.routes import router as agent_router
from app.crm.routes import router as crm_router
from app.erp.routes import router as erp_router

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(erp_router)
api_router.include_router(crm_router)
api_router.include_router(agent_router)


@api_router.get("", tags=["api"])
def api_root() -> dict:
    """Point d'entrée API v1 — modules ERP, CRM et agent à venir."""
    return {
        "version": "v1",
        "modules": {
            "erp": "/api/v1/erp",
            "crm": "/api/v1/crm",
            "agent": "/api/v1/agent",
        },
    }
