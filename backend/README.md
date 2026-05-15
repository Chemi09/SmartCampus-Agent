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

## Lancer l'API

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

| URL | Attendu |
|-----|---------|
| http://localhost:8000/health | `{"status":"ok"}` |
| http://localhost:8000/docs | Swagger UI |

## Plans

- [PLAN-BACKEND.md](../docs/PLAN-BACKEND.md)
- [PLAN-FRONTEND.md](../docs/PLAN-FRONTEND.md)
