# Plan backend — étape par étape

**Projet :** SmartCampus AgentAI  
**Stack :** Python 3.11+ · FastAPI · SQLAlchemy · **MySQL** (Laragon) · JWT  
**Équipe backend :** **Bradley** (ERP) · **Ephraim** (CRM + Agent IA)  
**Partenaire infra :** **Yamify** (cloud souverain Kinshasa)

**Documents liés :** [PLAN-CONCEPTION.md](./PLAN-CONCEPTION.md) · [architecture_et _structure_arboresente.md](./architecture_et%20_structure_arboresente.md) · [PROJET.md](./PROJET.md)

> **Comment utiliser ce document :** coche les cases `- [ ]` → `- [x]` au fur et à mesure.  
> Dans VS Code / Cursor : clic sur la case, ou `Alt+Entrée` sur la ligne.

---

## Tableau de bord — avancement global

### Phases

- [ ] **Phase 0** — Cadrage commun (2–4 h)
- [x] **Phase 1** — Socle technique (4–6 h)
- [x] **Phase 2** — Base de données (6–8 h)
- [x] **Phase 3** — Authentification & sécurité (3–4 h)
- [x] **Phase 4** — Module ERP — Bradley (10–12 h)
- [x] **Phase 5** — Module CRM — Ephraim (8–10 h)
- [x] **Phase 6** — Module Agent IA — Ephraim (10–12 h)
- [ ] **Phase 7** — API agrégée & intégration (4–6 h)
- [x] **Phase 8** — Seeds & données démo (3–4 h)
- [ ] **Phase 9** — Tests & documentation API (4–6 h)
- [ ] **Phase 10** — Déploiement Yamify (4–6 h)

### Par responsable

**Bradley**

- [x] Socle + auth terminés
- [x] Module ERP terminé
- [x] Seeds académiques OK
- [ ] API `summary` OK

**Ephraim**

- [x] Modèles CRM terminés (tables partagées phase 2)
- [x] Module CRM terminé
- [x] Agent IA terminé
- [ ] Déploiement cloud local OK

### Jalon hackathon

- [x] `GET /health` → 200
- [x] `GET /docs` → Swagger OK
- [x] Agent répond aux 5 phrases de test
- [ ] Parcours démo 3 min sans erreur
- [ ] Push sur `main` à jour

---

## Table des matières

1. [Vue d’ensemble](#1-vue-densemble)
2. [Phase 0](#phase-0--cadrage-commun-24-h)
3. [Phase 1](#phase-1--socle-technique-46-h)
4. [Phase 2](#phase-2--base-de-données-68-h)
5. [Phase 3](#phase-3--authentification--sécurité-34-h)
6. [Phase 4](#phase-4--module-erp--bradley-1012-h)
7. [Phase 5](#phase-5--module-crm--yamify-810-h)
8. [Phase 6](#phase-6--module-agent-ia--yamify-1012-h)
9. [Phase 7](#phase-7--api-agrégée--intégration-46-h)
10. [Phase 8](#phase-8--seeds--données-démo-34-h)
11. [Phase 9](#phase-9--tests--documentation-api-46-h)
12. [Phase 10](#phase-10--déploiement-yamify-46-h)
13. [Planning 48 h](#planning-synthétique-48-h)
14. [Checklist finale](#checklist-finale-backend)

---

## 1. Vue d’ensemble

### 1.1 Objectif du backend

Fournir une **API REST unique** (`/api/v1`) qui :

- gère les données **académiques** (ERP) ;
- gère les **paiements et communications** (CRM) ;
- expose un **agent IA** qui interroge ERP + CRM ;
- reste **hébergeable localement** (Yamify / Kinshasa).

### 1.2 Répartition

| Module | Dossier | Responsable | Préfixe API |
|--------|---------|-------------|-------------|
| Socle, auth, summary | `app/core/`, `app/api/` | **Bradley** (lead) | `/api/v1` |
| ERP | `app/erp/` | **Bradley** | `/api/v1/erp` |
| CRM | `app/crm/` | **Ephraim** | `/api/v1/crm` |
| Agent IA | `app/agent/` | **Ephraim** | `/api/v1/agent` |

---

## Phase 0 — Cadrage commun (2–4 h)

**Qui :** Bradley + Ephraim  
**But :** figer routes et schéma avant de coder.

- [ ] **0.1** Valider ce plan + routes [PLAN-CONCEPTION §6](./PLAN-CONCEPTION.md)
- [ ] **0.2** Créer dossier `backend/` ([arborescence](./architecture_et%20_structure_arboresente.md))
- [ ] **0.3** BDD **MySQL** (Laragon) — base `smartcampus` + `.env.example`
- [ ] **0.4** Convention : `student_id` + `phone` = clés de liaison ERP ↔ CRM ↔ agent
- [ ] **0.5** Canal équipe pour bloquants API (Discord / WhatsApp)

**Branches Git**

- [ ] `backend/socle` créée (Bradley)
- [ ] `backend/erp` créée (Bradley)
- [ ] `backend/crm` créée (Ephraim)
- [ ] `backend/agent` créée (Ephraim)

**Phase 0 terminée :** [ ]

---

## Phase 1 — Socle technique (4–6 h)

**Qui :** Bradley (lead)  
**But :** FastAPI démarre, `/health` → 200.

- [x] **1.1** `requirements.txt` créé et installé (`venv`)
- [x] **1.2** `app/config.py` — `DATABASE_URL`, `JWT_SECRET`, `LLM_ENDPOINT`, `DEMO_MODE`
- [x] **1.3** `app/database.py` — engine + `SessionLocal` + `get_db`
- [x] **1.4** `app/main.py` — FastAPI + CORS (Laragon)
- [x] **1.5** Route `GET /health` → `{"status": "ok"}`
- [x] **1.6** Router `/api/v1` monté (vide pour l’instant)
- [x] **1.7** `StaticFiles` → `../frontend` (optionnel)
- [x] **1.8** `docker-compose.yml` (MySQL + API)
- [x] **1.9** `backend/.env.example` + `backend/README.md` (install)

**Vérification**

- [x] `uvicorn app.main:app --reload` démarre sans erreur
- [x] `http://localhost:8000/health` → 200
- [x] `http://localhost:8000/docs` → Swagger UI

**Phase 1 terminée :** [x]

---

## Phase 2 — Base de données (6–8 h)

**Qui :** Bradley (ERP) + Ephraim (CRM) — review croisée obligatoire.

### Modèles

- [x] **2.1** `app/models/base.py`
- [x] **2.2** Modèle `faculty`
- [x] **2.3** Modèle `program`
- [x] **2.4** Modèle `student` (index unique `matricule`, `phone`)
- [x] **2.5** Modèle `semester`
- [x] **2.6** Modèle `course`
- [x] **2.7** Modèle `enrollment`
- [x] **2.8** Modèle `grade`
- [x] **2.9** Modèle `fee_type`
- [x] **2.10** Modèle `payment` (FK → `student`)
- [x] **2.11** Modèle `payment_transaction`
- [x] **2.12** Modèle `communication`
- [x] **2.13** FK `payment.student_id` → `student.id` validée

### Migrations

- [x] **2.14** Alembic initialisé
- [x] **2.15** Migration `001_initial_schema.py`
- [x] **2.16** `alembic upgrade head` OK (MySQL Laragon)

**Phase 2 terminée :** [x]

---

## Phase 3 — Authentification & sécurité (3–4 h)

**Qui :** Bradley.

- [x] **3.1** `app/core/security.py` — hash + JWT
- [x] **3.2** `app/schemas/auth.py` — `LoginRequest`, `TokenResponse`
- [x] **3.3** `POST /api/v1/auth/login`
- [x] **3.4** `GET /api/v1/auth/me`
- [x] **3.5** `app/dependencies.py` — `get_current_user`
- [x] **3.6** Rôles : `admin`, `student`, `agent_service`
- [x] **3.7** Routes ERP/CRM protégées (admin)
- [x] **3.8** Clé `AGENT_SERVICE_KEY` pour routes agent
- [x] **3.9** `app/core/exceptions.py` — 401, 403, 404

**Vérification**

- [x] Login admin démo → token reçu
- [x] Route ERP sans token → 401

**Phase 3 terminée :** [x]

---

## Phase 4 — Module ERP — Bradley (10–12 h)

**Dossier :** `app/erp/` · **Préfixe :** `/api/v1/erp`

### Fichiers module

- [x] **4.1** `erp/schemas.py` — Student, Grade, GradesSummary
- [x] **4.2** `erp/repositories.py`
- [x] **4.3** `erp/services.py` — moyenne pondérée par crédits
- [x] **4.4** `erp/routes.py` — router enregistré dans `main`

### Endpoints

- [x] **4.5** `GET /erp/semesters/active` (P0)
- [x] **4.6** `GET /erp/students` (P0)
- [x] **4.7** `GET /erp/students/{id}` (P0)
- [x] **4.8** `GET /erp/students/by-phone/{phone}` (P0 — agent)
- [x] **4.9** `GET /erp/students/{id}/grades` (P0 — agent)
- [x] **4.10** `POST /erp/students` (P1)
- [x] **4.11** `POST /erp/grades` (P1)
- [x] **4.12** `PUT /erp/students/{id}` (P2)

### Tests

- [x] **4.13** Liste filtrée par `program_id` OK
- [x] **4.14** `by-phone` → `ETU-2026-001` OK
- [x] **4.15** Moyenne cohérente avec seed OK

**Phase 4 terminée :** [x]

---

## Phase 5 — Module CRM — Ephraim (8–10 h)

**Dossier :** `app/crm/` · **Préfixe :** `/api/v1/crm`

### Fichiers module

- [x] **5.1** `crm/schemas.py` — Payment, Balance, Communication
- [x] **5.2** `crm/services.py` — statut `paid|partial|unpaid|overdue`
- [x] **5.3** `crm/services.py` — `record_payment` (mock Mobile Money)
- [x] **5.4** `crm/services.py` — `send_relance` → table `communications`
- [x] **5.5** `crm/routes.py` — router enregistré

### Endpoints

- [x] **5.6** `GET /crm/students/{id}/balance` (P0 — agent)
- [x] **5.7** `GET /crm/payments?status=unpaid` (P0 — front Michée)
- [x] **5.8** `GET /crm/students/{id}/payments` (P1)
- [x] **5.9** `POST /crm/payments/{id}/record` (P1)
- [x] **5.10** `POST /crm/relances` (P1)
- [x] **5.11** `GET /crm/communications` (P2)

### Tests

- [x] **5.12** Liste impayés retourne ≥ 2 étudiants (seed)
- [x] **5.13** `balance` cohérent pour `ETU-2026-001` (partial, 300 000 CDF restants)

**Phase 5 terminée :** [x]

---

## Phase 6 — Module Agent IA — Ephraim (10–12 h)

**Dossier :** `app/agent/` · **Préfixe :** `/api/v1/agent`

### Fichiers module

- [x] **6.1** `agent/prompts/system.txt` (FR / Lingala, pas d’hallucination)
- [x] **6.2** `agent/intents.py` — classifier
- [x] **6.3** `agent/handlers/grades.py`
- [x] **6.4** `agent/handlers/payment.py`
- [x] **6.5** `agent/handlers/enrollment.py`
- [x] **6.6** `agent/handlers/fallback.py`
- [x] **6.7** `agent/orchestrator.py`
- [x] **6.8** `agent/routes.py`

### Endpoints

- [x] **6.9** `POST /agent/chat`
- [x] **6.10** `POST /agent/webhook/whatsapp`
- [x] **6.11** `GET /agent/health`

### Intents

- [x] **6.12** Intent `grades.average` fonctionnel
- [x] **6.13** Intent `payment.status` fonctionnel
- [x] **6.14** Intent `enrollment.dates` fonctionnel
- [x] **6.15** Intent `student.status` fonctionnel
- [x] **6.16** Intent `unknown` / fallback fonctionnel

### Connexion LLM

- [x] **6.17** OpenClaw / LLM souverain connecté **ou** mock `DEMO_MODE=true`

### Tests agent (5 phrases)

- [x] **6.18** « Quelle est ma moyenne du semestre ? »
- [x] **6.19** « Ai-je payé mes frais S2 ? »
- [x] **6.20** « Quand ferme l'inscription en Master ? »
- [x] **6.21** « Mon dossier est-il actif ? »
- [x] **6.22** « Bonjour » → fallback

**Phase 6 terminée :** [x]

---

## Phase 7 — API agrégée & intégration (4–6 h)

**Qui :** Bradley + Ephraim.

- [ ] **7.1** `app/api/v1/summary.py` — `GET /students/{id}/summary`
- [ ] **7.2** Agrégation ERP (student + moyenne) + CRM (balance)
- [ ] **7.3** `app/api/v1/router.py` — tous routers inclus
- [ ] **7.4** Test : `summary` = ERP + CRM séparés (mêmes chiffres)
- [ ] **7.5** CORS OK pour front Laragon

**Phase 7 terminée :** [ ]

---

## Phase 8 — Seeds & données démo (3–4 h)

**Qui :** Bradley (académique) + Ephraim (paiements).

- [x] **8.1** 1 faculté + 1 programme (L2 Informatique)
- [x] **8.2** 1 semestre actif S2 2025-2026
- [x] **8.3** 3 UE avec crédits
- [x] **8.4** 8–10 étudiants en base
- [x] **8.5** Étudiant démo `ETU-2026-001` / `+243810000001` / Jean Mukendi
- [x] **8.6** Notes → moyenne ~72,5 % pour ETU-2026-001
- [x] **8.7** Paiements : 2 `unpaid`, 1 `partial` (ETU-2026-001), reste `paid`
- [x] **8.8** Compte admin démo documenté
- [x] **8.9** Script seed : `python -m seeds.demo_data` fonctionne

**Phase 8 terminée :** [x]

---

## Phase 9 — Tests & documentation API (4–6 h)

**Qui :** Bradley + Ephraim.

- [ ] **9.1** Descriptions Swagger sur chaque route
- [ ] **9.2** Fichier `backend/tests/api.http`
- [ ] **9.3** Test unitaire : calcul moyenne
- [ ] **9.4** Test unitaire : statut paiement
- [ ] **9.5** Test intégration : agent → ERP + CRM
- [ ] **9.6** `backend/README.md` complet (install, seed, run)

**Phase 9 terminée :** [ ]

---

## Phase 10 — Déploiement Yamify (4–6 h)

**Qui :** Ephraim (lead déploiement) · infra **Yamify**

- [ ] **10.1** `.env` prod (hors Git)
- [ ] **10.2** API déployée sur infra Texaf / Yamify
- [ ] **10.3** MySQL local sur cloud souverain
- [ ] **10.4** HTTPS + reverse proxy
- [ ] **10.5** `GET /agent/health` accessible publiquement
- [ ] **10.6** Aucune donnée académique vers LLM étranger
- [ ] **10.7** Slide « données restent à Kinshasa » prête

**Phase 10 terminée :** [ ]

---

## Planning synthétique 48 h

| Heure | Bradley | Ephraim |
|-------|---------|--------|
| H0–4 | Phase 0 + 1 | Phase 0 + revue schéma |
| H4–12 | Phase 2 ERP + 3 auth | Phase 2 CRM |
| H12–22 | Phase 4 ERP | Phase 5 CRM |
| H22–32 | Phase 7 summary | Phase 6 agent |
| H32–38 | Phase 8 seed académique | Phase 8 seed paiements |
| H38–44 | Phase 9 tests ERP | Phase 9 tests agent |
| H44–48 | Support front | Phase 10 déploiement |

---

## Checklist finale backend

### Fonctionnel

- [ ] Tous les endpoints **P0** → 200 avec seed
- [ ] Agent : 5 phrases de test OK
- [ ] `GET /students/{id}/summary` cohérent
- [ ] `POST /crm/relances` crée une `communication`
- [ ] Swagger `/docs` à jour

### Sécurité & souveraineté

- [ ] Routes admin → JWT obligatoire
- [ ] Agent lecture seule (pas de DELETE)
- [ ] Données hébergées localement (démo)
- [ ] `.env` dans `.gitignore`

### Intégration frontend

- [ ] CORS Laragon OK
- [ ] Joel : `/erp/*` OK
- [ ] Michée : `/crm/*` OK
- [ ] Joel : `/agent/chat` OK (simulateur)

### Pitch

- [ ] Parcours 3 min sans erreur
- [ ] `ETU-2026-001` prêt pour la démo
- [ ] Slide souveraineté validée

---

## Références techniques

### `requirements.txt`

```txt
fastapi>=0.110.0
uvicorn[standard]>=0.27.0
sqlalchemy>=2.0.0
alembic>=1.13.0
pydantic-settings>=2.0.0
python-jose[cryptography]>=3.3.0
bcrypt>=4.1.0
python-multipart>=0.0.9
httpx>=0.27.0
pymysql>=1.1.0
cryptography>=42.0.0
```

### `.env.example`

```env
DATABASE_URL=mysql+pymysql://root:@localhost:3306/smartcampus?charset=utf8mb4
JWT_SECRET=change-me-in-production
AGENT_SERVICE_KEY=agent-demo-key
LLM_ENDPOINT=http://localhost:11434/v1
DEMO_MODE=true
WHATSAPP_TOKEN=
CURRENCY_DEFAULT=CDF
```

### Extrait `backend/tests/api.http`

```http
GET http://localhost:8000/health

POST http://localhost:8000/api/v1/auth/login
Content-Type: application/json

{"email": "admin@smartcampus.local", "password": "demo1234"}

POST http://localhost:8000/api/v1/agent/chat
Content-Type: application/json

{"phone": "+243810000001", "message": "Quelle est ma moyenne?"}
```

---

*Plan backend v1.2 — SmartCampus AgentAI · Bradley & Ephraim · infra Yamify*
