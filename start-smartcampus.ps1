# SmartCampus AgentAI — démarrage local (Laragon / Windows)
#
# Usage :
#   .\start-smartcampus.ps1              # Démarre l'API + affiche les URLs
#   .\start-smartcampus.ps1 -OpenBrowser # Ouvre la page de connexion
#   .\start-smartcampus.ps1 -Setup       # Première install (venv, BDD, seeds)
#   .\start-smartcampus.ps1 -Seed        # Recharge les données démo
#   .\start-smartcampus.ps1 -Stop        # Arrête le processus sur le port 8000

param(
    [switch]$OpenBrowser,
    [switch]$Setup,
    [switch]$Seed,
    [switch]$NoBrowser,
    [switch]$Stop
)

$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot
$Backend = Join-Path $Root "backend"
$VenvActivate = Join-Path $Backend "venv\Scripts\Activate.ps1"
$EnvFile = Join-Path $Backend ".env"
$EnvExample = Join-Path $Backend ".env.example"
$BaseUrl = "http://localhost:8000"

function Write-Title($text) {
    Write-Host ""
    Write-Host $text -ForegroundColor Cyan
}

function Test-ApiHealth {
    param([int]$TimeoutSec = 2)
    try {
        $r = Invoke-RestMethod -Uri "$BaseUrl/health" -TimeoutSec $TimeoutSec
        return ($r.status -eq "ok")
    } catch {
        return $false
    }
}

function Wait-ForApi {
    param([int]$MaxSeconds = 45)
    Write-Host "Attente de l'API" -NoNewline
    for ($i = 0; $i -lt $MaxSeconds; $i++) {
        if (Test-ApiHealth) {
            Write-Host " OK" -ForegroundColor Green
            return $true
        }
        Start-Sleep -Seconds 1
        Write-Host "." -NoNewline
    }
    Write-Host " timeout" -ForegroundColor Yellow
    return $false
}

function Stop-Port8000 {
    $conns = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
    if (-not $conns) {
        Write-Host "Aucun service sur le port 8000." -ForegroundColor DarkGray
        return
    }
    $conns | ForEach-Object {
        $procId = $_.OwningProcess
        if ($procId) {
            Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
            Write-Host "Processus $procId arrêté (port 8000)." -ForegroundColor Yellow
        }
    }
}

Write-Title "SmartCampus AgentAI"
Write-Host "Racine : $Root" -ForegroundColor DarkGray

if ($Stop) {
    Stop-Port8000
    exit 0
}

# --- Installation / Setup ---
if (-not (Test-Path $VenvActivate)) {
    Write-Host "Création de l'environnement virtuel Python..." -ForegroundColor Yellow
    Set-Location $Backend
    python -m venv venv
    & $VenvActivate
    pip install --upgrade pip
    pip install -r requirements.txt
    Set-Location $Root
}

Set-Location $Backend
& $VenvActivate

if (-not (Test-Path $EnvFile)) {
    if (Test-Path $EnvExample) {
        Copy-Item $EnvExample $EnvFile
        Write-Host "Fichier .env créé depuis .env.example" -ForegroundColor Yellow
        Write-Host "Vérifiez DATABASE_URL (MySQL Laragon, base smartcampus)." -ForegroundColor Yellow
    }
}

if ($Setup) {
    Write-Title "Installation complète (base + migrations + seeds)"
    Write-Host "Assurez-vous que MySQL Laragon est démarré." -ForegroundColor DarkGray
    python -m scripts.init_database
    alembic upgrade head
    python -m scripts.seed_admin
    python -m seeds.demo_data
    Write-Host "Installation terminée." -ForegroundColor Green
}

if ($Seed) {
    Write-Host "Chargement des données démo..." -ForegroundColor Yellow
    python -m seeds.demo_data
}

Set-Location $Root

# --- Démarrage uvicorn ---
$alreadyUp = Test-ApiHealth -TimeoutSec 1

if ($alreadyUp) {
    Write-Host "L'API répond déjà sur $BaseUrl" -ForegroundColor Green
} else {
    $portInUse = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
    if ($portInUse) {
        Write-Host "Port 8000 occupé mais /health ne répond pas — vérifiez le processus." -ForegroundColor Yellow
    } else {
        Write-Host "Démarrage FastAPI (uvicorn) sur $BaseUrl ..." -ForegroundColor Green
        $uvicornCmd = @"
Set-Location '$Backend'
& '$VenvActivate'
Write-Host 'SmartCampus API — Ctrl+C pour arrêter' -ForegroundColor Cyan
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
"@
        Start-Process powershell -ArgumentList @("-NoExit", "-Command", $uvicornCmd) | Out-Null
        Wait-ForApi | Out-Null
    }
}

# --- Récapitulatif ---
Write-Title "URLs"
@(
    "$BaseUrl/",
    "$BaseUrl/pages/login.html",
    "$BaseUrl/pages/admin/dashboard.html",
    "$BaseUrl/pages/admin/payments.html",
    "$BaseUrl/pages/demo/chat.html",
    "$BaseUrl/pages/student/dashboard.html",
    "$BaseUrl/docs",
    "$BaseUrl/health"
) | ForEach-Object { Write-Host "  $_" }

Write-Title "Comptes démo"
Write-Host "  Admin    : admin@smartcampus.local / demo1234" -ForegroundColor DarkGray
Write-Host "  Étudiant : +243810000001 (Jean Mukendi, ETU-2026-001)" -ForegroundColor DarkGray

if (-not $Setup) {
    Write-Host ""
    Write-Host "Première installation ?  .\start-smartcampus.ps1 -Setup" -ForegroundColor DarkGray
}

$open = $OpenBrowser -or (-not $NoBrowser -and -not $alreadyUp -and (Test-ApiHealth -TimeoutSec 1))
if ($open) {
    Start-Process "$BaseUrl/pages/login.html"
}

Write-Host ""
Write-Host "Frontend + API servis par uvicorn (dossier frontend/)." -ForegroundColor Green
Write-Host "Arrêt : fermer la fenêtre uvicorn ou  .\start-smartcampus.ps1 -Stop" -ForegroundColor DarkGray
