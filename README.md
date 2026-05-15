# SmartCampus AgentAI

ERP universitaire + CRM campus + agent IA autonome — hackathon **OpenClaw** · hébergement **Yamify** (Kinshasa).

## Stack

| Couche | Technologie |
|--------|-------------|
| Frontend | HTML5, CSS3, JavaScript vanilla, Bootstrap 5 |
| Backend | Python FastAPI |
| BDD | PostgreSQL / SQLite |
| IA | OpenClaw, LangChain, Yamify |

## Démarrage rapide (backend)

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

- API : http://localhost:8000/docs  
- Health : http://localhost:8000/health  

## Documentation

- [PROJET.md](docs/PROJET.md) — vision, équipe, pitch
- [PLAN-CONCEPTION.md](docs/PLAN-CONCEPTION.md) — conception détaillée
- [Documentation.md](docs/Documentation.md) — catalogue fonctionnel
- [architecture_et _structure_arboresente.md](docs/architecture_et%20_structure_arboresente.md) — arborescence complète
- [PLAN-BACKEND.md](docs/PLAN-BACKEND.md) — conception backend étape par étape (Bradley & Yamify)

## Équipe

| Membre | Couche | Rôle |
|--------|--------|------|
| **Bradley** | Backend | ERP académique (API, modèles, notes) |
| **Yamify** | Backend | CRM (API), agent IA, cloud souverain |
| **Michée** | Frontend | Pages CRM (paiements, communications) |
| **Joel** | Frontend | Pages ERP, shell app, simulateur WhatsApp |

## Dépôt

https://github.com/Chemi09/SmartCampus-Agent
