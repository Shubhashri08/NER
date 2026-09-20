import hashlib
import json
from datetime import datetime, timezone
from typing import Optional, Any
from pydantic import BaseModel

class AuditRecord(BaseModel):
    record_id: str
    timestamp: str
    user_id: str
    user_role: str
    action_type: str
    target_resource_id: str
    decision_reasoning: str
    previous_state_hash: Optional[str] = None
    record_hash: str
    details: Optional[dict[str, Any]] = None

class AuditLedger:
    def __init__(self):
        self._records: list[AuditRecord] = []
        self._last_hash: str = "0" * 64

    def record_decision(
        self,
        user_id: str,
        user_role: str,
        action_type: str,
        target_resource_id: str,
        decision_reasoning: str,
        details: Optional[dict[str, Any]] = None
    ) -> AuditRecord:
        now_iso = datetime.now(timezone.utc).isoformat()
        record_id = f"AUD-{int(datetime.now(timezone.utc).timestamp() * 1000)}"
        
        # Cryptographic chain
        payload_to_hash = f"{record_id}|{now_iso}|{user_id}|{user_role}|{action_type}|{target_resource_id}|{decision_reasoning}|{self._last_hash}"
        record_hash = hashlib.sha256(payload_to_hash.encode("utf-8")).hexdigest()

        rec = AuditRecord(
            record_id=record_id,
            timestamp=now_iso,
            user_id=user_id,
            user_role=user_role,
            action_type=action_type,
            target_resource_id=target_resource_id,
            decision_reasoning=decision_reasoning,
            previous_state_hash=self._last_hash,
            record_hash=record_hash,
            details=details or {}
        )
        self._records.append(rec)
        self._last_hash = record_hash
        return rec

    def get_all(self) -> list[AuditRecord]:
        return list(reversed(self._records))

audit_ledger = AuditLedger()
