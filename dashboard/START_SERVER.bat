@echo off
echo ============================================
echo   Brahma Vidya Dashboard - Local Server
echo ============================================
echo.
echo Starting local server...
echo.
echo Dashboard will be available at:
echo   http://localhost:9000/dashboard/
echo.
echo Press Ctrl+C to stop the server
echo ============================================
echo.

cd /d "%~dp0\.."
python -m http.server 9000

pause
