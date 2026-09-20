@echo off
echo ========================================================================
echo   NER DISASTER LOGISTICS INTELLIGENCE PLATFORM — WINDOWS LAUNCHER
echo ========================================================================

echo Step 1: Installing Python dependencies...
cd backend
python -m pip install -r requirements.txt

echo Step 2: Installing Frontend dependencies...
cd ..\frontend
call npm install

echo Step 3: Starting Backend and Frontend services...
cd ..\backend
start "NER Backend API" cmd /k "python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

cd ..\frontend
start "NER Frontend App" cmd /k "npm run dev"

echo ========================================================================
echo   Platform started successfully!
echo   Backend API:      http://localhost:8000
echo   API Docs:         http://localhost:8000/docs
echo   Frontend UI:      http://localhost:5173
echo ========================================================================
pause
