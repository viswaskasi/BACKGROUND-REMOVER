@echo off
echo Starting Backend...
start cmd /k "cd backend && venv\Scripts\python.exe -m uvicorn main:app --port 8000"

echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"

echo Both services started!
