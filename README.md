# SmartCampus AgentAI

ERP universitaire + CRM campus + agent IA autonome — hackathon **OpenClaw** · hébergement **Yamify** (Kinshasa).

## Stack

| Couche | Technologie |
|--------|-------------|
| Frontend | HTML5, CSS3, JavaScript vanilla, Bootstrap 5 |
| Backend | Python FastAPI |
| BDD | MySQL (Laragon) |
| IA | OpenClaw, LangChain, Yamify |

## Démarrage rapide

```powershell
cd "c:\laragon\www\SmartCampus Agent"

# Première fois
.\start-smartcampus.ps1 -Setup

# Chaque session (PowerShell ou double-clic)
.\start-smartcampus.ps1 -OpenBrowser
start-smartcampus.bat
```

- Site : http://localhost:8000/pages/login.html  
- API / Swagger : http://localhost:8000/docs  
- Health : http://localhost:8000/health  

Liste complète des commandes : **[docs/LANCEMENT.md](docs/LANCEMENT.md)**

## Documentation

- [PROJET.md](docs/PROJET.md) — vision, équipe, pitch
- [PLAN-CONCEPTION.md](docs/PLAN-CONCEPTION.md) — conception détaillée
- [Documentation.md](docs/Documentation.md) — catalogue fonctionnel
- [architecture_et _structure_arboresente.md](docs/architecture_et%20_structure_arboresente.md) — arborescence complète
- [PLAN-BACKEND.md](docs/PLAN-BACKEND.md) — conception backend (Bradley & Ephraim)
- [PLAN-FRONTEND.md](docs/PLAN-FRONTEND.md) — conception frontend (Joel & Michée)
- [LANCEMENT.md](docs/LANCEMENT.md) — commandes et script de démarrage

## Équipe

| Membre | Couche | Rôle |
|--------|--------|------|
| **Bradley** | Backend | ERP académique (API, modèles, notes) |
| **Ephraim** | Backend | CRM (API), agent IA |
| **Michée** | Frontend | Pages CRM (paiements, communications) |
| **Joel** | Frontend | Pages ERP, shell app, simulateur WhatsApp |

## Dépôt

https://github.com/Chemi09/SmartCampus-Agent
