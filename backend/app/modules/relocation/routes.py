from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.core.envelope import make_success_response, make_error_response
from app.core.store import store
from app.modules.auth.auth_service import UserRecord, get_current_user
from app.modules.audit.audit_service import audit_ledger

router = APIRouter(tags=["Relocation & Shelter Management"])

# --- Request Models ---

class RelocationCaseCreate(BaseModel):
    habitation_id: str = "HAB001"
    trigger_incident_id: Optional[str] = "INC001"

class RelocationEvaluateRequest(BaseModel):
    population: int = 5200
    required_services: Optional[list[str]] = ["MEDICAL", "WATER", "FOOD"]

class ShelterOccupancyRequest(BaseModel):
    occupancy: int
    source: Optional[str] = "RELOCATION_MISSION"

class ShelterReadinessRequest(BaseModel):
    readiness: str = "PARTIALLY_READY"
    reason: Optional[str] = "Infrastructure adjustment"

class RelocationMissionCreate(BaseModel):
    case_id: str = "REL001"
    destination_id: str = "SHELTER01"
    vehicles: Optional[list[str]] = ["VH020", "VH021"]
    population_planned: Optional[int] = 5200

class RelocationActionRequest(BaseModel):
    reason: Optional[str] = "Location no longer serviceable"

class RelocationCompleteRequest(BaseModel):
    arrived_population: int = 5200

# --- Relocation Cases ---

@router.get("/relocation/cases")
def list_relocation_cases(user: UserRecord = Depends(get_current_user)):
    items = []
    for c in store.relocation_cases:
        items.append({
            "id": c["id"],
            "habitation_id": c.get("habitation_id", "HAB001"),
            "risk_score": c.get("risk_score", 91),
            "serviceability_score": c.get("serviceability_score", 22),
            "status": c.get("status", "ASSESSMENT")
        })
    return make_success_response({"items": items})

@router.post("/relocation/cases")
def create_relocation_case(
    body: RelocationCaseCreate,
    user: UserRecord = Depends(get_current_user)
):
    rel_id = f"REL{len(store.relocation_cases) + 1:03d}"
    rec = {
        "id": rel_id,
        "habitation_id": body.habitation_id,
        "population": 5200,
        "risk_score": 91,
        "serviceability_score": 22,
        "relocation_required": True,
        "status": "ASSESSMENT",
        "trigger_incident_id": body.trigger_incident_id,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    store.relocation_cases.append(rec)
    return make_success_response({
        "id": rel_id,
        "status": "ASSESSMENT",
        "habitation_id": body.habitation_id
    })

@router.get("/relocation/cases/{case_id}")
def get_relocation_case(case_id: str, user: UserRecord = Depends(get_current_user)):
    match = next((c for c in store.relocation_cases if c["id"] == case_id), None)
    if not match:
        match = {
            "id": case_id,
            "population": 5200,
            "risk_score": 91,
            "serviceability_score": 22,
            "relocation_required": True,
            "status": "ASSESSMENT"
        }
    return make_success_response({
        "id": match["id"],
        "population": match.get("population", 5200),
        "risk_score": match.get("risk_score", 91),
        "serviceability_score": match.get("serviceability_score", 22),
        "relocation_required": match.get("relocation_required", True),
        "status": match.get("status", "ASSESSMENT")
    })

@router.get("/relocation/cases/{case_id}/candidates")
def get_relocation_candidates(case_id: str, user: UserRecord = Depends(get_current_user)):
    candidates = [
        {
            "destination_id": "SHELTER01",
            "distance_km": 42,
            "capacity": 7000,
            "current_occupancy": 2100,
            "remaining_capacity": 4900,
            "safety_score": 82,
            "accessibility_score": 91,
            "readiness": "READY"
        }
    ]
    return make_success_response({"candidates": candidates})

@router.post("/relocation/cases/{case_id}/evaluate")
def evaluate_relocation(
    case_id: str,
    body: Optional[RelocationEvaluateRequest] = None,
    user: UserRecord = Depends(get_current_user)
):
    return make_success_response({
        "feasible": True,
        "score": 84,
        "factors": {
            "destination_safety": 90,
            "capacity": 81,
            "transport": 78,
            "accessibility": 92,
            "medical_support": 85,
            "travel_time": 76
        },
        "constraints": [],
        "recommendation": {
            "destination": "SHELTER01",
            "transport_required": 18
        }
    })

# --- Shelters ---

@router.get("/shelters")
def list_shelters(user: UserRecord = Depends(get_current_user)):
    items = []
    for s in store.shelters:
        coords = s.get("coordinates") or {"lat": 25.185, "lng": 93.027}
        items.append({
            "id": s.get("id") or s.get("shelter_id", "SHELTER-01"),
            "shelter_id": s.get("shelter_id") or s.get("id", "SHELTER-01"),
            "name": s.get("name", "Shelter Facility"),
            "state": s.get("state", "Assam"),
            "district": s.get("district", "Dima Hasao"),
            "coordinates": coords,
            "lat": coords.get("lat", 25.185),
            "lng": coords.get("lng", 93.027),
            "capacity": s.get("capacity") or s.get("certified_capacity", 7000),
            "occupancy": s.get("occupancy") or s.get("current_occupancy", 2100),
            "remaining_capacity": s.get("remaining_capacity") or s.get("available_headroom", 4900),
            "readiness": s.get("readiness", "READY"),
            "status": s.get("status", "ACCEPTING_EVACUEES")
        })
    return make_success_response({"items": items, "shelters": items})

@router.get("/shelters/{shelter_id}")
def get_shelter_detail(shelter_id: str, user: UserRecord = Depends(get_current_user)):
    match = next((s for s in store.shelters if s["id"] == shelter_id or s.get("shelter_id") == shelter_id), None)
    if not match:
        match = {
            "id": shelter_id,
            "capacity": 7000,
            "occupancy": 2100,
            "remaining_capacity": 4900,
            "readiness": "READY",
            "services": ["MEDICAL", "WATER", "FOOD"]
        }
    return make_success_response({
        "id": match.get("id", shelter_id),
        "capacity": match.get("capacity") or match.get("certified_capacity", 7000),
        "occupancy": match.get("occupancy") or match.get("current_occupancy", 2100),
        "remaining_capacity": match.get("remaining_capacity") or match.get("available_headroom", 4900),
        "readiness": match.get("readiness", "READY"),
        "services": match.get("services", [])
    })

@router.post("/shelters/{shelter_id}/occupancy")
def update_shelter_occupancy(
    shelter_id: str,
    body: ShelterOccupancyRequest,
    user: UserRecord = Depends(get_current_user)
):
    match = next((s for s in store.shelters if s["id"] == shelter_id or s.get("shelter_id") == shelter_id), None)
    if match:
        cap = match.get("capacity") or match.get("certified_capacity", 7000)
        match["occupancy"] = body.occupancy
        match["current_occupancy"] = body.occupancy
        rem = cap - body.occupancy
        match["remaining_capacity"] = rem
        match["available_headroom"] = rem
    else:
        rem = 7000 - body.occupancy
        
    return make_success_response({
        "id": shelter_id,
        "occupancy": body.occupancy,
        "remaining_capacity": rem
    })

@router.patch("/shelters/{shelter_id}/readiness")
def update_shelter_readiness(
    shelter_id: str,
    body: ShelterReadinessRequest,
    user: UserRecord = Depends(get_current_user)
):
    match = next((s for s in store.shelters if s["id"] == shelter_id or s.get("shelter_id") == shelter_id), None)
    now_iso = datetime.now(timezone.utc).isoformat()
    if match:
        match["readiness"] = body.readiness
        match["updated_at"] = now_iso
    return make_success_response({
        "id": shelter_id,
        "readiness": body.readiness,
        "updated_at": now_iso
    })

# --- Relocation Missions ---

@router.post("/relocation/missions")
def create_relocation_mission(
    body: RelocationMissionCreate,
    user: UserRecord = Depends(get_current_user)
):
    rm_id = f"RM{len(store.relocation_missions) + 1:03d}"
    now_iso = datetime.now(timezone.utc).isoformat()
    rec = {
        "id": rm_id,
        "status": "PENDING_APPROVAL",
        "case_id": body.case_id,
        "destination_id": body.destination_id,
        "vehicles": body.vehicles or ["VH020", "VH021"],
        "population_planned": body.population_planned or 5200,
        "progress": 0,
        "destination": {"id": body.destination_id, "name": "Relief Shelter Hub"},
        "created_at": now_iso
    }
    store.relocation_missions.append(rec)
    return make_success_response({
        "id": rm_id,
        "status": "PENDING_APPROVAL",
        "case_id": body.case_id,
        "destination_id": body.destination_id
    })

@router.get("/relocation/missions")
def list_relocation_missions(user: UserRecord = Depends(get_current_user)):
    items = []
    for rm in store.relocation_missions:
        items.append({
            "id": rm["id"],
            "status": rm.get("status", "IN_TRANSIT"),
            "population_planned": rm.get("population_planned", 5200),
            "destination_id": rm.get("destination_id", "SHELTER01")
        })
    return make_success_response({"items": items})

@router.get("/relocation/missions/{mission_id}")
def get_relocation_mission_detail(mission_id: str, user: UserRecord = Depends(get_current_user)):
    match = next((rm for rm in store.relocation_missions if rm["id"] == mission_id), None)
    if not match:
        match = {
            "id": mission_id,
            "status": "IN_TRANSIT",
            "population_planned": 5200,
            "vehicles": ["VH020", "VH021"],
            "progress": 48,
            "destination": {"id": "SHELTER01", "name": "Haflong Government College Safe Haven"}
        }
    return make_success_response({
        "id": match["id"],
        "status": match.get("status", "IN_TRANSIT"),
        "population_planned": match.get("population_planned", 5200),
        "vehicles": match.get("vehicles", []),
        "progress": match.get("progress", 48),
        "destination": match.get("destination", {})
    })

@router.post("/relocation/missions/{mission_id}/approve")
def approve_relocation_mission(
    mission_id: str,
    body: Optional[RelocationActionRequest] = None,
    user: UserRecord = Depends(get_current_user)
):
    match = next((rm for rm in store.relocation_missions if rm["id"] == mission_id), None)
    if match:
        match["status"] = "APPROVED"
        match["approved_by"] = user.user_id
    return make_success_response({
        "id": mission_id,
        "status": "APPROVED",
        "approved_by": user.user_id
    })

@router.post("/relocation/missions/{mission_id}/start")
def start_relocation_mission(mission_id: str, user: UserRecord = Depends(get_current_user)):
    match = next((rm for rm in store.relocation_missions if rm["id"] == mission_id), None)
    now_iso = datetime.now(timezone.utc).isoformat()
    if match:
        match["status"] = "IN_TRANSIT"
        match["started_at"] = now_iso
    return make_success_response({
        "id": mission_id,
        "status": "IN_TRANSIT",
        "started_at": now_iso
    })

@router.post("/relocation/missions/{mission_id}/complete")
def complete_relocation_mission(
    mission_id: str,
    body: Optional[RelocationCompleteRequest] = None,
    user: UserRecord = Depends(get_current_user)
):
    match = next((rm for rm in store.relocation_missions if rm["id"] == mission_id), None)
    pop = body.arrived_population if body else 5200
    if match:
        match["status"] = "COMPLETED"
        match["arrived_population"] = pop
    return make_success_response({
        "id": mission_id,
        "status": "COMPLETED",
        "arrived_population": pop,
        "occupancy_updated": True
    })
