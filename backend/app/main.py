from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

# Import Route Modules
from app.modules.auth.routes import router as auth_router
from app.modules.users.routes import router as users_router
from app.modules.regions.routes import router as regions_router
from app.modules.incidents.routes import router as incidents_router
from app.modules.hazards.routes import router as hazards_router
from app.modules.logistics.routes import router as logistics_router
from app.modules.resources.routes import router as resources_router
from app.modules.mobility.routes import router as mobility_router
from app.modules.roads.routes import router as roads_router
from app.modules.replanning.routes import router as replanning_router
from app.modules.reports.routes import router as reports_router
from app.modules.alerts.routes import router as alerts_router
from app.modules.relocation.routes import router as relocation_router
from app.modules.decision.routes import router as decision_router
from app.modules.voice.routes import router as voice_router
from app.modules.copilot.routes import router as copilot_router
from app.modules.gis.routes import router as gis_router
from app.modules.dashboard.routes import router as dashboard_router
from app.modules.analytics.routes import router as analytics_router
from app.modules.approvals.routes import router as approvals_router
from app.modules.audit.routes import router as audit_router
from app.modules.config.routes import router as config_router
from app.modules.offline.routes import router as offline_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="NER Disaster Logistics Intelligence Platform — Complete Feature, Backend API, Endpoint, Workflow & Response Specification",
    version="1.0.0"
)

# CORS configuration allowing local frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all 18 API families under /api/v1
api_prefix = settings.API_V1_STR

app.include_router(auth_router, prefix=api_prefix)
app.include_router(users_router, prefix=api_prefix)
app.include_router(regions_router, prefix=api_prefix)
app.include_router(incidents_router, prefix=api_prefix)
app.include_router(hazards_router, prefix=api_prefix)
app.include_router(logistics_router, prefix=api_prefix)
app.include_router(resources_router, prefix=api_prefix)
app.include_router(mobility_router, prefix=api_prefix)
app.include_router(roads_router, prefix=api_prefix)
app.include_router(replanning_router, prefix=api_prefix)
app.include_router(reports_router, prefix=api_prefix)
app.include_router(alerts_router, prefix=api_prefix)
app.include_router(relocation_router, prefix=api_prefix)
app.include_router(decision_router, prefix=api_prefix)
app.include_router(voice_router, prefix=api_prefix)
app.include_router(copilot_router, prefix=api_prefix)
app.include_router(gis_router, prefix=api_prefix)
app.include_router(dashboard_router, prefix=api_prefix)
app.include_router(analytics_router, prefix=api_prefix)
app.include_router(approvals_router, prefix=api_prefix)
app.include_router(audit_router, prefix=api_prefix)
app.include_router(config_router, prefix=api_prefix)
app.include_router(offline_router, prefix=api_prefix)

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "active_modules": [
            "auth", "users", "regions", "incidents", "hazards", "population", "facilities",
            "logistics", "resources", "warehouses", "vehicles", "routes", "replanning",
            "reports", "alerts", "relocation", "shelters", "decision", "voice", "copilot",
            "gis", "dashboard", "analytics", "approvals", "audit", "config", "offline", "sync", "edge"
        ]
    }

@app.get("/")
def root():
    return {
        "status": "ONLINE",
        "service": settings.PROJECT_NAME,
        "docs_url": "/docs",
        "api_v1": api_prefix
    }
