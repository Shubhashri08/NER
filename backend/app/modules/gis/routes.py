from typing import Optional
from fastapi import APIRouter, Depends
from app.core.envelope import make_success_response, make_error_response
from app.core.store import store
from app.modules.auth.auth_service import UserRecord, get_current_user

router = APIRouter(prefix="/gis", tags=["GIS & Spatial Intelligence"])

@router.get("/layers")
def get_gis_layers(user: UserRecord = Depends(get_current_user)):
    return make_success_response({
        "layers": [
            {"id": "roads", "name": "Road Network Graph", "source_type": "REAL", "available": True},
            {"id": "hazards", "name": "Dynamic Hazard Polygons", "source_type": "REAL", "available": True},
            {"id": "habitations", "name": "NER Habitations & Settlements", "source_type": "REAL", "available": True},
            {"id": "facilities", "name": "Critical Infrastructure & Shelters", "source_type": "REAL", "available": True},
            {"id": "vehicles", "name": "Live Vehicle Positions", "source_type": "SIMULATED", "available": True}
        ]
    })

@router.get("/features")
def get_gis_features(
    layer: Optional[str] = None,
    bbox: Optional[str] = None,
    user: UserRecord = Depends(get_current_user)
):
    features = []
    # Add habitations as GeoJSON Points
    for h in store.habitations:
        c = h.get("coordinates", {"lat": 25.4, "lng": 93.2})
        features.append({
            "type": "Feature",
            "properties": {
                "id": h["id"],
                "name": h["name"],
                "type": "HABITATION",
                "risk_level": h.get("risk_level", "HIGH"),
                "population": h.get("population", 2350)
            },
            "geometry": {
                "type": "Point",
                "coordinates": [c.get("lng", 93.2), c.get("lat", 25.4)]
            }
        })
    return make_success_response({
        "type": "FeatureCollection",
        "features": features
    })

@router.get("/nearby")
def get_nearby_entities(
    lat: float = 25.4,
    lng: float = 93.2,
    radius_km: float = 10.0,
    types: Optional[str] = None,
    user: UserRecord = Depends(get_current_user)
):
    return make_success_response({
        "items": [
            {"id": "WH01", "type": "WAREHOUSE", "distance_km": 7.2, "coordinates": {"lat": 25.185, "lng": 93.025}},
            {"id": "FAC10", "type": "SHELTER", "distance_km": 3.8, "coordinates": {"lat": 25.40, "lng": 93.20}},
            {"id": "FAC01", "type": "HOSPITAL", "distance_km": 1.2, "coordinates": {"lat": 25.40, "lng": 93.20}}
        ]
    })
