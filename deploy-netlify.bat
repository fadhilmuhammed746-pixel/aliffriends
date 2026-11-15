@echo off
title Deploy ALIF FRIENDS 12 to Netlify
cd /d "%~dp0"

echo ==========================================================
echo         ALIF FRIENDS 12 - NETLIFY PRODUCTION DEPLOY
echo ==========================================================
echo.
echo Step 1: Ensuring all latest changes are pushed to GitHub...
call git push origin main
echo.
echo Step 2: Deploying to Netlify project 'aliffriends'...
echo (If you are not logged in yet, run 'npx netlify login' once)
echo.
call npx.cmd netlify deploy --prod --site aliffriends

if %errorlevel% neq 0 (
    echo.
    echo ==========================================================
    echo [TIP] To authorize Netlify CLI on this computer:
    echo 1. Open your terminal and run: npx netlify login
    echo 2. Approve the login in your browser
    echo 3. Run this script again: deploy-netlify.bat
    echo ==========================================================
)

echo.
pause
