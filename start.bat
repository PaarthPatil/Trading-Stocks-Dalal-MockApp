@echo off
REM Quick Start Script for Stock Simulation Platform (Windows)
REM This script starts both backend and frontend servers

echo ╔════════════════════════════════════════════════╗
echo ║   🚀 Stock Simulation Platform - Quick Start   ║
echo ╚════════════════════════════════════════════════╝
echo.

REM Check if running from correct directory
if not exist "backend\server.js" (
    echo [ERROR] Please run this script from the project root directory
    echo Example: cd "d:\Dalal Stret Game"
    pause
    exit /b 1
)

REM Check if .env exists in backend
if not exist "backend\.env" (
    echo [INFO] .env file not found in backend folder
    echo Running setup wizard...
    cd backend
    node setup.js
    cd ..
    if errorlevel 1 (
        echo [ERROR] Setup failed. Please fix errors and try again.
        pause
        exit /b 1
    )
)

REM Check if node_modules exists
if not exist "backend\node_modules" (
    echo [INFO] Installing backend dependencies...
    cd backend
    call npm install
    cd ..
    if errorlevel 1 (
        echo [ERROR] Failed to install backend dependencies
        pause
        exit /b 1
    )
)

if not exist "frontend\node_modules" (
    echo [INFO] Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
    if errorlevel 1 (
        echo [ERROR] Failed to install frontend dependencies
        pause
        exit /b 1
    )
)

echo.
echo Starting servers...
echo.

REM Start backend in new window
echo [1/2] Starting Backend Server...
start "Stock Sim - Backend" cmd /k "cd backend && npm run dev"

REM Wait a bit for backend to initialize
timeout /t 3 /nobreak > nul

REM Start frontend in new window
echo [2/2] Starting Frontend Server...
start "Stock Sim - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ╔════════════════════════════════════════════════╗
echo ║          ✅ Servers Started!                   ║
echo ╚════════════════════════════════════════════════╝
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window...
pause > nul
