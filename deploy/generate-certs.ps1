# Certificats auto-signés pour HTTPS local / démo (phase 10)
# Génère deploy/certs/fullchain.pem et privkey.pem

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$CertDir = Join-Path $Root "deploy\certs"

if (-not (Test-Path $CertDir)) {
    New-Item -ItemType Directory -Path $CertDir | Out-Null
}

$cert = Join-Path $CertDir "fullchain.pem"
$key = Join-Path $CertDir "privkey.pem"

if ((Test-Path $cert) -and (Test-Path $key)) {
    Write-Host "Certificats déjà présents dans deploy/certs/" -ForegroundColor Yellow
    exit 0
}

Write-Host "Génération certificat auto-signé (OpenSSL)..." -ForegroundColor Cyan

$openssl = Get-Command openssl -ErrorAction SilentlyContinue
if (-not $openssl) {
    Write-Host "OpenSSL introuvable. Installez OpenSSL (Laragon) ou Git for Windows." -ForegroundColor Red
    exit 1
}

& openssl req -x509 -nodes -days 365 -newkey rsa:2048 `
    -keyout $key -out $cert `
    -subj "/CN=smartcampus.local/O=SmartCampus/C=CD"

Write-Host "OK : $cert" -ForegroundColor Green
Write-Host "OK : $key" -ForegroundColor Green
Write-Host "Utilisez https://localhost (accepter l'avertissement navigateur)" -ForegroundColor DarkGray
