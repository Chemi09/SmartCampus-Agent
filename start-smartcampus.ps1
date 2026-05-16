# SmartCampus AgentAI — démarrage local (Laragon / Windows)
# Usage :
#   .\start-smartcampus.ps1
#   .\start-smartcampus.ps1 -OpenBrowser
#   .\start-smartcampus.ps1 -Seed

param(
    [switch]$OpenBrowser,
    [switch]$Seed,
    [switch]$NoBrowser
)

$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot
$Backend = Join-Path $Root "backend"
$VenvActivate = Join-Path $Backend "venv\Scripts\Activate.ps1"

Write-Host "SmartCampus AgentAI" -ForegroundColor Cyan
Write-Host "Projet : $Root" -ForegroundColor DarkGray

if (-not (Test-Path $VenvActivate)) {
    Write-Host "venv introuvable. Création..." -ForegroundColor Yellow
    Set-Location $Backend
    python -m venv venv
    & $VenvActivate
    pip install -r requirements.txt
    if (-not (Test-Path (Join-Path $Backend ".env"))) {
        Copy-Item (Join-Path $Backend ".env.example") (Join-Path $Backend ".env")
        Write-Host "Fichier .env créé — vérifiez DATABASE_URL (MySQL Laragon)." -ForegroundColor Yellow
    }
} else {
    Set-Location $Backend
    & $VenvActivate
}

if ($Seed) {
    Write-Host "Chargement des données démo..." -ForegroundColor Yellow
    python -m seeds.demo_data
}

$portInUse = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "Port 8000 déjà utilisé — l'API tourne peut-être déjà." -ForegroundColor Yellow
} else {
    Write-Host "Démarrage API FastAPI sur http://localhost:8000 ..." -ForegroundColor Green
    $uvicornArgs = @(
        "-NoExit",
        "-Command",
        "cd '$Backend'; & '$VenvActivate'; uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
    )
    Start-Process powershell -ArgumentList $uvicornArgs | Out-Null
    Start-Sleep -Seconds 4
}

$urls = @(
    "http://localhost:8000/",
    "http://localhost:8000/pages/login.html",
    "http://localhost:8000/docs"
)

Write-Host ""
Write-Host "URLs :" -ForegroundColor Cyan
foreach ($u in $urls) { Write-Host "  $u" }

Write-Host ""
Write-Host "Compte admin démo : admin@smartcampus.local / demo1234" -ForegroundColor DarkGray
Write-Host "Étudiant démo (agent) : +243810000001 — Jean Mukendi" -ForegroundColor DarkGray

if ($OpenBrowser -or (-not $NoBrowser -and -not $portInUse)) {
    Start-Process "http://localhost:8000/pages/login.html"
}

Write-Host ""
Write-Host "Frontend servi par FastAPI (dossier frontend/). Ctrl+C dans la fenêtre uvicorn pour arrêter." -ForegroundColor Green
