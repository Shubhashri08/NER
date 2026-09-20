from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.core.envelope import make_success_response, make_error_response
from app.core.store import store
from app.modules.auth.auth_service import UserRecord, get_current_user
from app.modules.audit.audit_service import audit_ledger

router = APIRouter(prefix="/alerts", tags=["Alerts & Critical Notifications"])

class BroadcastAlertPayload(BaseModel):
    severity: str = "CRITICAL"
    title: str
    message: str

class AlertResolveRequest(BaseModel):
    reason: Optional[str] = "Condition resolved"

@router.get("")
def list_alerts(
    severity: Optional[str] = None,
    type: Optional[str] = None,
    status: Optional[str] = None,
    user: UserRecord = Depends(get_current_user)
):
    results = store.alerts
    if severity:
        results = [a for a in results if a.get("severity") == severity]
    if type:
        results = [a for a in results if a.get("type") == type]
    if status:
        results = [a for a in results if a.get("status") == status]
        
    items = []
    for a in results:
        items.append({
            "id": a["id"],
            "type": a.get("type", "ROUTE_BLOCKED"),
            "severity": a.get("severity", "CRITICAL"),
            "status": a.get("status", "ACTIVE"),
            "related_mission_id": a.get("related_mission_id", "MIS001")
        })
    return make_success_response({"items": items})

@router.get("/active")
def list_active_alerts(user: UserRecord = Depends(get_current_user)):
    items = [
        {
            "id": a["id"],
            "severity": a.get("severity", "CRITICAL"),
            "type": a.get("type", "ROUTE_BLOCKED"),
            "acknowledged": a.get("acknowledged", False)
        }
        for a in store.alerts if a.get("status") != "RESOLVED"
    ]
    return make_success_response({"items": items})

@router.post("/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: str, user: UserRecord = Depends(get_current_user)):
    match = next((a for a in store.alerts if a["id"] == alert_id), None)
    now_iso = datetime.now(timezone.utc).isoformat()
    if match:
        match["acknowledged"] = True
        match["acknowledged_by"] = user.user_id
        match["acknowledged_at"] = now_iso
        
    return make_success_response({
        "id": alert_id,
        "acknowledged": True,
        "acknowledged_by": user.user_id,
        "acknowledged_at": now_iso
    })

@router.patch("/{alert_id}/acknowledge")
def acknowledge_alert_patch(alert_id: str, user: UserRecord = Depends(get_current_user)):
    return acknowledge_alert(alert_id, user)

@router.post("/{alert_id}/resolve")
def resolve_alert(
    alert_id: str,
    body: Optional[AlertResolveRequest] = None,
    user: UserRecord = Depends(get_current_user)
):
    match = next((a for a in store.alerts if a["id"] == alert_id), None)
    now_iso = datetime.now(timezone.utc).isoformat()
    if match:
        match["status"] = "RESOLVED"
        match["resolved_at"] = now_iso
        
    return make_success_response({
        "id": alert_id,
        "status": "RESOLVED",
        "resolved_at": now_iso
    })

@router.post("/broadcast")
def broadcast_alert(
    body: BroadcastAlertPayload,
    user: UserRecord = Depends(get_current_user)
):
    alt_id = f"ALT{len(store.alerts) + 1:03d}"
    rec = {
        "id": alt_id,
        "type": "BROADCAST_ALERT",
        "severity": body.severity,
        "title": body.title,
        "message": body.message,
        "status": "ACTIVE",
        "acknowledged": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    store.alerts.append(rec)
    return make_success_response(rec)
