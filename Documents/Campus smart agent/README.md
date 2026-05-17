# Campus Smart Agent (OpenClaw / NestJS)

Module **Agent IA** importé depuis la branche `feat/orm`.

## Contenu

| Fichier | Rôle |
|---------|------|
| `src/agent.ts` | Agent principal |
| `src/agent-handler.ts` | Gestion des requêtes |
| `src/assistant.service.ts` | Service assistant |
| `src/assistant.controller.ts` | Contrôleur HTTP |
| `src/openclaw-tools.ts` | Outils OpenClaw |
| `src/app.module.ts` | Module NestJS |

## Configuration

```bash
copy .env.example .env
# Éditer GEMINI_API_KEY dans .env
```

Le fichier `.env` est ignoré par Git (ne jamais le committer).

## Lien avec SmartCampus

L’API FastAPI du projet expose déjà un agent dans `backend/app/agent/` (parcours démo hackathon).  
Ce dossier est la **version TypeScript / OpenClaw** de l’équipe — à intégrer ou à faire tourner en service séparé selon le besoin.
