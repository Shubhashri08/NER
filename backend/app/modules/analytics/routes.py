from typing import Optional
from fastapi import APIRouter, Depends
from app.core.envelope import make_success_response, make_error_response
from app.core.store import store
from app.modules.auth.auth_service import UserRecord, get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics & Reporting"])

@router.get("/logistics")
def get_logistics_analytics(user: UserRecord = Depends(get_current_user)):
    return make_success_response({
        "requests_total": 120,
        "completed": 92,
        "pending": 28,
        "average_delivery_time_min": 184,
        "delayed_missions": 11,
        "warehouse_utilization": 0.68,
        "vehicle_utilization": 0.74
    })

@router.get("/routes")
def get_route_analytics(user: UserRecord = Depends(get_current_user)):
    return make_success_response({
        "routes_calculated": 480,
        "routes_blocked": 32,
        "reroutes": 41,
        "average_delay_min": 27
    })

@router.get("/relocation")
def get_relocation_analytics(user: UserRecord = Depends(get_current_user)):
    return make_success_response({
        "locations_assessed": 31,
        "requiring_relocation": 4,
        "population_affected": 18200,
        "available_shelter_capacity": 24400,
        "transport_required": 61
    })

@router.get("/history")
def get_historical_analytics(
    state_id: Optional[str] = None,
    district_id: Optional[str] = None,
    user: UserRecord = Depends(get_current_user)
):
    return make_success_response({
        "series": [
            {"date": "2026-09-10", "incidents": 12, "missions": 32},
            {"date": "2026-09-11", "incidents": 15, "missions": 38},
            {"date": "2026-09-12", "incidents": 19, "missions": 44},
            {"date": "2026-09-13", "incidents": 24, "missions": 52},
            {"date": "2026-09-14", "incidents": 21, "missions": 49},
            {"date": "2026-09-15", "incidents": 18, "missions": 46},
            {"date": "2026-09-16", "incidents": 16, "missions": 42}
        ]
    })
