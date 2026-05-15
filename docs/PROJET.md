# SmartCampus AgentAI

**Hackathon OpenClaw · Yamify (cloud souverain, Kinshasa)**

📐 **Plan de conception :** [PLAN-CONCEPTION.md](./PLAN-CONCEPTION.md) · **Arborescence :** [architecture_et _structure_arboresente.md](./architecture_et%20_structure_arboresente.md)

> Le premier mini-ERP de campus universitaire congolais, avec suivi relationnel étudiants et un agent IA autonome hébergé localement — accessible 24h/24 via WhatsApp/SMS, en français ou en lingala.

---

## Équipe (4 personnes)

| Membre | Couche | Rôle principal |
|--------|--------|----------------|
| **Bradley** *(toi)* | **Backend** | ERP académique — API, modèles, notes, filières, emplois du temps, dossiers |
| **Yamify** | **Backend** | CRM (API) + agent IA — paiements, relances, orchestration OpenClaw, cloud souverain Kinshasa |
| **Michée** | **Frontend** | Pages CRM — tableau de bord impayés, paiements, communications, relances |
| **Joel** | **Frontend** | Pages ERP + shell app — étudiants, notes, login, simulateur WhatsApp, `api.js` |

---

## Concept

Trois visions fusionnées en **un seul produit** :

1. **Moteur interne (ERP)** — toute la lourdeur administrative du campus.
2. **Couche relationnelle (CRM)** — l’expérience et la fidélisation des « clients » du campus (étudiants, tuteurs, entreprises partenaires).
3. **Agent IA local** — rend le système ultra-accessible sans ouvrir l’application : questions en langage naturel, réponses sécurisées depuis les données hébergées à Kinshasa.

**Pivot par rapport au scolaire :** on vise le **campus universitaire** (facultés, filières, semestres, crédits/UE, réinscription) plutôt que l’école primaire/secondaire et les parents comme interlocuteurs principaux.

---

## Architecture fonctionnelle

```
┌─────────────────────────────────────────────────────────────┐
│                    Agent IA (Yamify local)                   │
│     WhatsApp / SMS · FR + Lingala · 24h/24                  │
└──────────────────────────┬──────────────────────────────────┘
                           │ interroge / déclenche
         ┌─────────────────┴─────────────────┐
         ▼                                   ▼
┌─────────────────┐               ┌─────────────────┐
│  ERP (Bradley)  │               │ CRM (Yamify)     │
│  Académique     │◄─────────────►│ Relationnel     │
│  Notes, EDt,    │   données     │ Paiements,      │
│  inscriptions   │   liées       │ relances, msgs  │
└─────────────────┘               └─────────────────┘
         │                                   │
         └───────────────┬───────────────────┘
                         ▼
              Données hébergées localement
              (souveraineté · Kinshasa / Texaf)
```

---

## 1. ERP universitaire — Bradley (backend) · Joel (frontend)

Moteur interne de l’application :

- Inscriptions et réinscriptions (filière, niveau L1–Master).
- Gestion des facultés, promotions, semestres.
- Notes par UE / crédits, relevés, statuts académiques.
- Emplois du temps, examens, salles.
- Dossier étudiant centralisé (matricule, filière, statut : actif, impayé, etc.).

---

## 2. CRM campus — Yamify (backend) · Michée (frontend)

Le campus vit grâce à ses étudiants et à la confiance (paiements, communication, rétention) :

- **Suivi des paiements** — frais d’inscription, tranches, bourses ; relances intelligentes (Mobile Money local).
- **Canal de communication** — historique échanges direction / secrétariat / étudiants (et tuteurs si besoin).
- **Tableau de bord** — impayés, taux de réinscription, satisfaction, alertes.

*Équivalent scolaire « parents » → ici l’**étudiant** est l’utilisateur principal ; parents/tuteurs en option.*

---

## 3. Agent IA autonome — Yamify (backend) · Joel (simulateur frontend)

Différenciateur hackathon (pas un simple chatbot FAQ) :

- Déployé sur le **cloud souverain** (infra OpenClaw / OADC Texaf, Kinshasa) — **backend Yamify**.
- **Assistant WhatsApp/SMS** : l’étudiant envoie par ex. *« Est-ce que j’ai soldé les frais du semestre ? »* ou *« Quelle est ma moyenne en [UE] ? »* — l’agent interroge ERP + CRM et répond de façon sécurisée.
- **Souveraineté** : notes, dossiers, transactions restent stockées localement (mineurs/adultes, données sensibles) — pas de fuite vers l’étranger.
- Capacités attendues par le jury : lecture BDD, relances, traduction / langue locale, tâches en arrière-plan.

---

## Parcours démo recommandé (MVP hackathon)

Un seul fil narratif pour le pitch :

1. Étudiant **impayé** sur le semestre → visible dans le **CRM** (UI Michée · API Yamify).
2. **Relance** automatique ou manuelle (Mobile Money / SMS).
3. L’étudiant pose une question sur **WhatsApp** à l’**agent**.
4. L’**agent** consulte **ERP** (statut académique) + **CRM** (paiement) et répond en FR ou lingala.

*Périmètre démo : 1 faculté, 1 promo, 1 semestre, 2–3 UE — le reste en roadmap.*

---

## Exemples de requêtes agent (démo)

| Langue   | Exemple |
|----------|---------|
| Français | « Ai-je soldé les frais du deuxième semestre ? » |
| Français | « Quelle est ma moyenne en [matière / UE] ? » |
| Français | « Quand ferme l’inscription en Master ? » |
| Lingala  | *(formulations courtes type secrétariat campus)* |

---

## Pourquoi c’est gagnant pour OpenClaw / Yamify

| Critère | Argument |
|---------|----------|
| **Complet** | ERP + CRM, pas seulement un chatbot |
| **Aligné Yamify** | Agent autonome, exécution réelle, cloud souverain |
| **Marché réel** | Kinshasa — gestion campus, impayés, étudiants qui travaillent |
| **Universitaire** | ERP crédible, moins de friction « données mineurs » qu’en scolaire |

---

## Pitch (une phrase)

> *SmartCampus AgentAI : mini-ERP de campus, CRM étudiants et agent IA souverain à Kinshasa qui répond 24h/24 aux étudiants en français ou lingala — sans exporter leurs données.*

---

## Backlog MVP (48h — à affiner en équipe)

### Backend — Bradley
- [ ] Modèles & API ERP : étudiant, filière, semestre, UE, note
- [ ] Endpoints : fiche étudiant, relevé, statut inscription, `by-phone`
- [ ] Seed académique : 5–10 étudiants, 1 promo

### Backend — Yamify
- [ ] Modèles & API CRM : paiement, échéance, relances (mock Mobile Money)
- [ ] Agent IA : 3–5 intents, lecture ERP + CRM
- [ ] Déploiement OpenClaw / cloud local + slide souveraineté

### Frontend — Michée
- [ ] `payments.html` + `communications.html` + JS associé
- [ ] Tableau de bord impayés (consomme API CRM)

### Frontend — Joel
- [ ] Structure `frontend/`, `api.js`, `auth.js`, pages admin ERP
- [ ] `demo/chat.html` (simulateur WhatsApp) + dashboard étudiant

### Transversal
- [ ] Auth / rôles minimal (admin campus, étudiant)
- [ ] Hébergement local + slide « souveraineté »
- [ ] Script démo 3 minutes

---

## Stack & repo

- **Repo / workspace :** `SmartCampus Agent`
- **Frontend (Joel + Michée) :** HTML5, CSS3, JavaScript vanilla, Bootstrap 5 — **pas React**
- **Backend (Bradley + Yamify) :** Python FastAPI · PostgreSQL / SQLite
- **IA / infra (Yamify) :** OpenClaw, LangChain, cloud souverain Kinshasa
- **Structure détaillée :** [architecture_et _structure_arboresente.md](./architecture_et%20_structure_arboresente.md)

---

## Roadmap post-hackathon (optionnel slide finale)

- Multi-facultés, jury, diplômes, stages
- Portail parents / tuteurs
- Alumni léger, partenariats entreprises
- Analytics rétention par filière

---

*Document équipe — OpenClaw hackathon. Dernière mise à jour : mai 2026.*
