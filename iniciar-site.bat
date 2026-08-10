@echo off
cd /d "%~dp0"
echo.
echo  4Juris - React + Vite + Tailwind
echo  O navegador abrira em http://localhost:5173
echo  Para encerrar, pressione Ctrl+C.
echo.
start "" "http://localhost:5173"
npm run dev
