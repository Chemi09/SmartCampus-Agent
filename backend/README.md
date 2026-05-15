# SmartCampus AgentAI — Backend

API FastAPI · Python 3.11+

## Installation

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

## Lancer l'API (développement)

```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Vérifications Phase 1

| URL | Attendu |
|-----|---------|
| http://localhost:8000/health | `{"status":"ok",...}` |
| http://localhost:8000/docs | Swagger UI |
| http://localhost:8000/api/v1 | Infos modules |

## Docker (PostgreSQL + API)

Depuis la racine du projet :

```powershell
docker compose up -d
```

Puis définir dans `backend/.env` :

```env
DATABASE_URL=postgresql://smartcampus:smartcampus@localhost:5432/smartcampus
```

## Structure

Voir [docs/architecture_et _structure_arboresente.md](../docs/architecture_et%20_structure_arboresente.md)

## Plan de développement

[docs/PLAN-BACKEND.md](../docs/PLAN-BACKEND.md)
