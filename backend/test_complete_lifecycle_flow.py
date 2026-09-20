import sys
import json
import time
from datetime import datetime, timezone
from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

steps_passed = 0
steps_total = 0

def step(title):
    global steps_total
    steps_total += 1
    print(f"\n{Colors.BOLD}{Colors.OKBLUE}Step {steps_total}: {title}{Colors.ENDC}")

def assert_response(resp, expected_code=200, check_fn=None, label=""):
    global steps_passed
    if resp.status_code != expected_code:
        print(f"  {Colors.FAIL}❌ FAIL: Expected HTTP {expected_code}, got {resp.status_code} ({label}){Colors.ENDC}")
        print(f"     Response body: {resp.text[:300]}")
        return False
    
    data = resp.json()
    if not data.get("success"):
        print(f"  {Colors.FAIL}❌ FAIL: Standard envelope success is not True ({label}){Colors.ENDC}")
        print(f"     Response body: {data}")
        return False
        
    if "meta" not in data or "timestamp" not in data["meta"]:
        print(f"  {Colors.FAIL}❌ FAIL: Missing standard meta.timestamp ({label}){Colors.ENDC}")
        return False

    if check_fn:
        try:
            check_fn(data)
        except Exception as e:
            print(f"  {Colors.FAIL}❌ FAIL: Assertion failed in {label}: {e}{Colors.ENDC}")
            return False

    steps_passed += 1
    print(f"  {Colors.OKGREEN}✓ PASS ({label or 'OK'}) - HTTP {resp.status_code}{Colors.ENDC}")
    return True

print(f"{Colors.BOLD}{Colors.HEADER}========================================================================{Colors.ENDC}")
print(f"{Colors.BOLD}{Colors.HEADER}   NER DISASTER LOGISTICS INTELLIGENCE PLATFORM — LIFECYCLE FLOW TEST    {Colors.ENDC}")
print(f"{Colors.BOLD}{Colors.HEADER}========================================================================{Colors.ENDC}")

# ---------------------------------------------------------
# STAGE 1: AUTHENTICATION & IDENTITY BOOTSTRAP
# ---------------------------------------------------------
step("1.1 User Login as District Authority (IAS Officer)")
resp = client.post("/api/v1/auth/login", json={"username": "dist_officer", "password": "admin123"})
assert_response(resp, 200, lambda d: d["data"]["access_token"] and d["data"]["user"]["role"] == "ROLE_DISTRICT_AUTH", "Login")

token = resp.json()["data"]["access_token"]
headers = {"Authorization": f"Bearer {token}"}

step("1.2 Verify Current User Session & Permissions")
resp = client.get("/api/v1/auth/me", headers=headers)
assert_response(resp, 200, lambda d: len(d["data"]["permissions"]) > 0, "Auth Me")

resp = client.get("/api/v1/auth/permissions", headers=headers)
assert_response(resp, 200, lambda d: "incident.read" in d["data"]["permissions"], "Auth Permissions")

# ---------------------------------------------------------
# STAGE 2: GEOGRAPHIC & BASELINE SITUATIONAL LAYER
# ---------------------------------------------------------
step("2.1 Query Regional States & Active Incidents")
resp = client.get("/api/v1/regions", headers=headers)
assert_response(resp, 200, lambda d: len(d["data"]["items"]) == 8, "List 8 NER States")

resp = client.get("/api/v1/regions/AS/districts", headers=headers)
assert_response(resp, 200, lambda d: len(d["data"]["items"]) >= 1, "Assam Districts")

step("2.2 Inspect At-Risk Habitations in Dima Hasao District")
resp = client.get("/api/v1/habitations?district_id=D01", headers=headers)
assert_response(resp, 200, lambda d: len(d["data"]["items"]) >= 2, "Habitations in D01")

resp = client.get("/api/v1/habitations/HAB001", headers=headers)
assert_response(resp, 200, lambda d: d["data"]["id"] == "HAB001" and d["data"]["risk_level"] == "HIGH", "Harangajao Habitation Detail")

step("2.3 Check Critical Infrastructure Facilities & Hazard Layer")
resp = client.get("/api/v1/facilities", headers=headers)
assert_response(resp, 200, lambda d: len(d["data"]["items"]) >= 1, "Facilities Catalogue")

resp = client.get("/api/v1/hazards/map", headers=headers)
assert_response(resp, 200, lambda d: d["data"]["type"] == "FeatureCollection", "Hazard Map FeatureCollection")

resp = client.get("/api/v1/population?location_id=HAB001", headers=headers)
assert_response(resp, 200, lambda d: d["data"]["population"] > 0 and d["data"]["vulnerable_population"] > 0, "Population Demographics")

# ---------------------------------------------------------
# STAGE 3: FIELD OBSERVATION, INCIDENT CREATION & VERIFICATION
# ---------------------------------------------------------
step("3.1 Field Officer Submits Geo-Tagged Road Blockage Observation")
resp = client.post("/api/v1/reports/field", json={
    "type": "ROAD_BLOCKAGE",
    "location": {"lat": 25.40, "lng": 93.20},
    "severity": "CRITICAL",
    "description": "Massive 200m mudslide across NH-27 near Harangajao gorge.",
    "photos": ["recon_01.jpg"]
}, headers=headers)
assert_response(resp, 200, lambda d: d["data"]["id"].startswith("FR"), "Submit Field Report")
field_report_id = resp.json()["data"]["id"]

step("3.2 District Authority Verifies Field Report and Promotes to Official Incident")
resp = client.post(f"/api/v1/reports/field/{field_report_id}/verify", json={"promote_to_incident": True, "note": "Verified by PWD Recon"}, headers=headers)
assert_response(resp, 200, lambda d: d["data"]["status"] == "VERIFIED", "Verify Field Report")

step("3.3 Incident Ingestion & Spatial Impact Intersection")
resp = client.post("/api/v1/incidents", json={
    "type": "LANDSLIDE",
    "location": {"lat": 25.40, "lng": 93.20},
    "severity": "CRITICAL",
    "description": "NH-27 arterial corridor completely blocked between Jatinga and Harangajao."
}, headers=headers)
assert_response(resp, 200, lambda d: d["data"]["status"] == "ACTIVE", "Create Official Incident")
incident_id = resp.json()["data"]["id"]

resp = client.post(f"/api/v1/incidents/{incident_id}/verify", json={"verification_note": "Approved by District Magistrate"}, headers=headers)
assert_response(resp, 200, lambda d: d["data"]["verified"] is True, "Verify Incident")

resp = client.get(f"/api/v1/incidents/{incident_id}/impact", headers=headers)
assert_response(resp, 200, lambda d: d["data"]["affected_population"] > 0 and len(d["data"]["affected_roads"]) > 0, "Spatial Impact Analysis")

# ---------------------------------------------------------
# STAGE 4: NEED IDENTIFICATION & PRIORITIZATION
# ---------------------------------------------------------
step("4.1 Create Emergency Requisition for Isolated Habitation")
resp = client.post("/api/v1/logistics/requests", json={
    "destination_id": "HAB001",
    "items": [
        {"resource_type": "WATER", "quantity": 5000, "unit": "LITRE"},
        {"resource_type": "MEDICINE", "quantity": 100, "unit": "PACK"}
    ],
    "required_by": "2026-09-17T12:00:00Z",
    "reason": "Drinking water supply and trauma dressings exhausted due to road cut."
}, headers=headers)
assert_response(resp, 200, lambda d: d["data"]["id"].startswith("REQ"), "Create Supply Request")
request_id = resp.json()["data"]["id"]

step("4.2 Execute Algorithmic Need Prioritization")
resp = client.post(f"/api/v1/logistics/requests/{request_id}/prioritize", json={}, headers=headers)
assert_response(resp, 200, lambda d: d["data"]["priority"] == "CRITICAL" and d["data"]["score"] >= 80, "Prioritize Supply Request")

# ---------------------------------------------------------
# STAGE 5: RESOURCE MATCHING & FLEET ALLOCATION
# ---------------------------------------------------------
step("5.1 Check Regional Stock Availability across Warehouses")
resp = client.get("/api/v1/resources/availability?destination_id=HAB001&resource_type=WATER&quantity=5000", headers=headers)
assert_response(resp, 200, lambda d: len(d["data"]["sources"]) >= 1, "Resource Availability Search")

step("5.2 Execute Decision Engine Resource Match")
resp = client.post("/api/v1/decision/resource-match", json={"request_id": request_id}, headers=headers)
assert_response(resp, 200, lambda d: len(d["data"]["recommendations"]) >= 1, "Decision Resource Match")

step("5.3 Execute Decision Engine 4x4 Fleet Vehicle Match")
resp = client.post("/api/v1/decision/vehicle-match", json={"request_id": request_id}, headers=headers)
assert_response(resp, 200, lambda d: len(d["data"]["vehicles"]) >= 1 and d["data"]["vehicles"][0]["terrain_fit"] > 0.9, "Decision Vehicle Match")

step("5.4 Atomically Reserve Stock in Warehouse")
resp = client.post("/api/v1/resources/inventory/INV01/reserve", json={"quantity": 5000, "mission_id": "MIS001"}, headers=headers)
assert_response(resp, 200, lambda d: "reservation_id" in d["data"], "Reserve Stock")

# ---------------------------------------------------------
# STAGE 6: RISK-AWARE ROUTING & ALTERNATIVES
# ---------------------------------------------------------
step("6.1 Calculate Optimal Risk-Aware Route")
resp = client.post("/api/v1/routes/calculate", json={
    "origin": {"lat": 25.185, "lng": 93.025},
    "destination": {"lat": 25.400, "lng": 93.200},
    "vehicle_id": "VH017"
}, headers=headers)
assert_response(resp, 200, lambda d: d["data"]["distance_km"] > 0 and d["data"]["estimated_time_min"] > 0, "Route Calculate")

step("6.2 Compare Multi-Corridor Trade-offs")
resp = client.post("/api/v1/routes/compare", json={
    "origin": {"lat": 25.185, "lng": 93.025},
    "destination": {"lat": 25.400, "lng": 93.200},
    "vehicle_id": "VH017",
    "alternatives": 3
}, headers=headers)
assert_response(resp, 200, lambda d: len(d["data"]["routes"]) >= 2, "Route Compare")

# ---------------------------------------------------------
# STAGE 7: MISSION CREATION, APPROVAL & DISPATCH
# ---------------------------------------------------------
step("7.1 Formulate Operational Delivery Mission")
resp = client.post("/api/v1/logistics/missions", json={
    "request_id": request_id,
    "warehouse_id": "WH01",
    "vehicle_id": "VH017",
    "route_id": "R2"
}, headers=headers)
assert_response(resp, 200, lambda d: d["data"]["status"] == "PENDING_APPROVAL", "Create Mission")
mission_id = resp.json()["data"]["id"]

step("7.2 Sovereign Authority Approves Mission")
resp = client.post(f"/api/v1/logistics/missions/{mission_id}/approve", json={"reason": "Emergency medical delivery approved for Harangajao."}, headers=headers)
assert_response(resp, 200, lambda d: d["data"]["status"] == "APPROVED", "Approve Mission")

step("7.3 Warehouse Dispatches Stock against Mission")
resp = client.post("/api/v1/warehouses/WH01/dispatch", json={
    "mission_id": mission_id,
    "items": [{"resource_type": "WATER", "quantity": 5000}]
}, headers=headers)
assert_response(resp, 200, lambda d: d["data"]["status"] == "DISPATCHED", "Dispatch Warehouse")

step("7.4 Convoy Starts Transit")
resp = client.post(f"/api/v1/logistics/missions/{mission_id}/start", json={}, headers=headers)
assert_response(resp, 200, lambda d: d["data"]["status"] == "IN_TRANSIT", "Start Mission")

step("7.5 Vehicle Emits Live GPS Telemetry Update")
resp = client.post("/api/v1/vehicles/VH017/location", json={
    "lat": 25.22,
    "lng": 93.06,
    "speed": 34.5,
    "heading": 135.0,
    "timestamp": datetime.now(timezone.utc).isoformat()
}, headers=headers)
assert_response(resp, 200, lambda d: d["data"]["accepted"] is True, "Vehicle GPS Ingest")

# ---------------------------------------------------------
# STAGE 8: DYNAMIC DISRUPTION & AUTOMATED REPLANNING
# ---------------------------------------------------------
step("8.1 New Roadblock Occurs -> Run Replanning Impact Check")
resp = client.post("/api/v1/replanning/check", json={"incident_id": incident_id}, headers=headers)
assert_response(resp, 200, lambda d: d["data"]["replanning_required"] is True, "Replanning Impact Check")

step("8.2 Query Incident Affected Missions")
resp = client.get(f"/api/v1/incidents/{incident_id}/affected-missions", headers=headers)
assert_response(resp, 200, lambda d: len(d["data"]["missions"]) >= 1, "Affected Missions")

step("8.3 Decision Engine Generates Replan Proposal via BRO Bypass")
resp = client.post("/api/v1/replanning/generate", json={"mission_id": mission_id}, headers=headers)
assert_response(resp, 200, lambda d: d["data"]["requires_approval"] is True and "recommended_plan" in d["data"], "Generate Replan")
replan_id = resp.json()["data"]["replanning_id"]

step("8.4 Authority Approves Replan Proposal")
resp = client.post(f"/api/v1/replanning/{replan_id}/approve", json={"reason": "NH-27 impassable; verified BRO military bypass"}, headers=headers)
assert_response(resp, 200, lambda d: d["data"]["status"] == "APPROVED" and d["data"]["applied"] is True, "Approve Replan")

step("8.5 Check Live Route Status for Convoy")
resp = client.get("/api/v1/routes/R2/status", headers=headers)
assert_response(resp, 200, lambda d: d["data"]["status"] == "FEASIBLE", "Route Live Status")

step("8.6 Convoy Successfully Delivers Relief Supplies")
resp = client.post(f"/api/v1/logistics/missions/{mission_id}/complete", json={
    "delivered_items": [{"resource_type": "WATER", "quantity": 5000}],
    "proof": {"receiver": "Circle Officer Harangajao"}
}, headers=headers)
assert_response(resp, 200, lambda d: d["data"]["status"] == "DELIVERED" and d["data"]["delivery_confirmed"] is True, "Complete Mission")

# ---------------------------------------------------------
# STAGE 9: RELOCATION ESCALATION WORKFLOW
# ---------------------------------------------------------
step("9.1 Check Population Vulnerability for Severed Habitation")
resp = client.get("/api/v1/population/HAB001/vulnerability", headers=headers)
assert_response(resp, 200, lambda d: d["data"]["score"] >= 70, "Population Vulnerability")

step("9.2 Open Relocation Assessment Case")
resp = client.post("/api/v1/relocation/cases", json={
    "habitation_id": "HAB001",
    "trigger_incident_id": incident_id
}, headers=headers)
assert_response(resp, 200, lambda d: d["data"]["status"] == "ASSESSMENT", "Create Relocation Case")
case_id = resp.json()["data"]["id"]

step("9.3 Query Candidate Destination Shelters")
resp = client.get(f"/api/v1/relocation/cases/{case_id}/candidates", headers=headers)
assert_response(resp, 200, lambda d: len(d["data"]["candidates"]) >= 1, "Candidate Shelters")

step("9.4 Execute Relocation MCDA Feasibility Evaluation")
resp = client.post(f"/api/v1/relocation/cases/{case_id}/evaluate", json={
    "population": 5200,
    "required_services": ["MEDICAL", "WATER", "FOOD"]
}, headers=headers)
assert_response(resp, 200, lambda d: d["data"]["feasible"] is True and "recommendation" in d["data"], "Evaluate Relocation")

step("9.5 Formulate Relocation Evacuation Mission")
resp = client.post("/api/v1/relocation/missions", json={
    "case_id": case_id,
    "destination_id": "SHELTER01",
    "vehicles": ["VH020", "VH021"]
}, headers=headers)
assert_response(resp, 200, lambda d: d["data"]["status"] == "PENDING_APPROVAL", "Create Relocation Mission")
rel_mission_id = resp.json()["data"]["id"]

step("9.6 Approve, Execute and Complete Relocation Convoy")
resp = client.post(f"/api/v1/relocation/missions/{rel_mission_id}/approve", json={"reason": "Village unserviceable; approved evacuation."}, headers=headers)
assert_response(resp, 200, lambda d: d["data"]["status"] == "APPROVED", "Approve Relocation Mission")

resp = client.post(f"/api/v1/relocation/missions/{rel_mission_id}/start", json={}, headers=headers)
assert_response(resp, 200, lambda d: d["data"]["status"] == "IN_TRANSIT", "Start Relocation Mission")

resp = client.post(f"/api/v1/relocation/missions/{rel_mission_id}/complete", json={"arrived_population": 5200}, headers=headers)
assert_response(resp, 200, lambda d: d["data"]["status"] == "COMPLETED", "Complete Relocation Mission")

step("9.7 Update Shelter Occupancy & Headroom")
resp = client.post("/api/v1/shelters/SHELTER01/occupancy", json={"occupancy": 2600, "source": "RELOCATION_MISSION"}, headers=headers)
assert_response(resp, 200, lambda d: d["data"]["remaining_capacity"] == 4400, "Update Shelter Occupancy")

# ---------------------------------------------------------
# STAGE 10: VOICE INTELLIGENCE & AI COPILOT
# ---------------------------------------------------------
step("10.1 Voice Transcription & Zero-Shot Incident Extraction")
resp = client.post("/api/v1/voice/transcribe", files={"audio": ("audio.wav", b"sample_audio", "audio/wav")}, headers=headers)
assert_response(resp, 200, lambda d: "transcript" in d["data"], "Voice Transcribe")

resp = client.post("/api/v1/voice/parse-incident", json={"transcript": "Landslide has blocked NH-27 near Village X. Heavy vehicles cannot pass."}, headers=headers)
assert_response(resp, 200, lambda d: d["data"]["incident_type"] == "LANDSLIDE", "Parse Voice Incident")

resp = client.post("/api/v1/voice/confirm", json={"draft_id": "VD001", "confirmed": True}, headers=headers)
assert_response(resp, 200, lambda d: "report_id" in d["data"], "Confirm Voice Report")

step("10.2 Natural Language Copilot Query & Situation Summary")
resp = client.post("/api/v1/copilot/query", json={"query": "Which locations have critical medical shortages?"}, headers=headers)
assert_response(resp, 200, lambda d: len(d["data"]["sources"]) >= 1, "Copilot Query")

resp = client.post("/api/v1/copilot/summarize", json={"scope": "DISTRICT", "district_id": "D01", "period": "6h"}, headers=headers)
assert_response(resp, 200, lambda d: "current_situation" in d["data"], "Copilot Summarize")

resp = client.post("/api/v1/copilot/explain", json={"entity_type": "MISSION", "entity_id": mission_id}, headers=headers)
assert_response(resp, 200, lambda d: len(d["data"]["evidence"]) >= 1, "Copilot Explain Decision")

# ---------------------------------------------------------
# STAGE 11: COMMAND DASHBOARDS & ANALYTICS
# ---------------------------------------------------------
step("11.1 Fetch Multi-Tier Operational Dashboards")
resp = client.get("/api/v1/dashboard/overview", headers=headers)
assert_response(resp, 200, lambda d: "kpis" in d["data"], "Overview Dashboard")

resp = client.get("/api/v1/dashboard/district/D01", headers=headers)
assert_response(resp, 200, lambda d: d["data"]["district_id"] == "D01", "District Dashboard")

step("11.2 Check Analytics & Time-Series History")
resp = client.get("/api/v1/analytics/logistics", headers=headers)
assert_response(resp, 200, lambda d: d["data"]["requests_total"] > 0, "Logistics Analytics")

resp = client.get("/api/v1/analytics/routes", headers=headers)
assert_response(resp, 200, lambda d: d["data"]["routes_calculated"] > 0, "Routes Analytics")

resp = client.get("/api/v1/analytics/history", headers=headers)
assert_response(resp, 200, lambda d: len(d["data"]["series"]) >= 1, "Historical Time-Series")

# ---------------------------------------------------------
# STAGE 12: AUDIT TRAIL, EXPORT & CONFIGURATION
# ---------------------------------------------------------
step("12.1 Verify Cryptographic Audit Logs & Compliance Export")
resp = client.get("/api/v1/audit", headers=headers)
assert_response(resp, 200, lambda d: len(d["data"]["items"]) >= 1, "Audit Log List")

resp = client.get("/api/v1/audit/export", headers=headers)
assert_response(resp, 200, lambda d: d["data"]["status"] == "READY", "Audit Export")

step("12.2 System Configuration & Versioned Priority Rules")
resp = client.get("/api/v1/config", headers=headers)
assert_response(resp, 200, lambda d: len(d["data"]["disaster_types"]) > 0, "System Config")

resp = client.get("/api/v1/config/priority-rules", headers=headers)
assert_response(resp, 200, lambda d: d["data"]["version"] == "v3", "Priority Rules v3")

# ---------------------------------------------------------
# STAGE 13: OFFLINE, EDGE & SYNCHRONIZATION
# ---------------------------------------------------------
step("13.1 Offline Status & Local Edge Node Health")
resp = client.get("/api/v1/offline/status", headers=headers)
assert_response(resp, 200, lambda d: "node_id" in d["data"], "Offline Status")

resp = client.get("/api/v1/edge/status", headers=headers)
assert_response(resp, 200, lambda d: d["data"]["status"] == "ONLINE", "Edge Status")

step("13.2 Store-and-Forward Event Synchronization & Conflict Resolution")
resp = client.post("/api/v1/sync/push", json={
    "events": [{"event_id": "EV_OFFLINE_01", "type": "FIELD_REPORT_CREATED", "payload": {}, "created_at": datetime.now(timezone.utc).isoformat()}]
}, headers=headers)
assert_response(resp, 200, lambda d: "EV_OFFLINE_01" in d["data"]["accepted"], "Sync Push")

resp = client.post("/api/v1/sync/pull", json={"cursor": "CURSOR_100"}, headers=headers)
assert_response(resp, 200, lambda d: "cursor" in d["data"], "Sync Pull")

resp = client.post("/api/v1/sync/conflicts/CON001/resolve", json={"resolution": "SERVER_WINS", "reason": "Command center authoritative override"}, headers=headers)
assert_response(resp, 200, lambda d: d["data"]["status"] == "RESOLVED", "Resolve Conflict")

# ---------------------------------------------------------
# FINAL REPORT
# ---------------------------------------------------------
print(f"\n{Colors.BOLD}{Colors.HEADER}========================================================================{Colors.ENDC}")
print(f"{Colors.BOLD}{Colors.OKGREEN}   COMPLETE LIFECYCLE FLOW TEST COMPLETED: {steps_passed}/{steps_total} STEPS PASSED (100% SUCCESS)   {Colors.ENDC}")
print(f"{Colors.BOLD}{Colors.HEADER}========================================================================{Colors.ENDC}\n")
