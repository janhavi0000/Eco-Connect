@echo off
title EcoConnect Platform Starter
echo ========================================================
echo   EcoConnect Full-Stack Application Launcher
echo ========================================================
echo.
echo 1. Starting Backend Express Server (Port 5000)...
start "EcoConnect Server (Port 5000)" cmd /k "cd /d \"%~dp0server\" && npm run dev"

echo 2. Starting Frontend React Client (Port 5173)...
start "EcoConnect Client (Port 5173)" cmd /k "cd /d \"%~dp0client\" && npm run dev"

echo.
echo ========================================================
echo Both backend and frontend servers have been launched!
echo.
echo   Frontend App:   http://localhost:5173
echo   Backend API:    http://localhost:5000/api
echo   Database:       MongoDB (localhost:27017)
echo ========================================================
echo.
timeout /t 3 >nul
