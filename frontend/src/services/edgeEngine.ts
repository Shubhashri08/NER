import { MOCK_DATA } from '../data/mockData';

// Standalone Edge Operational State Store (matching Python backend store logic)
class EdgeOperationalState {
  incidents: any[];
  requests: any[];
  missions: any[];
  warehouses: any[];
  vehicles: any[];
  roadSegments: any[];
  shelters: any[];
  fieldReports: any[];
  alerts: any[];
  relocationCases: any[];

  constructor() {
    this.incidents = [
      {
        id: "INC001",
        title: "Landslide at Jatinga Ridge",
        type: "LANDSLIDE",
        severity: "CRITICAL",
        status: "ACTIVE",
        location_name: "Haflong, Dima Hasao",
        location: { lat: 25.1832, lng: 93.0254 },
        affected_roads: ["NH-27 Corridor"],
        affected_habitations: ["Harangajao", "Jatinga"],
        affected_population: 1820,
        created_at: new Date().toISOString()
      },
      {
        id: "INC002",
        title: "Flash Flood in Barak Basin",
        type: "FLOOD",
        severity: "CRITICAL",
        status: "ACTIVE",
        location_name: "Silchar, Cachar",
        location: { lat: 24.8333, lng: 92.7926 },
        affected_roads: ["NH-37 Bypass"],
        affected_habitations: ["Silchar Urban"],
        affected_population: 14200,
        created_at: new Date().toISOString()
      },
      {
        id: "INC003",
        title: "Bridge Approach Washout",
        type: "WASHOUT",
        severity: "HIGH",
        status: "ACTIVE",
        location_name: "Mangan, North Sikkim",
        location: { lat: 27.5050, lng: 88.5286 },
        affected_roads: ["NH-10 Highway"],
        affected_habitations: ["Mangan Base"],
        affected_population: 850,
        created_at: new Date().toISOString()
      }
    ];

    this.requests = [
      {
        id: "SR-001",
        item: "High-Calorie Food Rations",
        category: "Food Packs",
        quantity: 500,
        unit: "Packs",
        requested_by: "Dima Hasao DDMA",
        destination_id: "HAB001",
        location: "Haflong, Dima Hasao",
        priority: "CRITICAL",
        status: "APPROVED",
        requested_on: "10 mins ago",
        items: [{ resource_type: "Food Packs", quantity: 500, unit: "Packs" }]
      },
      {
        id: "SR-002",
        item: "Trauma Medical Supplies & Blood Bags",
        category: "Medical Kits",
        quantity: 120,
        unit: "Kits",
        requested_by: "Silchar Civil Hospital",
        destination_id: "HAB002",
        location: "Silchar, Cachar",
        priority: "CRITICAL",
        status: "IN_TRANSIT",
        requested_on: "25 mins ago",
        items: [{ resource_type: "Medical Kits", quantity: 120, unit: "Kits" }]
      },
      {
        id: "SR-003",
        item: "Emergency Water Purification Systems",
        category: "Drinking Water",
        quantity: 1000,
        unit: "Liters",
        requested_by: "North Sikkim SDMA",
        destination_id: "HAB003",
        location: "Mangan, North Sikkim",
        priority: "HIGH",
        status: "PENDING",
        requested_on: "1 hour ago",
        items: [{ resource_type: "Drinking Water", quantity: 1000, unit: "Liters" }]
      }
    ];

    this.missions = [
      {
        id: "MIS001",
        title: "Rapid Relief Delivery to Jatinga",
        status: "IN_TRANSIT",
        priority: "CRITICAL",
        request_id: "SR-001",
        warehouse_id: "WH-GUW-01",
        vehicle_id: "TRK-4X4-01",
        route_id: "RT-NH27-A",
        origin: { name: "Guwahati Strategic Depot", lat: 26.1445, lng: 91.7362 },
        destination: { name: "Haflong HQ", lat: 25.1832, lng: 93.0254 },
        resources: [{ resource_type: "Food Packs", quantity: 500, unit: "Packs" }],
        vehicle: { id: "TRK-4X4-01", type: "Tata 715 4x4 Heavy Tactical", capacity: 5000 },
        route: { id: "RT-NH27-A", name: "Guwahati - Haflong Arterial", distance_km: 320, eta_min: 240, risk_score: 35 },
        eta: "2 hrs 15 mins",
        progress: 65,
        risk_score: 35,
        replanning_status: "NONE"
      },
      {
        id: "MIS002",
        title: "Medical Evacuation Support",
        status: "IN_TRANSIT",
        priority: "CRITICAL",
        request_id: "SR-002",
        warehouse_id: "WH-SIL-02",
        vehicle_id: "ICU-VAN-01",
        route_id: "RT-NH37-B",
        origin: { name: "Silchar Regional Hub", lat: 24.8333, lng: 92.7926 },
        destination: { name: "Silchar Civil Hospital", lat: 24.8200, lng: 92.8000 },
        resources: [{ resource_type: "Medical Kits", quantity: 120, unit: "Kits" }],
        vehicle: { id: "ICU-VAN-01", type: "Mobile ICU Rapid Response Van", capacity: 1500 },
        route: { id: "RT-NH37-B", name: "Silchar Bypass", distance_km: 18, eta_min: 25, risk_score: 15 },
        eta: "12 mins",
        progress: 85,
        risk_score: 15,
        replanning_status: "NONE"
      }
    ];

    this.warehouses = [
      { id: "WH-GUW-01", name: "Guwahati Central Strategic Depot", state: "Assam", coordinates: { lat: 26.1445, lng: 91.7362 }, capacity: 10000, used_capacity: 8500, status: "OPERATIONAL" },
      { id: "WH-SIL-02", name: "Silchar Transshipment Hub", state: "Assam", coordinates: { lat: 24.8333, lng: 92.7926 }, capacity: 6000, used_capacity: 2880, status: "OPERATIONAL" },
      { id: "WH-SHL-03", name: "Shillong Upland Depot", state: "Meghalaya", coordinates: { lat: 25.5788, lng: 91.8933 }, capacity: 4500, used_capacity: 1800, status: "OPERATIONAL" },
      { id: "WH-ITN-04", name: "Itanagar Foothills Reserve", state: "Arunachal Pradesh", coordinates: { lat: 27.0844, lng: 93.6053 }, capacity: 5000, used_capacity: 1750, status: "OPERATIONAL" },
      { id: "WH-KOH-05", name: "Kohima Regional Base", state: "Nagaland", coordinates: { lat: 25.6751, lng: 94.1086 }, capacity: 4000, used_capacity: 1120, status: "OPERATIONAL" },
      { id: "WH-GTK-06", name: "Gangtok High-Altitude Depot", state: "Sikkim", coordinates: { lat: 27.3389, lng: 88.6065 }, capacity: 3500, used_capacity: 2170, status: "OPERATIONAL" }
    ];

    this.vehicles = [
      { id: "TRK-4X4-01", callsign: "ALPHA-01", type: "Tata 715 4x4 Heavy Tactical", status: "IN_TRANSIT", capacity: 5000, coordinates: { lat: 25.6, lng: 92.4 }, current_mission_id: "MIS001", assigned_driver: "Sub. Rajesh Kumar" },
      { id: "ICU-VAN-01", callsign: "MEDIC-01", type: "Mobile ICU Rapid Response Van", status: "IN_TRANSIT", capacity: 1500, coordinates: { lat: 24.83, lng: 92.79 }, current_mission_id: "MIS002", assigned_driver: "Dr. A. Sarma" },
      { id: "TRK-4X4-02", callsign: "BRAVO-02", type: "Ashok Leyland 4x4 Offroad", status: "AVAILABLE", capacity: 6000, coordinates: { lat: 26.14, lng: 91.73 }, current_mission_id: null, assigned_driver: "N. Gogoi" },
      { id: "BOAT-01", callsign: "RESCUE-BOAT-1", type: "Amphibious Power Boat", status: "AVAILABLE", capacity: 2000, coordinates: { lat: 24.83, lng: 92.79 }, current_mission_id: null, assigned_driver: "Capt. B. Teron" }
    ];

    this.roadSegments = [
      { edge_id: "RD-001", from_node: "Guwahati", to_node: "Haflong", road_name: "NH-27 Arterial", status: "PARTIALLY_BLOCKED", distance_km: 320, typical_speed_kmh: 45, terrain_difficulty: "MOUNTAINOUS", blockage_reason: "Landslide at Jatinga Ridge" },
      { edge_id: "RD-002", from_node: "Silchar", to_node: "Haflong", road_name: "NH-37 Bypass", status: "CLEAR", distance_km: 110, typical_speed_kmh: 55, terrain_difficulty: "HILLY" },
      { edge_id: "RD-003", from_node: "Silchar", to_node: "Aizawl", road_name: "NH-54", status: "CLEAR", distance_km: 180, typical_speed_kmh: 50, terrain_difficulty: "HILLY" },
      { edge_id: "RD-004", from_node: "Gangtok", to_node: "Mangan", road_name: "NH-10", status: "BLOCKED", distance_km: 65, typical_speed_kmh: 30, terrain_difficulty: "HIGH_ALTITUDE", blockage_reason: "Bridge approach washed out" }
    ];

    this.shelters = [
      { id: "SHL-001", name: "Haflong District Sports Complex", capacity: 1200, occupancy: 850, remaining_capacity: 350, safety_score: 92, accessibility_score: 85, readiness: "READY", services: ["Medical", "Food", "Sanitation"], coordinates: { lat: 25.18, lng: 93.02 } },
      { id: "SHL-002", name: "Silchar Community High School", capacity: 2000, occupancy: 1820, remaining_capacity: 180, safety_score: 88, accessibility_score: 90, readiness: "NEAR_CAPACITY", services: ["Food", "Clean Water"], coordinates: { lat: 24.83, lng: 92.79 } },
      { id: "SHL-003", name: "Mangan Relief Camp", capacity: 500, occupancy: 420, remaining_capacity: 80, safety_score: 80, accessibility_score: 65, readiness: "NEAR_CAPACITY", services: ["Basic Shelter", "First Aid"], coordinates: { lat: 27.50, lng: 88.52 } }
    ];

    this.fieldReports = [];
    this.alerts = [
      { id: "ALT-001", type: "HAZARD_ALERT", severity: "CRITICAL", title: "Active Landslide Warning - Jatinga Ridge", time_ago: "5 mins ago" },
      { id: "ALT-002", type: "LOGISTICS_ALERT", severity: "HIGH", title: "Low Medical Stock at Silchar Hub", time_ago: "18 mins ago" }
    ];
    this.relocationCases = [];
  }

  getDashboardOverview() {
    return {
      kpis: {
        active_incidents: this.incidents.filter(i => i.status === "ACTIVE").length,
        incidents_delta_24h: "+3",
        people_affected: 16870,
        people_affected_delta: "+12%",
        active_missions: this.missions.length,
        active_missions_delta: "+2",
        tons_of_supplies: 1240,
        supplies_delta: "+15%",
        operational_shelters: this.shelters.length,
        system_readiness_pct: 92,
        critical_needs: 3,
        missions_at_risk: 1,
        vehicles_active: this.vehicles.filter(v => v.status === "IN_TRANSIT").length,
        vehicles_available: this.vehicles.filter(v => v.status === "AVAILABLE").length,
        blocked_roads_count: this.roadSegments.filter(r => r.status === "BLOCKED").length,
        relocation_cases: this.relocationCases.length,
        pending_requests: this.requests.filter(r => r.status === "PENDING").length,
        critical_shortages: 2,
        missions_replanned: 1
      },
      people_at_risk: [
        { state: "Assam", count: 12400, pct: 73.5 },
        { state: "Sikkim", count: 2850, pct: 16.9 },
        { state: "Meghalaya", count: 1620, pct: 9.6 }
      ],
      mission_status: {
        in_transit: 2,
        at_risk: 1,
        delayed: 0,
        completed: 14,
        planned: 3,
        total: 20
      },
      supply_delivery_progress: {
        overall_delivered_tons: 471.2,
        overall_target_tons: 1240,
        overall_pct: 38,
        categories: [
          { name: "Food Packs", progress_pct: 38, delivered: "471.2 T", target: "1240 T" },
          { name: "Drinking Water", progress_pct: 26, delivered: "322.4 T", target: "1240 T" },
          { name: "Medical Kits", progress_pct: 18, delivered: "223.2 T", target: "1240 T" }
        ]
      },
      road_status: {
        open_pct: 75,
        open_count: 3,
        partially_blocked_pct: 12.5,
        partially_blocked_count: 1,
        fully_blocked_pct: 12.5,
        fully_blocked_count: 1
      },
      priority_actions: [
        {
          id: "ACT01",
          type: "APPROVE",
          severity: "CRITICAL",
          title: "Approve relief convoy to Jatinga Ridge",
          subtitle: "Medicines and food supplies (2.5 tons)",
          time_ago: "2 min ago",
          action_type: "approve_mission",
          target_id: "MIS001",
          button_text: "Approve"
        }
      ],
      recent_updates: [
        { time_ago: "5 min ago", text: "Landslide reported on NH-27 near Jatinga", type: "INCIDENT" },
        { time_ago: "12 min ago", text: "Convoy MIS001 dispatched from Guwahati Hub", type: "LOGISTICS" }
      ],
      ai_summary: "CRITICAL ALERT: Landslide at Jatinga Ridge (Assam) has partially blocked NH-27. Convoy MIS001 is rerouting via NH-37 Bypass. Emergency food and medical kits dispatched.",
      active_alerts: this.alerts,
      critical_locations: [],
      recent_activity: []
    };
  }
}

export const edgeStore = new EdgeOperationalState();

// Edge Engine Request Dispatcher
export function handleEdgeApiRequest(path: string, options?: RequestInit): any {
  const method = (options?.method || "GET").toUpperCase();

  // 1. Auth
  if (path === "/auth/login") {
    return {
      access_token: "jwt_edge_token_2026",
      token_type: "bearer",
      user: {
        username: "dist_officer",
        full_name: "Dr. Pranjal Borah, IAS",
        role: "ROLE_DISTRICT_AUTH",
        role_title: "Deputy Commissioner & Chair DDMA",
        department: "Dima Hasao DDMA HQ",
        initials: "PB"
      }
    };
  }
  if (path === "/auth/me") {
    return {
      username: "dist_officer",
      full_name: "Dr. Pranjal Borah, IAS",
      role: "ROLE_DISTRICT_AUTH",
      role_title: "Deputy Commissioner & Chair DDMA",
      department: "Dima Hasao DDMA HQ",
      initials: "PB"
    };
  }

  // 2. Dashboard
  if (path === "/dashboard/overview") {
    return edgeStore.getDashboardOverview();
  }

  // 3. Incidents
  if (path.startsWith("/incidents")) {
    if (method === "GET") {
      return { items: edgeStore.incidents };
    }
    if (method === "POST") {
      const payload = options?.body ? JSON.parse(options.body as string) : {};
      const newInc = {
        id: `INC00${edgeStore.incidents.length + 1}`,
        title: payload.description || "Reported Disaster Incident",
        type: payload.type || "LANDSLIDE",
        severity: payload.severity || "HIGH",
        status: "ACTIVE",
        location_name: "North East Operational Zone",
        location: payload.location || { lat: 25.4, lng: 93.2 },
        created_at: new Date().toISOString()
      };
      edgeStore.incidents.unshift(newInc);
      return newInc;
    }
  }

  // 4. Supply Requests & Logistics
  if (path.startsWith("/logistics/requests")) {
    if (method === "GET") {
      return { items: edgeStore.requests };
    }
    if (method === "POST") {
      const payload = options?.body ? JSON.parse(options.body as string) : {};
      const newReq = {
        id: `SR-00${edgeStore.requests.length + 1}`,
        item: payload.items?.[0]?.resource_type || payload.need_type || "Relief Supplies",
        category: payload.items?.[0]?.resource_type || "General Relief",
        quantity: payload.quantity || 100,
        unit: payload.unit || "Units",
        requested_by: "District Response Team",
        priority: payload.priority || "HIGH",
        status: "PENDING",
        requested_on: "Just now",
        items: payload.items || [{ resource_type: "Relief", quantity: payload.quantity || 100, unit: "Units" }]
      };
      edgeStore.requests.unshift(newReq);
      return newReq;
    }
  }

  // 5. Missions
  if (path.startsWith("/logistics/missions")) {
    if (method === "GET") {
      return { items: edgeStore.missions };
    }
    if (method === "POST") {
      const payload = options?.body ? JSON.parse(options.body as string) : {};
      const newMis = {
        id: `MIS00${edgeStore.missions.length + 1}`,
        title: "Relief Supply Convoy Mission",
        status: "APPROVED",
        priority: "CRITICAL",
        warehouse_id: payload.warehouse_id || "WH-GUW-01",
        vehicle_id: payload.vehicle_id || "TRK-4X4-01",
        route_id: payload.route_id || "RT-NH27-A",
        origin: { name: "Regional Strategic Depot", lat: 26.14, lng: 91.73 },
        destination: { name: "Affected District HQ", lat: 25.18, lng: 93.02 },
        progress: 10,
        risk_score: 20
      };
      edgeStore.missions.unshift(newMis);
      return newMis;
    }
  }

  // 6. Warehouses & Inventory
  if (path === "/warehouses") {
    return { items: edgeStore.warehouses };
  }
  if (path.startsWith("/resources/inventory")) {
    return {
      items: [
        { id: "INV-01", warehouse_id: "WH-GUW-01", resource_type: "Food Packs", stock: 471, reserved: 50, available: 421, unit: "Tons" },
        { id: "INV-02", warehouse_id: "WH-GUW-01", resource_type: "Drinking Water", stock: 322, reserved: 30, available: 292, unit: "Tons" },
        { id: "INV-03", warehouse_id: "WH-SIL-02", resource_type: "Trauma Medical Kits", stock: 223, reserved: 20, available: 203, unit: "Kits" }
      ]
    };
  }

  // 7. Vehicles & Fleet
  if (path === "/vehicles" || path.startsWith("/vehicles")) {
    return { items: edgeStore.vehicles };
  }

  // 8. Roads & Routing
  if (path === "/roads/status") {
    return edgeStore.roadSegments;
  }
  if (path === "/routes/calculate" || path === "/routes/compare") {
    return {
      routes: [
        {
          id: "RT-RECOMMENDED",
          name: "NH-37 Bypass via Silchar Corridor (Optimal)",
          distance_km: 145,
          eta_min: 165,
          risk_score: 18,
          is_recommended: true
        }
      ]
    };
  }

  // 9. Shelters
  if (path === "/shelters") {
    return { items: edgeStore.shelters };
  }

  // 10. GIS & Layers
  if (path === "/gis/layers") {
    return {
      layers: [
        { id: "layer_villages", name: "Vulnerable Habitations", source_type: "geojson", available: true },
        { id: "layer_hazards", name: "Active Landslide & Flood Hazard Zones", source_type: "geojson", available: true },
        { id: "layer_roads", name: "National Highway Network", source_type: "geojson", available: true }
      ]
    };
  }
  if (path.startsWith("/gis/features")) {
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { id: "HAB001", name: "Jatinga Ridge Valley", risk_level: "CRITICAL", population: 1820 },
          geometry: { type: "Point", coordinates: [93.04, 25.12] }
        }
      ]
    };
  }

  // 11. Alerts & Audit
  if (path === "/alerts") {
    return edgeStore.alerts;
  }
  if (path === "/audit/ledger") {
    return [
      { id: "AUD-01", timestamp: new Date().toISOString(), user: "Dr. Pranjal Borah", action: "Approved Mission MIS001", status: "VERIFIED" }
    ];
  }

  // Fallback default response
  return { status: "ONLINE", message: "Edge Engine Dispatch OK", path };
}
