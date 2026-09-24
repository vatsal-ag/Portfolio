#!/bin/bash
# RxVision AI - Doctor Prescription Reader & Senior Caretaker Assistant
# Launch Script

echo "============================================================"
echo " Starting RxVision AI Backend & Frontend Services"
echo " Compliant with HIPAA 45 CFR & Indian IT Act 2000"
echo "============================================================"

# Kill any existing instances on ports 8008 and 3000
lsof -ti:8008 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null

# Activate backend venv & start FastAPI
echo ">> Launching FastAPI Backend on http://127.0.0.1:8008..."
PYTHONPATH=backend backend/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8008 --reload &
BACKEND_PID=$!

# Start Vite React Frontend
echo ">> Launching Frontend on http://localhost:3000..."
npm run dev --prefix frontend &
FRONTEND_PID=$!

echo ""
echo ">> App running!"
echo ">> Web UI:  http://localhost:3000"
echo ">> API Doc: http://127.0.0.1:8008/docs"
echo ""
echo "Press Ctrl+C to stop both servers."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM
wait
