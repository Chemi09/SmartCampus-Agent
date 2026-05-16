# SmartCampus — déploiement production local (Docker + HTTPS)
# Équivalent phase 10 Yamify / Kinshasa (stack conteneurisée)

param(
    [switch]$Build,
    [switch]$Down,
    [switch]$Logs
)

$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot
$EnvFile = Join-Path $Root "backend\.env.production"
$EnvExample = Join-Path $Root "backend\.env.production.example"

Set-Location $Root

if ($Down) {
    docker compose -f docker-compose.prod.yml down
    exit 0
}

if ($Logs) {
    docker compose -f docker-compose.prod.yml logs -f api nginx
    exit 0
}

if (-not (Test-Path $EnvFile)) {
    Copy-Item $EnvExample $EnvFile
    Write-Host "Créé backend/.env.production — modifiez JWT_SECRET avant prod réelle." -ForegroundColor Yellow
}

& (Join-Path $Root "deploy\generate-certs.ps1")

$composeArgs = @("-f", "docker-compose.prod.yml", "up", "-d")
if ($Build) { $composeArgs += "--build" }

docker compose @composeArgs

Write-Host ""
Write-Host "SmartCampus production (local)" -ForegroundColor Cyan
Write-Host "  https://localhost/          (front + API)" -ForegroundColor White
Write-Host "  https://localhost/health" -ForegroundColor White
Write-Host "  https://localhost/docs      (Swagger)" -ForegroundColor White
Write-Host "  https://localhost/api/v1/agent/health" -ForegroundColor White
Write-Host ""
Write-Host "Admin : admin@smartcampus.local / demo1234" -ForegroundColor DarkGray
Write-Host "Logs  : .\deploy-prod.ps1 -Logs" -ForegroundColor DarkGray
