#!/usr/bin/env bash
set -e

echo "========================================================================"
echo "  NER DISASTER LOGISTICS INTELLIGENCE PLATFORM — LOCAL LAUNCHER"
echo "========================================================================"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed or not in PATH."
    exit 1
fi

# Check Node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed or not in PATH."
    exit 1
fi

echo "📦 Step 1: Installing Python dependencies..."
cd "$ROOT_DIR/backend"
python3 -m pip install -q -r requirements.txt

echo "📦 Step 2: Installing Frontend dependencies..."
cd "$ROOT_DIR/frontend"
npm install --silent

echo "🚀 Step 3: Starting Backend API server on http://localhost:8000..."
cd "$ROOT_DIR/backend"
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

echo "🚀 Step 4: Starting Frontend server on http://localhost:5173..."
cd "$ROOT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================================================"
echo "  ✅ Platform is running successfully!"
echo "  📡 Backend API:      http://localhost:8000"
echo "  📚 API Docs:         http://localhost:8000/docs"
echo "  🖥️  Frontend Deck:    http://localhost:5173"
echo "========================================================================"
echo "Press Ctrl+C to stop all services."

cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM

wait
