from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import create_access_token, verify_password
from app.database import get_db
from app.dependencies import get_current_user, require_admin
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse, UserRead

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse, summary="Connexion JWT")
def login(body: LoginRequest, db: Annotated[Session, Depends(get_db)]) -> TokenResponse:
    user = db.scalar(select(User).where(User.email == body.email))
    if user is None or not verify_password(body.password, user.hashed_password):
        from app.core.exceptions import UnauthorizedException

        raise UnauthorizedException("Email ou mot de passe incorrect")

    token = create_access_token(
        subject=str(user.id),
        role=user.role,
        email=user.email,
    )
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserRead)
def me(current_user: Annotated[User, Depends(get_current_user)]) -> User:
    return current_user


@router.get("/admin-check")
def admin_check(_: Annotated[User, Depends(require_admin)]) -> dict:
    """Route de test — protégée admin (vérifie JWT phase 3)."""
    return {"ok": True, "message": "Accès admin autorisé"}
