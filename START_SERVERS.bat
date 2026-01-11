@echo off
echo ========================================
echo  Financial Manager - Starting Servers
echo ========================================
echo.

echo [1/2] Starting Backend API Server...
echo.
start "Backend API" cmd /k "cd backend && python run.py"
timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Dev Server...
echo.
start "Frontend WebApp" cmd /k "cd webapp && npm run dev"

echo.
echo ========================================
echo  Servers Starting...
echo ========================================
echo.
echo Backend API: http://localhost:8000
echo API Docs:    http://localhost:8000/docs
echo Frontend:    http://localhost:5173
echo.
echo Press any key to exit this window...
pause >nul
