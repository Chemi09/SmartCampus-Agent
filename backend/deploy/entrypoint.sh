#!/bin/sh
set -e

echo "[SmartCampus] Migrations Alembic..."
alembic upgrade head

echo "[SmartCampus] Compte admin..."
python -m scripts.seed_admin

if [ "${SEED_DEMO:-false}" = "true" ]; then
  echo "[SmartCampus] Données démo..."
  python -m seeds.demo_data || true
fi

echo "[SmartCampus] Démarrage API (port 8000)..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 1
