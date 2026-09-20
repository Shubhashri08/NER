from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.core.envelope import make_success_response, make_error_response
from app.modules.auth.auth_service import (
    SystemRole, UserRecord, USERS_DB, require_roles, get_current_user
)
from app.modules.audit.audit_service import audit_ledger

router = APIRouter(prefix="/users", tags=["Users & Government Access"])

class CreateUserRequest(BaseModel):
    name: str
    email: str
    role: str
    department: str
    state: str = "Assam"
    district: str = "Dima Hasao"

class UpdateUserRequest(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    department: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None

class UserStatusRequest(BaseModel):
    status: str

@router.get("")
def list_users(
    role: Optional[str] = None,
    department: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
    user: UserRecord = Depends(require_roles(SystemRole.ROLE_SYS_ADMIN, SystemRole.ROLE_STATE_AUTH, SystemRole.ROLE_DISTRICT_AUTH))
):
    items = []
    for u in USERS_DB.values():
        u_role = u["role"].value if hasattr(u["role"], "value") else str(u["role"])
        if role and u_role != role:
            continue
        if department and u["department"] != department:
            continue
        items.append({
            "id": u["user_id"],
            "name": u["full_name"],
            "role": u_role,
            "department": u["department"],
            "state": "Assam",
            "district": "Dima Hasao",
            "status": "ACTIVE" if u.get("is_active", True) else "DISABLED"
        })
    
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
def create_user(
    body: CreateUserRequest,
    user: UserRecord = Depends(require_roles(SystemRole.ROLE_SYS_ADMIN))
):
    user_id = f"USR{len(USERS_DB) + 10:03d}"
    username = body.email.split("@")[0]
    
    USERS_DB[username] = {
        "user_id": user_id,
        "username": username,
        "password_hash": "admin123",
        "full_name": body.name,
        "role": getattr(SystemRole, body.role, SystemRole.ROLE_FIELD_OFFICER),
        "department": body.department,
        "jurisdiction": f"{body.district}, {body.state}",
        "is_active": True
    }
    
    audit_ledger.record_decision(
        user_id=user.user_id,
        user_role=user.role.value if hasattr(user.role, "value") else user.role,
        action_type="USER_CREATED",
        target_resource_id=user_id,
        decision_reasoning=f"Created user {body.name} ({body.role}) for {body.district}",
        details={"user_id": user_id, "role": body.role}
    )
    
    return make_success_response({
        "id": user_id,
        "status": "ACTIVE",
        "role": body.role,
        "jurisdiction": {
            "state": body.state,
            "district": body.district
        }
    })

@router.get("/{user_id}")
def get_user_detail(user_id: str, user: UserRecord = Depends(get_current_user)):
    match = next((u for u in USERS_DB.values() if u["user_id"] == user_id or u["username"] == user_id), None)
    if not match:
        return make_error_response("NOT_FOUND", f"User {user_id} not found")
    
    u_role = match["role"].value if hasattr(match["role"], "value") else str(match["role"])
    return make_success_response({
        "id": match["user_id"],
        "name": match["full_name"],
        "role": u_role,
        "department": match["department"],
        "jurisdiction": {"state": "Assam", "district": "Dima Hasao"},
        "status": "ACTIVE" if match.get("is_active", True) else "DISABLED"
    })

@router.patch("/{user_id}")
def update_user(
    user_id: str,
    body: UpdateUserRequest,
    user: UserRecord = Depends(require_roles(SystemRole.ROLE_SYS_ADMIN))
):
    match = next((u for u in USERS_DB.values() if u["user_id"] == user_id or u["username"] == user_id), None)
    if not match:
        return make_error_response("NOT_FOUND", f"User {user_id} not found")
    
    if body.role:
        match["role"] = getattr(SystemRole, body.role, match["role"])
    if body.name:
        match["full_name"] = body.name
    if body.department:
        match["department"] = body.department
        
    u_role = match["role"].value if hasattr(match["role"], "value") else str(match["role"])
    return make_success_response({
        "id": match["user_id"],
        "role": u_role,
        "updated_at": datetime.now(timezone.utc).isoformat()
    })

@router.patch("/{user_id}/status")
def change_user_status(
    user_id: str,
    body: UserStatusRequest,
    user: UserRecord = Depends(require_roles(SystemRole.ROLE_SYS_ADMIN))
):
    match = next((u for u in USERS_DB.values() if u["user_id"] == user_id or u["username"] == user_id), None)
    if not match:
        return make_error_response("NOT_FOUND", f"User {user_id} not found")
    
    match["is_active"] = (body.status.upper() == "ACTIVE")
    return make_success_response({
        "id": match["user_id"],
        "status": body.status
    })

@router.get("/{user_id}/activity")
def get_user_activity(user_id: str, user: UserRecord = Depends(get_current_user)):
    user_records = [
        {"action": "MISSION_APPROVED", "resource_id": "MIS001", "timestamp": "2026-09-16T07:15:00Z"},
        {"action": "INCIDENT_VERIFIED", "resource_id": "INC001", "timestamp": "2026-09-16T06:45:00Z"}
    ]
    return make_success_response({
        "items": user_records
    })
