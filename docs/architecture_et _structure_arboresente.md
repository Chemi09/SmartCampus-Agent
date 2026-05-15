# Architecture et structure arborescente — SmartCampus AgentAI

**Stack validée :** Frontend **HTML5 · CSS3 · JavaScript (vanilla)** + **Bootstrap 5** — **pas de React, pas de Vue, pas de framework SPA.**

**Backend :** Python **FastAPI** (cf. [PLAN-CONCEPTION.md](./PLAN-CONCEPTION.md), [Documentation.md](./Documentation.md))

---

## Vue d’ensemble

```
Utilisateur
    ├── Navigateur (pages HTML statiques + JS)
    └── WhatsApp / SMS
              │
              ▼
         API REST (FastAPI)  /api/v1
              │
    ┌─────────┼─────────┐
    ▼         ▼         ▼
  ERP       CRM      Agent IA
(Bradley) (Michée)  (Yamify)
              │
              ▼
         PostgreSQL / SQLite
              │
              ▼
         Yamify (cloud local Kinshasa)
```

---

## FRONTEND (Joel) — HTML · CSS · JS

Pas de build obligatoire : pages servies par le backend (`StaticFiles`) ou serveur Laragon.

```
frontend/
├── index.html                 # Landing / accueil hackathon
├── assets/
│   ├── css/
│   │   ├── bootstrap.min.css  # Bootstrap 5 (CDN ou local)
│   │   ├── variables.css      # Couleurs campus, CDF, statuts
│   │   └── main.css           # Styles globaux
│   └── js/
│       ├── config.js          # URL API, clés démo
│       ├── api.js             # fetch() vers /api/v1 (wrapper commun)
│       ├── auth.js            # Token JWT en localStorage, rôles
│       └── utils.js           # Format CDF, dates, toasts
├── pages/
│   ├── login.html
│   ├── admin/
│   │   ├── dashboard.html     # KPIs, impayés, stats campus
│   │   ├── students.html      # Liste étudiants (ERP — Bradley)
│   │   ├── student-detail.html
│   │   ├── grades.html        # Saisie / vue notes
│   │   ├── payments.html      # Frais, relances (CRM — Michée)
│   │   └── communications.html
│   ├── student/
│   │   └── dashboard.html     # Mes notes, mon solde, notifications
│   └── demo/
│       └── chat.html          # Simulateur WhatsApp (si pas d’API Meta)
└── partials/                  # Optionnel : fragments HTML réutilisables
    ├── header.html            # Chargés via fetch + innerHTML si besoin
    └── sidebar-admin.html
```

### Rôle des dossiers frontend

| Dossier / fichier | Rôle |
|-------------------|------|
| `assets/css/` | Bootstrap + thème SmartCampus |
| `assets/js/api.js` | Tous les appels `GET/POST` vers le backend |
| `assets/js/auth.js` | Connexion, déconnexion, garde des pages admin |
| `pages/admin/` | Interfaces secrétariat / direction |
| `pages/student/` | Portail étudiant |
| `pages/demo/chat.html` | Démo agent sans WhatsApp réel |

### Pages ↔ modules équipe

| Page | Module | Responsable |
|------|--------|-------------|
| `students.html`, `grades.html` | ERP | Bradley (API) + Joel (UI) |
| `payments.html`, `communications.html` | CRM | Michée (API) + Joel (UI) |
| `demo/chat.html` | Agent | Yamify (API) + Joel (webhook UI) |

---

## BACKEND (Python FastAPI)

```
backend/
├── app/
│   ├── main.py                # App FastAPI, CORS, montage StaticFiles /frontend
│   ├── config.py              # DATABASE_URL, JWT, LLM, DEMO_MODE
│   ├── database.py            # Session SQLAlchemy
│   ├── erp/                   # Module Bradley
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── routes.py          # /api/v1/erp/*
│   │   └── services.py
│   ├── crm/                   # Module Michée
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── routes.py          # /api/v1/crm/*
│   │   └── services.py
│   └── agent/                 # Module Yamify
│       ├── routes.py          # /api/v1/agent/*
│       ├── intents.py         # grades, payment, enrollment…
│       └── orchestrator.py    # OpenClaw / LangChain
├── migrations/
├── seeds/
│   └── demo_data.py           # 8–10 étudiants, 2 impayés
├── requirements.txt
└── .env.example
```

### Alignement avec l’ancienne ébauche Node/React

| Ancien (incorrect) | Remplacé par |
|--------------------|--------------|
| `Dashboard.jsx`, `Students.jsx` | `dashboard.html`, `students.html` + `assets/js/` |
| `context/`, `hooks/` (React) | `auth.js`, `api.js` |
| `erpController.js` (Node) | `app/erp/routes.py` (FastAPI) |
| `crmController.js` | `app/crm/routes.py` |
| `aiController.js` | `app/agent/routes.py` |
| `yamifyAI.js` | `app/agent/orchestrator.py` |
| `mobileMoney.js` | `app/crm/services.py` (mock paiement) |

---

## Racine du dépôt

```
SmartCampus-Agent/
├── docs/
│   ├── PROJET.md
│   ├── Documentation.md
│   ├── PLAN-CONCEPTION.md
│   └── architecture_et _structure_arboresente.md   # ce fichier
├── frontend/                  # HTML · CSS · JS (Joel)
├── backend/                   # FastAPI (Bradley, Michée, Yamify)
├── docker-compose.yml
└── README.md
```

---

## Communication frontend ↔ backend

Exemple dans `assets/js/api.js` :

```javascript
const API_BASE = window.CONFIG?.API_BASE ?? '/api/v1';

async function getStudentSummary(studentId) {
  const res = await fetch(`${API_BASE}/students/${studentId}/summary`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error('API error');
  return res.json();
}
```

Le backend sert les pages HTML :

```python
# main.py — extrait
from fastapi.staticfiles import StaticFiles
app.mount("/", StaticFiles(directory="../frontend", html=True), name="frontend")
```

---

## Documents de référence

| Document | Contenu |
|----------|---------|
| [Documentation.md](./Documentation.md) §11 | HTML5, CSS3, JavaScript, Bootstrap — **confirmé, pas React** |
| [PLAN-CONCEPTION.md](./PLAN-CONCEPTION.md) §3.2, §9 | Stack et écrans MVP |
| [PROJET.md](./PROJET.md) | Vision équipe et backlog |

*Dernière mise à jour : mai 2026 — stack frontend validée HTML/CSS/JS.*

---

## Arborescence complète du projet

Arbre **unifié** (racine → chaque fichier prévu). À créer au fil du hackathon.

```
SmartCampus-Agent/
│
├── README.md
├── .gitignore
├── .env.example
├── docker-compose.yml
│
├── docs/
│   ├── PROJET.md
│   ├── Documentation.md
│   ├── PLAN-CONCEPTION.md
│   └── architecture_et _structure_arboresente.md
│
├── frontend/                              # Joel — HTML · CSS · JS (pas React)
│   ├── index.html
│   │
│   ├── assets/
│   │   ├── css/
│   │   │   ├── bootstrap.min.css
│   │   │   ├── variables.css
│   │   │   └── main.css
│   │   ├── js/
│   │   │   ├── config.js
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   ├── utils.js
│   │   │   ├── admin/
│   │   │   │   ├── dashboard.js
│   │   │   │   ├── students.js
│   │   │   │   ├── student-detail.js
│   │   │   │   ├── grades.js
│   │   │   │   ├── payments.js
│   │   │   │   └── communications.js
│   │   │   ├── student/
│   │   │   │   └── dashboard.js
│   │   │   └── demo/
│   │   │       └── chat.js
│   │   └── img/
│   │       ├── logo.svg
│   │       └── favicon.ico
│   │
│   ├── pages/
│   │   ├── login.html
│   │   ├── admin/
│   │   │   ├── dashboard.html
│   │   │   ├── students.html
│   │   │   ├── student-detail.html
│   │   │   ├── grades.html
│   │   │   ├── payments.html
│   │   │   └── communications.html
│   │   ├── student/
│   │   │   └── dashboard.html
│   │   └── demo/
│   │       └── chat.html
│   │
│   └── partials/
│       ├── header.html
│       ├── footer.html
│       └── sidebar-admin.html
│
└── backend/                               # Bradley · Michée · Yamify — FastAPI
    ├── requirements.txt
    ├── .env.example
    ├── alembic.ini                        # optionnel — migrations
    │
    ├── migrations/
    │   ├── env.py
    │   └── versions/
    │       └── 001_initial_schema.py
    │
    ├── seeds/
    │   ├── __init__.py
    │   └── demo_data.py                   # 8–10 étudiants, 2 impayés, 3 UE
    │
    └── app/
        ├── __init__.py
        ├── main.py                        # FastAPI, CORS, StaticFiles, routers
        ├── config.py
        ├── database.py
        ├── dependencies.py                # get_db, get_current_user
        │
        ├── core/
        │   ├── __init__.py
        │   ├── security.py                # JWT, hash, rôles
        │   └── exceptions.py
        │
        ├── models/                        # SQLAlchemy — modèles partagés
        │   ├── __init__.py
        │   ├── base.py
        │   ├── faculty.py
        │   ├── program.py
        │   ├── student.py
        │   ├── semester.py
        │   ├── course.py
        │   ├── enrollment.py
        │   ├── grade.py
        │   ├── schedule.py
        │   ├── payment.py
        │   ├── payment_transaction.py
        │   ├── communication.py
        │   └── announcement.py
        │
        ├── schemas/                       # Pydantic — réponses API
        │   ├── __init__.py
        │   ├── student.py
        │   ├── grade.py
        │   ├── payment.py
        │   └── agent.py
        │
        ├── api/
        │   ├── __init__.py
        │   └── v1/
        │       ├── __init__.py
        │       ├── router.py              # agrège erp + crm + agent + summary
        │       ├── summary.py             # GET /students/{id}/summary (Joel)
        │       └── auth.py                # login, token
        │
        ├── erp/                           # Bradley
        │   ├── __init__.py
        │   ├── routes.py                  # /api/v1/erp/*
        │   ├── services.py
        │   └── repositories.py
        │
        ├── crm/                           # Michée
        │   ├── __init__.py
        │   ├── routes.py                  # /api/v1/crm/*
        │   ├── services.py                # relances, mock Mobile Money
        │   └── repositories.py
        │
        └── agent/                         # Yamify
            ├── __init__.py
            ├── routes.py                  # /api/v1/agent/*, webhook WhatsApp
            ├── orchestrator.py            # OpenClaw / LangChain
            ├── intents.py                 # classifier + handlers
            ├── handlers/
            │   ├── __init__.py
            │   ├── grades.py
            │   ├── payment.py
            │   ├── enrollment.py
            │   └── fallback.py
            └── prompts/
                └── system.txt             # prompt FR / Lingala
```

### Légende rapide

| Symbole / dossier | Signification |
|-------------------|---------------|
| `frontend/pages/` | Pages HTML servies au navigateur |
| `frontend/assets/js/` | Logique UI, appels `fetch` vers l’API |
| `backend/app/erp/` | Module académique (Bradley) |
| `backend/app/crm/` | Module relationnel & paiements (Michée) |
| `backend/app/agent/` | Orchestrateur IA & WhatsApp (Yamify) |
| `backend/app/models/` | Tables PostgreSQL / SQLite |
| `seeds/demo_data.py` | Jeu de données pour la démo jury |

### Fichiers optionnels (post-MVP)

```
backend/tests/
├── test_erp.py
├── test_crm.py
└── test_agent.py

frontend/assets/js/
└── i18n.js                                # Lingala — phase 2
```
