@echo off
REM MediCare Application Startup Script
REM This script starts both the Socket.io server and Next.js frontend

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║        MediCare Patient Registration & Staff Dashboard        ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo Checking for Node.js and npm...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js found

echo.
echo Starting MediCare application with both server and frontend...
echo.

REM Check if npm modules are installed
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✓ Dependencies installed
    echo.
)

REM Start both services using npm run dev:all
echo 🚀 Starting Socket.io server on http://localhost:3001
echo 🚀 Starting Next.js frontend on http://localhost:3000
echo.
echo Press Ctrl+C to stop both services
echo.

call npm run dev:all

pause
