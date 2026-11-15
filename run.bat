@echo off
title Alif Friends 12 - Development Server
cd /d "%~dp0"

echo ==========================================================
echo           ALIF FRIENDS 12 - LAUNCH SCRIPT
echo ==========================================================
echo Starting development server on port 8080...
echo Once ready, your browser will open to:
echo http://localhost:8080
echo.
echo (Press Ctrl+C in this window anytime to stop the server)
echo ==========================================================
echo.

:: Open browser after a brief pause to let Next.js initialize
start /min cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:8080"

:: Run the dev server using npm.cmd (bypasses PowerShell script restriction)
call npm.cmd run dev

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Server encountered an error or stopped unexpectedly.
    pause
)

