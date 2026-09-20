from typing import Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.core.envelope import make_success_response, make_error_response
from app.modules.auth.auth_service import (
    SystemRole, UserRecord, USERS_DB, create_access_token, get_current_user
)

router = APIRouter(prefix="/auth", tags=["Auth & Permissions"])

class LoginRequest(BaseModel):
    username: str
    password: str

class RefreshRequest(BaseModel):
    refresh_token: Optional[str] = None

class LogoutRequest(BaseModel):
    refresh_token: Optional[str] = None

ROLE_PERMISSIONS = {
    SystemRole.ROLE_DISTRICT_AUTH: ["incident.read", "incident.create", "incident.update", "incident.verify", "incident.close", "logistics.read", "logistics.create", "mission.create", "mission.approve", "relocation.approve", "approvals.manage", "reports.generate"],
    SystemRole.ROLE_STATE_AUTH: ["incident.read", "logistics.read", "mission.read", "relocation.read", "reports.read", "dashboard.state"],
    SystemRole.ROLE_LOGISTICS_COORD: ["logistics.read", "logistics.create", "logistics.update", "inventory.manage", "mission.create", "vehicles.assign", "replanning.generate"],
    SystemRole.ROLE_FIELD_OFFICER: ["incident.read", "incident.create", "reports.field.create", "voice.create", "logistics.create", "sync.offline"],
    SystemRole.ROLE_SHELTER_COORD: ["shelters.read", "shelters.manage", "relocation.read", "relocation.create"],
    SystemRole.ROLE_TRANSPORT_OP: ["vehicles.read", "vehicles.telemetry", "missions.report", "missions.execute"],
    SystemRole.ROLE_RESPONSE_AGENCY: ["incident.read", "roads.manage", "alerts.read", "gis.read"],
    SystemRole.ROLE_SYS_ADMIN: ["users.manage", "config.manage", "audit.read", "edge.manage", "system.all"]
}

@router.post("/login")
def login(creds: LoginRequest):
    user = USERS_DB.get(creds.username)
    if not user or user["password_hash"] != creds.password:
        return make_error_response("INVALID_CREDENTIALS", "Invalid username or password")
    
    token = create_access_token({"sub": user["username"], "role": user["role"].value if hasattr(user["role"], "value") else user["role"]})
    refresh_token = create_access_token({"sub": user["username"], "type": "refresh"})
    
    return make_success_response({
        "access_token": token,
        "refresh_token": refresh_token,
        "expires_in": 3600,
        "user": {
            "id": user["user_id"],
            "name": user["full_name"],
            "role": user["role"].value if hasattr(user["role"], "value") else user["role"],
            "department": user["department"],
            "state": "Assam",
            "district": "Dima Hasao"
        }
    })

@router.post("/refresh")
def refresh_token(body: Optional[RefreshRequest] = None, user: UserRecord = Depends(get_current_user)):
    new_token = create_access_token({"sub": user.username, "role": user.role.value if hasattr(user.role, "value") else user.role})
    return make_success_response({
        "access_token": new_token,
        "expires_in": 3600
    })

@router.post("/logout")
def logout(body: Optional[LogoutRequest] = None):
    return make_success_response({"logged_out": True})

@router.get("/me")
def get_me(user: UserRecord = Depends(get_current_user)):
    perms = ROLE_PERMISSIONS.get(user.role, ["incident.read", "logistics.read"])
    return make_success_response({
        "id": user.user_id,
        "name": user.full_name,
        "role": user.role.value if hasattr(user.role, "value") else user.role,
        "department": user.department,
        "jurisdiction": {
            "state": "Assam",
            "district": "Dima Hasao"
        },
        "permissions": perms
    })

@router.get("/permissions")
def get_permissions(user: UserRecord = Depends(get_current_user)):
    perms = ROLE_PERMISSIONS.get(user.role, ["incident.read", "logistics.read"])
    return make_success_response({
        "permissions": perms
    })
