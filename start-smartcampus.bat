@echo off
REM SmartCampus AgentAI — lancement rapide (double-clic ou CMD)
REM Usage :
REM   start-smartcampus.bat
REM   start-smartcampus.bat setup
REM   start-smartcampus.bat seed
REM   start-smartcampus.bat stop

chcp 65001 >nul 2>&1
cd /d "%~dp0"

set "PS_ARGS="
if /i "%~1"=="setup" set "PS_ARGS=-Setup -OpenBrowser" & goto :run
if /i "%~1"=="seed" set "PS_ARGS=-Seed" & goto :run
if /i "%~1"=="stop" set "PS_ARGS=-Stop" & goto :run
if /i "%~1"=="nobrowser" set "PS_ARGS=-NoBrowser" & goto :run
if "%~1"=="" set "PS_ARGS=-OpenBrowser" & goto :run

set "PS_ARGS=%*"

:run
echo.
echo  SmartCampus AgentAI
echo  -------------------
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-smartcampus.ps1" %PS_ARGS%
set "EXIT_CODE=%ERRORLEVEL%"

if not "%EXIT_CODE%"=="0" (
    echo.
    echo  Erreur lors du demarrage (code %EXIT_CODE%).
    pause
    exit /b %EXIT_CODE%
)

REM Laisser la fenetre ouverte si lance en double-clic (sans argument inconnu)
if "%~1"=="" pause
exit /b 0
