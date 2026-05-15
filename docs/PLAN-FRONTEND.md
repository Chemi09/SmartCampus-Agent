# Plan frontend — étape par étape

**Projet :** SmartCampus AgentAI  
**Stack :** HTML5 · CSS3 · JavaScript vanilla · Bootstrap 5 — **pas React**  
**Équipe frontend :** **Joel** (ERP + shell app) · **Michée** (CRM)

**Documents liés :** [PLAN-CONCEPTION.md](./PLAN-CONCEPTION.md) · [PLAN-BACKEND.md](./PLAN-BACKEND.md) · [architecture_et _structure_arboresente.md](./architecture_et%20_structure_arboresente.md)

> **Utilisation :** coche `- [ ]` → `- [x]` au fur et à mesure (clic ou `Alt+Entrée` dans Cursor).

---

## Tableau de bord — avancement global

### Phases

- [ ] **Phase 0** — Cadrage & structure (2–3 h)
- [ ] **Phase 1** — Shell app & assets communs (4–6 h)
- [ ] **Phase 2** — Authentification UI (3–4 h)
- [ ] **Phase 3** — Pages ERP — Joel (8–10 h)
- [ ] **Phase 4** — Pages CRM — Michée (8–10 h)
- [ ] **Phase 5** — Dashboard admin unifié (4–6 h)
- [ ] **Phase 6** — Portail étudiant (3–4 h)
- [ ] **Phase 7** — Simulateur WhatsApp / agent (4–6 h)
- [ ] **Phase 8** — Intégration API & tests (4–6 h)
- [ ] **Phase 9** — Polish UI & démo hackathon (3–4 h)

### Par responsable

**Joel**

- [ ] Structure `frontend/` + `api.js` / `auth.js`
- [ ] Pages ERP (étudiants, notes)
- [ ] Login + dashboard admin (partie académique)
- [ ] Simulateur `demo/chat.html`

**Michée**

- [ ] Pages CRM (paiements, communications)
- [ ] Dashboard impayés + relances
- [ ] Styles cohérents avec le thème campus

### Jalon hackathon

- [ ] Toutes les pages P0 navigables
- [ ] Appels API backend OK (CORS)
- [ ] Parcours démo 3 min fluide
- [ ] Responsive mobile (étudiant sur smartphone)

---

## 1. Vue d’ensemble

### 1.1 Objectif frontend

Interfaces **HTML statiques** enrichies en JavaScript qui consomment l’API FastAPI (`/api/v1`) :

| Zone | Pages | Responsable | API backend |
|------|-------|-------------|-------------|
| Shell | login, layout, `api.js` | Joel | `/auth/*` |
| ERP | étudiants, notes, fiche | Joel | `/erp/*` (Bradley) |
| CRM | paiements, communications | Michée | `/crm/*` (Yamify) |
| Agent | chat démo | Joel | `/agent/chat` (Yamify) |
| Étudiant | mon espace | Joel | ERP + CRM |

### 1.2 Principes

1. **Pas de framework SPA** — fichiers `.html` + modules JS.
2. **Un seul `api.js`** — tous les `fetch` passent par là.
3. **Bootstrap 5** — grille, composants, responsive.
4. **Token JWT** — `localStorage` après login admin.
5. **API base** — `http://localhost:8000/api/v1` (configurable dans `config.js`).

### 1.3 Arborescence cible

```
frontend/
├── index.html
├── assets/css/          # variables.css, main.css, Bootstrap
├── assets/js/
│   ├── config.js        # API_BASE
│   ├── api.js           # fetch wrapper
│   ├── auth.js          # login, logout, guard
│   ├── utils.js         # CDF, dates, toasts
│   ├── admin/           # Joel + Michée
│   └── demo/chat.js     # Joel
├── pages/
│   ├── login.html
│   ├── admin/           # dashboard, students, grades, payments, communications
│   ├── student/         # dashboard étudiant
│   └── demo/chat.html
└── partials/            # header, sidebar, footer
```

---

## Phase 0 — Cadrage & structure (2–3 h)

**Qui :** Joel (lead) + Michée

- [ ] **0.1** Valider les maquettes / liste des pages avec l’équipe
- [ ] **0.2** Créer l’arborescence `frontend/` (dossiers vides + fichiers placeholder)
- [ ] **0.3** Choisir palette couleurs campus (variables CSS)
- [ ] **0.4** Valider URL API avec Bradley (`http://localhost:8000`)
- [ ] **0.5** Convention nommage : un `.html` + un `.js` homonyme par page admin

**Phase 0 terminée :** [ ]

---

## Phase 1 — Shell app & assets communs (4–6 h)

**Qui :** Joel (lead)

### CSS

- [ ] **1.1** `assets/css/variables.css` — couleurs, polices, espacements
- [ ] **1.2** `assets/css/main.css` — layout global, sidebar, cartes KPI
- [ ] **1.3** Bootstrap 5 via CDN (ou fichier local)

### JavaScript commun

- [ ] **1.4** `assets/js/config.js` — `API_BASE = '/api/v1'` ou URL complète
- [ ] **1.5** `assets/js/api.js` — `apiGet`, `apiPost`, headers Bearer
- [ ] **1.6** `assets/js/utils.js` — `formatCDF()`, `formatDate()`, `showToast()`
- [ ] **1.7** `assets/js/auth.js` — squelette (complété phase 2)

### Partials

- [ ] **1.8** `partials/header.html`
- [ ] **1.9** `partials/sidebar-admin.html` — liens ERP + CRM
- [ ] **1.10** `partials/footer.html`
- [ ] **1.11** Fonction `loadPartial()` — fetch + injection dans `#header`, `#sidebar`

### Landing

- [ ] **1.12** `index.html` — liens vers login, docs API, démo

**Phase 1 terminée :** [ ]

---

## Phase 2 — Authentification UI (3–4 h)

**Qui :** Joel (dépend backend phase 3 auth)

- [ ] **2.1** `pages/login.html` — formulaire email / mot de passe
- [ ] **2.2** `auth.js` — `login()`, stockage `access_token` dans `localStorage`
- [ ] **2.3** `auth.js` — `logout()`, redirection `/pages/login.html`
- [ ] **2.4** `auth.js` — `requireAuth()` — redirection si pas de token
- [ ] **2.5** `auth.js` — `getToken()`, header `Authorization: Bearer`
- [ ] **2.6** Test : login admin démo → accès page admin

**Compte démo (backend seed)**

- Email : `admin@smartcampus.local`
- Mot de passe : `demo1234`

**Phase 2 terminée :** [ ]

---

## Phase 3 — Pages ERP — Joel (8–10 h)

**API :** `/api/v1/erp/*` (Bradley)

### Liste étudiants

- [ ] **3.1** `pages/admin/students.html` — tableau Bootstrap
- [ ] **3.2** `assets/js/admin/students.js` — `GET /erp/students`
- [ ] **3.3** Filtre par filière / statut (query params)
- [ ] **3.4** Lien vers fiche détail par `id`

### Fiche étudiant

- [ ] **3.5** `pages/admin/student-detail.html`
- [ ] **3.6** `student-detail.js` — `GET /erp/students/{id}`
- [ ] **3.7** Bloc infos + lien notes + bloc solde CRM (appel `/crm/...` ou summary)

### Notes

- [ ] **3.8** `pages/admin/grades.html`
- [ ] **3.9** `grades.js` — liste notes + moyenne (`GET /erp/students/{id}/grades`)
- [ ] **3.10** Formulaire encodage note — `POST /erp/grades` (P1)

### Tests Joel

- [ ] **3.11** Tableau affiche les étudiants du seed
- [ ] **3.12** Fiche `ETU-2026-001` accessible

**Phase 3 terminée :** [ ]

---

## Phase 4 — Pages CRM — Michée (8–10 h)

**API :** `/api/v1/crm/*` (Yamify)

### Paiements & impayés

- [ ] **4.1** `pages/admin/payments.html` — tableau impayés
- [ ] **4.2** `assets/js/admin/payments.js` — `GET /crm/payments?status=unpaid`
- [ ] **4.3** Badge statut : `paid` / `partial` / `unpaid` / `overdue` (couleurs)
- [ ] **4.4** Bouton « Enregistrer paiement » — `POST /crm/payments/{id}/record` (modal mock Mobile Money)
- [ ] **4.5** Bouton « Relancer » — `POST /crm/relances`

### Communications

- [ ] **4.6** `pages/admin/communications.html`
- [ ] **4.7** `communications.js` — `GET /crm/communications?student_id=`
- [ ] **4.8** Historique messages (canal, date, corps)

### Tests Michée

- [ ] **4.9** Liste impayés ≥ 2 lignes (seed)
- [ ] **4.10** Relance affiche succès + historique mis à jour

**Phase 4 terminée :** [ ]

---

## Phase 5 — Dashboard admin unifié (4–6 h)

**Qui :** Joel (layout) + Michée (bloc finances)

- [ ] **5.1** `pages/admin/dashboard.html`
- [ ] **5.2** Cartes KPI Joel : nb étudiants, semestre actif
- [ ] **5.3** Cartes KPI Michée : nb impayés, montant total dû (CDF)
- [ ] **5.4** Tableau « derniers impayés » (top 5)
- [ ] **5.5** Liens rapides : étudiants, paiements, chat démo
- [ ] **5.6** `dashboard.js` — agrège appels ERP + CRM

**Phase 5 terminée :** [ ]

---

## Phase 6 — Portail étudiant (3–4 h)

**Qui :** Joel

- [ ] **6.1** `pages/student/dashboard.html`
- [ ] **6.2** `assets/js/student/dashboard.js`
- [ ] **6.3** Affichage : mes notes, ma moyenne, mon solde frais
- [ ] **6.4** Login étudiant (ou token démo simplifié hackathon)
- [ ] **6.5** Mise en page mobile-first

**Phase 6 terminée :** [ ]

---

## Phase 7 — Simulateur WhatsApp / agent (4–6 h)

**Qui :** Joel · **API :** `POST /api/v1/agent/chat` (Yamify)

- [ ] **7.1** `pages/demo/chat.html` — interface type messagerie
- [ ] **7.2** `assets/js/demo/chat.js` — envoi message, affichage réponse
- [ ] **7.3** Champ téléphone démo prérempli `+243810000001`
- [ ] **7.4** Bulles utilisateur / agent (styles distincts)
- [ ] **7.5** Suggestions cliquables : « Ma moyenne ? », « Ai-je payé S2 ? »
- [ ] **7.6** Indicateur chargement pendant appel API
- [ ] **7.7** Test des 5 phrases [PLAN-BACKEND §8](./PLAN-BACKEND.md)

**Phase 7 terminée :** [ ]

---

## Phase 8 — Intégration API & tests (4–6 h)

**Qui :** Joel + Michée

- [ ] **8.1** Toutes les pages appellent `api.js` (pas de `fetch` dispersés)
- [ ] **8.2** Gestion erreurs API — toasts 401, 404, 500
- [ ] **8.3** CORS OK avec backend Laragon (`localhost:8000`)
- [ ] **8.4** Test parcours : login → dashboard → impayés → fiche → chat
- [ ] **8.5** Test sans backend : message d’erreur clair
- [ ] **8.6** Vérifier chemins relatifs si ouvert via Laragon (`smartcampus-agent.test`)

**Phase 8 terminée :** [ ]

---

## Phase 9 — Polish UI & démo hackathon (3–4 h)

**Qui :** Joel + Michée

- [ ] **9.1** Logo / favicon `assets/img/`
- [ ] **9.2** Responsive vérifié (mobile, tablette)
- [ ] **9.3** Textes FR cohérents (campus universitaire, CDF)
- [ ] **9.4** Page ou slide « souveraineté » linked depuis footer (optionnel)
- [ ] **9.5** Script démo 3 min répété sans bug
- [ ] **9.6** Screenshots ou vidéo backup si réseau coupe

**Phase 9 terminée :** [ ]

---

## Planning synthétique (48 h hackathon)

| Heure | Joel | Michée |
|-------|------|--------|
| H0–4 | Phase 0 + 1 (shell) | Phase 0 + variables CSS |
| H4–8 | Phase 2 auth + début ERP | Phase 1 partials sidebar |
| H8–18 | Phase 3 ERP complet | Phase 4 CRM complet |
| H18–24 | Phase 5 dashboard + Phase 6 étudiant | Phase 5 bloc finances |
| H24–30 | Phase 7 simulateur chat | Polish CRM + tests |
| H30–36 | Phase 8 intégration | Phase 8 tests |
| H36–48 | Phase 9 polish + script démo | Phase 9 polish + démo |

---

## Parcours démo 3 min (frontend)

| # | Action | Page | Responsable |
|---|--------|------|-------------|
| 1 | Login admin | `login.html` | Joel |
| 2 | Voir KPI + 2 impayés | `dashboard.html` | Joel + Michée |
| 3 | Ouvrir liste paiements, cliquer relance | `payments.html` | Michée |
| 4 | Ouvrir fiche `ETU-2026-001` | `student-detail.html` | Joel |
| 5 | Simulateur : « Ai-je payé mes frais S2 ? » | `demo/chat.html` | Joel |
| 6 | Réponse agent affichée | chat | Yamify (backend) |

---

## Contrat `api.js` (référence)

```javascript
// assets/js/config.js
window.CONFIG = {
  API_BASE: 'http://localhost:8000/api/v1',
};

// assets/js/api.js
async function apiGet(path) {
  const res = await fetch(`${CONFIG.API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
```

---

## Checklist finale frontend

### Fonctionnel

- [ ] Login / logout admin
- [ ] Liste étudiants + fiche + notes
- [ ] Liste impayés + relance + enregistrement paiement mock
- [ ] Dashboard KPIs corrects
- [ ] Simulateur agent 5/5 phrases

### UX

- [ ] Bootstrap cohérent sur toutes les pages
- [ ] Mobile utilisable
- [ ] Toasts erreurs / succès

### Intégration

- [ ] Backend MySQL + API démarrés
- [ ] Pas d’erreur CORS en console
- [ ] Token JWT sur routes protégées

### Pitch

- [ ] Parcours 3 min rodé
- [ ] Onglets pré-ouverts pour la démo (optionnel)

---

## Références

- [PLAN-BACKEND.md](./PLAN-BACKEND.md) — API à consommer
- [PLAN-CONCEPTION.md](./PLAN-CONCEPTION.md) §9 — écrans MVP
- [architecture_et _structure_arboresente.md](./architecture_et%20_structure_arboresente.md)

---

*Plan frontend v1.0 — SmartCampus AgentAI · Joel & Michée · HTML/CSS/JS*
