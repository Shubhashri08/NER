from enum import Enum
from typing import Optional
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.core.config import settings

# 8 Official Government Roles strictly per docs/02-SYSTEM-ROLES.md
class SystemRole(str, Enum):
    ROLE_STATE_AUTH = "ROLE_STATE_AUTH"
    ROLE_DISTRICT_AUTH = "ROLE_DISTRICT_AUTH"
    ROLE_LOGISTICS_COORD = "ROLE_LOGISTICS_COORD"
    ROLE_FIELD_OFFICER = "ROLE_FIELD_OFFICER"
    ROLE_SHELTER_COORD = "ROLE_SHELTER_COORD"
    ROLE_TRANSPORT_OP = "ROLE_TRANSPORT_OP"
    ROLE_RESPONSE_AGENCY = "ROLE_RESPONSE_AGENCY"
    ROLE_SYS_ADMIN = "ROLE_SYS_ADMIN"

class UserRecord(BaseModel):
    user_id: str
    username: str
    full_name: str
    role: SystemRole
    department: str
    is_active: bool = True

# Authoritative In-Memory User Directory for District Command
USERS_DB: dict[str, dict] = {
    "dist_officer": {
        "user_id": "USR-NER-DIST-001",
        "username": "dist_officer",
        "password_hash": "admin123",
        "full_name": "Dr. Pranjal Borah, IAS",
        "role": SystemRole.ROLE_DISTRICT_AUTH,
        "department": "Dima Hasao District Disaster Management Authority (DDMA)",
        "jurisdiction": "Dima Hasao District, Assam",
        "is_active": True
    },
    "state_officer": {
        "user_id": "USR-NER-STATE-001",
        "username": "state_officer",
        "password_hash": "admin123",
        "full_name": "Gyanendra Dev Tripathi, IAS",
        "role": SystemRole.ROLE_STATE_AUTH,
        "department": "Assam State Disaster Management Authority (ASDMA)",
        "jurisdiction": "North Eastern Region (NER Inter-State Operations)",
        "is_active": True
    },
    "logistics_lead": {
        "user_id": "USR-NER-LOG-002",
        "username": "logistics_lead",
        "password_hash": "admin123",
        "full_name": "Col. B. K. Sarma (Retd)",
        "role": SystemRole.ROLE_LOGISTICS_COORD,
        "department": "Regional Food & Medical Staging Warehouses",
        "jurisdiction": "Silchar-Haflong Logistics Corridor",
        "is_active": True
    },
    "field_officer": {
        "user_id": "USR-NER-FO-003",
        "username": "field_officer",
        "password_hash": "admin123",
        "full_name": "Romen Deka, Circle Officer",
        "role": SystemRole.ROLE_FIELD_OFFICER,
        "department": "Harangajao Field Recon & SITREP Cell",
        "jurisdiction": "NH-27 Cut Zone / Harangajao Block",
        "is_active": True
    },
    "shelter_coord": {
        "user_id": "USR-NER-SHL-004",
        "username": "shelter_coord",
        "password_hash": "admin123",
        "full_name": "Ananya Hazarika, ACS",
        "role": SystemRole.ROLE_SHELTER_COORD,
        "department": "Social Welfare & Camp Relocation Directorate",
        "jurisdiction": "Haflong & Southern Cachar Relief Shelters",
        "is_active": True
    },
    "transport_op": {
        "user_id": "USR-NER-TRN-005",
        "username": "transport_op",
        "password_hash": "admin123",
        "full_name": "Subedar M. K. Thapa",
        "role": SystemRole.ROLE_TRANSPORT_OP,
        "department": "Border Roads Organisation (BRO) Convoy Wing",
        "jurisdiction": "BRO Old Mahur Bypass Corridor",
        "is_active": True
    },
    "response_agency": {
        "user_id": "USR-NER-NDRF-006",
        "username": "response_agency",
        "password_hash": "admin123",
        "full_name": "Commandant Rajesh Pathak",
        "role": SystemRole.ROLE_RESPONSE_AGENCY,
        "department": "1st Battalion National Disaster Response Force (NDRF)",
        "jurisdiction": "Guwahati-Barak Valley Operational Sector",
        "is_active": True
    },
    "admin": {
        "user_id": "USR-NER-SYS-000",
        "username": "admin",
        "password_hash": "admin123",
        "full_name": "Himangshu Sharma",
        "role": SystemRole.ROLE_SYS_ADMIN,
        "department": "National Informatics Centre (NIC) Disaster Support Unit",
        "jurisdiction": "System Technical Administration (Zero Ops Authority)",
        "is_active": True
    }
}

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

async def get_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> UserRecord:
    # If no token provided in request header, default gracefully to the primary district authority for interactive exploration
    if not token:
        u = USERS_DB["dist_officer"]
        return UserRecord(
            user_id=u["user_id"],
            username=u["username"],
            full_name=u["full_name"],
            role=u["role"],
            department=u["department"],
            is_active=u["is_active"]
        )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None or username not in USERS_DB:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        u = USERS_DB[username]
        return UserRecord(
            user_id=u["user_id"],
            username=u["username"],
            full_name=u["full_name"],
            role=u["role"],
            department=u["department"],
            is_active=u["is_active"]
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

def require_roles(*allowed_roles: SystemRole):
    def role_checker(current_user: UserRecord = Depends(get_current_user)) -> UserRecord:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: Operation requires one of {[r.value for r in allowed_roles]}. Current role: {current_user.role.value}"
            )
        return current_user
    return role_checker
