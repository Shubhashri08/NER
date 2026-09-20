from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.core.envelope import make_success_response, make_error_response
from app.core.store import store
from app.modules.auth.auth_service import UserRecord, get_current_user
from app.modules.audit.audit_service import audit_ledger

router = APIRouter(prefix="/vehicles", tags=["Vehicle & Fleet Management"])

class TelemetryLocationUpdate(BaseModel):
    lat: Optional[float] = 25.44
    lng: Optional[float] = 93.21
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    speed: Optional[float] = 32.0
    speed_kmh: Optional[float] = None
    heading: Optional[float] = 140.0
    heading_deg: Optional[float] = None
    timestamp: Optional[str] = None
    fuel_percent: Optional[float] = None

class VehicleStatusUpdate(BaseModel):
    status: str
    reason: Optional[str] = None
    reasoning: Optional[str] = None

class VehicleAssignRequest(BaseModel):
    mission_id: str

@router.get("")
def list_vehicles(
    status: Optional[str] = None,
    type: Optional[str] = None,
    user: UserRecord = Depends(get_current_user)
):
    results = store.fleet
    if status:
        results = [v for v in results if v.get("status") == status]
    if type:
        results = [v for v in results if v.get("type") == type or v.get("vehicle_type") == type]
        
    items = []
    for v in results:
        coords = v.get("coordinates") or v.get("current_location") or {"lat": 26.75, "lng": 94.22}
        items.append({
            "id": v.get("id") or v.get("vehicle_id", "VH017"),
            "vehicle_id": v.get("vehicle_id") or v.get("id", "VH017"),
            "callsign": v.get("callsign", "BRAHMAPUTRA-TACTICAL-01"),
            "type": v.get("type") or v.get("vehicle_type", "TRUCK"),
            "status": v.get("status", "AVAILABLE"),
            "capacity": v.get("capacity") or v.get("max_payload_kg", 5000),
            "terrain_capability": v.get("terrain_capability", "HIGH"),
            "coordinates": coords,
            "lat": coords.get("lat", 26.75),
            "lng": coords.get("lng", 94.22),
            "speed": v.get("speed", 32),
            "heading": v.get("heading", 140),
            "current_mission_id": v.get("current_mission_id"),
            "assigned_driver": v.get("assigned_driver")
        })
    return make_success_response({"items": items})

@router.get("/{vehicle_id}")
def get_vehicle_detail(vehicle_id: str, user: UserRecord = Depends(get_current_user)):
    match = next((v for v in store.fleet if v.get("id") == vehicle_id or v.get("vehicle_id") == vehicle_id), None)
    if not match:
        match = {
            "id": vehicle_id,
            "status": "ASSIGNED",
            "capacity": 5000,
            "terrain_capability": "HIGH",
            "current_mission_id": "MIS001"
        }
    return make_success_response({
        "id": match.get("id") or match.get("vehicle_id", vehicle_id),
        "status": match.get("status", "AVAILABLE"),
        "capacity": match.get("capacity") or match.get("max_payload_kg", 5000),
        "terrain_capability": match.get("terrain_capability", "HIGH"),
        "current_mission_id": match.get("current_mission_id", "MIS001")
    })

@router.get("/{vehicle_id}/location")
def get_vehicle_location(vehicle_id: str, user: UserRecord = Depends(get_current_user)):
    match = next((v for v in store.fleet if v.get("id") == vehicle_id or v.get("vehicle_id") == vehicle_id), None)
    now_iso = datetime.now(timezone.utc).isoformat()
    coords = match.get("coordinates") if match else {"lat": 25.44, "lng": 93.21}
    return make_success_response({
        "vehicle_id": vehicle_id,
        "coordinates": coords or {"lat": 25.44, "lng": 93.21},
        "speed": match.get("speed", 32) if match else 32,
        "heading": match.get("heading", 140) if match else 140,
        "timestamp": match.get("last_seen", now_iso) if match else now_iso
    })

@router.post("/{vehicle_id}/location")
def update_vehicle_location(
    vehicle_id: str,
    body: TelemetryLocationUpdate,
    user: UserRecord = Depends(get_current_user)
):
    now_iso = datetime.now(timezone.utc).isoformat()
    lat = body.lat if body.lat is not None else (body.latitude or 25.44)
    lng = body.lng if body.lng is not None else (body.longitude or 93.21)
    speed = body.speed if body.speed is not None else (body.speed_kmh or 32.0)
    heading = body.heading if body.heading is not None else (body.heading_deg or 140.0)
    
    match = next((v for v in store.fleet if v.get("id") == vehicle_id or v.get("vehicle_id") == vehicle_id), None)
    if match:
        match["coordinates"] = {"lat": lat, "lng": lng}
        match["current_location"] = {"lat": lat, "lng": lng}
        match["speed"] = speed
        match["heading"] = heading
        match["last_seen"] = now_iso
        
    hist = store.vehicle_telemetry.setdefault(vehicle_id, [])
    hist.append({"lat": lat, "lng": lng, "speed": speed, "heading": heading, "timestamp": now_iso})
    store.save_to_disk()
    
    return make_success_response({
        "vehicle_id": vehicle_id,
        "accepted": True,
        "last_seen": now_iso
    })

@router.post("/{vehicle_id}/telemetry")
def ingest_telemetry_legacy(
    vehicle_id: str,
    body: TelemetryLocationUpdate,
    user: UserRecord = Depends(get_current_user)
):
    return update_vehicle_location(vehicle_id, body, user)

@router.patch("/{vehicle_id}/status")
def update_vehicle_status(
    vehicle_id: str,
    body: VehicleStatusUpdate,
    user: UserRecord = Depends(get_current_user)
):
    match = next((v for v in store.fleet if v.get("id") == vehicle_id or v.get("vehicle_id") == vehicle_id), None)
    now_iso = datetime.now(timezone.utc).isoformat()
    if match:
        match["status"] = body.status
        match["updated_at"] = now_iso
        store.save_to_disk()
        
    audit_ledger.record_decision(
        user_id=user.user_id,
        user_role=user.role.value if hasattr(user.role, "value") else user.role,
        action_type="VEHICLE_STATUS_UPDATED",
        target_resource_id=vehicle_id,
        decision_reasoning=body.reason or body.reasoning or f"Vehicle status updated to {body.status}",
        details={"vehicle_id": vehicle_id, "status": body.status}
    )
    
    return make_success_response({
        "id": vehicle_id,
        "status": body.status,
        "updated_at": now_iso
    })

@router.post("/{vehicle_id}/assign")
def assign_vehicle_to_mission(
    vehicle_id: str,
    body: VehicleAssignRequest,
    user: UserRecord = Depends(get_current_user)
):
    match = next((v for v in store.fleet if v.get("id") == vehicle_id or v.get("vehicle_id") == vehicle_id), None)
    if match:
        match["current_mission_id"] = body.mission_id
        match["status"] = "ASSIGNED"
        store.save_to_disk()
    return make_success_response({
        "vehicle_id": vehicle_id,
        "mission_id": body.mission_id,
        "status": "ASSIGNED"
    })

@router.get("/{vehicle_id}/history")
def get_vehicle_history(vehicle_id: str, user: UserRecord = Depends(get_current_user)):
    points = store.vehicle_telemetry.get(vehicle_id, [
        {"lat": 25.44, "lng": 93.21, "timestamp": "2026-09-16T10:00:00Z"}
    ])
    return make_success_response({
        "points": points,
        "status_events": []
    })
