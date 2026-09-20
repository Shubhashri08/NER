from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, UploadFile, File
from pydantic import BaseModel
from app.core.envelope import make_success_response, make_error_response
from app.core.store import store
from app.modules.auth.auth_service import UserRecord, get_current_user

router = APIRouter(prefix="/voice", tags=["Voice Intelligence"])

class VoiceParseRequest(BaseModel):
    transcript: str

class VoiceConfirmRequest(BaseModel):
    draft_id: str = "VD001"
    confirmed: bool = True

@router.post("/transcribe")
async def transcribe_voice(
    audio: Optional[UploadFile] = File(None),
    user: UserRecord = Depends(get_current_user)
):
    return make_success_response({
        "transcript": "Landslide has blocked NH-27 near Village X. Heavy vehicles cannot pass.",
        "language": "en",
        "confidence": 0.93
    })

@router.post("/parse-incident")
def parse_voice_incident(
    body: VoiceParseRequest,
    user: UserRecord = Depends(get_current_user)
):
    return make_success_response({
        "incident_type": "LANDSLIDE",
        "road": "NH-27",
        "location": {"lat": 25.4, "lng": 93.2},
        "severity": "HIGH",
        "passability": {"heavy_vehicle": False, "4x4": True},
        "requires_confirmation": True
    })

@router.post("/confirm")
def confirm_voice_report(
    body: VoiceConfirmRequest,
    user: UserRecord = Depends(get_current_user)
):
    rep_id = f"FR{len(store.field_reports) + 10:03d}"
    inc_id = f"INC{len(store.incidents) + 20:03d}"
    return make_success_response({
        "report_id": rep_id,
        "incident_id": inc_id,
        "status": "PENDING_VERIFICATION"
    })
