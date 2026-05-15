from fastapi import APIRouter

api_router = APIRouter()


@api_router.get("", tags=["api"])
def api_root() -> dict:
    """Point d'entrée API v1 — modules ERP, CRM et agent à venir."""
    return {
        "version": "v1",
        "modules": {
            "erp": "/api/v1/erp (phase 4)",
            "crm": "/api/v1/crm (phase 5)",
            "agent": "/api/v1/agent (phase 6)",
        },
    }
