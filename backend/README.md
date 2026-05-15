# SmartCampus AgentAI — Backend

API FastAPI · Python 3.11+ · **MySQL** (Laragon)

## Prérequis MySQL (Laragon)

1. Démarrer **MySQL** dans Laragon.
2. Créer la base `smartcampus` (HeidiSQL ou phpMyAdmin).
3. Copier `.env.example` → `.env` et adapter `DATABASE_URL`.

Exemple (utilisateur `root`, mot de passe vide — classique Laragon) :

```env
DATABASE_URL=mysql+pymysql://root:@localhost:3306/smartcampus?charset=utf8mb4
```

Avec mot de passe :

```env
DATABASE_URL=mysql+pymysql://root:ton_mdp@localhost:3306/smartcampus?charset=utf8mb4
```

## Installation

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

## Migrations (Phase 2)

```powershell
# 1. Créer la base MySQL (si besoin)
python -m scripts.init_database

# 2. Appliquer les migrations
alembic upgrade head

# Alternative dev rapide (sans alembic_version)
# python -m scripts.create_tables
```

Vérifier : `alembic current` doit afficher `002`.

```powershell
python -m scripts.seed_admin
python -m seeds.demo_data
```

Compte admin démo : `admin@smartcampus.local` / `demo1234`

Étudiant démo : `ETU-2026-001` — Jean Mukendi — `+243810000001` (moyenne ~72,5 %, paiement partiel 300 000 CDF restants)

Recréer les données : `python -m seeds.demo_data --reset`

## Lancer l'API + frontend

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

| URL | Attendu |
|-----|---------|
| http://localhost:8000/ | Landing frontend |
| http://localhost:8000/pages/login.html | Connexion admin |
| http://localhost:8000/pages/admin/dashboard.html | Dashboard admin |
| http://localhost:8000/pages/demo/chat.html | Simulateur agent |
| http://localhost:8000/health | `{"status":"ok","database":"connected"}` |
| http://localhost:8000/docs | Swagger UI |

## Plans

- [PLAN-BACKEND.md](../docs/PLAN-BACKEND.md)
- [PLAN-FRONTEND.md](../docs/PLAN-FRONTEND.md)
