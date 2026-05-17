# Lancement du projet — SmartCampus AgentAI

Guide des commandes pour installer, configurer et démarrer l’application en local (Windows + Laragon).

---

## Prérequis

| Outil | Version | Rôle |
|-------|---------|------|
| **Laragon** | récent | MySQL + optionnel PHP |
| **Python** | 3.11+ | API FastAPI |
| **MySQL** | 8.x (Laragon) | Base `smartcampus` |
| **PowerShell** | 5.1+ | Scripts de démarrage |

1. Démarrer **MySQL** dans Laragon.
2. Créer la base **`smartcampus`** (HeidiSQL, phpMyAdmin ou script ci-dessous).

---

## Démarrage le plus simple (recommandé)

À la **racine du projet**.

### Double-clic (Windows) — fichiers `.bat`

| Fichier | Action |
|---------|--------|
| **`start-smartcampus.bat`** | Démarre le site + ouvre le navigateur |
| **`start-smartcampus-setup.bat`** | Première installation complète |
| `start-smartcampus.bat seed` | Recharge les données démo |
| `start-smartcampus.bat stop` | Arrête le serveur (port 8000) |
| `start-smartcampus.bat nobrowser` | Démarre sans ouvrir le navigateur |

### PowerShell

```powershell
cd "c:\laragon\www\SmartCampus Agent"

# Première fois : installation complète + données démo
.\start-smartcampus.ps1 -Setup

# Ensuite, à chaque session
.\start-smartcampus.ps1

# Ouvrir le navigateur sur la page de connexion
.\start-smartcampus.ps1 -OpenBrowser

# Recharger les données de démonstration
.\start-smartcampus.ps1 -Seed
```

Le script :

- active le `venv` Python dans `backend/`
- lance **uvicorn** sur le port **8000**
- sert le **frontend** et l’**API** au même endroit
- ouvre une **nouvelle fenêtre** PowerShell pour le serveur (la fenêtre courante reste libre)

> **Important :** utilisez **http://localhost:8000** (pas `file://`). Le frontend appelle l’API sur le même hôte.

---

## URLs après démarrage

| Page | URL |
|------|-----|
| Accueil | http://localhost:8000/ |
| Connexion admin | http://localhost:8000/pages/login.html |
| Dashboard admin | http://localhost:8000/pages/admin/dashboard.html |
| Paiements / relances | http://localhost:8000/pages/admin/payments.html |
| Fiche étudiant démo | http://localhost:8000/pages/admin/student-detail.html?id=1 |
| Simulateur agent | http://localhost:8000/pages/demo/chat.html |
| Espace étudiant | http://localhost:8000/pages/student/dashboard.html |
| Santé API | http://localhost:8000/health |
| Swagger | http://localhost:8000/docs |
| API v1 | http://localhost:8000/api/v1 |

---

## Comptes de démonstration

| Rôle | Identifiant | Mot de passe / info |
|------|-------------|---------------------|
| Admin | `admin@smartcampus.local` | `demo1234` |
| Étudiant (agent / portail) | Téléphone `+243810000001` | Jean Mukendi — `ETU-2026-001` |

---

## Installation manuelle (première fois)

### 1. Backend — environnement Python

```powershell
cd "c:\laragon\www\SmartCampus Agent\backend"

python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

Éditer `backend\.env` — exemple Laragon (root sans mot de passe) :

```env
DATABASE_URL=mysql+pymysql://root:@localhost:3306/smartcampus?charset=utf8mb4
JWT_SECRET=change-me-in-production
AGENT_SERVICE_KEY=agent-demo-key
LLM_ENDPOINT=http://localhost:11434/v1
DEMO_MODE=true
CURRENCY_DEFAULT=CDF
```

### 2. Base de données

```powershell
# Toujours avec venv activé, depuis backend/
python -m scripts.init_database
alembic upgrade head
python -m scripts.seed_admin
python -m seeds.demo_data
```

Recréer les données démo :

```powershell
python -m seeds.demo_data --reset
```

### 3. Lancer le serveur

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## Commandes utiles

### Tests backend

```powershell
cd backend
.\venv\Scripts\Activate.ps1
pytest -v
```

### Vérifier la santé de l’API

```powershell
Invoke-RestMethod http://localhost:8000/health
```

### Arrêter le serveur

Fermer la fenêtre PowerShell où tourne **uvicorn**, ou :

```powershell
# Libérer le port 8000 si bloqué
Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue |
  ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
```

### Migrations Alembic

```powershell
cd backend
.\venv\Scripts\Activate.ps1
alembic current
alembic upgrade head
```

### Déploiement Docker (production locale)

```powershell
cd "c:\laragon\www\SmartCampus Agent"
.\deploy\generate-certs.ps1
copy backend\.env.production.example backend\.env.production
.\deploy-prod.ps1 -Build
```

Voir aussi [backend/README.md](../backend/README.md) (section déploiement).

---

## Dépannage

| Problème | Solution |
|----------|----------|
| `database: disconnected` sur `/health` | MySQL Laragon démarré ? Base `smartcampus` créée ? `DATABASE_URL` dans `.env` |
| Page vide / données mock | API non démarrée — lancer `.\start-smartcampus.ps1` |
| Erreur CORS | Ouvrir le site via **http://localhost:8000**, pas en fichier local |
| Port 8000 occupé | Arrêter l’ancien uvicorn ou changer le port dans la commande |
| `venv` introuvable | `.\start-smartcampus.ps1 -Setup` ou installation manuelle ci-dessus |
| Agent ne répond pas | `DEMO_MODE=true` dans `.env` (réponses sans LLM externe) |

---

## Fichiers liés

| Fichier | Description |
|---------|-------------|
| [start-smartcampus.bat](../start-smartcampus.bat) | Lancement double-clic / CMD |
| [start-smartcampus-setup.bat](../start-smartcampus-setup.bat) | Installation première fois |
| [start-smartcampus.ps1](../start-smartcampus.ps1) | Script PowerShell (moteur du .bat) |
| [backend/README.md](../backend/README.md) | API, CRM, agent, déploiement |
| [PLAN-BACKEND.md](./PLAN-BACKEND.md) | Plan technique backend |
| [PLAN-FRONTEND.md](./PLAN-FRONTEND.md) | Plan technique frontend |

---

*SmartCampus AgentAI — Laragon · FastAPI · MySQL*
