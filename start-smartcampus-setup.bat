@echo off
REM Premiere installation : venv, base MySQL, migrations, seeds
cd /d "%~dp0"
call "%~dp0start-smartcampus.bat" setup
