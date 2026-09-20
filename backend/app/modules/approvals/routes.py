from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.core.envelope import make_success_response, make_error_response
from app.core.store import store
from app.modules.auth.auth_service import UserRecord, get_current_user
from app.modules.audit.audit_service import audit_ledger

router = APIRouter(prefix="/approvals", tags=["Approvals & Sovereign Workflow"])

class ApprovalDecisionRequest(BaseModel):
    reason: Optional[str] = "Approved after reviewing operational evidence"

@router.get("/pending")
def list_pending_approvals(user: UserRecord = Depends(get_current_user)):
    return make_success_response({
        "items": store.approvals_queue
    })

@router.post("/{item_type}/{item_id}/approve")
def approve_action(
    item_type: str,
    item_id: str,
    body: Optional[ApprovalDecisionRequest] = None,
    user: UserRecord = Depends(get_current_user)
):
    now_iso = datetime.now(timezone.utc).isoformat()
    store.approvals_queue = [it for it in store.approvals_queue if it["id"] != item_id]
    
    store.approvals_history.append({
        "type": item_type.upper(),
        "id": item_id,
        "decision": "APPROVED",
        "by": user.user_id,
        "reason": body.reason if body else "Approved",
        "timestamp": now_iso
    })
    
    return make_success_response({
        "type": item_type.upper(),
        "id": item_id,
        "status": "APPROVED",
        "approved_by": user.user_id,
        "approved_at": now_iso
    })

@router.post("/{item_type}/{item_id}/reject")
def reject_action(
    item_type: str,
    item_id: str,
    body: Optional[ApprovalDecisionRequest] = None,
    user: UserRecord = Depends(get_current_user)
):
    now_iso = datetime.now(timezone.utc).isoformat()
    store.approvals_queue = [it for it in store.approvals_queue if it["id"] != item_id]
    
    store.approvals_history.append({
        "type": item_type.upper(),
        "id": item_id,
        "decision": "REJECTED",
        "by": user.user_id,
        "reason": body.reason if body else "Rejected",
        "timestamp": now_iso
    })
    
    return make_success_response({
        "type": item_type.upper(),
        "id": item_id,
        "status": "REJECTED",
        "rejected_by": user.user_id
    })

@router.get("/history")
def get_approvals_history(user: UserRecord = Depends(get_current_user)):
    return make_success_response({
        "items": store.approvals_history
    })
