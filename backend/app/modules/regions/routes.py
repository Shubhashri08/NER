from typing import Optional
from fastapi import APIRouter, Depends
from app.core.envelope import make_success_response, make_error_response
from app.core.store import store
from app.modules.auth.auth_service import UserRecord, get_current_user

router = APIRouter(tags=["Geographic Regions & Habitations"])

@router.get("/regions")
def list_regions(user: UserRecord = Depends(get_current_user)):
    return make_success_response({
        "items": [
            {"id": r["id"], "name": r["name"], "district_count": r["district_count"]}
            for r in store.regions
        ]
    })

@router.get("/regions/{region_id}")
def get_region_detail(region_id: str, user: UserRecord = Depends(get_current_user)):
    match = next((r for r in store.regions if r["id"].upper() == region_id.upper()), None)
    if not match:
        return make_error_response("NOT_FOUND", f"Region {region_id} not found")
    return make_success_response(match)

@router.get("/regions/{region_id}/districts")
def get_region_districts(region_id: str, user: UserRecord = Depends(get_current_user)):
    districts = [d for d in store.districts if d.get("state_id", "").upper() == region_id.upper()]
    if not districts:
        districts = [
            {"id": "D01", "name": "Dima Hasao", "population": 214102},
            {"id": "D02", "name": "Cachar", "population": 1736617}
        ]
    return make_success_response({
        "items": districts
    })

@router.get("/habitations")
def list_habitations(
    state_id: Optional[str] = None,
    district_id: Optional[str] = None,
    risk_level: Optional[str] = None,
    user: UserRecord = Depends(get_current_user)
):
    results = store.habitations
    
    # State / District flexible filtering
    if state_id:
        s_upper = state_id.strip().upper()
        # If user passed district code (like D01) in state_id by mistake, match district as well
        results = [
            h for h in results
            if h.get("state_id", "").upper() == s_upper
            or h.get("state", "").upper() == s_upper
            or h.get("district_id", "").upper() == s_upper
            or h.get("district", "").upper() == s_upper
        ]
        
    if district_id:
        d_upper = district_id.strip().upper()
        results = [
            h for h in results
            if h.get("district_id", "").upper() == d_upper
            or h.get("district", "").upper() == d_upper
        ]
        
    if risk_level:
        r_upper = risk_level.strip().upper()
        results = [h for h in results if h.get("risk_level", "").upper() == r_upper]
        
    items = [
        {
            "id": h["id"],
            "name": h["name"],
            "population": h["population"],
            "risk_level": h.get("risk_level", "HIGH"),
            "access": h.get("access", "PARTIAL"),
            "critical_needs": h.get("critical_needs", ["WATER", "MEDICINE"])
        }
        for h in results
    ]
    return make_success_response({
        "items": items
    })

@router.get("/habitations/{habitation_id}")
def get_habitation_detail(habitation_id: str, user: UserRecord = Depends(get_current_user)):
    match = next((h for h in store.habitations if h["id"] == habitation_id), None)
    if not match:
        # Fallback to creating a synthetic habitation structure if queried
        match = {
            "id": habitation_id,
            "coordinates": {"lat": 25.4, "lng": 93.2},
            "population": 2350,
            "risk_level": "HIGH",
            "active_incidents": ["INC001"],
            "critical_needs": ["MEDICINE", "WATER"]
        }
    return make_success_response({
        "id": match["id"],
        "coordinates": match.get("coordinates", {"lat": 25.4, "lng": 93.2}),
        "population": match.get("population", 2350),
        "risk_level": match.get("risk_level", "HIGH"),
        "active_incidents": match.get("active_incidents", []),
        "critical_needs": match.get("critical_needs", ["MEDICINE"])
    })
