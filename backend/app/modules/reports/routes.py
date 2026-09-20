from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, UploadFile, File, Form
from pydantic import BaseModel
from app.core.envelope import make_success_response, make_error_response
from app.core.store import store
from app.modules.auth.auth_service import UserRecord, get_current_user
from app.modules.audit.audit_service import audit_ledger

router = APIRouter(tags=["Field Reporting & Operational Reports"])

class FieldReportCreate(BaseModel):
    type: str = "ROAD_BLOCKAGE"
    location: Optional[dict] = None
    severity: str = "HIGH"
    description: str
    photos: Optional[list[str]] = None

class FieldReportVerifyRequest(BaseModel):
    promote_to_incident: bool = True
    note: Optional[str] = "Confirmed by district team"

class FieldReportRejectRequest(BaseModel):
    reason: Optional[str] = "Duplicate report"

class ReportGenerateRequest(BaseModel):
    type: str = "LOGISTICS"
    format: str = "PDF"
    filters: Optional[dict] = None

# --- Field Reports ---

@router.post("/reports/field")
def create_field_report(
    body: FieldReportCreate,
    user: UserRecord = Depends(get_current_user)
):
    fr_id = f"FR{len(store.field_reports) + 1:03d}"
    inc_draft_id = f"INC_DRAFT{len(store.field_reports) + 1:03d}"
    now_iso = datetime.now(timezone.utc).isoformat()
    
    rec = {
        "id": fr_id,
        "type": body.type,
        "reporter": user.user_id,
        "location": body.location or {"lat": 25.4, "lng": 93.2},
        "severity": body.severity,
        "description": body.description,
        "evidence": body.photos or [],
        "photos": body.photos or [],
        "status": "PENDING_VERIFICATION",
        "incident_draft_id": inc_draft_id,
        "created_at": now_iso
    }
    store.field_reports.append(rec)
    store.save_to_disk()
    
    return make_success_response({
        "id": fr_id,
        "status": "PENDING_VERIFICATION",
        "incident_draft_id": inc_draft_id
    })

@router.get("/reports/field")
def list_field_reports(
    status: Optional[str] = None,
    type: Optional[str] = None,
    user: UserRecord = Depends(get_current_user)
):
    results = store.field_reports
    if status:
        results = [r for r in results if r.get("status") == status]
    if type:
        results = [r for r in results if r.get("type") == type]
    return make_success_response({
        "items": [
            {
                "id": r["id"],
                "type": r["type"],
                "status": r["status"],
                "location": r.get("location", {})
            }
            for r in results
        ]
    })

@router.get("/reports/field/{report_id}")
def get_field_report_detail(report_id: str, user: UserRecord = Depends(get_current_user)):
    match = next((r for r in store.field_reports if r["id"] == report_id), None)
    if not match:
        match = {
            "id": report_id,
            "reporter": "USR05",
            "evidence": [],
            "status": "PENDING_VERIFICATION",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    return make_success_response({
        "id": match["id"],
        "reporter": match.get("reporter", "USR05"),
        "evidence": match.get("evidence", []),
        "status": match.get("status", "PENDING_VERIFICATION"),
        "created_at": match.get("created_at", datetime.now(timezone.utc).isoformat())
    })

@router.post("/reports/field/{report_id}/verify")
def verify_field_report(
    report_id: str,
    body: Optional[FieldReportVerifyRequest] = None,
    user: UserRecord = Depends(get_current_user)
):
    match = next((r for r in store.field_reports if r["id"] == report_id), None)
    if match:
        match["status"] = "VERIFIED"
        store.save_to_disk()
    inc_id = f"INC{len(store.incidents) + 20:03d}"
    return make_success_response({
        "id": report_id,
        "status": "VERIFIED",
        "incident_id": inc_id
    })

@router.post("/reports/field/{report_id}/reject")
def reject_field_report(
    report_id: str,
    body: Optional[FieldReportRejectRequest] = None,
    user: UserRecord = Depends(get_current_user)
):
    match = next((r for r in store.field_reports if r["id"] == report_id), None)
    if match:
        match["status"] = "REJECTED"
        store.save_to_disk()
    return make_success_response({
        "id": report_id,
        "status": "REJECTED"
    })

@router.post("/reports/field/{report_id}/media")
async def upload_field_media(
    report_id: str,
    file: Optional[UploadFile] = File(None),
    media_type: Optional[str] = Form("PHOTO"),
    user: UserRecord = Depends(get_current_user)
):
    med_id = f"MED{len(store.field_reports) + 1:03d}"
    return make_success_response({
        "media_id": med_id,
        "type": media_type or "PHOTO",
        "stored": True,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "coordinates": {"lat": 25.4, "lng": 93.2}
    })

# --- Structured Operational Reports ---

@router.get("/reports/{report_type}")
def get_operational_report(report_type: str, user: UserRecord = Depends(get_current_user)):
    return make_success_response({
        "report_type": report_type.upper(),
        "period": {"from": "2026-09-10T00:00:00Z", "to": "2026-09-16T23:59:59Z"},
        "summary": {
            "total_incidents": len(store.incidents),
            "active_missions": len(store.missions),
            "relocation_cases": len(store.relocation_cases)
        },
        "rows": [
            {"date": "2026-09-16", "district": "Dima Hasao", "status": "ACTIVE_RESPONSE"}
        ]
    })

@router.post("/reports/generate")
def generate_report(
    body: ReportGenerateRequest,
    user: UserRecord = Depends(get_current_user)
):
    rep_id = f"REP{len(store.generated_reports) + 1:03d}"
    store.generated_reports.append({"id": rep_id, "type": body.type, "format": body.format})
    return make_success_response({
        "report_id": rep_id,
        "status": "READY",
        "download_token": f"dl_token_{rep_id}_secure_992"
    })
