from typing import Optional, Any
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.core.envelope import make_success_response, make_error_response
from app.core.store import store
from app.modules.auth.auth_service import SystemRole, UserRecord, get_current_user, require_roles
from app.modules.audit.audit_service import audit_ledger
from app.modules.decision.decision_service import decision_engine

router = APIRouter(prefix="/logistics", tags=["Logistics & Mission Management"])

# --- Request Models ---

class LogisticsItem(BaseModel):
    resource_type: str
    quantity: float
    unit: str = "LITRE"

class SupplyRequestCreate(BaseModel):
    id: Optional[str] = None
    item: Optional[str] = None
    category: Optional[str] = "Food"
    quantity: Optional[Any] = None
    unit: Optional[str] = "units"
    requested_by: Optional[str] = "District HQ"
    location: Optional[str] = "Haflong"
    destination_id: Optional[str] = "HAB001"
    location_id: Optional[str] = None
    items: Optional[list[LogisticsItem]] = None
    need_type: Optional[str] = None
    priority: Optional[str] = "High"
    required_by: Optional[str] = "2026-09-17T10:00:00Z"
    reason: Optional[str] = "Emergency disaster supply request"
    requested_on: Optional[str] = None

class SupplyRequestUpdate(BaseModel):
    items: Optional[list[LogisticsItem]] = None
    required_by: Optional[str] = None
    reason: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None

class MissionCreate(BaseModel):
    request_id: Optional[str] = "REQ001"
    warehouse_id: Optional[str] = "WH01"
    vehicle_id: Optional[str] = "VH017"
    route_id: Optional[str] = "ROUTE001"
    origin_warehouse_id: Optional[str] = None
    destination_location_id: Optional[str] = None
    cargo_manifest: Optional[list[dict]] = None
    planned_departure: Optional[str] = None

class MissionApprovalRequest(BaseModel):
    reason: Optional[str] = "Critical supply delivery approved"

class MissionCompleteRequest(BaseModel):
    delivered_items: Optional[list[dict]] = None
    proof: Optional[dict] = None

class MissionCancelRequest(BaseModel):
    reason: Optional[str] = "Destination no longer accessible"

class MissionReportRequest(BaseModel):
    status: str = "DELAYED"
    location: Optional[dict] = None
    note: Optional[str] = "Field condition report"

# --- Endpoints: Logistics Requests ---

@router.get("/requests")
def list_supply_requests(
    destination_id: Optional[str] = None,
    priority: Optional[str] = None,
    status: Optional[str] = None,
    user: UserRecord = Depends(get_current_user)
):
    results = store.logistics_requests
    if destination_id:
        results = [r for r in results if r.get("destination_id") == destination_id or r.get("location_id") == destination_id]
    if priority and priority != "ALL":
        results = [r for r in results if r.get("priority", "").upper() == priority.upper()]
    if status and status != "ALL":
        if status.upper() == "ACTIVE":
            results = [r for r in results if r.get("status", "").upper() in ("PENDING", "APPROVED", "IN_TRANSIT")]
        else:
            results = [r for r in results if r.get("status", "").upper() == status.upper()]
        
    items = []
    for r in results:
        items_list = r.get("items")
        if not items_list and r.get("need_type"):
            items_list = [{"resource_type": r["need_type"], "quantity": r.get("quantity", 100), "unit": r.get("unit", "PACK")}]
        
        # Quantity string representation
        raw_qty = r.get("quantity")
        unit_str = r.get("unit", "units")
        if isinstance(raw_qty, (int, float)):
            qty_fmt = f"{int(raw_qty):,} {unit_str}"
        elif isinstance(raw_qty, str) and raw_qty.strip():
            qty_fmt = raw_qty
        else:
            qty_fmt = "1,000 units"

        # Priority normalization
        raw_pri = (r.get("priority") or "High").upper()
        if raw_pri == "CRITICAL":
            pri_norm = "Critical"
        elif raw_pri == "HIGH":
            pri_norm = "High"
        elif raw_pri == "MEDIUM":
            pri_norm = "Medium"
        else:
            pri_norm = "Low"

        # Status normalization
        raw_st = (r.get("status") or "PENDING").upper()
        if raw_st == "PENDING":
            st_norm = "Pending"
        elif raw_st == "APPROVED":
            st_norm = "Approved"
        elif raw_st in ("IN_TRANSIT", "IN TRANSIT"):
            st_norm = "In Transit"
        elif raw_st in ("FULFILLED", "COMPLETED", "DELIVERED"):
            st_norm = "Fulfilled"
        elif raw_st == "REJECTED":
            st_norm = "Rejected"
        else:
            st_norm = "Pending"

        items.append({
            "id": r.get("id") or r.get("request_id", "REQ001"),
            "request_id": r.get("request_id") or r.get("id", "REQ001"),
            "item": r.get("item") or "Emergency Relief Supplies",
            "category": r.get("category") or "Food",
            "quantity": qty_fmt,
            "requested_by": r.get("requested_by") or "District Authority",
            "location": r.get("location") or (r.get("destination", {}).get("name") if isinstance(r.get("destination"), dict) else "Assam"),
            "priority": pri_norm,
            "status": st_norm,
            "requested_on": r.get("requested_on") or "16 Sep 2025",
            "destination_id": r.get("destination_id") or r.get("location_id", "HAB001"),
            "reason": r.get("reason"),
            "items": items_list or [{"resource_type": "WATER", "quantity": 5000, "unit": "LITRE"}]
        })
    return make_success_response({"items": items})

@router.post("/requests")
def create_supply_request(
    payload: SupplyRequestCreate,
    user: UserRecord = Depends(get_current_user)
):
    req_count = len(store.logistics_requests)
    req_id = payload.id or f"SR-{req_count + 18:03d}"
    now_iso = datetime.now(timezone.utc).isoformat()
    dest_id = payload.destination_id or payload.location_id or "HAB001"
    
    items_list = []
    if payload.items:
        items_list = [it.dict() for it in payload.items]
    elif payload.need_type:
        items_list = [{"resource_type": payload.need_type, "quantity": payload.quantity or 100, "unit": payload.unit or "PACK"}]
    else:
        items_list = [{"resource_type": payload.category.upper() if payload.category else "FOOD", "quantity": 1000, "unit": payload.unit or "units"}]
        
    pri_raw = (payload.priority or "High").upper()
    
    record = {
        "id": req_id,
        "request_id": req_id,
        "item": payload.item or "Emergency Relief Supply",
        "category": payload.category or "Food",
        "quantity": payload.quantity or "1,000 units",
        "unit": payload.unit or "units",
        "requested_by": payload.requested_by or "District HQ",
        "location": payload.location or "Haflong",
        "destination_id": dest_id,
        "location_id": dest_id,
        "destination": {"id": dest_id, "name": f"{payload.location or 'Regional'} Relief Hub", "lat": 25.40, "lng": 93.20},
        "items": items_list,
        "priority": pri_raw,
        "priority_details": {"score": 90 if pri_raw == "CRITICAL" else 75, "level": pri_raw},
        "status": "PENDING",
        "requested_on": payload.requested_on or datetime.now().strftime("%d %b %Y"),
        "required_by": payload.required_by or now_iso,
        "reason": payload.reason or "Emergency supply request",
        "created_at": now_iso
    }
    store.logistics_requests.insert(0, record)
    store.save_to_disk()
    
    audit_ledger.record_decision(
        user_id=user.user_id,
        user_role=user.role.value if hasattr(user.role, "value") else user.role,
        action_type="LOGISTICS_REQUEST_CREATED",
        target_resource_id=req_id,
        decision_reasoning=f"Created supply request {req_id} for {payload.location or dest_id}",
        details=record
    )
    
    return make_success_response({
        "id": req_id,
        "item": record["item"],
        "category": record["category"],
        "quantity": record["quantity"],
        "requested_by": record["requested_by"],
        "location": record["location"],
        "status": "Pending",
        "priority": payload.priority or "High",
        "requested_on": record["requested_on"],
        "created_at": now_iso
    })

@router.patch("/requests/{request_id}")
def update_supply_request(
    request_id: str,
    payload: SupplyRequestUpdate,
    user: UserRecord = Depends(get_current_user)
):
    match = next((r for r in store.logistics_requests if r.get("id") == request_id or r.get("request_id") == request_id), None)
    if not match:
        return make_error_response("NOT_FOUND", f"Supply request {request_id} not found", status_code=404)
    
    if payload.status:
        match["status"] = payload.status.upper().replace(" ", "_")
    if payload.priority:
        match["priority"] = payload.priority.upper()
    if payload.reason:
        match["reason"] = payload.reason
    if payload.required_by:
        match["required_by"] = payload.required_by
        
    store.save_to_disk()
    return make_success_response(match)

@router.get("/requests/{request_id}")
def get_supply_request(request_id: str, user: UserRecord = Depends(get_current_user)):
    match = next((r for r in store.logistics_requests if r["id"] == request_id), None)
    if not match:
        match = {
            "id": request_id,
            "destination": {"id": "HAB001", "name": "Village A", "lat": 25.4, "lng": 93.2},
            "items": [{"resource_type": "WATER", "quantity": 5000, "unit": "LITRE"}],
            "priority": {"score": 94, "level": "CRITICAL"},
            "resource_options": [
                {"warehouse_id": "WH01", "distance_km": 72, "available": 4000, "score": 91}
            ],
            "vehicle_options": [
                {"vehicle_id": "VH017", "capacity_fit": 0.92, "terrain_fit": 0.97, "availability": True, "score": 91}
            ],
            "route_options": [
                {"id": "R2", "distance_km": 205, "eta_min": 325, "risk_score": 24}
            ]
        }
    return make_success_response({
        "id": match["id"],
        "destination": match.get("destination", {"id": "HAB001", "name": "Village A", "lat": 25.4, "lng": 93.2}),
        "items": match.get("items", []),
        "priority": match.get("priority_details", {"score": 94, "level": match.get("priority", "CRITICAL")}),
        "resource_options": match.get("resource_options", []),
        "vehicle_options": match.get("vehicle_options", []),
        "route_options": match.get("route_options", [])
    })

@router.patch("/requests/{request_id}")
def update_supply_request(
    request_id: str,
    payload: SupplyRequestUpdate,
    user: UserRecord = Depends(get_current_user)
):
    match = next((r for r in store.logistics_requests if r["id"] == request_id), None)
    now_iso = datetime.now(timezone.utc).isoformat()
    if match:
        if payload.items:
            match["items"] = [it.dict() for it in payload.items]
        if payload.required_by:
            match["required_by"] = payload.required_by
        if payload.reason:
            match["reason"] = payload.reason
        if payload.status:
            match["status"] = payload.status
        items_res = match["items"]
        store.save_to_disk()
    else:
        items_res = [it.dict() for it in payload.items] if payload.items else [{"resource_type": "WATER", "quantity": 7000, "unit": "LITRE"}]
        
    return make_success_response({
        "id": request_id,
        "items": items_res,
        "updated_at": now_iso
    })

@router.post("/requests/{request_id}/prioritize")
def prioritize_supply_request(request_id: str, user: UserRecord = Depends(get_current_user)):
    return make_success_response({
        "request_id": request_id,
        "priority": "CRITICAL",
        "score": 94,
        "factors": {
            "population_at_risk": 88,
            "time_to_stockout": 97,
            "hazard": 91,
            "medical_dependency": 100
        },
        "explanation": "Critical medical supplies and drinking water may run out within 6 hours due to corridor blockage."
    })

# --- Endpoints: Logistics Missions ---

@router.get("/missions")
def list_missions(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    user: UserRecord = Depends(get_current_user)
):
    results = store.missions
    if status:
        results = [m for m in results if m.get("status") == status]
    if priority:
        results = [m for m in results if m.get("priority") == priority]
        
    items = []
    for m in results:
        items.append({
            "id": m.get("id") or m.get("mission_id", "MIS001"),
            "mission_id": m.get("mission_id") or m.get("id", "MIS001"),
            "title": m.get("title", "Relief Mission"),
            "status": m.get("status", "IN_TRANSIT"),
            "priority": m.get("priority", "CRITICAL"),
            "request_id": m.get("request_id", "REQ001"),
            "vehicle_id": m.get("vehicle_id", "VH017"),
            "route_id": m.get("route_id", "RD01"),
            "origin": m.get("origin") or {"lat": 26.14, "lng": 91.73, "name": "Guwahati Strategic Hub"},
            "destination": m.get("destination") or {"lat": 25.40, "lng": 93.20, "name": "Target Habitation"},
            "resources": m.get("resources", []),
            "vehicle": m.get("vehicle") or {"id": m.get("vehicle_id", "VH017"), "type": "TRUCK"},
            "route": m.get("route", {}),
            "progress": m.get("progress", 50),
            "risk_score": m.get("risk_score", 30),
            "eta": m.get("eta", "2026-09-16T14:30:00Z"),
            "created_at": m.get("created_at")
        })
    return make_success_response({"items": items})

@router.post("/missions")
def create_mission(
    payload: MissionCreate,
    user: UserRecord = Depends(get_current_user)
):
    msn_id = f"MIS{len(store.missions) + 1:03d}"
    now_iso = datetime.now(timezone.utc).isoformat()
    req_id = payload.request_id or "REQ001"
    wh_id = payload.warehouse_id or payload.origin_warehouse_id or "WH01"
    veh_id = payload.vehicle_id or "VH017"
    route_id = payload.route_id or "ROUTE001"
    
    rec = {
        "id": msn_id,
        "status": "PENDING_APPROVAL",
        "request_id": req_id,
        "warehouse_id": wh_id,
        "vehicle_id": veh_id,
        "route_id": route_id,
        "origin": {"warehouse_id": wh_id, "name": "Relief Depot"},
        "destination": {"habitation_id": "HAB001", "name": "Village A"},
        "resources": [{"resource_type": "WATER", "quantity": 5000}],
        "vehicle": {"id": veh_id, "type": "TRUCK"},
        "route": {"id": route_id, "distance_km": 182, "eta_min": 310},
        "eta": "2026-09-17T12:00:00Z",
        "risk_score": 38,
        "progress": 0,
        "active_alerts": [],
        "replanning_status": "NONE",
        "created_at": now_iso
    }
    store.missions.append(rec)
    store.save_to_disk()
    
    audit_ledger.record_decision(
        user_id=user.user_id,
        user_role=user.role.value if hasattr(user.role, "value") else user.role,
        action_type="MISSION_FORMULATED",
        target_resource_id=msn_id,
        decision_reasoning=f"Mission {msn_id} formulated for {req_id} via {route_id}",
        details=rec
    )
    
    return make_success_response({
        "id": msn_id,
        "status": "PENDING_APPROVAL",
        "request_id": req_id,
        "warehouse_id": wh_id,
        "vehicle_id": veh_id,
        "route_id": route_id
    })

@router.get("/missions/{mission_id}")
def get_mission_detail(mission_id: str, user: UserRecord = Depends(get_current_user)):
    match = next((m for m in store.missions if m["id"] == mission_id), None)
    if not match:
        match = {
            "id": mission_id,
            "status": "IN_TRANSIT",
            "origin": {"id": "WH01", "name": "Relief Depot A"},
            "destination": {"id": "HAB001", "name": "Village A"},
            "resources": [{"resource_type": "WATER", "quantity": 5000}],
            "vehicle": {"id": "VH017", "type": "TRUCK"},
            "route": {"id": "R2", "distance_km": 205, "eta_min": 325},
            "eta": "2026-09-16T14:30:00Z",
            "risk_score": 42,
            "progress": 67,
            "active_alerts": [],
            "replanning_status": "NONE"
        }
    return make_success_response({
        "id": match["id"],
        "status": match.get("status", "IN_TRANSIT"),
        "origin": match.get("origin", {"id": "WH01", "name": "Relief Depot A"}),
        "destination": match.get("destination", {"id": "HAB001", "name": "Village A"}),
        "resources": match.get("resources", []),
        "vehicle": match.get("vehicle", {}),
        "route": match.get("route", {}),
        "eta": match.get("eta", "2026-09-16T14:30:00Z"),
        "risk_score": match.get("risk_score", 42),
        "progress": match.get("progress", 67),
        "active_alerts": match.get("active_alerts", []),
        "replanning_status": match.get("replanning_status", "NONE")
    })

@router.post("/missions/{mission_id}/approve")
def approve_mission(
    mission_id: str,
    body: Optional[MissionApprovalRequest] = None,
    user: UserRecord = Depends(get_current_user)
):
    match = next((m for m in store.missions if m["id"] == mission_id), None)
    now_iso = datetime.now(timezone.utc).isoformat()
    if match:
        match["status"] = "APPROVED"
        match["approved_by"] = user.user_id
        match["approved_at"] = now_iso
        store.save_to_disk()
        
    audit_ledger.record_decision(
        user_id=user.user_id,
        user_role=user.role.value if hasattr(user.role, "value") else user.role,
        action_type="MISSION_APPROVED",
        target_resource_id=mission_id,
        decision_reasoning=body.reason if body and body.reason else "Mission approved by district authority",
        details={"mission_id": mission_id, "status": "APPROVED"}
    )
    
    return make_success_response({
        "id": mission_id,
        "status": "APPROVED",
        "approved_by": user.user_id,
        "approved_at": now_iso
    })

@router.post("/missions/{mission_id}/start")
def start_mission(mission_id: str, user: UserRecord = Depends(get_current_user)):
    match = next((m for m in store.missions if m["id"] == mission_id), None)
    now_iso = datetime.now(timezone.utc).isoformat()
    if match:
        match["status"] = "IN_TRANSIT"
        match["started_at"] = now_iso
        store.save_to_disk()
    return make_success_response({
        "id": mission_id,
        "status": "IN_TRANSIT",
        "started_at": now_iso
    })

@router.post("/missions/{mission_id}/complete")
def complete_mission(
    mission_id: str,
    body: Optional[MissionCompleteRequest] = None,
    user: UserRecord = Depends(get_current_user)
):
    match = next((m for m in store.missions if m["id"] == mission_id), None)
    now_iso = datetime.now(timezone.utc).isoformat()
    if match:
        match["status"] = "DELIVERED"
        match["completed_at"] = now_iso
        match["delivery_confirmed"] = True
        store.save_to_disk()
    return make_success_response({
        "id": mission_id,
        "status": "DELIVERED",
        "completed_at": now_iso,
        "delivery_confirmed": True
    })

@router.post("/missions/{mission_id}/cancel")
def cancel_mission(
    mission_id: str,
    body: Optional[MissionCancelRequest] = None,
    user: UserRecord = Depends(get_current_user)
):
    match = next((m for m in store.missions if m["id"] == mission_id), None)
    now_iso = datetime.now(timezone.utc).isoformat()
    if match:
        match["status"] = "CANCELLED"
        store.save_to_disk()
    return make_success_response({
        "id": mission_id,
        "status": "CANCELLED",
        "released_resources": True,
        "released_vehicle": True
    })

@router.post("/missions/{mission_id}/report")
def report_mission(
    mission_id: str,
    body: MissionReportRequest,
    user: UserRecord = Depends(get_current_user)
):
    match = next((m for m in store.missions if m["id"] == mission_id), None)
    if match:
        match["status"] = body.status
        store.save_to_disk()
    rep_id = f"MR{len(store.field_reports) + 1:03d}"
    return make_success_response({
        "mission_id": mission_id,
        "status": body.status,
        "report_id": rep_id,
        "replanning_check_triggered": True
    })

@router.get("/triage-score")
def get_triage_score(
    water_deficit: float = 0.8,
    med_deficit: float = 0.9,
    food_deficit: float = 0.4,
    days_cut_off: float = 3.0,
    vulnerability_pop_fraction: float = 0.32
):
    res = decision_engine.calculate_urgency_score(
        water_deficit, med_deficit, food_deficit, days_cut_off, vulnerability_pop_fraction
    )
    return make_success_response(res)
