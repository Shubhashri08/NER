from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.core.envelope import make_success_response, make_error_response
from app.core.store import store
from app.modules.auth.auth_service import UserRecord, get_current_user

router = APIRouter(tags=["Resources, Inventory & Warehouses"])

class InventoryAddRequest(BaseModel):
    warehouse_id: str
    resource_type: str
    quantity: float
    unit: str = "LITRE"

class ReserveInventoryRequest(BaseModel):
    quantity: float
    mission_id: str

class ReleaseInventoryRequest(BaseModel):
    reservation_id: Optional[str] = "RES001"
    quantity: float

class CreateWarehouseRequest(BaseModel):
    name: str
    coordinates: Optional[dict] = None
    capacity: int = 10000

class WarehouseDispatchRequest(BaseModel):
    mission_id: str
    items: list[dict]

# --- Resources & Inventory ---

@router.get("/resources/types")
def get_resource_types(user: UserRecord = Depends(get_current_user)):
    return make_success_response({
        "items": store.resource_types
    })

@router.get("/resources/inventory")
def list_resource_inventory(
    warehouse_id: Optional[str] = None,
    resource_type: Optional[str] = None,
    user: UserRecord = Depends(get_current_user)
):
    results = store.inventory
    if warehouse_id:
        results = [i for i in results if i.get("warehouse_id") == warehouse_id]
    if resource_type:
        results = [i for i in results if i.get("resource_type") == resource_type]
    return make_success_response({
        "items": results
    })

@router.post("/resources/inventory")
def add_inventory_stock(
    body: InventoryAddRequest,
    user: UserRecord = Depends(get_current_user)
):
    inv_id = f"INV{len(store.inventory) + 1:02d}"
    item = {
        "id": inv_id,
        "warehouse_id": body.warehouse_id,
        "resource_type": body.resource_type,
        "stock": body.quantity,
        "reserved": 0,
        "available": body.quantity,
        "unit": body.unit
    }
    store.inventory.append(item)
    store.save_to_disk()
    return make_success_response({
        "id": inv_id,
        "warehouse_id": body.warehouse_id,
        "resource_type": body.resource_type,
        "stock": body.quantity,
        "available": body.quantity
    })

@router.post("/resources/inventory/{inventory_id}/reserve")
def reserve_inventory(
    inventory_id: str,
    body: ReserveInventoryRequest,
    user: UserRecord = Depends(get_current_user)
):
    match = next((i for i in store.inventory if i["id"] == inventory_id), None)
    if not match:
        match = {"id": inventory_id, "stock": 7200, "reserved": 1000, "available": 6200}
    
    match["reserved"] = match.get("reserved", 0) + body.quantity
    match["available"] = match.get("stock", 7200) - match["reserved"]
    res_id = f"RES{len(store.reservations) + 1:03d}"
    
    store.reservations.append({
        "id": res_id,
        "inventory_id": inventory_id,
        "mission_id": body.mission_id,
        "quantity": body.quantity,
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    store.save_to_disk()
    
    return make_success_response({
        "inventory_id": inventory_id,
        "reserved": match["reserved"],
        "available": match["available"],
        "reservation_id": res_id
    })

@router.post("/resources/inventory/{inventory_id}/release")
def release_inventory(
    inventory_id: str,
    body: ReleaseInventoryRequest,
    user: UserRecord = Depends(get_current_user)
):
    match = next((i for i in store.inventory if i["id"] == inventory_id), None)
    if not match:
        match = {"id": inventory_id, "stock": 7200, "reserved": 3000, "available": 4200}
        
    match["reserved"] = max(0, match.get("reserved", 0) - body.quantity)
    match["available"] = match.get("stock", 7200) - match["reserved"]
    store.save_to_disk()
    
    return make_success_response({
        "inventory_id": inventory_id,
        "reserved": match["reserved"],
        "available": match["available"]
    })

@router.get("/resources/availability")
def get_resource_availability(
    destination_id: Optional[str] = "HAB001",
    resource_type: Optional[str] = "WATER",
    quantity: float = 5000,
    user: UserRecord = Depends(get_current_user)
):
    return make_success_response({
        "requested": quantity,
        "available": 7200,
        "sources": [
            {"warehouse_id": "WH01", "distance_km": 72, "available": 4000},
            {"warehouse_id": "WH04", "distance_km": 115, "available": 3200}
        ]
    })

# --- Warehouses ---

@router.get("/warehouses")
def list_warehouses(user: UserRecord = Depends(get_current_user)):
    items = []
    for w in store.warehouses:
        items.append({
            "id": w["id"],
            "name": w["name"],
            "coordinates": w.get("coordinates", {}),
            "status": w.get("status", "OPERATIONAL"),
            "available_stock_types": w.get("available_stock_types", 5)
        })
    return make_success_response({"items": items})

@router.post("/warehouses")
def create_warehouse(
    body: CreateWarehouseRequest,
    user: UserRecord = Depends(get_current_user)
):
    wh_id = f"WH{len(store.warehouses) + 10:02d}"
    rec = {
        "id": wh_id,
        "name": body.name,
        "coordinates": body.coordinates or {"lat": 25.4, "lng": 93.2},
        "capacity": body.capacity,
        "used_capacity": 0,
        "status": "OPERATIONAL",
        "available_stock_types": 0,
        "inventory": [],
        "dispatches": []
    }
    store.warehouses.append(rec)
    store.save_to_disk()
    return make_success_response({
        "id": wh_id,
        "name": body.name,
        "status": "OPERATIONAL"
    })

@router.get("/warehouses/{warehouse_id}")
def get_warehouse_detail(warehouse_id: str, user: UserRecord = Depends(get_current_user)):
    match = next((w for w in store.warehouses if w["id"] == warehouse_id), None)
    if not match:
        match = {
            "id": warehouse_id,
            "capacity": 10000,
            "used_capacity": 6200,
            "inventory": ["INV01", "INV02"],
            "dispatches": ["DSP001"]
        }
    return make_success_response({
        "id": match["id"],
        "capacity": match.get("capacity", 10000),
        "used_capacity": match.get("used_capacity", 6200),
        "inventory": match.get("inventory", []),
        "dispatches": match.get("dispatches", [])
    })

@router.post("/warehouses/{warehouse_id}/dispatch")
def dispatch_warehouse_items(
    warehouse_id: str,
    body: WarehouseDispatchRequest,
    user: UserRecord = Depends(get_current_user)
):
    dsp_id = f"DSP{len(store.dispatches) + 1:03d}"
    rec = {
        "dispatch_id": dsp_id,
        "warehouse_id": warehouse_id,
        "mission_id": body.mission_id,
        "status": "DISPATCHED",
        "items": body.items,
        "dispatched_at": datetime.now(timezone.utc).isoformat()
    }
    store.dispatches.append(rec)
    store.save_to_disk()
    return make_success_response({
        "dispatch_id": dsp_id,
        "mission_id": body.mission_id,
        "status": "DISPATCHED",
        "items": body.items
    })
