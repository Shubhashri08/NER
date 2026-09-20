from typing import Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.core.envelope import make_success_response, make_error_response
from app.core.store import store
from app.modules.auth.auth_service import UserRecord, get_current_user

router = APIRouter(tags=["Hazards, Population & Facilities"])

class FacilityCreateRequest(BaseModel):
    name: str
    type: str = "SHELTER"
    coordinates: Optional[dict] = None
    capacity: Optional[int] = 500

@router.get("/hazards")
def get_hazard_catalogue(user: UserRecord = Depends(get_current_user)):
    return make_success_response({
        "layers": [
            {"id": "flood", "name": "Flood Risk", "unit": "class", "source_type": "REAL"},
            {"id": "landslide", "name": "Landslide Susceptibility", "unit": "class", "source_type": "REAL"},
            {"id": "cyclone", "name": "Wind & Cyclone Susceptibility", "unit": "kmh", "source_type": "REAL"}
        ]
    })

@router.get("/hazards/map")
def get_hazard_map(user: UserRecord = Depends(get_current_user)):
    features = []
    if store.hazard_zones:
        for hz in store.hazard_zones:
            features.append({
                "type": "Feature",
                "properties": {
                    "hazard": hz.get("hazard_type", "LANDSLIDE"),
                    "risk": hz.get("severity_level", 4),
                    "name": hz.get("name", "Hazard Zone")
                },
                "geometry": hz.get("geometry", {})
            })
    else:
        features = [
            {"type": "Feature", "properties": {"hazard": "LANDSLIDE", "risk": 4}, "geometry": {}}
        ]
    return make_success_response({
        "type": "FeatureCollection",
        "features": features
    })

@router.get("/hazards/impact")
def get_hazard_impact(
    lat: float = 25.4,
    lng: float = 93.2,
    radius_km: float = 20.0,
    user: UserRecord = Depends(get_current_user)
):
    return make_success_response({
        "risk_score": 82,
        "hazards": [
            {"type": "LANDSLIDE", "score": 91},
            {"type": "FLOOD", "score": 63}
        ]
    })

@router.get("/population")
def get_population_data(
    location_id: Optional[str] = None,
    user: UserRecord = Depends(get_current_user)
):
    loc_id = location_id or "HAB001"
    match = next((h for h in store.habitations if h["id"] == loc_id), None)
    if match:
        return make_success_response({
            "location_id": match["id"],
            "population": match["population"],
            "households": match.get("households", 1200),
            "children": match.get("children", 820),
            "elderly": match.get("elderly", 430),
            "persons_with_disabilities": match.get("persons_with_disabilities", 95),
            "vulnerable_population": match.get("vulnerable_population", 1345)
        })
    return make_success_response({
        "location_id": loc_id,
        "population": 5300,
        "households": 1200,
        "children": 820,
        "elderly": 430,
        "persons_with_disabilities": 95,
        "vulnerable_population": 1345
    })

@router.get("/population/{location_id}/vulnerability")
def get_population_vulnerability(location_id: str, user: UserRecord = Depends(get_current_user)):
    match = next((h for h in store.habitations if h["id"] == location_id), None)
    if match and "vulnerability_score" in match:
        return make_success_response({
            "score": match["vulnerability_score"],
            "factors": match.get("vulnerability_factors", {
                "population": 80,
                "accessibility": 90,
                "hazard": 85,
                "critical_facility_dependency": 60
            })
        })
    return make_success_response({
        "score": 78,
        "factors": {
            "population": 80,
            "accessibility": 90,
            "hazard": 85,
            "critical_facility_dependency": 60
        }
    })

@router.get("/facilities")
def list_facilities(
    type: Optional[str] = None,
    user: UserRecord = Depends(get_current_user)
):
    results = store.facilities
    if type:
        results = [f for f in results if f.get("type", "").upper() == type.upper()]
    return make_success_response({
        "items": [
            {
                "id": f["id"],
                "name": f["name"],
                "type": f["type"],
                "coordinates": f.get("coordinates", {}),
                "operational": f.get("operational", True)
            }
            for f in results
        ]
    })

@router.post("/facilities")
def create_facility(
    body: FacilityCreateRequest,
    user: UserRecord = Depends(get_current_user)
):
    fac_id = f"FAC{len(store.facilities) + 10:02d}"
    rec = {
        "id": fac_id,
        "name": body.name,
        "type": body.type,
        "coordinates": body.coordinates or {"lat": 25.4, "lng": 93.2},
        "operational": True,
        "capacity": body.capacity or 500,
        "current_load": 0,
        "water": "AVAILABLE",
        "medical_stock": "AVAILABLE",
        "status": "ACTIVE"
    }
    store.facilities.append(rec)
    return make_success_response({
        "id": fac_id,
        "name": body.name,
        "type": body.type,
        "status": "ACTIVE"
    })

@router.get("/facilities/{facility_id}")
def get_facility_detail(facility_id: str, user: UserRecord = Depends(get_current_user)):
    match = next((f for f in store.facilities if f["id"] == facility_id), None)
    if not match:
        match = {
            "id": facility_id,
            "operational": True,
            "capacity": 500,
            "current_load": 320,
            "water": "AVAILABLE",
            "medical_stock": "LOW"
        }
    return make_success_response({
        "id": match["id"],
        "operational": match.get("operational", True),
        "capacity": match.get("capacity", 500),
        "current_load": match.get("current_load", 320),
        "water": match.get("water", "AVAILABLE"),
        "medical_stock": match.get("medical_stock", "LOW")
    })
