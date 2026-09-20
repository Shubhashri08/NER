from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.core.envelope import make_success_response, make_error_response
from app.core.store import store
from app.modules.auth.auth_service import UserRecord, get_current_user

router = APIRouter(tags=["Offline, Edge & Synchronization"])

class SyncPushRequest(BaseModel):
    events: list[dict]

class SyncPullRequest(BaseModel):
    cursor: str = "CURSOR_123"

class ConflictResolveRequest(BaseModel):
    resolution: str = "SERVER_WINS"
    reason: Optional[str] = "Authoritative command-center verification"

# --- Offline Status ---

@router.get("/offline/status")
def get_offline_status(user: UserRecord = Depends(get_current_user)):
    return make_success_response({
        "online": False,
        "map_available": True,
        "data_last_sync": datetime.now(timezone.utc).isoformat(),
        "node_id": "EDGE-D01"
    })

@router.get("/offline/map/status")
def get_offline_map_status(user: UserRecord = Depends(get_current_user)):
    return make_success_response({
        "available": True,
        "version": "ner-map-v12",
        "coverage": "NER",
        "max_zoom": 15
    })

# --- Sync ---

@router.get("/sync/status")
def get_sync_status(user: UserRecord = Depends(get_current_user)):
    return make_success_response({
        "pending_push": 7,
        "pending_pull": 0,
        "last_sync": datetime.now(timezone.utc).isoformat(),
        "conflicts": len(store.sync_conflicts)
    })

@router.post("/sync/push")
def push_sync_events(
    body: SyncPushRequest,
    user: UserRecord = Depends(get_current_user)
):
    accepted_ids = [ev.get("event_id", "EV001") for ev in body.events]
    return make_success_response({
        "accepted": accepted_ids,
        "rejected": [],
        "conflicts": []
    })

@router.post("/sync/pull")
def pull_sync_events(
    body: SyncPullRequest,
    user: UserRecord = Depends(get_current_user)
):
    return make_success_response({
        "cursor": "CURSOR_124",
        "changes": [
            {"type": "INCIDENT_UPDATED", "id": "INC001", "version": 4, "payload": {}}
        ]
    })

@router.get("/sync/conflicts")
def get_sync_conflicts(user: UserRecord = Depends(get_current_user)):
    return make_success_response({
        "items": store.sync_conflicts
    })

@router.post("/sync/conflicts/{conflict_id}/resolve")
def resolve_sync_conflict(
    conflict_id: str,
    body: ConflictResolveRequest,
    user: UserRecord = Depends(get_current_user)
):
    match = next((c for c in store.sync_conflicts if c["id"] == conflict_id), None)
    if match:
        match["status"] = "RESOLVED"
        match["resolution"] = body.resolution
    return make_success_response({
        "id": conflict_id,
        "status": "RESOLVED",
        "resolution": body.resolution
    })

# --- Edge Node Status ---

@router.get("/edge/status")
def get_edge_status(user: UserRecord = Depends(get_current_user)):
    return make_success_response({
        "node_id": "EDGE-AS-D01",
        "status": "ONLINE",
        "services": {
            "database": "RUNNING",
            "maps": "RUNNING",
            "routing": "RUNNING",
            "ai": "RUNNING",
            "voice": "RUNNING"
        }
    })
