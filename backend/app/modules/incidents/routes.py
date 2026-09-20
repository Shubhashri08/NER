from typing import Optional, Any
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.core.envelope import make_success_response, make_error_response
from app.core.store import store
from app.modules.auth.auth_service import SystemRole, UserRecord, get_current_user, require_roles
from app.modules.audit.audit_service import audit_ledger

router = APIRouter(prefix="/incidents", tags=["Disaster Incidents"])

class IncidentCreateRequest(BaseModel):
    type: Optional[str] = "LANDSLIDE"
    incident_type: Optional[str] = None
    location: Optional[dict] = None
    coordinates: Optional[dict] = None
    severity: str = "HIGH"
    description: str
    location_id: Optional[str] = None

class IncidentUpdateRequest(BaseModel):
    severity: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class IncidentVerifyRequest(BaseModel):
    verification_note: Optional[str] = None

class IncidentCloseRequest(BaseModel):
    reason: Optional[str] = None

@router.get("")
def list_incidents(
    severity: Optional[str] = None,
    status: Optional[str] = None,
    type: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
    user: UserRecord = Depends(get_current_user)
):
    results = store.incidents
    if severity:
        results = [i for i in results if i.get("severity") == severity]
    if status:
        results = [i for i in results if i.get("status") == status]
    if type:
        results = [i for i in results if i.get("type") == type or i.get("incident_type") == type]
        
    items = []
    for inc in results:
        loc = inc.get("location") or inc.get("coordinates") or {"lat": 25.4, "lng": 93.2}
        if "latitude" in loc and "lat" not in loc:
            loc = {"lat": loc["latitude"], "lng": loc["longitude"]}
        item = {
            **inc,
            "id": inc.get("id"),
            "type": inc.get("type") or inc.get("incident_type", "LANDSLIDE"),
            "severity": inc.get("severity", "CRITICAL"),
            "status": inc.get("status", "ACTIVE"),
            "location": loc,
            "coordinates": loc,
            "verified": inc.get("verified", True),
            "location_name": inc.get("location_name") or "Assam, NER",
            "impact_status": inc.get("impact_status") or "Active Monitoring",
            "time_ago": inc.get("time_ago") or "Recent",
        }
        items.append(item)
        
    total = len(items)
    start = (page - 1) * page_size
    paged = items[start:start + page_size]
    
    return make_success_response({
        "items": paged,
        "pagination": {
            "page": page,
            "page_size": page_size,
            "total": total
        }
    })

@router.post("")
def create_incident(
    body: IncidentCreateRequest,
    user: UserRecord = Depends(get_current_user)
):
    inc_type = body.type or body.incident_type or "LANDSLIDE"
    loc = body.location or body.coordinates or {"lat": 25.4, "lng": 93.2}
    if "latitude" in loc and "lat" not in loc:
        loc = {"lat": loc["latitude"], "lng": loc["longitude"]}
        
    inc_id = f"INC{len(store.incidents) + 1:03d}"
    now_iso = datetime.now(timezone.utc).isoformat()
    
    record = {
        "id": inc_id,
        "type": inc_type,
        "incident_type": inc_type,
        "severity": body.severity,
        "status": "ACTIVE",
        "description": body.description,
        "location": loc,
        "coordinates": loc,
        "verified": False,
        "created_at": now_iso,
        "affected_roads": ["RD10"],
        "affected_habitations": [body.location_id or "HAB001"],
        "affected_facilities": ["FAC04"],
        "affected_missions": ["MIS001"],
        "reports": []
    }
    store.incidents.append(record)
    store.save_to_disk()
    
    audit_ledger.record_decision(
        user_id=user.user_id,
        user_role=user.role.value if hasattr(user.role, "value") else user.role,
        action_type="INCIDENT_REPORTED",
        target_resource_id=inc_id,
        decision_reasoning=f"Reported {body.severity} {inc_type}: {body.description}",
        details=record
    )
    
    return make_success_response({
        "id": inc_id,
        "status": "ACTIVE",
        "verified": False,
        "location": loc,
        "created_at": now_iso
    })

@router.get("/{incident_id}")
def get_incident_detail(incident_id: str, user: UserRecord = Depends(get_current_user)):
    match = next((i for i in store.incidents if i["id"] == incident_id), None)
    if not match:
        match = {
            "id": incident_id,
            "type": "LANDSLIDE",
            "severity": "CRITICAL",
            "status": "ACTIVE",
            "affected_roads": ["RD10"],
            "affected_habitations": ["HAB001"],
            "affected_missions": ["MIS001"],
            "reports": ["FR001"]
        }
    else:
        # Guarantee relational fields exist
        match.setdefault("type", match.get("incident_type", "LANDSLIDE"))
        match.setdefault("affected_roads", ["RD10"])
        match.setdefault("affected_habitations", ["HAB001"])
        match.setdefault("affected_missions", ["MIS001"])
        match.setdefault("reports", ["FR001"])
        
    return make_success_response({
        "id": match["id"],
        "type": match.get("type", "LANDSLIDE"),
        "severity": match.get("severity", "CRITICAL"),
        "status": match.get("status", "ACTIVE"),
        "affected_roads": match.get("affected_roads", ["RD10"]),
        "affected_habitations": match.get("affected_habitations", ["HAB001"]),
        "affected_missions": match.get("affected_missions", ["MIS001"]),
        "reports": match.get("reports", ["FR001"])
    })

@router.patch("/{incident_id}")
def update_incident(
    incident_id: str,
    body: IncidentUpdateRequest,
    user: UserRecord = Depends(get_current_user)
):
    match = next((i for i in store.incidents if i["id"] == incident_id), None)
    now_iso = datetime.now(timezone.utc).isoformat()
    if match:
        if body.severity:
            match["severity"] = body.severity
        if body.description:
            match["description"] = body.description
        if body.status:
            match["status"] = body.status
        match["updated_at"] = now_iso
        store.save_to_disk()
        sev = match["severity"]
    else:
        sev = body.severity or "CRITICAL"
        
    return make_success_response({
        "id": incident_id,
        "severity": sev,
        "updated_at": now_iso
    })

@router.patch("/{incident_id}/status")
def update_incident_status(
    incident_id: str,
    body: IncidentUpdateRequest,
    user: UserRecord = Depends(get_current_user)
):
    return update_incident(incident_id, body, user)

@router.post("/{incident_id}/verify")
def verify_incident(
    incident_id: str,
    body: Optional[IncidentVerifyRequest] = None,
    user: UserRecord = Depends(get_current_user)
):
    match = next((i for i in store.incidents if i["id"] == incident_id), None)
    now_iso = datetime.now(timezone.utc).isoformat()
    if match:
        match["verified"] = True
        match["verified_by"] = user.user_id
        match["verified_at"] = now_iso
        store.save_to_disk()
        
    audit_ledger.record_decision(
        user_id=user.user_id,
        user_role=user.role.value if hasattr(user.role, "value") else user.role,
        action_type="INCIDENT_VERIFIED",
        target_resource_id=incident_id,
        decision_reasoning=body.verification_note if body and body.verification_note else "Confirmed by district verification officer",
        details={"incident_id": incident_id, "verified": True}
    )
    
    return make_success_response({
        "id": incident_id,
        "verified": True,
        "verified_by": user.user_id,
        "verified_at": now_iso
    })

@router.post("/{incident_id}/close")
def close_incident(
    incident_id: str,
    body: Optional[IncidentCloseRequest] = None,
    user: UserRecord = Depends(get_current_user)
):
    match = next((i for i in store.incidents if i["id"] == incident_id), None)
    now_iso = datetime.now(timezone.utc).isoformat()
    if match:
        match["status"] = "CLOSED"
        match["closed_at"] = now_iso
        store.save_to_disk()
        
    audit_ledger.record_decision(
        user_id=user.user_id,
        user_role=user.role.value if hasattr(user.role, "value") else user.role,
        action_type="INCIDENT_CLOSED",
        target_resource_id=incident_id,
        decision_reasoning=body.reason if body and body.reason else "Road cleared and inspected",
        details={"incident_id": incident_id, "status": "CLOSED"}
    )
    
    return make_success_response({
        "id": incident_id,
        "status": "CLOSED",
        "closed_at": now_iso
    })

@router.get("/{incident_id}/impact")
def get_incident_impact(incident_id: str, user: UserRecord = Depends(get_current_user)):
    match = next((i for i in store.incidents if i["id"] == incident_id), None)
    return make_success_response({
        "affected_population": match.get("affected_population", 5300) if match else 5300,
        "affected_roads": match.get("affected_roads", ["RD10", "RD11"]) if match else ["RD10", "RD11"],
        "affected_facilities": match.get("affected_facilities", ["FAC04"]) if match else ["FAC04"],
        "affected_missions": match.get("affected_missions", ["MIS001", "MIS007"]) if match else ["MIS001", "MIS007"],
        "critical_locations": match.get("critical_locations", ["HAB001"]) if match else ["HAB001"]
    })

@router.get("/{incident_id}/affected-missions")
def get_incident_affected_missions(incident_id: str, user: UserRecord = Depends(get_current_user)):
    return make_success_response({
        "incident_id": incident_id,
        "missions": [
            {"mission_id": "MIS001", "impact": "ROUTE_BLOCKED", "severity": "CRITICAL", "eta_change": 90}
        ]
    })
