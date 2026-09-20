# NER Disaster Logistics & Tactical Response Intelligence Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.0+-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2+-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0+-06B6D4.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Leaflet GIS](https://img.shields.io/badge/Leaflet-GIS_Mapping-199900.svg?logo=leaflet&logoColor=white)](https://leafletjs.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **"Resilient People. Stronger Communities. A Safer Tomorrow."**  
> *Official Humanitarian Disaster Response, Tactical GIS & AI Supply Chain Intelligence Engine for the 8 Northeastern Region (NER) States of India.*

---

## 📌 Project Overview

The **NER Disaster Logistics Intelligence Platform** is an end-to-end humanitarian disaster response coordination and supply chain platform designed for high-altitude, terrain-constrained, and landslide-prone environments across the 8 Northeastern States (*Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, and Tripura*).

### 🎯 Key Problems Solved
- **Terrain & Monsoon Vulnerability**: Continuous landslide monitoring, flash flood alerts, and high-altitude weather risk integration.
- **Dynamic Multi-Corridor Replanning**: Real-time road blockage detection that recalculates and evaluates alternate arterial bypasses (Dijkstra/A* shortest path algorithms with 4x4 terrain difficulty weighting).
- **Intelligent Supply Matching**: Automated prioritization of life-critical relief requisitions (Food, Clean Water, Trauma Medicine, Fuel, Shelters) matched against real-time warehouse inventory.
- **Tactical Fleet & Convoy Telemetry**: Real-time GPS tracking and capacity utilization of tactical 4x4 high-clearance trucks, medical vans, and amphibious rescue boats.
- **MCDA Population Relocation**: Multi-criteria decision analysis for staging evacuations to certified safe shelters with live bed headroom tracking.
- **AI Intelligence Copilot**: Powered by Google Gemini for zero-shot SitRep summarization, disaster extraction from field reports, and voice transcription.

---

## 🏗️ Architecture & Technology Stack

```
                                  ┌───────────────────────────────┐
                                  │   Tactical Frontend (React)   │
                                  │   Vite + TypeScript + Tailwind │
                                  └───────────────┬───────────────┘
                                                  │ (REST / API v1)
                                                  ▼
                                  ┌───────────────────────────────┐
                                  │   FastAPI Intelligence Engine │
                                  │  Python 3.11 + Pydantic v2    │
                                  └───────┬───────────────┬───────┘
                                          │               │
                  ┌───────────────────────┴──────┐ ┌──────┴───────────────────────┐
                  ▼                              ▼ ▼                              ▼
    ┌───────────────────────────┐  ┌───────────────────────────┐  ┌───────────────────────────┐
    │     Spatial GIS & Graph   │  │    Algorithmic Engines    │  │    Google Gemini Copilot   │
    │ GeoJSON, NetworkX Routing │  │ Stock Allocation, MCDA    │  │  SitRep Parsing & NL Q&A  │
    └───────────────────────────┘  └───────────────────────────┘  └───────────────────────────┘
```

- **Frontend**: React 19, TypeScript 5.9, Vite 6.2, Tailwind CSS 4.0, Leaflet GIS, Framer Motion, Lucide Icons.
- **Backend**: Python 3.11, FastAPI, Pydantic v2, NetworkX, Uvicorn, Google GenAI SDK.
- **Authoritative Data**: GeoJSON spatial boundaries, road network graph models, regional warehouse manifests, shelter directories, and atomic state datastores.

---

## 🚀 How to Run the Project

### Prerequisites
* **Python**: 3.10 or higher
* **Node.js**: 18.0 or higher (npm 9+)

---

### Option 1: Automatic Launchers (One-Click)

#### macOS & Linux:
```bash
chmod +x start.sh
./start.sh
```

#### Windows:
```bat
start.bat
```

> The launcher automatically checks prerequisites, installs backend and frontend dependencies, launches the FastAPI API engine on `http://localhost:8000`, and opens the Vite UI on `http://localhost:5173`.

---

### Option 2: Manual Setup

#### Step 1: Start the Backend API
```bash
cd backend

# Create & activate a virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# (Optional) Add your Gemini API Key for AI features
cp .env.example .env
# Open .env and set GEMINI_API_KEY=your_key

# Run the FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
* **Backend API**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
* **Interactive OpenAPI Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

#### Step 2: Start the Frontend UI (in a new terminal window)
```bash
cd frontend

# Install Node dependencies
npm install

# Start development server
npm run dev
```
* **Frontend App**: [http://localhost:5173](http://localhost:5173)

---

### Option 3: Docker Compose

```bash
docker compose up --build
```
* **Frontend UI**: [http://localhost:3000](http://localhost:3000)
* **Backend API**: [http://localhost:8000](http://localhost:8000)
* **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🖥️ Operational Decks & Features

| Deck | URL Route | Description |
|---|---|---|
| **🎖️ Command Center** | `/command` | Executive dashboard with live KPI counters, satellite GIS overview, priority action approvals, and SitRep event stream. |
| **🗺️ Live Map Studio** | `/map` | Multi-layer interactive GIS map with satellite/terrain toggle, hazard overlays, road statuses, and district inspector. |
| **📦 Logistics Management** | `/logistics` | 5 subtabs for Requisitions, Warehouse Depots (+ Restock modal), Fleet Telemetry, Active Missions, and Route Corridors. |
| **🔄 Response & Replanning** | `/replanning` | Side-by-side trade-off analysis comparing blocked arterial roads vs recommended 4x4 bypasses with instant reroute execution. |
| **👥 Relocation & Shelters** | `/relocation` | Safe haven bed occupancy tracking, habitation vulnerability assessment, and mass evacuation staging. |
| **🧠 Unified Intelligence** | `/intelligence` | AI-powered natural language copilot, situation summaries, and voice-assisted incident reporting. |

---

## 👥 Demo Personas & Roles

The system comes pre-configured with operational government roles:

| Role | Persona Name | Default ID | Scope & Clearance |
|---|---|---|---|
| **District Authority** | Dr. Pranjal Borah, IAS | `USR002` | Full sovereign clearance, mission approvals, evacuation orders |
| **State Authority** | R. K. Sharma, ACS | `USR001` | State-wide coordination, inter-district corridor clearance |
| **Logistics Coordinator** | Anita Roy, APCS | `USR003` | Warehouse stock balancing, fleet allocation, requisition approval |
| **Field Officer** | T. Jamir, Inspector | `USR004` | Field observation SitRep submission, geo-tagged road blockage reporting |
| **Shelter Coordinator** | L. Renthlei, SWO | `USR005` | Relief camp intake, bed headroom and occupancy management |
| **Transport Operator** | Bikram Sangma, Lead | `USR006` | Convoy GPS telemetry, driver manifest, route status updates |

---

## 🧪 Testing & Verification

Run the comprehensive 63-step automated backend lifecycle test:
```bash
python3 backend/test_complete_lifecycle_flow.py
```

Build the frontend bundle for production verification:
```bash
cd frontend
npm run build
```

---

## 📂 Repository Layout

```
.
├── backend/
│   ├── app/
│   │   ├── core/           # Security, Envelopes, Config, Data Storage
│   │   ├── modules/        # 18 Domain API routers (Auth, Logistics, GIS, etc.)
│   │   └── main.py         # FastAPI App Entrypoint
│   ├── data/               # GeoJSON files, graph models, scenario datasets
│   ├── requirements.txt    # Backend dependencies
│   └── .env.example        # Environment template
├── frontend/
│   ├── src/
│   │   ├── components/     # Command Center, Map, Logistics, Replanning, Relocation
│   │   ├── services/       # Typed API Client (disasterApi)
│   │   ├── App.tsx         # Root component & navigation
│   │   └── index.css       # Tailwind tokens & dual-theme engine
│   ├── package.json        # Frontend dependencies
│   └── .env.example        # Frontend environment template
├── data/                   # Authoritative regional GIS & operational data
├── docker-compose.yml      # Multi-container setup
├── start.sh                # macOS/Linux launcher
├── start.bat               # Windows launcher
├── .gitignore              # Git ignore rules
├── LICENSE                 # MIT License
└── README.md               # Project documentation
```

---

## 📜 License
This project is licensed under the [MIT License](LICENSE).