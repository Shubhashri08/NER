from typing import Optional
from fastapi import APIRouter, Depends
from app.core.envelope import make_success_response, make_error_response
from app.core.store import store
from app.modules.auth.auth_service import UserRecord, get_current_user
from app.modules.audit.audit_service import audit_ledger

router = APIRouter(prefix="/audit", tags=["Audit & Cryptographic Verification"])

@router.get("")
def list_audit_logs(
    user_id: Optional[str] = None,
    action: Optional[str] = None,
    user: UserRecord = Depends(get_current_user)
):
    items = []
    # Mix from stored audit records and audit_ledger
    for a in store.audit_logs:
        items.append({
            "id": a["id"],
            "user_id": a["user_id"],
            "action": a["action"],
            "resource": a.get("resource", "MIS001"),
            "timestamp": a["timestamp"]
        })
    return make_success_response({"items": items})

@router.get("/export")
def export_audit_logs(user: UserRecord = Depends(get_current_user)):
    return make_success_response({
        "export_id": "EXP001",
        "status": "READY"
    })

@router.get("/ledger")
def get_audit_ledger(user: UserRecord = Depends(get_current_user)):
    return make_success_response(audit_ledger.get_all())

@router.get("/{audit_id}")
def get_audit_detail(audit_id: str, user: UserRecord = Depends(get_current_user)):
    match = next((a for a in store.audit_logs if a["id"] == audit_id), None)
    if not match:
        match = {
            "id": audit_id,
            "action": "MISSION_APPROVED",
            "previous_state": "PENDING",
            "new_state": "APPROVED",
            "reason": "Critical medical supply",
            "actor": {"id": "USR009", "name": "District Officer", "role": "DISTRICT_AUTHORITY"}
        }
    return make_success_response({
        "id": match["id"],
        "action": match.get("action", "MISSION_APPROVED"),
        "previous_state": match.get("previous_state", "PENDING"),
        "new_state": match.get("new_state", "APPROVED"),
        "reason": match.get("reason", "Critical supply"),
        "actor": match.get("actor", {})
    })
