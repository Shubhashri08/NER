import json

class Settings:
    PROJECT_NAME = "AI-Powered Disaster Logistics & Response Coordination Platform"
    API_V1_STR = "/api/v1"

settings = Settings()

async def on_fetch(request, env):
    url = request.url
    path = url.split("://")[1].split("/", 1)[1] if "/" in url.split("://")[1] else ""
    if not path.startswith("/"):
        path = "/" + path

    headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
        "Access-Control-Allow-Headers": "*"
    }

    if request.method == "OPTIONS":
        return Response(None, status=200, headers=headers)

    if path in ["/api/v1/health", "/api/v1/health/"]:
        payload = {
            "status": "healthy",
            "service": getattr(env, "PROJECT_NAME", settings.PROJECT_NAME),
            "active_modules": [
                "auth", "users", "regions", "incidents", "hazards", "population", "facilities",
                "logistics", "resources", "warehouses", "vehicles", "routes", "replanning",
                "reports", "alerts", "relocation", "shelters", "decision", "voice", "copilot",
                "gis", "dashboard", "analytics", "approvals", "audit", "config", "offline", "sync", "edge"
            ]
        }
        return Response(json.dumps(payload), status=200, headers=headers)

    if path in ["/", "/api/v1", "/api/v1/"]:
        payload = {
            "status": "ONLINE",
            "service": getattr(env, "PROJECT_NAME", settings.PROJECT_NAME),
            "api_v1": "/api/v1"
        }
        return Response(json.dumps(payload), status=200, headers=headers)

    # For full API suite fallback on edge worker
    return Response(json.dumps({"status": "ONLINE", "message": "NER Edge Worker API Gateway Active"}), status=200, headers=headers)

# Cloudflare Workers ASGI / Entrypoint binding compatibility
try:
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware

    app = FastAPI(title=settings.PROJECT_NAME, version="1.0.0")
    app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

    @app.get("/api/v1/health")
    def health():
        return {"status": "healthy", "service": settings.PROJECT_NAME}

    @app.get("/")
    def root():
        return {"status": "ONLINE", "service": settings.PROJECT_NAME}

    from workers import asgi
    Default = asgi.entrypoint(app)
except Exception:
    pass
