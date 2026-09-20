import json
from datetime import datetime, timezone
from typing import Any, Optional
from app.core.config import settings

class OperationalDataStore:
    def __init__(self):
        # Base geographic and infrastructure datasets
        self.villages: list[dict] = []
        self.hazard_zones: list[dict] = []
        self.warehouses: list[dict] = []
        self.fleet: list[dict] = []
        self.shelters: list[dict] = []
        self.facilities: list[dict] = []
        self.weather: dict = {}
        
        # Domain operational state
        self.users: list[dict] = []
        self.regions: list[dict] = []
        self.districts: list[dict] = []
        self.habitations: list[dict] = []
        self.incidents: list[dict] = []
        self.logistics_requests: list[dict] = []
        self.resource_types: list[dict] = []
        self.inventory: list[dict] = []
        self.reservations: list[dict] = []
        self.dispatches: list[dict] = []
        self.vehicle_telemetry: dict[str, list[dict]] = {}
        self.missions: list[dict] = []
        self.routes_catalog: list[dict] = []
        self.replanning_cases: list[dict] = []
        self.field_reports: list[dict] = []
        self.alerts: list[dict] = []
        self.relocation_cases: list[dict] = []
        self.relocation_missions: list[dict] = []
        self.approvals_queue: list[dict] = []
        self.approvals_history: list[dict] = []
        self.generated_reports: list[dict] = []
        self.audit_logs: list[dict] = []
        self.sync_events: list[dict] = []
        self.sync_conflicts: list[dict] = []
        self.voice_drafts: list[dict] = []
        self.edge_nodes: list[dict] = []
        self.priority_rules: dict = {}
        self.priority_actions: list[dict] = [
            {
                "id": "ACT01",
                "type": "APPROVE",
                "severity": "CRITICAL",
                "title": "Approve relief convoy to Maibong",
                "subtitle": "Medicines and food supplies (2.5 tons)",
                "time_ago": "2 min ago",
                "action_type": "approve_mission",
                "target_id": "MIS001",
                "button_text": "Approve"
            },
            {
                "id": "ACT02",
                "type": "REVIEW",
                "severity": "HIGH",
                "title": "Assess shelter capacity in Tura",
                "subtitle": "Increase inflow due to flooding",
                "time_ago": "15 min ago",
                "action_type": "review_shelter",
                "target_id": "FAC10",
                "button_text": "Review"
            },
            {
                "id": "ACT03",
                "type": "ALLOCATE",
                "severity": "MEDIUM",
                "title": "Reallocate fuel to Aizawl",
                "subtitle": "Low stock alert (800 L remaining)",
                "time_ago": "28 min ago",
                "action_type": "allocate_resource",
                "target_id": "WH04",
                "button_text": "Allocate"
            },
            {
                "id": "ACT04",
                "type": "PLAN_ROUTE",
                "severity": "INFO",
                "title": "Clear alternate route for NH-27",
                "subtitle": "Primary route blocked at Jatinga",
                "time_ago": "42 min ago",
                "action_type": "plan_route",
                "target_id": "R2",
                "button_text": "Plan Route"
            },
            {
                "id": "ACT05",
                "type": "CONFIRM",
                "severity": "SUCCESS",
                "title": "Confirm relocation readiness",
                "subtitle": "Rengma Village, Assam (5,200 people)",
                "time_ago": "1 hour ago",
                "action_type": "confirm_relocation",
                "target_id": "REL001",
                "button_text": "Review"
            },
            {
                "id": "ACT06",
                "type": "APPROVE",
                "severity": "CRITICAL",
                "title": "Authorize medical airlift to Haflong",
                "subtitle": "Emergency surgical kits & oxygen (500 kg)",
                "time_ago": "1 hour ago",
                "action_type": "approve_mission",
                "target_id": "MIS002",
                "button_text": "Approve"
            },
            {
                "id": "ACT07",
                "type": "DISPATCH",
                "severity": "HIGH",
                "title": "Dispatch backup power generators to Sonitpur",
                "subtitle": "Relief camp power outage alert",
                "time_ago": "2 hours ago",
                "action_type": "allocate_resource",
                "target_id": "WH01",
                "button_text": "Dispatch"
            },
            {
                "id": "ACT08",
                "type": "VERIFY",
                "severity": "MEDIUM",
                "title": "Verify satellite landslide survey on NH-6",
                "subtitle": "New ground displacement detected near Jowai",
                "time_ago": "3 hours ago",
                "action_type": "plan_route",
                "target_id": "RD14",
                "button_text": "Verify"
            }
        ]

        self.reload_from_disk()
        if not self.load_persisted_state():
            self.seed_operational_state()
            self.save_to_disk()

    @property
    def persistent_state_path(self):
        return settings.DATA_DIR / "operational_state.json"

    def save_to_disk(self):
        try:
            state = {
                "users": self.users,
                "regions": self.regions,
                "districts": self.districts,
                "habitations": self.habitations,
                "incidents": self.incidents,
                "logistics_requests": self.logistics_requests,
                "resource_types": self.resource_types,
                "inventory": self.inventory,
                "reservations": self.reservations,
                "dispatches": self.dispatches,
                "vehicle_telemetry": self.vehicle_telemetry,
                "missions": self.missions,
                "routes_catalog": self.routes_catalog,
                "replanning_cases": self.replanning_cases,
                "field_reports": self.field_reports,
                "alerts": self.alerts,
                "shelters": self.shelters,
                "facilities": self.facilities,
                "fleet": self.fleet,
                "warehouses": self.warehouses,
                "relocation_cases": self.relocation_cases,
                "relocation_missions": self.relocation_missions,
                "approvals_queue": self.approvals_queue,
                "approvals_history": self.approvals_history,
                "generated_reports": self.generated_reports,
                "audit_logs": self.audit_logs,
                "priority_rules": self.priority_rules,
                "priority_actions": self.priority_actions,
                "sync_events": self.sync_events,
                "sync_conflicts": self.sync_conflicts,
                "edge_nodes": self.edge_nodes,
            }
            tmp_path = self.persistent_state_path.with_suffix(".tmp")
            with open(tmp_path, "w", encoding="utf-8") as f:
                json.dump(state, f, indent=2, ensure_ascii=False)
            tmp_path.replace(self.persistent_state_path)
        except Exception as e:
            print(f"[STORE PERSISTENCE ERROR] Failed to save state to disk: {e}")

    def load_persisted_state(self) -> bool:
        if not self.persistent_state_path.exists():
            return False
        try:
            with open(self.persistent_state_path, "r", encoding="utf-8") as f:
                state = json.load(f)
            for k, v in state.items():
                if hasattr(self, k) and v:
                    setattr(self, k, v)
            return True
        except Exception as e:
            print(f"[STORE PERSISTENCE WARNING] Failed to load state from disk: {e}")
            return False


    def reload_from_disk(self):
        if settings.VILLAGES_PATH.exists():
            with open(settings.VILLAGES_PATH, "r", encoding="utf-8") as f:
                v_data = json.load(f)
                self.villages = [feat["properties"] for feat in v_data.get("features", [])]

        if settings.HAZARDS_PATH.exists():
            with open(settings.HAZARDS_PATH, "r", encoding="utf-8") as f:
                h_data = json.load(f)
                self.hazard_zones = [feat["properties"] for feat in h_data.get("features", [])]

        if settings.WAREHOUSES_PATH.exists():
            with open(settings.WAREHOUSES_PATH, "r", encoding="utf-8") as f:
                w_data = json.load(f)
                self.warehouses = w_data.get("warehouses", [])

        if settings.FLEET_PATH.exists():
            with open(settings.FLEET_PATH, "r", encoding="utf-8") as f:
                f_data = json.load(f)
                self.fleet = f_data.get("vehicles", [])

        if settings.SHELTERS_PATH.exists():
            with open(settings.SHELTERS_PATH, "r", encoding="utf-8") as f:
                s_data = json.load(f)
                self.shelters = s_data.get("shelters", [])

        if settings.WEATHER_PATH.exists():
            with open(settings.WEATHER_PATH, "r", encoding="utf-8") as f:
                self.weather = json.load(f)

    def seed_operational_state(self):
        now_iso = datetime.now(timezone.utc).isoformat()

        # 1. Regions (8 NER States)
        self.regions = [
            {"id": "AS", "name": "Assam", "district_count": 35, "boundary": "GeoJSON_Polygon_Assam", "active_incidents": 12, "critical_missions": 4},
            {"id": "AR", "name": "Arunachal Pradesh", "district_count": 26, "boundary": "GeoJSON_Polygon_Arunachal", "active_incidents": 5, "critical_missions": 2},
            {"id": "MN", "name": "Manipur", "district_count": 16, "boundary": "GeoJSON_Polygon_Manipur", "active_incidents": 4, "critical_missions": 1},
            {"id": "ML", "name": "Meghalaya", "district_count": 12, "boundary": "GeoJSON_Polygon_Meghalaya", "active_incidents": 3, "critical_missions": 2},
            {"id": "MZ", "name": "Mizoram", "district_count": 11, "boundary": "GeoJSON_Polygon_Mizoram", "active_incidents": 2, "critical_missions": 1},
            {"id": "NL", "name": "Nagaland", "district_count": 16, "boundary": "GeoJSON_Polygon_Nagaland", "active_incidents": 3, "critical_missions": 1},
            {"id": "SK", "name": "Sikkim", "district_count": 6, "boundary": "GeoJSON_Polygon_Sikkim", "active_incidents": 6, "critical_missions": 3},
            {"id": "TR", "name": "Tripura", "district_count": 8, "boundary": "GeoJSON_Polygon_Tripura", "active_incidents": 2, "critical_missions": 1},
        ]

        # 2. Districts
        self.districts = [
            {"id": "D01", "name": "Dima Hasao", "state_id": "AS", "population": 214102, "hq": "Haflong"},
            {"id": "D02", "name": "Cachar", "state_id": "AS", "population": 1736617, "hq": "Silchar"},
            {"id": "D03", "name": "North Sikkim", "state_id": "SK", "population": 43709, "hq": "Mangan"},
            {"id": "D04", "name": "Papum Pare", "state_id": "AR", "population": 176573, "hq": "Yupia"},
            {"id": "D05", "name": "East Khasi Hills", "state_id": "ML", "population": 825922, "hq": "Shillong"},
        ]

        # 3. Habitations (Pre-seeded + GeoJSON loaded)
        state_map = {
            "Assam": "AS", "Arunachal Pradesh": "AR", "Manipur": "MN",
            "Meghalaya": "ML", "Mizoram": "MZ", "Nagaland": "NL",
            "Sikkim": "SK", "Tripura": "TR"
        }
        district_map = {
            "Dima Hasao": "D01", "Cachar": "D02", "North Sikkim": "D03",
            "Papum Pare": "D04", "East Khasi Hills": "D05"
        }
        
        self.habitations = [
            {
                "id": "HAB001",
                "name": "Village A (Harangajao)",
                "state_id": "AS",
                "state": "Assam",
                "district_id": "D01",
                "district": "Dima Hasao",
                "coordinates": {"lat": 25.40, "lng": 93.20},
                "population": 2350,
                "households": 480,
                "children": 360,
                "elderly": 190,
                "persons_with_disabilities": 45,
                "vulnerable_population": 595,
                "risk_level": "HIGH",
                "access": "PARTIAL",
                "critical_needs": ["WATER", "MEDICINE"],
                "active_incidents": ["INC001"],
                "vulnerability_score": 78,
                "vulnerability_factors": {
                    "population": 80,
                    "accessibility": 90,
                    "hazard": 85,
                    "critical_facility_dependency": 60
                }
            },
            {
                "id": "HAB002",
                "name": "Jatinga Ridge Valley",
                "state_id": "AS",
                "state": "Assam",
                "district_id": "D01",
                "district": "Dima Hasao",
                "coordinates": {"lat": 25.12, "lng": 93.04},
                "population": 1820,
                "households": 340,
                "children": 250,
                "elderly": 140,
                "persons_with_disabilities": 30,
                "vulnerable_population": 420,
                "risk_level": "CRITICAL",
                "access": "BLOCKED",
                "critical_needs": ["FOOD", "WATER", "MEDICINE"],
                "active_incidents": ["INC001"],
                "vulnerability_score": 88,
                "vulnerability_factors": {
                    "population": 75,
                    "accessibility": 95,
                    "hazard": 92,
                    "critical_facility_dependency": 80
                }
            }
        ]

        # Load GeoJSON features into habitations
        if settings.VILLAGES_PATH.exists():
            try:
                with open(settings.VILLAGES_PATH, "r", encoding="utf-8") as f:
                    v_data = json.load(f)
                    for feat in v_data.get("features", []):
                        props = feat.get("properties", {})
                        geom = feat.get("geometry", {})
                        coords = geom.get("coordinates", [93.0, 25.0])
                        v_id = props.get("location_id") or feat.get("id")
                        if not any(h["id"] == v_id for h in self.habitations):
                            st_name = props.get("state", "Assam")
                            dt_name = props.get("district", "Dima Hasao")
                            self.habitations.append({
                                "id": v_id,
                                "name": props.get("village_name", v_id),
                                "state_id": state_map.get(st_name, "AS"),
                                "state": st_name,
                                "district_id": district_map.get(dt_name, "D01"),
                                "district": dt_name,
                                "coordinates": {"lat": coords[1], "lng": coords[0]},
                                "population": props.get("population", 2500),
                                "households": props.get("households", 500),
                                "children": props.get("children_under_6", 300),
                                "elderly": props.get("elderly_above_60", 200),
                                "persons_with_disabilities": 50,
                                "vulnerable_population": int(props.get("population", 2500) * props.get("vulnerability_index", 0.5)),
                                "risk_level": "CRITICAL" if props.get("vulnerability_index", 0) > 0.8 else "HIGH",
                                "access": "BLOCKED" if props.get("baseline_days_isolated", 0) > 3 else "OPEN",
                                "critical_needs": ["WATER", "MEDICINE"],
                                "active_incidents": [],
                                "vulnerability_score": int(props.get("vulnerability_index", 0.5) * 100),
                                "vulnerability_factors": {
                                    "population": 80,
                                    "accessibility": 85,
                                    "hazard": 75,
                                    "critical_facility_dependency": 65
                                }
                            })
            except Exception:
                pass

        # 4. Facilities
        self.facilities = [
            {
                "id": "FAC01",
                "name": "PHC Harangajao",
                "type": "HOSPITAL",
                "state_id": "AS",
                "district_id": "D01",
                "coordinates": {"lat": 25.40, "lng": 93.20},
                "operational": True,
                "capacity": 80,
                "current_load": 65,
                "water": "AVAILABLE",
                "medical_stock": "LOW",
                "status": "ACTIVE"
            },
            {
                "id": "FAC10",
                "name": "Shelter A (Haflong Multipurpose)",
                "type": "SHELTER",
                "state_id": "AS",
                "district_id": "D01",
                "coordinates": {"lat": 25.40, "lng": 93.20},
                "operational": True,
                "capacity": 500,
                "current_load": 320,
                "water": "AVAILABLE",
                "medical_stock": "LOW",
                "status": "ACTIVE"
            },
            {
                "id": "FAC04",
                "name": "Civil Hospital Haflong",
                "type": "HOSPITAL",
                "state_id": "AS",
                "district_id": "D01",
                "coordinates": {"lat": 25.18, "lng": 93.02},
                "operational": True,
                "capacity": 200,
                "current_load": 140,
                "water": "AVAILABLE",
                "medical_stock": "ADEQUATE",
                "status": "ACTIVE"
            }
        ]

        # 5. Resource Types Catalogue
        self.resource_types = [
            {"id": "WATER", "name": "Drinking Water", "allowed_units": ["LITRE", "BOTTLES", "BOX"]},
            {"id": "FOOD", "name": "Ready-to-Eat Rations", "allowed_units": ["PACK", "KG", "MEALS"]},
            {"id": "MEDICINE", "name": "Emergency Medical Trauma Packs", "allowed_units": ["PACK", "KITS"]},
            {"id": "SHELTER_KIT", "name": "All-Weather Tarpaulins & Tents", "allowed_units": ["UNIT", "SETS"]},
            {"id": "FUEL", "name": "High-Altitude Diesel Fuel", "allowed_units": ["LITRE", "DRUMS"]}
        ]

        # 6. Warehouses & Inventory (1,240 Tons Total Inventory across 6 Strategic Warehouses)
        self.warehouses = [
            {
                "id": "WH01",
                "name": "Guwahati Central Strategic Hub",
                "location_name": "Guwahati, Kamrup Metro",
                "coordinates": {"lat": 26.14, "lng": 91.73},
                "capacity": 50000,
                "used_capacity": 42500,
                "utilization": 85,
                "status": "OPERATIONAL",
                "available_stock_types": 6,
                "inventory": ["INV01", "INV02", "INV03", "INV04", "INV05", "INV06"],
                "dispatches": ["DSP001"]
            },
            {
                "id": "WH02",
                "name": "Dima Hasao Regional Depot",
                "location_name": "Haflong, Dima Hasao",
                "coordinates": {"lat": 25.185, "lng": 93.025},
                "capacity": 15000,
                "used_capacity": 9300,
                "utilization": 62,
                "status": "OPERATIONAL",
                "available_stock_types": 5,
                "inventory": ["INV01", "INV02", "INV03"],
                "dispatches": ["DSP001"]
            },
            {
                "id": "WH03",
                "name": "Silchar Valley Strategic Reserve",
                "location_name": "Silchar, Cachar",
                "coordinates": {"lat": 24.833, "lng": 92.778},
                "capacity": 20000,
                "used_capacity": 9600,
                "utilization": 48,
                "status": "OPERATIONAL",
                "available_stock_types": 5,
                "inventory": ["INV01", "INV03", "INV04"],
                "dispatches": []
            },
            {
                "id": "WH04",
                "name": "Aizawl Forward Staging Depot",
                "location_name": "Aizawl, Mizoram",
                "coordinates": {"lat": 23.73, "lng": 92.72},
                "capacity": 10000,
                "used_capacity": 4000,
                "utilization": 40,
                "status": "OPERATIONAL",
                "available_stock_types": 4,
                "inventory": ["INV01", "INV02", "INV05"],
                "dispatches": []
            },
            {
                "id": "WH05",
                "name": "Itanagar High-Altitude Depot",
                "location_name": "Itanagar, Arunachal Pradesh",
                "coordinates": {"lat": 27.08, "lng": 93.60},
                "capacity": 12000,
                "used_capacity": 4200,
                "utilization": 35,
                "status": "OPERATIONAL",
                "available_stock_types": 4,
                "inventory": ["INV01", "INV03", "INV04"],
                "dispatches": []
            },
            {
                "id": "WH06",
                "name": "Kohima Tactical Logistics Store",
                "location_name": "Kohima, Nagaland",
                "coordinates": {"lat": 25.67, "lng": 94.11},
                "capacity": 10000,
                "used_capacity": 2800,
                "utilization": 28,
                "status": "OPERATIONAL",
                "available_stock_types": 4,
                "inventory": ["INV02", "INV03", "INV05"],
                "dispatches": []
            }
        ]

        # Realistic Inventory Breakdown totalling 1,240 Tons:
        # Food: 38% (471.2T), Water: 26% (322.4T), Medicine: 18% (223.2T), Fuel: 10% (124T), Shelter: 6% (74.4T), Others: 2% (24.8T)
        self.inventory = [
            {"id": "INV01", "warehouse_id": "WH01", "resource_type": "FOOD", "name": "Ready-to-Eat Food Packs", "stock": 471200, "reserved": 25000, "available": 446200, "unit": "PACK", "tons": 471.2, "percentage": 38},
            {"id": "INV02", "warehouse_id": "WH01", "resource_type": "WATER", "name": "Bottled Drinking Water (1L)", "stock": 322400, "reserved": 30000, "available": 292400, "unit": "LITRE", "tons": 322.4, "percentage": 26},
            {"id": "INV03", "warehouse_id": "WH01", "resource_type": "MEDICINE", "name": "Emergency Trauma Medicine Kits", "stock": 223200, "reserved": 15000, "available": 208200, "unit": "KITS", "tons": 223.2, "percentage": 18},
            {"id": "INV04", "warehouse_id": "WH01", "resource_type": "FUEL", "name": "High-Altitude Diesel Fuel", "stock": 124000, "reserved": 12000, "available": 112000, "unit": "LITRE", "tons": 124.0, "percentage": 10},
            {"id": "INV05", "warehouse_id": "WH01", "resource_type": "SHELTER_KIT", "name": "All-Weather Tarpaulins & Tents", "stock": 74400, "reserved": 5000, "available": 69400, "unit": "SETS", "tons": 74.4, "percentage": 6},
            {"id": "INV06", "warehouse_id": "WH01", "resource_type": "RESCUE_GEAR", "name": "Rescue Boats & Search Gear", "stock": 24800, "reserved": 2000, "available": 22800, "unit": "UNITS", "tons": 24.8, "percentage": 2},
        ]

        self.reservations = [
            {"id": "RES001", "inventory_id": "INV01", "mission_id": "MIS001", "quantity": 1000, "status": "ACTIVE", "created_at": now_iso}
        ]

        self.dispatches = [
            {"dispatch_id": "DSP001", "warehouse_id": "WH01", "mission_id": "MIS001", "status": "DISPATCHED", "items": [{"resource_type": "WATER", "quantity": 1000}], "dispatched_at": now_iso}
        ]

        # 7. Vehicles & Fleet (42 Realistic Operational Units across North East)
        fleet_templates = [
            ("VH001", "BRAHMAPUTRA-TACTICAL-01", "TRUCK", "4X4_HIGH_CLEARANCE_HEAVY", "AVAILABLE", 5000, "HIGH", 26.14, 91.73, 0, 0, "Guwahati Central Depot", "Havildar B. Gogoi", 92),
            ("VH002", "BRAHMAPUTRA-TACTICAL-02", "TRUCK", "4X4_HIGH_CLEARANCE_HEAVY", "AVAILABLE", 5000, "HIGH", 26.18, 91.75, 34, 110, "Guwahati Central Depot", "Naik P. Kalita", 88),
            ("VH003", "BRAHMAPUTRA-TACTICAL-03", "TRUCK", "4X4_HIGH_CLEARANCE_HEAVY", "AVAILABLE", 5000, "HIGH", 26.75, 94.22, 28, 140, "Jorhat Tactical Hub", "Havildar D. Baruah", 76),
            ("VH004", "MEGHALAYA-OFFROAD-01", "4X4_LIGHT", "4X4_LIGHT", "AVAILABLE", 1500, "VERY_HIGH", 25.57, 91.88, 0, 0, "Shillong HQ", "Sub-Inspector T. Sangma", 95),
            ("VH005", "MEGHALAYA-OFFROAD-02", "4X4_LIGHT", "4X4_LIGHT", "AVAILABLE", 1500, "VERY_HIGH", 25.52, 90.22, 24, 90, "Tura Sub-Depot", "Naik J. Marak", 84),
            ("VH006", "HILL-DEFENDER-01", "TRUCK", "4X4_HIGH_CLEARANCE_HEAVY", "AVAILABLE", 4000, "HIGH", 25.18, 93.02, 0, 0, "Dima Hasao Depot", "Havildar K. Thapa", 90),
            ("VH007", "HILL-DEFENDER-02", "TRUCK", "4X4_HIGH_CLEARANCE_HEAVY", "AVAILABLE", 4000, "HIGH", 25.35, 93.15, 26, 180, "Haflong Regional Hub", "Naik S. Dimasa", 79),
            ("VH008", "HILL-DEFENDER-03", "TRUCK", "4X4_HIGH_CLEARANCE_HEAVY", "AVAILABLE", 4000, "HIGH", 25.40, 93.20, 31, 160, "Harangajao Staging", "Naik B. Kemprai", 85),
            ("VH009", "CONVOY-BUS-01", "BUS", "HEAVY_PASSENGER_BUS", "AVAILABLE", 50, "STANDARD", 26.14, 91.73, 0, 0, "Guwahati Transit", "Naik R. Debbarma", 90),
            ("VH010", "CONVOY-BUS-02", "BUS", "HEAVY_PASSENGER_BUS", "AVAILABLE", 50, "STANDARD", 24.83, 92.79, 0, 0, "Silchar Transit", "Havildar M. Nath", 94),
            ("VH011", "ARUNACHAL-RAPID-01", "4X4_LIGHT", "4X4_LIGHT", "AVAILABLE", 2000, "VERY_HIGH", 27.08, 93.60, 35, 210, "Itanagar Base", "Naik L. Ao", 82),
            ("VH012", "ARUNACHAL-RAPID-02", "4X4_LIGHT", "4X4_LIGHT", "AVAILABLE", 2000, "VERY_HIGH", 27.30, 95.35, 0, 0, "Pasighat Depot", "Naik T. Riba", 96),
            ("VH013", "NAGALAND-EXPEDITION-01", "TRUCK", "4X4_HIGH_CLEARANCE_HEAVY", "AVAILABLE", 4500, "VERY_HIGH", 25.67, 94.11, 20, 130, "Kohima Logistics Hub", "Havildar Z. Angami", 75),
            ("VH014", "NAGALAND-EXPEDITION-02", "4X4_LIGHT", "4X4_LIGHT", "AVAILABLE", 1800, "VERY_HIGH", 25.90, 93.73, 0, 0, "Dimapur Depot", "Naik V. Sema", 91),
            ("VH015", "SIKKIM-ALPINE-01", "TRUCK", "4X4_HIGH_CLEARANCE_HEAVY", "AVAILABLE", 3500, "VERY_HIGH", 27.33, 88.61, 22, 190, "Gangtok Forward Hub", "Havildar P. Lepcha", 87),
            ("VH016", "SIKKIM-ALPINE-02", "4X4_LIGHT", "4X4_LIGHT", "AVAILABLE", 1500, "VERY_HIGH", 27.51, 88.53, 0, 0, "Mangan Staging Depot", "Naik K. Bhutia", 93),
            ("VH017", "CACHAR-RESCUE-01", "TRUCK", "4X4_HIGH_CLEARANCE_HEAVY", "AVAILABLE", 5000, "HIGH", 24.83, 92.78, 30, 140, "Silchar Valley Hub", "Havildar B. Gogoi", 89),
            ("VH018", "CACHAR-RESCUE-02", "4X4_LIGHT", "4X4_LIGHT", "AVAILABLE", 1500, "VERY_HIGH", 24.68, 92.60, 25, 90, "Hailakandi Point", "Sub-Inspector T. Sangma", 86),
            ("VH019", "MIZORAM-HILL-01", "TRUCK", "4X4_HIGH_CLEARANCE_HEAVY", "AVAILABLE", 4000, "HIGH", 23.73, 92.72, 28, 180, "Aizawl Forward Depot", "Naik K. Thapa", 84),
            ("VH020", "MIZORAM-HILL-02", "4X4_LIGHT", "4X4_LIGHT", "AVAILABLE", 1800, "VERY_HIGH", 22.89, 92.77, 0, 0, "Lunglei Sub-Depot", "Naik L. Sailo", 92),
            ("VH021", "MANIPUR-RELIEF-01", "TRUCK", "4X4_HIGH_CLEARANCE_HEAVY", "AVAILABLE", 4500, "HIGH", 24.81, 93.94, 32, 160, "Imphal Central Depot", "Havildar N. Singh", 88),
            ("VH022", "MANIPUR-RELIEF-02", "4X4_LIGHT", "4X4_LIGHT", "AVAILABLE", 1500, "VERY_HIGH", 24.33, 93.67, 0, 0, "Churachandpur Hub", "Naik H. Haokip", 95),
            ("VH023", "TRIPURA-CORRIDOR-01", "TRUCK", "4X4_HIGH_CLEARANCE_HEAVY", "AVAILABLE", 4000, "HIGH", 23.83, 91.28, 0, 0, "Agartala Depot", "Havildar S. Das", 93),
            ("VH024", "TRIPURA-CORRIDOR-02", "4X4_LIGHT", "4X4_LIGHT", "AVAILABLE", 1500, "HIGH", 24.16, 92.01, 26, 120, "Dharmanagar Point", "Naik B. Reang", 85),
            ("VH025", "AMPHIBIOUS-BOAT-01", "BOAT", "AMPHIBIOUS_POWER_BOAT", "AVAILABLE", 1200, "AMPHIBIOUS", 26.19, 91.76, 18, 90, "Brahmaputra Waterway Station", "Commander A. Sarma", 98),
            ("VH026", "AMPHIBIOUS-BOAT-02", "BOAT", "AMPHIBIOUS_POWER_BOAT", "AVAILABLE", 1200, "AMPHIBIOUS", 26.65, 92.80, 22, 110, "Tezpur River Outpost", "Lt. P. Bora", 94),
            ("VH027", "AMPHIBIOUS-BOAT-03", "BOAT", "AMPHIBIOUS_POWER_BOAT", "AVAILABLE", 1200, "AMPHIBIOUS", 24.85, 92.82, 0, 0, "Barak River Flotilla", "Naik S. Roy", 97),
            ("VH028", "AMPHIBIOUS-BOAT-04", "BOAT", "AMPHIBIOUS_POWER_BOAT", "AVAILABLE", 1200, "AMPHIBIOUS", 26.85, 94.60, 16, 75, "Majuli Emergency Pier", "Naik R. Payeng", 96),
            ("VH029", "MEDIC-EVAC-01", "AMBULANCE", "MOBILE_ICU_4X4", "AVAILABLE", 800, "HIGH", 26.14, 91.73, 0, 0, "Guwahati Medical Depot", "Dr. A. Dutta / Driver G. Nath", 100),
            ("VH030", "MEDIC-EVAC-02", "AMBULANCE", "MOBILE_ICU_4X4", "AVAILABLE", 800, "HIGH", 25.18, 93.02, 36, 140, "Haflong Civil Hospital Depot", "Dr. K. Mech / Driver R. Hmar", 89),
            ("VH031", "MEDIC-EVAC-03", "AMBULANCE", "MOBILE_ICU_4X4", "AVAILABLE", 800, "HIGH", 25.52, 90.22, 0, 0, "Tura Civil Hospital Depot", "Dr. M. Sangma / Driver L. Marak", 93),
            ("VH032", "MEDIC-EVAC-04", "AMBULANCE", "MOBILE_ICU_4X4", "AVAILABLE", 800, "HIGH", 27.33, 88.61, 28, 170, "Gangtok STNM Mobile Base", "Dr. S. Pradhan / Driver C. Rai", 91),
            ("VH033", "KARBI-ANGLONG-HEAVY-01", "TRUCK", "4X4_HIGH_CLEARANCE_HEAVY", "AVAILABLE", 5000, "HIGH", 25.84, 93.43, 0, 0, "Diphu Depot", "Havildar H. Rongpi", 94),
            ("VH034", "KARBI-ANGLONG-LIGHT-02", "4X4_LIGHT", "4X4_LIGHT", "AVAILABLE", 1800, "VERY_HIGH", 25.86, 93.45, 30, 120, "Diphu Outpost", "Naik K. Teron", 88),
            ("VH035", "UPPER-ASSAM-HEAVY-01", "TRUCK", "4X4_HIGH_CLEARANCE_HEAVY", "AVAILABLE", 5000, "HIGH", 27.47, 94.91, 0, 0, "Dibrugarh Strategic Yard", "Havildar S. Sonowal", 95),
            ("VH036", "UPPER-ASSAM-HEAVY-02", "TRUCK", "4X4_HIGH_CLEARANCE_HEAVY", "AVAILABLE", 5000, "HIGH", 27.50, 95.36, 33, 150, "Tinsukia Depot", "Naik R. Saikia", 83),
            ("VH037", "NORTH-BANK-CONVOY-01", "TRUCK", "4X4_HIGH_CLEARANCE_HEAVY", "AVAILABLE", 4500, "HIGH", 26.65, 92.80, 0, 0, "Tezpur Forward Hub", "Havildar N. Das", 92),
            ("VH038", "NORTH-BANK-LIGHT-02", "4X4_LIGHT", "4X4_LIGHT", "AVAILABLE", 1800, "VERY_HIGH", 27.23, 94.10, 29, 135, "North Lakhimpur Depot", "Naik T. Gogoi", 86),
            ("VH039", "WEST-ASSAM-LOGISTICS-01", "TRUCK", "4X4_HIGH_CLEARANCE_HEAVY", "AVAILABLE", 5000, "HIGH", 26.00, 89.98, 0, 0, "Dhubri Riverport Depot", "Havildar A. Ali", 96),
            ("VH040", "WEST-ASSAM-LOGISTICS-02", "TRUCK", "4X4_HIGH_CLEARANCE_HEAVY", "AVAILABLE", 5000, "HIGH", 26.15, 90.62, 27, 105, "Goalpara Sub-Depot", "Naik M. Rabha", 90),
            ("VH041", "BARPETA-TACTICAL-01", "4X4_LIGHT", "4X4_LIGHT", "AVAILABLE", 1800, "HIGH", 26.32, 91.00, 0, 0, "Barpeta Logistics Post", "Naik D. Talukdar", 93),
            ("VH042", "NAGAON-CENTRAL-01", "TRUCK", "4X4_HIGH_CLEARANCE_HEAVY", "AVAILABLE", 5000, "HIGH", 26.35, 92.68, 31, 140, "Nagaon Central Relay", "Havildar P. Bora", 91),
        ]

        self.fleet = [
            {
                "id": t[0],
                "vehicle_id": t[0],
                "callsign": t[1],
                "type": t[2],
                "vehicle_type": t[3],
                "status": t[4],
                "capacity": t[5],
                "terrain_capability": t[6],
                "coordinates": {"lat": t[7], "lng": t[8]},
                "speed": t[9],
                "heading": t[10],
                "depot": t[11],
                "assigned_driver": t[12],
                "fuel_level": t[13],
                "battery_level": t[13],
                "last_seen": now_iso
            }
            for t in fleet_templates
        ]

        self.vehicle_telemetry = {
            "VH017": [
                {"lat": 26.60, "lng": 94.00, "speed": 40, "heading": 120, "timestamp": "2026-09-16T09:00:00Z"},
                {"lat": 26.75, "lng": 94.22, "speed": 32, "heading": 140, "timestamp": "2026-09-16T09:30:00Z"}
            ],
            "VH018": [
                {"lat": 25.50, "lng": 90.15, "speed": 20, "heading": 90, "timestamp": "2026-09-16T09:00:00Z"},
                {"lat": 25.52, "lng": 90.22, "speed": 24, "heading": 90, "timestamp": "2026-09-16T09:30:00Z"}
            ]
        }

        # 8. Incidents (8 Distinct Active Regional Incidents)
        self.incidents = [
            {
                "id": "INC-001",
                "incident_id": "INC-001",
                "title": "Landslide on NH-27",
                "type": "LANDSLIDE",
                "severity": "CRITICAL",
                "status": "ACTIVE",
                "location_name": "Dima Hasao, Assam",
                "time_ago": "2 hours ago",
                "impact_status": "Road Blocked",
                "description": "Massive hill subsidence and 200m road cut on NH-27 between Jatinga and Harangajao.",
                "location": {"lat": 25.40, "lng": 93.20},
                "coordinates": {"latitude": 25.40, "longitude": 93.20},
                "verified": True,
                "verified_by": "USR002",
                "verified_at": "2026-09-16T06:45:00Z",
                "created_at": "2026-09-16T06:30:00Z",
                "affected_roads": ["RD01"],
                "affected_habitations": ["HAB001", "HAB002"],
                "affected_facilities": ["FAC04"],
                "affected_missions": ["MIS001"],
                "reports": ["FR-004"],
                "critical_locations": ["HAB001"],
                "affected_population": 5300
            },
            {
                "id": "INC-002",
                "incident_id": "INC-002",
                "title": "Flash Flooding",
                "type": "FLOOD",
                "severity": "HIGH",
                "status": "ACTIVE",
                "location_name": "Sonitpur, Assam",
                "time_ago": "4 hours ago",
                "impact_status": "Multiple Villages Inundated",
                "description": "Brahmaputra tributary overflow inundated low-lying settlements across 8 panchayats.",
                "location": {"lat": 26.65, "lng": 92.80},
                "coordinates": {"latitude": 26.65, "longitude": 92.80},
                "verified": True,
                "verified_by": "USR002",
                "verified_at": "2026-09-16T05:00:00Z",
                "created_at": "2026-09-16T04:30:00Z",
                "affected_roads": ["RD05"],
                "affected_habitations": ["HAB003"],
                "affected_facilities": ["FAC02"],
                "affected_missions": ["MIS006"],
                "reports": ["FR-002"],
                "critical_locations": ["HAB003"],
                "affected_population": 8400
            },
            {
                "id": "INC-003",
                "incident_id": "INC-003",
                "title": "Bridge Damage & Flash Flood",
                "type": "BRIDGE_DAMAGE",
                "severity": "HIGH",
                "status": "ACTIVE",
                "location_name": "West Garo Hills (Tura), Meghalaya",
                "time_ago": "6 hours ago",
                "impact_status": "Limited Access",
                "description": "Pillar scour and structural fracture on Tura-Rongram connecting bridge.",
                "location": {"lat": 25.52, "lng": 90.22},
                "coordinates": {"latitude": 25.52, "longitude": 90.22},
                "verified": True,
                "verified_by": "USR002",
                "verified_at": "2026-09-16T03:00:00Z",
                "created_at": "2026-09-16T02:30:00Z",
                "affected_roads": ["RD02"],
                "affected_habitations": ["HAB004"],
                "affected_facilities": [],
                "affected_missions": ["MIS002"],
                "reports": ["FR-003"],
                "critical_locations": ["HAB004"],
                "affected_population": 3200
            },
            {
                "id": "INC-004",
                "incident_id": "INC-004",
                "title": "Heavy Rainfall Alert",
                "type": "HEAVY_RAINFALL",
                "severity": "MEDIUM",
                "status": "ACTIVE",
                "location_name": "Aizawl, Mizoram",
                "time_ago": "8 hours ago",
                "impact_status": "High Risk (140mm)",
                "description": "Continuous torrential downpour (140mm/24h) threatening slope stability along ridges.",
                "location": {"lat": 23.73, "lng": 92.72},
                "coordinates": {"latitude": 23.73, "longitude": 92.72},
                "verified": True,
                "verified_by": "USR002",
                "verified_at": "2026-09-16T01:00:00Z",
                "created_at": "2026-09-16T00:30:00Z",
                "affected_roads": ["RD03"],
                "affected_habitations": [],
                "affected_facilities": [],
                "affected_missions": ["MIS003"],
                "reports": [],
                "critical_locations": [],
                "affected_population": 2100
            },
            {
                "id": "INC-005",
                "incident_id": "INC-005",
                "title": "River Overflow Monitoring",
                "type": "RIVER_OVERFLOW",
                "severity": "LOW",
                "status": "ACTIVE",
                "location_name": "Itanagar, Arunachal Pradesh",
                "time_ago": "11 hours ago",
                "impact_status": "Monitoring",
                "description": "Dikrong river water level reached warning stage. Embankment patrol activated.",
                "location": {"lat": 27.08, "lng": 93.60},
                "coordinates": {"latitude": 27.08, "longitude": 93.60},
                "verified": True,
                "verified_by": "USR002",
                "verified_at": "2026-09-15T22:00:00Z",
                "created_at": "2026-09-15T21:30:00Z",
                "affected_roads": [],
                "affected_habitations": [],
                "affected_facilities": [],
                "affected_missions": ["MIS008"],
                "reports": [],
                "critical_locations": [],
                "affected_population": 1400
            },
            {
                "id": "INC-006",
                "incident_id": "INC-006",
                "title": "Flash Flood Watch",
                "type": "FLOOD",
                "severity": "HIGH",
                "status": "ACTIVE",
                "location_name": "Mokokchung, Nagaland",
                "time_ago": "5 hours ago",
                "impact_status": "Hill Inundation",
                "description": "Flash runoff across hillside terraces with mud buildup along district highway.",
                "location": {"lat": 26.32, "lng": 94.52},
                "coordinates": {"latitude": 26.32, "longitude": 94.52},
                "verified": True,
                "verified_by": "USR002",
                "verified_at": "2026-09-16T04:00:00Z",
                "created_at": "2026-09-16T03:30:00Z",
                "affected_roads": [],
                "affected_habitations": [],
                "affected_facilities": [],
                "affected_missions": ["MIS007"],
                "reports": [],
                "critical_locations": [],
                "affected_population": 2800
            },
            {
                "id": "INC-007",
                "incident_id": "INC-007",
                "title": "Glacial Runoff & Landslide",
                "type": "LANDSLIDE",
                "severity": "CRITICAL",
                "status": "ACTIVE",
                "location_name": "Mangan (North Sikkim), Sikkim",
                "time_ago": "3 hours ago",
                "impact_status": "Debris Flow on NH-10",
                "description": "Heavy alpine runoff triggered severe rockfall isolating northern Dzongu sector.",
                "location": {"lat": 27.51, "lng": 88.53},
                "coordinates": {"latitude": 27.51, "longitude": 88.53},
                "verified": True,
                "verified_by": "USR002",
                "verified_at": "2026-09-16T05:30:00Z",
                "created_at": "2026-09-16T05:00:00Z",
                "affected_roads": [],
                "affected_habitations": [],
                "affected_facilities": [],
                "affected_missions": ["MIS008"],
                "reports": [],
                "critical_locations": [],
                "affected_population": 1800
            },
            {
                "id": "INC-008",
                "incident_id": "INC-008",
                "title": "Valley Inundation Alert",
                "type": "FLOOD",
                "severity": "MEDIUM",
                "status": "ACTIVE",
                "location_name": "Churachandpur, Manipur",
                "time_ago": "7 hours ago",
                "impact_status": "Valley Inundation",
                "description": "Rising water levels along Khuga river basin causing waterlogging in low terrain.",
                "location": {"lat": 24.33, "lng": 93.67},
                "coordinates": {"latitude": 24.33, "longitude": 93.67},
                "verified": True,
                "verified_by": "USR002",
                "verified_at": "2026-09-16T02:00:00Z",
                "created_at": "2026-09-16T01:30:00Z",
                "affected_roads": [],
                "affected_habitations": [],
                "affected_facilities": [],
                "affected_missions": [],
                "reports": [],
                "critical_locations": [],
                "affected_population": 3600
            }
        ]

        # 9. Logistics Requests (47 Realistic Regional Demands: 12 Active, 8 Approved, 24 Fulfilled, 3 Rejected)
        active_requests_seed = [
            ("SR-017", "Food Packets", "Food", 5000, "units", "Dima Hasao DC", "Haflong", "CRITICAL", 98, "PENDING", "16 Sep 2025", "HAB001"),
            ("SR-016", "Drinking Water (1L)", "Water", 10000, "units", "Karbi Anglong DC", "Diphu", "HIGH", 88, "APPROVED", "15 Sep 2025", "HAB002"),
            ("SR-015", "Medicine Kits", "Medical", 2000, "units", "Tura SDM", "Tura", "HIGH", 85, "IN_TRANSIT", "15 Sep 2025", "HAB003"),
            ("SR-014", "Tents", "Shelter", 500, "units", "Aizawl DC", "Aizawl", "MEDIUM", 68, "APPROVED", "14 Sep 2025", "HAB004"),
            ("SR-013", "Fuel (Diesel)", "Fuel", 8000, "L", "Itanagar DC", "Itanagar", "MEDIUM", 62, "PENDING", "14 Sep 2025", "HAB005"),
            ("REQ001", "Water & Trauma Medicine", "Medical", 5000, "LITRE", "Harangajao SDM", "Harangajao", "CRITICAL", 94, "PENDING", "16 Sep 2025", "HAB001"),
            ("SR-010", "Infant Nutrition & Formula", "Food", 1200, "packs", "Sonitpur DC", "Tezpur", "HIGH", 82, "PENDING", "15 Sep 2025", "HAB003"),
            ("SR-009", "Water Purification Tablets", "Water", 25000, "tablets", "Dhemaji DC", "Silapathar", "HIGH", 80, "APPROVED", "15 Sep 2025", "HAB002"),
            ("SR-008", "Emergency High-Calorie Rations", "Food", 4500, "packs", "Kohima DC", "Kohima", "MEDIUM", 70, "APPROVED", "14 Sep 2025", "HAB006"),
            ("SR-007", "Family Hygiene Kits", "Relief", 1800, "kits", "Imphal West DC", "Imphal", "MEDIUM", 65, "APPROVED", "14 Sep 2025", "HAB004"),
            ("SR-006", "Heavy Duty Tarpaulins", "Shelter", 1500, "units", "Gangtok SDM", "Mangan", "HIGH", 78, "APPROVED", "14 Sep 2025", "HAB007"),
            ("SR-005", "Silent Mobile Generators", "Power", 25, "units", "East Garo Hills SDM", "Williamnagar", "MEDIUM", 64, "IN_TRANSIT", "13 Sep 2025", "HAB003"),
        ]

        approved_extra_seed = [
            ("SR-021", "Surgical Trauma Consumables", "Medical", 600, "kits", "Silchar Medical College", "Silchar", "HIGH", 86, "APPROVED", "13 Sep 2025", "HAB002"),
            ("SR-022", "High-Volume Water Bladders", "Water", 40, "units", "Majuli DC", "Garamur", "MEDIUM", 72, "APPROVED", "13 Sep 2025", "HAB001"),
        ]

        fulfilled_requests_seed = [
            ("SR-012", "Blankets & Warm Clothing", "Relief", 3000, "units", "Kohima DC", "Kohima", "LOW", 42, "FULFILLED", "13 Sep 2025", "HAB006"),
            ("SR-011", "Solar Emergency Lamps", "Power", 1000, "units", "Shillong DC", "Shillong", "LOW", 38, "FULFILLED", "12 Sep 2025", "HAB007"),
            ("SR-031", "Packed Potable Water Cans", "Water", 12000, "cans", "Guwahati Transit Post", "Guwahati", "MEDIUM", 55, "FULFILLED", "12 Sep 2025", "HAB001"),
            ("SR-032", "Anti-Venom & First Aid", "Medical", 400, "vials", "Nagaon DC", "Nagaon", "HIGH", 78, "FULFILLED", "11 Sep 2025", "HAB002"),
            ("SR-033", "Temporary Partition Screens", "Shelter", 800, "units", "Tinsukia SDM", "Tinsukia", "LOW", 35, "FULFILLED", "11 Sep 2025", "HAB005"),
            ("SR-034", "High-Energy Glucose Biscuits", "Food", 15000, "packets", "Hailakandi DC", "Hailakandi", "MEDIUM", 60, "FULFILLED", "10 Sep 2025", "HAB002"),
            ("SR-035", "Kerosene Cooking Stoves", "Relief", 600, "units", "Lunglei DC", "Lunglei", "LOW", 40, "FULFILLED", "10 Sep 2025", "HAB004"),
            ("SR-036", "Chlorine Disinfection Granules", "Water", 500, "kg", "Jorhat DC", "Jorhat", "MEDIUM", 58, "FULFILLED", "09 Sep 2025", "HAB001"),
            ("SR-037", "Heavy Rain Ponchos & Boots", "Relief", 2500, "sets", "Mawkyrwat SDM", "Mawkyrwat", "LOW", 32, "FULFILLED", "09 Sep 2025", "HAB003"),
            ("SR-038", "Solar Power Banks", "Power", 400, "units", "Zunheboto DC", "Zunheboto", "LOW", 36, "FULFILLED", "08 Sep 2025", "HAB006"),
            ("SR-039", "Mobile Satellite Radios", "Power", 50, "units", "Twipra SDM", "Dharmanagar", "MEDIUM", 62, "FULFILLED", "08 Sep 2025", "HAB005"),
            ("SR-040", "Ready Meal Pouches", "Food", 8000, "pouches", "Sivasagar DC", "Sivasagar", "LOW", 44, "FULFILLED", "07 Sep 2025", "HAB001"),
            ("SR-041", "Medical ORS Electrolyte Packs", "Medical", 10000, "sachets", "Barpeta DC", "Barpeta", "MEDIUM", 66, "FULFILLED", "07 Sep 2025", "HAB002"),
            ("SR-042", "Inflatable Air Mattresses", "Shelter", 750, "units", "Churachandpur DC", "Churachandpur", "LOW", 39, "FULFILLED", "06 Sep 2025", "HAB004"),
            ("SR-043", "Emergency Rescue Ropes & Harness", "Relief", 200, "sets", "Bomdila SDM", "Bomdila", "HIGH", 74, "FULFILLED", "06 Sep 2025", "HAB005"),
            ("SR-044", "High-Octane Generator Fuel", "Fuel", 4000, "L", "Aizawl DC", "Aizawl", "MEDIUM", 58, "FULFILLED", "05 Sep 2025", "HAB004"),
            ("SR-045", "Baby Food Cereals", "Food", 2200, "tins", "Haflong Regional", "Haflong", "HIGH", 80, "FULFILLED", "05 Sep 2025", "HAB001"),
            ("SR-046", "Emergency Surgical Sutures", "Medical", 300, "boxes", "Diphu Civil Hospital", "Diphu", "HIGH", 82, "FULFILLED", "04 Sep 2025", "HAB002"),
            ("SR-047", "Dry Firewood & Pellets", "Fuel", 5000, "kg", "Namchi SDM", "Namchi", "LOW", 28, "FULFILLED", "04 Sep 2025", "HAB007"),
            ("SR-048", "Potable Water Tankers (5000L)", "Water", 10, "tankers", "Goalpara DC", "Goalpara", "MEDIUM", 64, "FULFILLED", "03 Sep 2025", "HAB001"),
            ("SR-049", "Reinforced Mosquito Nets", "Relief", 4000, "nets", "Karimganj DC", "Karimganj", "LOW", 41, "FULFILLED", "03 Sep 2025", "HAB002"),
            ("SR-050", "Sanitary Napkins & Hygiene Sets", "Relief", 3500, "packs", "Wokha SDM", "Wokha", "LOW", 37, "FULFILLED", "02 Sep 2025", "HAB006"),
            ("SR-051", "Emergency Torchlights & D-Cells", "Power", 1800, "units", "Nongpoh SDM", "Nongpoh", "LOW", 30, "FULFILLED", "02 Sep 2025", "HAB003"),
            ("SR-052", "High-Protein Pulse Bags", "Food", 6000, "kg", "Bongaigaon DC", "Bongaigaon", "MEDIUM", 52, "FULFILLED", "01 Sep 2025", "HAB001"),
        ]

        rejected_requests_seed = [
            ("SR-091", "Heavy Earth Excavator", "Relief", 2, "units", "Private Sub-Contractor", "Harangajao", "HIGH", 76, "REJECTED", "14 Sep 2025", "HAB001", "Roadway bridge capacity insufficient for 40T axle weight; heavy equipment rerouted via railway flatbed."),
            ("SR-092", "Commercial Grade Fuel Tanker", "Fuel", 20000, "L", "District Quarry Board", "Umiam", "MEDIUM", 50, "REJECTED", "13 Sep 2025", "HAB003", "Non-emergency commercial requisition denied. Priority reserved for critical medical & search rescue units."),
            ("SR-093", "Duplicate Rations Requisition", "Food", 10000, "units", "Diphu Sub-Division 2", "Diphu", "LOW", 30, "REJECTED", "12 Sep 2025", "HAB002", "Duplicate submission detected. Overlapping requisition already authorized and en route under SR-016."),
        ]

        all_requests = []
        for row in (active_requests_seed + approved_extra_seed + fulfilled_requests_seed + rejected_requests_seed):
            req_id, item, category, qty, unit, req_by, loc, pri, score, st, req_on, dest_id = row[:12]
            rej_reason = row[12] if len(row) > 12 else None
            all_requests.append({
                "id": req_id,
                "request_id": req_id,
                "item": item,
                "category": category,
                "quantity": qty,
                "unit": unit,
                "requested_by": req_by,
                "location": loc,
                "priority": pri,
                "priority_details": {"score": score, "level": pri},
                "status": st,
                "requested_on": req_on,
                "required_by": "2026-09-17T10:00:00Z",
                "destination_id": dest_id,
                "destination": {"id": dest_id, "name": f"{loc} Relief Point", "lat": 25.40, "lng": 93.20},
                "items": [{"resource_type": category.upper(), "quantity": qty, "unit": unit}],
                "reason": rej_reason or f"Critical {category.lower()} demand for disaster relief operations.",
                "created_at": now_iso
            })
        self.logistics_requests = all_requests

        # 10. Missions (86 Realistic Operational Missions across North East India)
        mission_destinations = [
            ("Harangajao", 25.40, 93.20, "Dima Hasao"),
            ("Tura", 25.52, 90.22, "West Garo Hills"),
            ("Aizawl", 23.73, 92.72, "Mizoram Central"),
            ("Maibong", 25.30, 93.16, "Dima Hasao"),
            ("Jatinga Ridge", 25.12, 93.04, "Cachar Ridge"),
            ("Sonitpur", 26.65, 92.80, "Brahmaputra Basin"),
            ("Mokokchung", 26.32, 94.52, "Nagaland Hills"),
            ("Mangan", 27.51, 88.53, "North Sikkim Alpine"),
            ("Diphu", 25.84, 93.43, "Karbi Anglong"),
            ("Tezpur", 26.65, 92.80, "Sonitpur Riverport"),
            ("Silchar", 24.83, 92.78, "Barak Valley"),
            ("Imphal", 24.81, 93.94, "Manipur Valley"),
            ("Churachandpur", 24.33, 93.67, "South Manipur"),
            ("Kohima", 25.67, 94.11, "Nagaland HQ"),
            ("Shillong", 25.57, 91.88, "East Khasi Hills"),
            ("Itanagar", 27.08, 93.60, "Papum Pare"),
            ("Pasighat", 27.30, 95.35, "East Siang"),
            ("Gangtok", 27.33, 88.61, "East Sikkim"),
            ("Agartala", 23.83, 91.28, "West Tripura"),
            ("Dhubri", 26.00, 89.98, "Lower Assam"),
            ("Dibrugarh", 27.47, 94.91, "Upper Assam"),
            ("Majuli", 26.85, 94.60, "River Island"),
        ]

        self.missions = []
        for i in range(1, 87):
            mis_id = f"MIS{i:03d}"
            dest = mission_destinations[(i - 1) % len(mission_destinations)]
            vh_idx = (i - 1) % len(self.fleet)
            vh = self.fleet[vh_idx]
            
            # Status distribution: 38 In Transit, 24 Completed, 12 Approved/Started, 7 Delayed, 5 At Risk = 86 Missions
            if i <= 38:
                st = "IN_TRANSIT"
                prog = 20 + (i * 2) % 65
                pri = "CRITICAL" if i % 3 == 0 else "HIGH"
            elif i <= 62:
                st = "COMPLETED"
                prog = 100
                pri = "MEDIUM" if i % 2 == 0 else "LOW"
            elif i <= 74:
                st = "APPROVED"
                prog = 10 + (i % 20)
                pri = "HIGH" if i % 2 == 0 else "MEDIUM"
            elif i <= 81:
                st = "DELAYED"
                prog = 25
                pri = "HIGH"
            else:
                st = "AT_RISK"
                prog = 45
                pri = "CRITICAL"

            cargo_type = ["Food Packets", "Bottled Water (1L)", "Emergency Trauma Kits", "High-Altitude Fuel", "All-Weather Tents", "Rescue Inflatable Boats"][i % 6]
            self.missions.append({
                "id": mis_id,
                "mission_id": mis_id,
                "title": f"Convoy Delivery of {cargo_type} to {dest[0]}",
                "status": st,
                "priority": pri,
                "request_id": f"SR-{i:03d}",
                "warehouse_id": "WH01" if i % 3 == 0 else "WH02" if i % 3 == 1 else "WH03",
                "vehicle_id": vh["vehicle_id"],
                "route_id": f"RD{(i % 6) + 1:02d}",
                "origin": {"warehouse_id": "WH01", "name": "Guwahati Central Strategic Hub", "lat": 26.14, "lng": 91.73},
                "destination": {"habitation_id": f"HAB{i:03d}", "name": f"{dest[0]} Relief Point ({dest[3]})", "lat": dest[1], "lng": dest[2]},
                "resources": [{"resource_type": cargo_type.upper(), "quantity": 1000 + (i * 150), "unit": "units"}],
                "vehicle": {"id": vh["vehicle_id"], "callsign": vh["callsign"], "type": vh["type"], "capacity": vh["capacity"]},
                "route": {"id": f"RD{(i % 6) + 1:02d}", "distance_km": 45 + (i * 3) % 200, "eta_min": 60 + (i * 5) % 280, "risk_score": 15 + (i * 3) % 50},
                "eta": "2026-09-17T14:30:00Z",
                "risk_score": 15 + (i * 2) % 45,
                "progress": prog,
                "active_alerts": ["ROAD_SLIP"] if st == "DELAYED" else ["HIGH_RISK_SURGE"] if st == "AT_RISK" else [],
                "replanning_status": "REQUIRED" if st == "AT_RISK" else "NONE",
                "created_at": now_iso,
                "started_at": now_iso
            })

        # 11. Routes Catalog
        self.routes_catalog = [
            {
                "id": "R1",
                "route_id": "R1",
                "name": "NH-27 Primary Corridor",
                "distance_km": 180,
                "eta_min": 290,
                "risk_score": 62,
                "confidence": 0.85,
                "status": "BLOCKED",
                "geometry": {"type": "LineString", "coordinates": [[93.025, 25.185], [93.10, 25.25], [93.20, 25.40]]},
                "segments": [
                    {"segment_id": "SEG_01", "road": "NH-27", "distance_km": 45, "status": "CLEAR"},
                    {"segment_id": "SEG_02", "road": "NH-27", "distance_km": 20, "status": "BLOCKED", "reason": "Landslide active"}
                ],
                "warnings": ["Active landslide reported at km 65"]
            },
            {
                "id": "R2",
                "route_id": "R2",
                "name": "BRO Old Mahur Bypass Corridor",
                "distance_km": 205,
                "eta_min": 325,
                "risk_score": 24,
                "confidence": 0.91,
                "status": "FEASIBLE",
                "geometry": {"type": "LineString", "coordinates": [[93.025, 25.185], [93.05, 25.30], [93.20, 25.40]]},
                "segments": [
                    {"segment_id": "SEG_03", "road": "BRO-Mahur", "distance_km": 110, "status": "CLEAR"},
                    {"segment_id": "SEG_04", "road": "SH-14", "distance_km": 95, "status": "CLEAR"}
                ],
                "warnings": []
            },
            {
                "id": "R3",
                "route_id": "R3",
                "name": "Umrangso Southern Spur",
                "distance_km": 194,
                "eta_min": 315,
                "risk_score": 37,
                "confidence": 0.88,
                "status": "FEASIBLE",
                "geometry": {"type": "LineString", "coordinates": [[93.025, 25.185], [92.95, 25.35], [93.20, 25.40]]},
                "segments": [
                    {"segment_id": "SEG_05", "road": "SH-19", "distance_km": 194, "status": "CLEAR"}
                ],
                "warnings": ["Single lane stretch across Umrangso bridge"]
            }
        ]

        # 12. Dynamic Replanning Proposals
        self.replanning_cases = [
            {
                "id": "RP001",
                "replanning_id": "RP001",
                "mission_id": "MIS001",
                "status": "PENDING_APPROVAL",
                "current_plan": {
                    "route_id": "R1",
                    "vehicle_id": "VH017",
                    "eta": "2026-09-16T13:30:00Z"
                },
                "recommended_plan": {
                    "route": {"id": "R2", "name": "BRO Old Mahur Bypass", "distance_km": 205, "eta_min": 325},
                    "vehicle": {"id": "VH018", "type": "4X4_LIGHT"},
                    "resources": {"WATER": 5000},
                    "eta": "2026-09-16T14:45:00Z"
                },
                "alternatives": [
                    {"id": "R3", "eta_min": 315, "risk_score": 37}
                ],
                "reason": "Primary road became impassable due to landslide",
                "impact": {"delay_min": 42, "risk_change": -18},
                "evidence": [
                    "NH-27 km 65 blocked by 200m mudslide",
                    "BRO bypass inspected and cleared for 4x4 convoys"
                ],
                "requires_approval": True,
                "approved_by": None,
                "created_at": now_iso
            }
        ]

        # 13. Field Reports
        self.field_reports = [
            {
                "id": "FR-001",
                "report_id": "FR-001",
                "type": "ROAD_BLOCKAGE",
                "title": "Road completely blocked near Jorhat",
                "reporter": "Village volunteer",
                "reporter_role": "Volunteer",
                "location_name": "Jorhat, Assam",
                "location": {"lat": 26.75, "lng": 94.22},
                "coordinates": {"lat": 26.75, "lng": 94.22},
                "time_ago": "12 min ago",
                "severity": "CRITICAL",
                "description": "Fallen trees and mudflow blocked state highway connecting Jorhat to Mariani.",
                "evidence": ["photo_jorhat_block.jpg"],
                "photos": [],
                "status": "PENDING_VERIFICATION",
                "created_at": now_iso
            },
            {
                "id": "FR-002",
                "report_id": "FR-002",
                "type": "FLOODING",
                "title": "Water level rising in Sonitpur",
                "reporter": "Field Officer",
                "reporter_role": "Field Officer",
                "location_name": "Sonitpur, Assam",
                "location": {"lat": 26.65, "lng": 92.80},
                "coordinates": {"lat": 26.65, "lng": 92.80},
                "time_ago": "36 min ago",
                "severity": "HIGH",
                "description": "Embankment seepage observed near Dhekiajuli sector. Water levels 1.2m above normal.",
                "evidence": ["photo_sonitpur_embankment.jpg"],
                "photos": [],
                "status": "VERIFIED",
                "created_at": now_iso
            },
            {
                "id": "FR-003",
                "report_id": "FR-003",
                "type": "INFRASTRUCTURE",
                "title": "Bridge structure damaged",
                "reporter": "District Authority",
                "reporter_role": "District Authority",
                "location_name": "West Garo Hills, Meghalaya",
                "location": {"lat": 25.52, "lng": 90.22},
                "coordinates": {"lat": 25.52, "lng": 90.22},
                "time_ago": "1 hour ago",
                "severity": "HIGH",
                "description": "Cracks and scouring on western bridge pier. Heavy vehicle crossing restricted.",
                "evidence": ["photo_bridge_pier.jpg"],
                "photos": [],
                "status": "VERIFIED",
                "created_at": now_iso
            },
            {
                "id": "FR-004",
                "report_id": "FR-004",
                "type": "LANDSLIDE",
                "title": "Landslide reported on NH-27",
                "reporter": "Local Resident (Voice Report)",
                "reporter_role": "Local Resident",
                "location_name": "Dima Hasao, Assam",
                "location": {"lat": 25.40, "lng": 93.20},
                "coordinates": {"lat": 25.40, "lng": 93.20},
                "time_ago": "2 hours ago",
                "severity": "CRITICAL",
                "description": "Massive hill slide blocked both lanes. 3 trucks stranded on eastern approach.",
                "evidence": ["photo_nh27_slide.jpg"],
                "photos": [],
                "status": "VERIFIED",
                "created_at": now_iso
            }
        ]

        # 14. Alerts
        self.alerts = [
            {
                "id": "ALT-001",
                "type": "ROUTE_BLOCKED",
                "severity": "CRITICAL",
                "status": "ACTIVE",
                "title": "NH-27 Landslide Blockage",
                "message": "Landslide on NH-27 has blocked primary corridor for convoy MS-017.",
                "related_mission_id": "MS-017",
                "location": "Dima Hasao, Assam",
                "time_ago": "2 min ago",
                "acknowledged": False,
                "created_at": now_iso
            },
            {
                "id": "ALT-002",
                "type": "SHELTER_OVERFLOW",
                "severity": "HIGH",
                "status": "ACTIVE",
                "title": "Tura Shelter Near Capacity",
                "message": "Increased inflow due to flooding in West Garo Hills. Capacity reached 73%.",
                "related_mission_id": None,
                "location": "Tura, Meghalaya",
                "time_ago": "15 min ago",
                "acknowledged": False,
                "created_at": now_iso
            },
            {
                "id": "ALT-003",
                "type": "LOW_STOCK",
                "severity": "HIGH",
                "status": "ACTIVE",
                "title": "Low Fuel Reserve Alert in Aizawl",
                "message": "Aizawl Generator Depot diesel reserve dropped below 800 L buffer threshold.",
                "related_mission_id": "MS-042",
                "location": "Aizawl, Mizoram",
                "time_ago": "28 min ago",
                "acknowledged": False,
                "created_at": now_iso
            },
            {
                "id": "ALT-004",
                "type": "WEATHER_WARNING",
                "severity": "MEDIUM",
                "status": "ACTIVE",
                "title": "Heavy Rainfall Warning",
                "message": "IMD forecast predicts 140mm rainfall in upper Assam and Meghalaya in next 24h.",
                "related_mission_id": None,
                "location": "Upper Assam",
                "time_ago": "1 hour ago",
                "acknowledged": False,
                "created_at": now_iso
            },
            {
                "id": "ALT-005",
                "type": "RELOCATION_ALERT",
                "severity": "HIGH",
                "status": "ACTIVE",
                "title": "Rengma Habitation Evacuation Staged",
                "message": "5,200 residents in flood zone require relocation confirmation to Maibong shelter.",
                "related_mission_id": "RM001",
                "location": "Rengma Village, Assam",
                "time_ago": "1 hour ago",
                "acknowledged": False,
                "created_at": now_iso
            }
        ]

        # 15. Shelters
        self.shelters = [
            {
                "id": "SH01",
                "shelter_id": "SH01",
                "name": "Haflong Multipurpose Relief Center",
                "capacity": 1200,
                "occupancy": 820,
                "remaining_capacity": 380,
                "safety_score": 88,
                "accessibility_score": 92,
                "readiness": "READY",
                "status": "OPEN",
                "location_name": "Haflong, Dima Hasao",
                "services": ["MEDICAL", "WATER", "FOOD", "SANITATION", "BEDS"],
                "coordinates": {"lat": 25.185, "lng": 93.025}
            },
            {
                "id": "SH02",
                "shelter_id": "SH02",
                "name": "Tura Community Evacuation Sanctuary",
                "capacity": 1500,
                "occupancy": 1100,
                "remaining_capacity": 400,
                "safety_score": 84,
                "accessibility_score": 86,
                "readiness": "READY",
                "status": "OPEN",
                "location_name": "Tura, West Garo Hills",
                "services": ["MEDICAL", "WATER", "FOOD", "SANITATION"],
                "coordinates": {"lat": 25.52, "lng": 90.22}
            },
            {
                "id": "SH03",
                "shelter_id": "SH03",
                "name": "Maibong Higher Secondary Safe Haven",
                "capacity": 800,
                "occupancy": 320,
                "remaining_capacity": 480,
                "safety_score": 90,
                "accessibility_score": 88,
                "readiness": "READY",
                "status": "OPEN",
                "location_name": "Maibong, Dima Hasao",
                "services": ["WATER", "FOOD", "BEDS"],
                "coordinates": {"lat": 25.30, "lng": 93.16}
            },
            {
                "id": "SH04",
                "shelter_id": "SH04",
                "name": "Silchar Indoor Stadium Relief Hub",
                "capacity": 2500,
                "occupancy": 1400,
                "remaining_capacity": 1100,
                "safety_score": 94,
                "accessibility_score": 96,
                "readiness": "READY",
                "status": "OPEN",
                "location_name": "Silchar, Cachar",
                "services": ["MEDICAL", "WATER", "FOOD", "POWER", "SANITATION"],
                "coordinates": {"lat": 24.83, "lng": 92.78}
            },
            {
                "id": "SH05",
                "shelter_id": "SH05",
                "name": "Aizawl Central Relief Sanctuary",
                "capacity": 1000,
                "occupancy": 450,
                "remaining_capacity": 550,
                "safety_score": 86,
                "accessibility_score": 80,
                "readiness": "READY",
                "status": "OPEN",
                "location_name": "Aizawl, Mizoram",
                "services": ["WATER", "FOOD", "SANITATION"],
                "coordinates": {"lat": 23.73, "lng": 92.72}
            }
        ]

        # 16. Relocation Cases & Missions
        self.relocation_cases = [
            {
                "id": "REL001",
                "habitation_id": "HAB001",
                "population": 5200,
                "risk_score": 91,
                "serviceability_score": 22,
                "relocation_required": True,
                "status": "ASSESSMENT",
                "trigger_incident_id": "INC001",
                "created_at": now_iso
            }
        ]

        self.relocation_missions = [
            {
                "id": "RM001",
                "case_id": "REL001",
                "destination_id": "SHELTER01",
                "status": "IN_TRANSIT",
                "population_planned": 5200,
                "vehicles": ["VH020", "VH021"],
                "progress": 48,
                "destination": {"id": "SHELTER01", "name": "Haflong Government College Safe Haven"},
                "approved_by": "USR002",
                "started_at": now_iso,
                "created_at": now_iso
            }
        ]

        # 17. Approvals Queue & History
        self.approvals_queue = [
            {
                "type": "MISSION",
                "id": "MIS001",
                "priority": "CRITICAL",
                "title": "Emergency Medical Supply to Harangajao",
                "created_at": now_iso
            },
            {
                "type": "REPLAN",
                "id": "RP001",
                "priority": "HIGH",
                "title": "Bypass Rerouting via BRO Mahur Corridor",
                "created_at": now_iso
            }
        ]

        self.approvals_history = [
            {
                "type": "MISSION",
                "id": "MIS001",
                "decision": "APPROVED",
                "by": "USR002",
                "reason": "Reviewed operational evidence",
                "timestamp": now_iso
            }
        ]

        # 18. Audit Logs
        self.audit_logs = [
            {
                "id": "AUD001",
                "user_id": "USR009",
                "action": "MISSION_APPROVED",
                "resource": "MIS001",
                "previous_state": "PENDING",
                "new_state": "APPROVED",
                "reason": "Critical medical supply",
                "actor": {"id": "USR009", "name": "District Magistrate", "role": "DISTRICT_AUTHORITY"},
                "timestamp": now_iso
            }
        ]

        # 19. System Config & Priority Rules
        self.priority_rules = {
            "version": "v3",
            "factors": [
                {"name": "hazard", "weight": 0.30},
                {"name": "population", "weight": 0.25},
                {"name": "stockout_urgency", "weight": 0.30},
                {"name": "critical_dependency", "weight": 0.15}
            ],
            "activated_at": now_iso,
            "updated_by": "ADMIN001"
        }

        # 20. Offline & Sync
        self.sync_events = []
        self.sync_conflicts = [
            {"id": "CON001", "entity": "INC001", "local_version": 3, "server_version": 4, "status": "OPEN"}
        ]
        self.edge_nodes = [
            {
                "node_id": "EDGE-AS-D01",
                "status": "ONLINE",
                "services": {
                    "database": "RUNNING",
                    "maps": "RUNNING",
                    "routing": "RUNNING",
                    "ai": "RUNNING",
                    "voice": "RUNNING"
                }
            }
        ]

store = OperationalDataStore()
