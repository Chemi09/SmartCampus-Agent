"""
Crée toutes les tables (alternative rapide à Alembic pour le dev).
Usage : python -m scripts.create_tables
"""

from app.database import Base, engine
import app.models  # noqa: F401


def main() -> None:
    Base.metadata.create_all(bind=engine)
    print("Tables créées avec succès.")


if __name__ == "__main__":
    main()
