from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.core.envelope import make_success_response, make_error_response
from app.core.store import store
from app.modules.auth.auth_service import UserRecord, get_current_user

router = APIRouter(prefix="/config", tags=["System Configuration"])

class PriorityFactorItem(BaseModel):
    name: str
    weight: float

class UpdatePriorityRulesRequest(BaseModel):
    version: str = "v4"
    factors: list[PriorityFactorItem]

@router.get("")
def get_system_config(user: UserRecord = Depends(get_current_user)):
    return make_success_response({
        "disaster_types": ["FLOOD", "LANDSLIDE", "CYCLONE", "EARTHQUAKE", "FLASH_FLOOD"],
        "resource_types": ["WATER", "FOOD", "MEDICINE", "SHELTER_KIT", "FUEL"],
        "vehicle_types": ["4X4_LIGHT", "4X4_HEAVY_TRUCK", "BUS", "BOAT", "HELICOPTER"],
        "priority_rules_version": store.priority_rules.get("version", "v3")
    })

@router.get("/priority-rules")
def get_priority_rules(user: UserRecord = Depends(get_current_user)):
    return make_success_response({
        "version": store.priority_rules.get("version", "v3"),
        "factors": store.priority_rules.get("factors", [
            {"name": "hazard", "weight": 0.30},
            {"name": "population", "weight": 0.25},
            {"name": "stockout_urgency", "weight": 0.30},
            {"name": "critical_dependency", "weight": 0.15}
        ])
    })

@router.patch("/priority-rules")
def update_priority_rules(
    body: UpdatePriorityRulesRequest,
    user: UserRecord = Depends(get_current_user)
):
    now_iso = datetime.now(timezone.utc).isoformat()
    store.priority_rules = {
        "version": body.version,
        "factors": [f.dict() for f in body.factors],
        "activated_at": now_iso,
        "updated_by": user.user_id
    }
    return make_success_response({
        "version": body.version,
        "activated_at": now_iso,
        "updated_by": user.user_id
    })
