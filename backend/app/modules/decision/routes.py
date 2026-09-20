from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.core.envelope import make_success_response, make_error_response
from app.core.store import store
from app.modules.auth.auth_service import UserRecord, get_current_user
from app.modules.decision.decision_service import decision_engine

router = APIRouter(prefix="/decision", tags=["AI Decision Support Engines"])

class DecisionPriorityRequest(BaseModel):
    location_id: Optional[str] = "HAB001"
    request_id: Optional[str] = "REQ001"

class DecisionResourceMatchRequest(BaseModel):
    request_id: str = "REQ001"

class DecisionVehicleMatchRequest(BaseModel):
    request_id: str = "REQ001"

class DecisionExplainRequest(BaseModel):
    entity_type: str = "MISSION"
    entity_id: str = "MIS001"

@router.post("/priority")
def calculate_priority_score(
    body: DecisionPriorityRequest,
    user: UserRecord = Depends(get_current_user)
):
    return make_success_response({
        "priority_score": 94,
        "priority": "CRITICAL",
        "factors": [
            {"factor": "Population at risk", "score": 91},
            {"factor": "Time to stockout", "score": 98},
            {"factor": "Hazard severity", "score": 87}
        ],
        "data_freshness": "3 minutes"
    })

@router.post("/resource-match")
def match_resources(
    body: DecisionResourceMatchRequest,
    user: UserRecord = Depends(get_current_user)
):
    return make_success_response({
        "recommendations": [
            {"warehouse_id": "WH01", "available": 4000, "distance_km": 72, "score": 91},
            {"warehouse_id": "WH04", "available": 3200, "distance_km": 115, "score": 84}
        ]
    })

@router.post("/vehicle-match")
def match_vehicles(
    body: DecisionVehicleMatchRequest,
    user: UserRecord = Depends(get_current_user)
):
    return make_success_response({
        "vehicles": [
            {"vehicle_id": "VH017", "capacity_fit": 0.92, "terrain_fit": 0.97, "availability": True, "score": 91},
            {"vehicle_id": "VH018", "capacity_fit": 0.65, "terrain_fit": 0.99, "availability": True, "score": 82}
        ]
    })

@router.post("/explain")
def explain_decision(
    body: DecisionExplainRequest,
    user: UserRecord = Depends(get_current_user)
):
    return make_success_response({
        "recommendation": "Use Vehicle VH017 via Route R2",
        "why": [
            "Route R1 contains active landslide blockage",
            "VH017 has required terrain capability",
            "Warehouse WH03 has sufficient stock"
        ],
        "confidence": 0.89,
        "data_freshness": "4 minutes"
    })
