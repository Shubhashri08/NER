import os
from pathlib import Path
from pydantic import BaseModel
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent.parent
# Load environment variables from backend/.env and root .env
load_dotenv(BASE_DIR / ".env")
load_dotenv(BASE_DIR.parent / ".env")

def resolve_data_dir() -> Path:
    env_dir = os.getenv("DATA_DIR")
    if env_dir and Path(env_dir).exists():
        return Path(env_dir).resolve()
    candidates = [
        BASE_DIR / "data",
        BASE_DIR.parent / "data",
        Path("/app/data"),
        Path.cwd() / "data",
    ]
    for cand in candidates:
        if cand.exists():
            return cand.resolve()
    return (BASE_DIR.parent / "data").resolve()

DATA_DIR = resolve_data_dir()

class Settings(BaseModel):
    PROJECT_NAME: str = "AI-Powered Disaster Logistics & Response Coordination Platform"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "DISASTER_COORDINATION_SECURE_JWT_SECRET_2026_HEX"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Authoritative Data Paths
    DATA_DIR: Path = DATA_DIR
    ROADS_GRAPH_PATH: Path = DATA_DIR / "processed" / "network_graph.json"
    VILLAGES_PATH: Path = DATA_DIR / "processed" / "villages.geojson"
    HAZARDS_PATH: Path = DATA_DIR / "processed" / "hazard_zones.geojson"
    WAREHOUSES_PATH: Path = DATA_DIR / "scenarios" / "warehouse_inventory.json"
    FLEET_PATH: Path = DATA_DIR / "scenarios" / "fleet_manifest.json"
    SHELTERS_PATH: Path = DATA_DIR / "scenarios" / "shelter_directory.json"
    WEATHER_PATH: Path = DATA_DIR / "scenarios" / "weather_events.json"

    # AI / LLM Configuration (Google Gemini & OpenAI)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

settings = Settings()

