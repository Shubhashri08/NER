from typing import Any, Optional, Literal
from datetime import datetime, timezone
import uuid
from pydantic import BaseModel, Field

DataTierType = Literal["REAL_DATA", "SYNTHETIC_DATA", "SIMULATION"]

class ResponseMeta(BaseModel):
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    request_id: str = Field(default_factory=lambda: f"req_{uuid.uuid4().hex[:8]}")
    data_tier: Optional[DataTierType] = None

class StandardError(BaseModel):
    code: str
    message: str
    details: Optional[dict[str, Any]] = None

class StandardResponse(BaseModel):
    success: bool = True
    data: Optional[Any] = None
    error: Optional[StandardError] = None
    meta: ResponseMeta = Field(default_factory=ResponseMeta)

def make_success_response(data: Any, data_tier: Optional[DataTierType] = None, request_id: Optional[str] = None) -> dict:
    meta = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "request_id": request_id or f"req_{uuid.uuid4().hex[:8]}"
    }
    if data_tier:
        meta["data_tier"] = data_tier
        
    return {
        "success": True,
        "data": data,
        "meta": meta
    }

def make_error_response(code: str, message: str, details: Optional[dict] = None, request_id: Optional[str] = None) -> dict:
    return {
        "success": False,
        "error": {
            "code": code,
            "message": message,
            "details": details or {}
        },
        "meta": {
            "request_id": request_id or f"req_{uuid.uuid4().hex[:8]}"
        }
    }
