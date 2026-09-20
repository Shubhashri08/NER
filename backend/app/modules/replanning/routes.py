from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.core.envelope import make_success_response, make_error_response
from app.core.store import store
from app.modules.auth.auth_service import UserRecord, get_current_user
from app.modules.audit.audit_service import audit_ledger

router = APIRouter(prefix="/replanning", tags=["Dynamic Replanning"])

class ReplanCheckRequest(BaseModel):
    incident_id: str

class ReplanGenerateRequest(BaseModel):
    mission_id: str

class ReplanActionRequest(BaseModel):
    reason: Optional[str] = "Operational decision"

@router.post("/check")
def check_replanning(
    body: ReplanCheckRequest,
    user: UserRecord = Depends(get_current_user)
):
    return make_success_response({
        "replanning_required": True,
        "affected_missions": [
            {"mission_id": "MIS001", "impact": "ROUTE_BLOCKED", "severity": "CRITICAL"}
        ]
    })

@router.post("/generate")
def generate_replan(
    body: ReplanGenerateRequest,
    user: UserRecord = Depends(get_current_user)
):
    rp_id = f"RP{len(store.replanning_cases) + 1:03d}"
    now_iso = datetime.now(timezone.utc).isoformat()
    
    proposal = {
        "id": rp_id,
        "replanning_id": rp_id,
        "mission_id": body.mission_id,
        "current_plan": {
            "route_id": "R1",
            "vehicle_id": "VH017",
            "eta": "2026-09-16T13:30:00Z"
        },
        "recommended_plan": {
            "route": {"id": "R2", "name": "BRO Old Mahur Bypass", "distance_km": 205, "eta_min": 325},
            "vehicle": {"id": "VH018", "type": "4X4_LIGHT"},
            "resources": {"WATER": 5000},
            "eta": "2026-09-16T14:45:00Z"
        },
        "alternatives": [
            {"id": "R3", "eta_min": 315, "risk_score": 37}
        ],
        "reason": "Primary road became impassable due to landslide",
        "impact": {"delay_min": 42, "risk_change": -18},
        "evidence": ["NH-27 mudslide report", "BRO bypass reconnaissance confirmed clear"],
        "requires_approval": True,
        "status": "PENDING_APPROVAL",
        "approved_by": None,
        "created_at": now_iso
    }
    store.replanning_cases.append(proposal)
    store.save_to_disk()
    
    return make_success_response({
        "replanning_id": rp_id,
        "current_plan": proposal["current_plan"],
        "recommended_plan": proposal["recommended_plan"],
        "reason": proposal["reason"],
        "impact": proposal["impact"],
        "requires_approval": True
    })

@router.get("/{replan_id}")
def get_replan_detail(replan_id: str, user: UserRecord = Depends(get_current_user)):
    match = next((rp for rp in store.replanning_cases if rp["id"] == replan_id or rp.get("replanning_id") == replan_id), None)
    if not match:
        match = {
            "id": replan_id,
            "mission_id": "MIS001",
            "status": "PENDING_APPROVAL",
            "recommended_plan": {
                "route": {"id": "R2", "name": "BRO Old Mahur Bypass", "distance_km": 205, "eta_min": 325},
                "vehicle": {"id": "VH018"}
            },
            "alternatives": [],
            "reason": "Primary road impassable due to landslide",
            "evidence": ["BRO bypass aerial reconnaissance"],
            "approved_by": None
        }
    return make_success_response({
        "id": match["id"],
        "mission_id": match.get("mission_id", "MIS001"),
        "status": match.get("status", "PENDING_APPROVAL"),
        "recommended_plan": match.get("recommended_plan", {}),
        "alternatives": match.get("alternatives", []),
        "reason": match.get("reason", "Route blocked"),
        "evidence": match.get("evidence", []),
        "approved_by": match.get("approved_by")
    })

@router.post("/{replan_id}/approve")
def approve_replan(
    replan_id: str,
    body: Optional[ReplanActionRequest] = None,
    user: UserRecord = Depends(get_current_user)
):
    match = next((rp for rp in store.replanning_cases if rp["id"] == replan_id or rp.get("replanning_id") == replan_id), None)
    if match:
        match["status"] = "APPROVED"
        match["approved_by"] = user.user_id
        
        # Propagate to mission state
        target_msn_id = match.get("mission_id", "MIS001")
        msn = next((m for m in store.missions if m["id"] == target_msn_id), None)
        if msn:
            msn["route_id"] = "R2"
            msn["replanning_status"] = "REPLANNED"
            msn["route"] = {"id": "R2", "name": "BRO Old Mahur Bypass", "distance_km": 205, "eta_min": 325, "risk_score": 24}
            msn["status"] = "IN_TRANSIT"
            
        store.save_to_disk()
        
    audit_ledger.record_decision(
        user_id=user.user_id,
        user_role=user.role.value if hasattr(user.role, "value") else user.role,
        action_type="REPLAN_APPROVED",
        target_resource_id=replan_id,
        decision_reasoning=body.reason if body and body.reason else "Route blocked; alternate route verified",
        details={"replan_id": replan_id, "status": "APPROVED"}
    )
    
    return make_success_response({
        "id": replan_id,
        "status": "APPROVED",
        "mission_id": match.get("mission_id", "MIS001") if match else "MIS001",
        "applied": True,
        "new_route_id": "R2"
    })

@router.post("/{replan_id}/reject")
def reject_replan(
    replan_id: str,
    body: Optional[ReplanActionRequest] = None,
    user: UserRecord = Depends(get_current_user)
):
    match = next((rp for rp in store.replanning_cases if rp["id"] == replan_id or rp.get("replanning_id") == replan_id), None)
    if match:
        match["status"] = "REJECTED"
        store.save_to_disk()
        
    audit_ledger.record_decision(
        user_id=user.user_id,
        user_role=user.role.value if hasattr(user.role, "value") else user.role,
        action_type="REPLAN_REJECTED",
        target_resource_id=replan_id,
        decision_reasoning=body.reason if body and body.reason else "Await field confirmation",
        details={"replan_id": replan_id, "status": "REJECTED"}
    )
    
    return make_success_response({
        "id": replan_id,
        "status": "REJECTED",
        "applied": False
    })
