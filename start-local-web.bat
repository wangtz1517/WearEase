@echo off
setlocal
set SCRIPT_DIR=%~dp0

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found.
  echo Install Node.js first, then run this script again.
  pause
  exit /b 1
)

if "%HOST%"=="" set HOST=127.0.0.1
if "%PORT%"=="" set PORT=3000

echo Starting local frontend server at http://%HOST%:%PORT% ...
node "%SCRIPT_DIR%scripts\local-dev-server.js" --host "%HOST%" --port "%PORT%"

endlocal

