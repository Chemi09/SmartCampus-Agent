"""
Crée l'utilisateur admin de démo.
Usage : python -m scripts.seed_admin
"""

from sqlalchemy import select

from app.core.security import hash_password
from app.database import SessionLocal
from app.models.user import User

ADMIN_EMAIL = "admin@smartcampus.local"
ADMIN_PASSWORD = "demo1234"


def main() -> None:
    db = SessionLocal()
    try:
        existing = db.scalar(select(User).where(User.email == ADMIN_EMAIL))
        if existing:
            print(f"Admin déjà présent : {ADMIN_EMAIL}")
            return

        admin = User(
            email=ADMIN_EMAIL,
            hashed_password=hash_password(ADMIN_PASSWORD),
            role="admin",
        )
        db.add(admin)
        db.commit()
        print(f"Admin créé : {ADMIN_EMAIL} / {ADMIN_PASSWORD}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
