# Plan backend — étape par étape

**Projet :** SmartCampus AgentAI  
**Stack :** Python 3.11+ · FastAPI · SQLAlchemy · PostgreSQL / SQLite · JWT  
**Équipe backend :** **Bradley** (ERP) · **Yamify** (CRM + Agent IA)

**Documents liés :** [PLAN-CONCEPTION.md](./PLAN-CONCEPTION.md) · [architecture_et _structure_arboresente.md](./architecture_et%20_structure_arboresente.md) · [PROJET.md](./PROJET.md)

---

## Table des matières

1. [Vue d’ensemble](#1-vue-densemble)
2. [Phase 0 — Cadrage commun (2–4 h)](#phase-0--cadrage-commun-24-h)
3. [Phase 1 — Socle technique (4–6 h)](#phase-1--socle-technique-46-h)
4. [Phase 2 — Base de données (6–8 h)](#phase-2--base-de-données-68-h)
5. [Phase 3 — Authentification & sécurité (3–4 h)](#phase-3--authentification--sécurité-34-h)
6. [Phase 4 — Module ERP — Bradley (10–12 h)](#phase-4--module-erp--bradley-1012-h)
7. [Phase 5 — Module CRM — Yamify (8–10 h)](#phase-5--module-crm--yamify-810-h)
8. [Phase 6 — Module Agent IA — Yamify (10–12 h)](#phase-6--module-agent-ia--yamify-1012-h)
9. [Phase 7 — API agrégée & intégration (4–6 h)](#phase-7--api-agrégée--intégration-46-h)
10. [Phase 8 — Seeds & données démo (3–4 h)](#phase-8--seeds--données-démo-34-h)
11. [Phase 9 — Tests & documentation API (4–6 h)](#phase-9--tests--documentation-api-46-h)
12. [Phase 10 — Déploiement Yamify (4–6 h)](#phase-10--déploiement-yamify-46-h)
13. [Planning synthétique 48 h](#planning-synthétique-48-h)
14. [Checklist finale backend](#checklist-finale-backend)

---

## 1. Vue d’ensemble

### 1.1 Objectif du backend

Fournir une **API REST unique** (`/api/v1`) qui :

- gère les données **académiques** (ERP) ;
- gère les **paiements et communications** (CRM) ;
- expose un **agent IA** qui interroge ERP + CRM sans accès direct à la BDD depuis le front ;
- reste **hébergeable localement** (Yamify / Kinshasa).

### 1.2 Répartition

| Module | Dossier | Responsable | Préfixe API |
|--------|---------|-------------|-------------|
| Socle, auth, summary | `app/core/`, `app/api/` | **Bradley** (lead) + Yamify | `/api/v1` |
| ERP | `app/erp/` | **Bradley** | `/api/v1/erp` |
| CRM | `app/crm/` | **Yamify** | `/api/v1/crm` |
| Agent IA | `app/agent/` | **Yamify** | `/api/v1/agent` |

### 1.3 Architecture cible

```
Client (Frontend Joel/Michée · WhatsApp)
              │
              ▼
       FastAPI main.py
              │
    ┌─────────┼─────────┬─────────────┐
    ▼         ▼         ▼             ▼
  auth      erp       crm          agent
(Bradley) (Bradley) (Yamify)     (Yamify)
    │         │         │             │
    └─────────┴────┬────┴─────────────┘
                   ▼
            SQLAlchemy + PostgreSQL
```

---

## Phase 0 — Cadrage commun (2–4 h)

**Qui :** Bradley + Yamify ensemble  
**But :** éviter les conflits de schéma et d’URLs le jour J1.

### Étapes

| # | Action | Livrable | ✓ |
|---|--------|----------|---|
| 0.1 | Valider ce plan et les routes §6 de [PLAN-CONCEPTION.md](./PLAN-CONCEPTION.md) | Routes figées sur papier / Notion | ☐ |
| 0.2 | Créer le repo `backend/` (structure [architecture](./architecture_et%20_structure_arboresente.md)) | Dossiers vides + `README` backend | ☐ |
| 0.3 | Choisir BDD hackathon : **SQLite** (dev) ou **PostgreSQL** (prod démo) | Note dans `.env.example` | ☐ |
| 0.4 | Définir `student_id` + `phone` comme clés de liaison ERP ↔ CRM ↔ agent | Convention documentée | ☐ |
| 0.5 | Créer canal communication équipe (Discord / WhatsApp) pour bloquants API | — | ☐ |

### Convention de branches Git (recommandé)

```
main
├── backend/socle      (Bradley)
├── backend/erp        (Bradley)
├── backend/crm        (Yamify)
└── backend/agent      (Yamify)
```

---

## Phase 1 — Socle technique (4–6 h)

**Qui :** Bradley (lead), Yamify valide  
**But :** serveur FastAPI qui démarre, répond `200` sur `/health`.

### Étapes

| # | Action | Fichier(s) | ✓ |
|---|--------|------------|---|
| 1.1 | Créer `requirements.txt` | `fastapi`, `uvicorn[standard]`, `sqlalchemy`, `alembic`, `pydantic-settings`, `python-jose`, `passlib[bcrypt]`, `python-multipart`, `httpx` | ☐ |
| 1.2 | Environnement virtuel + installation | `python -m venv venv` | ☐ |
| 1.3 | `app/config.py` — lecture `.env` | `DATABASE_URL`, `JWT_SECRET`, `LLM_ENDPOINT`, `DEMO_MODE` | ☐ |
| 1.4 | `app/database.py` — engine + `SessionLocal` + `get_db` | Test connexion BDD | ☐ |
| 1.5 | `app/main.py` — instance FastAPI | Titre, version, CORS ouverts pour front Laragon | ☐ |
| 1.6 | Monter routes v1 + `/health` | `{"status": "ok"}` | ☐ |
| 1.7 | Servir le frontend en statique (optionnel) | `StaticFiles` → `../frontend` | ☐ |
| 1.8 | `docker-compose.yml` — service `db` + `api` | PostgreSQL si choisi | ☐ |

### `requirements.txt` minimal

```txt
fastapi>=0.110.0
uvicorn[standard]>=0.27.0
sqlalchemy>=2.0.0
alembic>=1.13.0
pydantic-settings>=2.0.0
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4
python-multipart>=0.0.9
httpx>=0.27.0
psycopg2-binary>=2.9.9
```

### Critère de fin de phase

```bash
uvicorn app.main:app --reload
# GET http://localhost:8000/health → 200
# GET http://localhost:8000/docs → Swagger UI
```

---

## Phase 2 — Base de données (6–8 h)

**Qui :** Bradley (modèles académiques) + Yamify (modèles CRM) — **review croisée obligatoire**

### Étapes

| # | Action | Responsable | ✓ |
|---|--------|-------------|---|
| 2.1 | `app/models/base.py` — `Base` declarative SQLAlchemy | Bradley | ☐ |
| 2.2 | Modèles ERP : `faculty`, `program`, `student`, `semester`, `course`, `enrollment`, `grade` | Bradley | ☐ |
| 2.3 | Modèles CRM : `fee_type`, `payment`, `payment_transaction`, `communication` | Yamify | ☐ |
| 2.4 | Clés étrangères : `payment.student_id` → `student.id` | Les deux | ☐ |
| 2.5 | Index uniques : `student.matricule`, `student.phone` | Bradley | ☐ |
| 2.6 | Alembic init + migration `001_initial_schema.py` | Bradley | ☐ |
| 2.7 | `alembic upgrade head` sur SQLite local | Les deux | ☐ |

### Détail tables ERP (Bradley)

```python
# Champs critiques student
matricule: str   # unique, ex. ETU-2026-001
phone: str       # unique, ex. +243810000001
program_id: FK
status: str      # active | suspended | graduated
```

### Détail tables CRM (Yamify)

```python
# payment
amount: Decimal
paid_amount: Decimal
status: str      # paid | partial | unpaid | overdue
due_date: date
student_id: FK
semester_id: FK
```

### Règle métier `payment.status` (à coder en service)

| Condition | Status |
|-----------|--------|
| `paid_amount == 0` | `unpaid` |
| `0 < paid_amount < amount` | `partial` |
| `paid_amount >= amount` | `paid` |
| `due_date < today` et non `paid` | `overdue` |

### Critère de fin de phase

- Toutes les tables créées sans erreur de migration.
- Diagramme ER [PLAN-CONCEPTION §4](./PLAN-CONCEPTION.md) respecté.

---

## Phase 3 — Authentification & sécurité (3–4 h)

**Qui :** Bradley (implémentation), Yamify (clé `agent_service`)

### Étapes

| # | Action | Fichier | ✓ |
|---|--------|---------|---|
| 3.1 | `app/core/security.py` — hash mot de passe, création JWT | ☐ |
| 3.2 | `app/schemas/auth.py` — `LoginRequest`, `TokenResponse` | ☐ |
| 3.3 | `app/api/v1/auth.py` — `POST /auth/login` | ☐ |
| 3.4 | `app/dependencies.py` — `get_current_user`, rôles | ☐ |
| 3.5 | Rôles : `admin`, `student`, `agent_service` | ☐ |
| 3.6 | Protéger routes ERP/CRM (admin) ; agent utilise clé service | ☐ |
| 3.7 | `app/core/exceptions.py` — handlers HTTP 401, 403, 404 | ☐ |

### Endpoints auth

| Méthode | Route | Body | Réponse |
|---------|-------|------|---------|
| POST | `/api/v1/auth/login` | `{ "email", "password" }` | `{ "access_token", "token_type" }` |
| GET | `/api/v1/auth/me` | Bearer JWT | profil utilisateur |

### Critère de fin de phase

- Login admin démo fonctionne.
- Route ERP sans token → `401`.

---

## Phase 4 — Module ERP — Bradley (10–12 h)

**Dossier :** `app/erp/`  
**Préfixe :** `/api/v1/erp`

### Étapes

| # | Action | ✓ |
|---|--------|---|
| 4.1 | `schemas/` Pydantic : `StudentCreate`, `StudentRead`, `GradeCreate`, `GradeRead`, `GradesSummary` | ☐ |
| 4.2 | `repositories.py` — requêtes SQLAlchemy (liste, by id, by phone) | ☐ |
| 4.3 | `services.py` — calcul **moyenne pondérée par crédits** | ☐ |
| 4.4 | `routes.py` — enregistrer le router | ☐ |

### Endpoints à implémenter (ordre recommandé)

| Ordre | Méthode | Route | Priorité |
|-------|---------|-------|----------|
| 1 | GET | `/erp/semesters/active` | P0 |
| 2 | GET | `/erp/students` | P0 |
| 3 | GET | `/erp/students/{id}` | P0 |
| 4 | GET | `/erp/students/by-phone/{phone}` | P0 — **agent** |
| 5 | GET | `/erp/students/{id}/grades` | P0 — **agent** |
| 6 | POST | `/erp/students` | P1 |
| 7 | POST | `/erp/grades` | P1 |
| 8 | PUT | `/erp/students/{id}` | P2 |

### Logique moyenne (service)

```
moyenne = Σ(score × credits) / Σ(credits)
```

Uniquement sur les `grades` du `semester_id` demandé (ou semestre actif par défaut).

### Tests manuels (Postman / Swagger)

- [ ] Liste étudiants filtrée par `program_id`
- [ ] `by-phone` retourne l’étudiant démo `ETU-2026-001`
- [ ] Grades + `average` cohérents avec seed

### Critère de fin de phase

Yamify peut appeler `by-phone` et `grades` depuis l’agent sans erreur.

---

## Phase 5 — Module CRM — Yamify (8–10 h)

**Dossier :** `app/crm/`  
**Préfixe :** `/api/v1/crm`

### Étapes

| # | Action | ✓ |
|---|--------|---|
| 5.1 | Schemas : `PaymentRead`, `BalanceRead`, `PaymentRecord`, `CommunicationRead` | ☐ |
| 5.2 | `services.py` — calcul statut, solde restant, logique `overdue` | ☐ |
| 5.3 | `services.py` — `record_payment` (mock Mobile Money) | ☐ |
| 5.4 | `services.py` — `send_relance` (écrit dans `communications`) | ☐ |
| 5.5 | `routes.py` — tous les endpoints CRM | ☐ |

### Endpoints à implémenter

| Ordre | Méthode | Route | Priorité |
|-------|---------|-------|----------|
| 1 | GET | `/crm/students/{id}/balance` | P0 — **agent** |
| 2 | GET | `/crm/payments?status=unpaid` | P0 — **frontend Michée** |
| 3 | GET | `/crm/students/{id}/payments` | P1 |
| 4 | POST | `/crm/payments/{id}/record` | P1 — démo encaissement |
| 5 | POST | `/crm/relances` | P1 — démo relance |
| 6 | GET | `/crm/communications` | P2 |

### Body exemple — enregistrer paiement

```json
POST /api/v1/crm/payments/3/record
{
  "amount": 300000,
  "method": "mobile_money",
  "reference": "MM-2026-DEMO-001"
}
```

### Body exemple — relance

```json
POST /api/v1/crm/relances
{
  "student_id": 1,
  "channel": "sms",
  "template": "fee_reminder_s2"
}
```

### Critère de fin de phase

- Dashboard frontend peut lister les impayés.
- Agent peut lire le solde exact d’un étudiant.

---

## Phase 6 — Module Agent IA — Yamify (10–12 h)

**Dossier :** `app/agent/`  
**Préfixe :** `/api/v1/agent`

### Étapes

| # | Action | ✓ |
|---|--------|---|
| 6.1 | `prompts/system.txt` — règles FR/Lingala, pas d’hallucination | ☐ |
| 6.2 | `intents.py` — classifier (mots-clés MVP, LLM en option) | ☐ |
| 6.3 | `handlers/grades.py` — appelle `GET /erp/students/by-phone` + `grades` | ☐ |
| 6.4 | `handlers/payment.py` — appelle `GET /crm/.../balance` | ☐ |
| 6.5 | `handlers/enrollment.py` — dates en config ou seed | ☐ |
| 6.6 | `handlers/fallback.py` — message d’aide + exemples | ☐ |
| 6.7 | `orchestrator.py` — pipeline : classify → handler → format réponse | ☐ |
| 6.8 | `routes.py` — `POST /agent/chat`, `POST /agent/webhook/whatsapp` | ☐ |
| 6.9 | `GET /agent/health` — statut LLM + DB | ☐ |
| 6.10 | Connexion OpenClaw / LLM souverain (ou mock si `DEMO_MODE=true`) | ☐ |

### Intents MVP

| Intent | Mots-clés (ex.) | Handler | API interne |
|--------|-----------------|---------|-------------|
| `grades.average` | moyenne, note, score | `handlers/grades.py` | ERP grades |
| `payment.status` | payé, frais, solde, napesaki | `handlers/payment.py` | CRM balance |
| `enrollment.dates` | inscription, master, date | `handlers/enrollment.py` | config |
| `student.status` | dossier, actif, suspendu | `handlers/grades.py` | ERP student |
| `unknown` | — | `handlers/fallback.py` | — |

### Contrat `POST /agent/chat`

**Request :**

```json
{
  "phone": "+243810000001",
  "message": "Napesaki frais ya semestre?"
}
```

**Response :**

```json
{
  "reply": "Ozali kaka na 300 000 CDF ya kolongola na frais S2.",
  "intent": "payment.status",
  "language": "fr",
  "sources": ["crm.balance"]
}
```

### Règles agent (non négociables)

1. **Jamais** inventer un montant ou une note — toujours lire l’API.
2. Si `phone` inconnu → message « contactez le secrétariat ».
3. Logs sans données sensibles en clair.

### Critère de fin de phase

- Simulateur frontend (Joel) envoie un message → réponse correcte en < 5 s.
- 5 phrases de test démo passent (voir §8.3).

---

## Phase 7 — API agrégée & intégration (4–6 h)

**Qui :** Bradley (`summary`) + Yamify (tests agent)

### Étapes

| # | Action | ✓ |
|---|--------|---|
| 7.1 | `app/api/v1/summary.py` — `GET /students/{id}/summary` | ☐ |
| 7.2 | Agréger : ERP (student + average) + CRM (balance) | ☐ |
| 7.3 | `app/api/v1/router.py` — inclure erp, crm, agent, auth, summary | ☐ |
| 7.4 | Test bout-en-bout : summary = données cohérentes avec ERP + CRM séparés | ☐ |
| 7.5 | CORS + headers pour front Laragon (`localhost`) | ☐ |

### Réponse `summary` attendue

```json
{
  "matricule": "ETU-2026-001",
  "name": "Jean Mukendi",
  "academic_status": "active",
  "semester_average": 72.5,
  "payment_status": "partial",
  "amount_remaining": 300000,
  "currency": "CDF"
}
```

---

## Phase 8 — Seeds & données démo (3–4 h)

**Qui :** Bradley (partie académique) + Yamify (paiements) — fichier `seeds/demo_data.py` partagé

### Étapes

| # | Action | ✓ |
|---|--------|---|
| 8.1 | 1 faculté, 1 programme (L2 Informatique), 1 semestre actif S2 | ☐ |
| 8.2 | 3 cours (UE) avec crédits | ☐ |
| 8.3 | 8–10 étudiants dont **ETU-2026-001** (impayé partiel) | ☐ |
| 8.4 | Notes pour chaque étudiant actif (moyenne calculable) | ☐ |
| 8.5 | 1 paiement par étudiant : 2 `unpaid`, 1 `partial`, reste `paid` | ☐ |
| 8.6 | Compte admin démo + token documenté dans README | ☐ |
| 8.7 | Commande : `python -m seeds.demo_data` ou `alembic` + seed | ☐ |

### Scénario démo jury (données)

| Élément | Valeur |
|---------|--------|
| Étudiant star | `ETU-2026-001`, Jean Mukendi, `+243810000001` |
| Moyenne | ~72,5 % |
| Paiement | 200 000 / 500 000 CDF → `partial` |
| Message test | « Ai-je soldé les frais du semestre ? » |

### Phrases de test agent (§6.3)

| # | Message | Intent attendu |
|---|---------|----------------|
| 1 | Quelle est ma moyenne du semestre ? | `grades.average` |
| 2 | Ai-je payé mes frais S2 ? | `payment.status` |
| 3 | Quand ferme l'inscription en Master ? | `enrollment.dates` |
| 4 | Mon dossier est-il actif ? | `student.status` |
| 5 | Bonjour | `unknown` / fallback |

---

## Phase 9 — Tests & documentation API (4–6 h)

**Qui :** Bradley + Yamify (moitié chacun)

### Étapes

| # | Action | ✓ |
|---|--------|---|
| 9.1 | Swagger auto (`/docs`) — descriptions sur chaque route | ☐ |
| 9.2 | Collection Postman / fichier `backend/tests/api.http` | ☐ |
| 9.3 | Tests unitaires services (moyenne, statut paiement) | ☐ |
| 9.4 | Test intégration : agent → ERP + CRM | ☐ |
| 9.5 | README backend : install, `.env`, lancer seed, lancer API | ☐ |

### Fichier `backend/tests/api.http` (extraits)

```http
### Health
GET http://localhost:8000/health

### Login
POST http://localhost:8000/api/v1/auth/login
Content-Type: application/json

{"email": "admin@smartcampus.local", "password": "demo1234"}

### Grades (agent)
GET http://localhost:8000/api/v1/erp/students/by-phone/%2B243810000001
Authorization: Bearer {{token}}

### Agent chat
POST http://localhost:8000/api/v1/agent/chat
Content-Type: application/json

{"phone": "+243810000001", "message": "Quelle est ma moyenne?"}
```

---

## Phase 10 — Déploiement Yamify (4–6 h)

**Qui :** Yamify (lead), Bradley (support config BDD)

### Étapes

| # | Action | ✓ |
|---|--------|---|
| 10.1 | Variables prod dans `.env` (pas de secrets dans Git) | ☐ |
| 10.2 | Docker image API ou déploiement direct sur infra Texaf | ☐ |
| 10.3 | PostgreSQL local sur le cloud souverain | ☐ |
| 10.4 | HTTPS + reverse proxy (nginx / traefik) | ☐ |
| 10.5 | `GET /agent/health` accessible depuis l’extérieur | ☐ |
| 10.6 | Vérifier : **aucune** donnée académique vers API LLM étrangère | ☐ |
| 10.7 | Slide pitch : schéma « données restent à Kinshasa » | ☐ |

### Variables `.env.example`

```env
DATABASE_URL=sqlite:///./smartcampus.db
# DATABASE_URL=postgresql://user:pass@localhost:5432/smartcampus
JWT_SECRET=change-me-in-production
AGENT_SERVICE_KEY=agent-demo-key
LLM_ENDPOINT=http://localhost:11434/v1
DEMO_MODE=true
WHATSAPP_TOKEN=
CURRENCY_DEFAULT=CDF
```

---

## Planning synthétique 48 h

| Heure | Bradley | Yamify |
|-------|---------|--------|
| **H0–4** | Phase 0 + 1 (socle) | Phase 0 + revue schéma |
| **H4–12** | Phase 2 (modèles ERP) + 3 (auth) | Phase 2 (modèles CRM) |
| **H12–22** | Phase 4 (API ERP complète) | Phase 5 (API CRM) |
| **H22–32** | Phase 7 (summary) + aide tests | Phase 6 (agent IA) |
| **H32–38** | Phase 8 (seed académique) | Phase 8 (seed paiements) + 6 fin |
| **H38–44** | Phase 9 (tests ERP) | Phase 9 (tests agent) + 10 |
| **H44–48** | Buffer bugs + support front | Déploiement + health checks |

```mermaid
gantt
    title Backend SmartCampus — 48h
    dateFormat HH
    axisFormat %Hh

    section Socle
    Phase 0-1 Bradley     :a1, 0, 6
    Phase 2-3 Auth        :a2, 6, 12

    section ERP
    Phase 4 API ERP       :b1, 12, 22

    section CRM Agent
    Phase 2 CRM models    :c1, 4, 10
    Phase 5 API CRM       :c2, 10, 18
    Phase 6 Agent IA      :c3, 18, 32

    section Intégration
    Phase 7-8 Summary Seed :d1, 22, 38
    Phase 9-10 Tests Deploy :d2, 38, 48
```

---

## Checklist finale backend

### Fonctionnel

- [ ] Tous les endpoints P0 répondent `200` avec seed
- [ ] Agent répond correctement aux 5 phrases de test
- [ ] `summary` cohérent avec ERP + CRM
- [ ] Relance CRM crée une ligne `communications`
- [ ] Swagger à jour sur `/docs`

### Sécurité & souveraineté

- [ ] Routes admin protégées JWT
- [ ] Agent en lecture seule (pas de DELETE)
- [ ] Données hébergées localement pour la démo
- [ ] `.env` hors Git

### Intégration frontend (Joel + Michée)

- [ ] CORS OK depuis Laragon
- [ ] Joel : pages ERP consomment `/erp/*`
- [ ] Michée : pages CRM consomment `/crm/*`
- [ ] Simulateur chat consomme `/agent/chat`

### Pitch hackathon

- [ ] Parcours 3 min rejouable sans erreur
- [ ] Étudiant `ETU-2026-001` + impayé démo prêts
- [ ] Slide souveraineté données validée par Yamify

---

## Annexes

### A. Ordre de merge Git recommandé

1. `backend/socle` → `main`
2. `backend/erp` → `main`
3. `backend/crm` → `main`
4. `backend/agent` → `main`

### B. Contacts / escalade

| Sujet | Référent |
|-------|----------|
| Schéma BDD, ERP, auth | Bradley |
| CRM, agent, déploiement | Yamify |
| Consommation API front | Joel (ERP UI), Michée (CRM UI) |

### C. Liens

- [PLAN-CONCEPTION.md](./PLAN-CONCEPTION.md) — modèle de données, contrats API
- [architecture_et _structure_arboresente.md](./architecture_et%20_structure_arboresente.md) — arborescence fichiers
- [PROJET.md](./PROJET.md) — vision & backlog équipe

---

*Plan backend v1.0 — SmartCampus AgentAI · Bradley & Yamify · OpenClaw Hackathon*
