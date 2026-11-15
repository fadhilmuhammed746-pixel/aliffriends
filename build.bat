@echo off
title Alif Friends 12 - Production Build
cd /d "%~dp0"

echo ==========================================================
echo         ALIF FRIENDS 12 - PRODUCTION BUILD
echo ==========================================================
call npm.cmd run build

echo.
echo ==========================================================
if %errorlevel% equ 0 (
    echo [SUCCESS] Build completed successfully!
) else (
    echo [ERROR] Build failed. Please check the logs above.
)
echo ==========================================================
pause

