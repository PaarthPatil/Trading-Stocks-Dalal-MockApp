@echo off
REM Quick Start Script for Stock Simulation Backend (Windows)

echo.
echo ╔════════════════════════════════════════════════╗
echo ║   Stock Simulation Platform - Setup            ║
echo ╚════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js found: 
node --version
echo.

REM Install dependencies
echo Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [OK] Dependencies installed successfully
echo.

REM Check if .env exists
if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo [WARNING] Please edit .env file with your database credentials!
    echo.
) else (
    echo [OK] .env file exists
    echo.
)

REM Database setup prompt
echo ════════════════════════════════════════════════
echo DATABASE SETUP
echo ════════════════════════════════════════════════
echo.
echo To setup the database, run:
echo   mysql -u root -p ^< database/schema.sql
echo.
echo Make sure MySQL is installed and running.
echo.

echo ════════════════════════════════════════════════
echo STARTING SERVER
echo ════════════════════════════════════════════════
echo.

REM Start server in development mode
call npm run dev

pause
