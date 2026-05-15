from typing import Annotated

from fastapi import Depends, Header
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.config import get_settings
from app.core.exceptions import ForbiddenException, UnauthorizedException
from app.core.security import decode_access_token
from app.database import get_db
from app.models.user import User

security_scheme = HTTPBearer(auto_error=False)
settings = get_settings()


def get_current_user(
    db: Annotated[Session, Depends(get_db)],
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security_scheme)],
) -> User:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise UnauthorizedException()

    try:
        payload = decode_access_token(credentials.credentials)
        user_id = int(payload.get("sub", 0))
    except (JWTError, ValueError, TypeError):
        raise UnauthorizedException("Token invalide ou expiré") from None

    user = db.get(User, user_id)
    if user is None:
        raise UnauthorizedException("Utilisateur introuvable")
    return user


def require_roles(*roles: str):
    def checker(user: Annotated[User, Depends(get_current_user)]) -> User:
        if user.role not in roles:
            raise ForbiddenException(f"Rôle requis : {', '.join(roles)}")
        return user

    return checker


require_admin = require_roles("admin")
require_student = require_roles("student")
require_admin_or_student = require_roles("admin", "student")


def verify_agent_service_key(
    x_agent_key: Annotated[str | None, Header(alias="X-Agent-Key")] = None,
) -> None:
    if not x_agent_key or x_agent_key != settings.agent_service_key:
        raise UnauthorizedException("Clé agent invalide")
