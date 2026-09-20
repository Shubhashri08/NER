function getApiBaseUrl(): string {
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === "string" && envUrl.trim() !== "") {
    const trimmed = envUrl.trim().replace(/\/+$/, "");
    return trimmed.endsWith("/api/v1") ? trimmed : `${trimmed}/api/v1`;
  }
  // If running in local browser without env var, use default localhost backend
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "http://127.0.0.1:8000/api/v1";
  }
  return "/api/v1";
}

const API_BASE = getApiBaseUrl();

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  } | null;
  timestamp: string;
  data_tier: "REAL_DATA" | "SYNTHETIC_DATA" | "SIMULATION";
}

import { handleEdgeApiRequest } from './edgeEngine';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string> || {}),
  };
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
    if (!res.ok) {
      const errText = await res.text();
      let parsedErr: any = null;
      try { parsedErr = JSON.parse(errText); } catch {}
      throw new Error(parsedErr?.error?.message || `API Error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err: any) {
    // If running on Cloudflare Edge Worker without a separate Python process, use Cloudflare Edge Engine
    try {
      const resultData = handleEdgeApiRequest(endpoint, options);
      return {
        success: true,
        data: resultData as T,
        timestamp: new Date().toISOString(),
        data_tier: "REAL_DATA"
      };
    } catch (edgeErr) {
      console.error(`[API & Edge Fallback Failed] ${endpoint}:`, err);
      throw err;
    }
  }
}


// Domain Model Contracts

export interface DashboardKPIs {
  active_incidents: number;
  incidents_delta_24h: string;
  people_affected: number;
  people_affected_delta: string;
  active_missions: number;
  active_missions_delta: string;
  tons_of_supplies: number;
  supplies_delta: string;
  operational_shelters: number;
  system_readiness_pct: number;
  critical_needs: number;
  missions_at_risk: number;
  vehicles_active: number;
  vehicles_available: number;
  blocked_roads_count: number;
  relocation_cases: number;
  pending_requests: number;
  critical_shortages: number;
  missions_replanned: number;
}

export interface PriorityAction {
  id: string;
  type: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "INFO" | "SUCCESS";
  title: string;
  subtitle: string;
  time_ago: string;
  action_type: string;
  target_id: string;
  button_text: string;
}

export interface RecentUpdate {
  time_ago: string;
  text: string;
  type: string;
}

export interface SupplyDeliveryProgress {
  overall_delivered_tons: number;
  overall_target_tons: number;
  overall_pct: number;
  categories: {
    name: string;
    progress_pct: number;
    delivered: string;
    target: string;
  }[];
}

export interface RoadStatusSummary {
  open_pct: number;
  open_count: number;
  partially_blocked_pct: number;
  partially_blocked_count: number;
  fully_blocked_pct: number;
  fully_blocked_count: number;
}

export interface DashboardOverview {
  kpis: DashboardKPIs;
  people_at_risk: { state: string; count: number; pct: number }[];
  mission_status: {
    in_transit: number;
    at_risk: number;
    delayed: number;
    completed: number;
    planned: number;
    total: number;
  };
  supply_delivery_progress: SupplyDeliveryProgress;
  road_status: RoadStatusSummary;
  priority_actions: PriorityAction[];
  recent_updates: RecentUpdate[];
  ai_summary: string;
  active_alerts: any[];
  critical_locations: any[];
  recent_activity: any[];
}

export interface IncidentRecord {
  id: string;
  incident_id?: string;
  title?: string;
  type: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "ACTIVE" | "VERIFIED" | "CLOSED";
  location_name?: string;
  impact_status?: string;
  description?: string;
  location?: { lat: number; lng: number };
  coordinates?: { latitude?: number; longitude?: number; lat?: number; lng?: number };
  verified?: boolean;
  affected_roads?: string[];
  affected_habitations?: string[];
  affected_facilities?: string[];
  affected_missions?: string[];
  affected_population?: number;
  created_at?: string;
  time_ago?: string;
  photo?: string;
}

export interface SupplyRequestRecord {
  id: string;
  item?: string;
  category?: string;
  quantity?: string | number;
  unit?: string;
  requested_by?: string;
  destination_id?: string;
  location?: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "UNASSESSED";
  status: "PENDING" | "APPROVED" | "IN_TRANSIT" | "FULFILLED" | "REJECTED";
  requested_on?: string;
  created_at?: string;
  required_by?: string;
  reason?: string;
  items?: { resource_type: string; quantity: number; unit: string }[];
  destination?: { id: string; name: string; lat: number; lng: number };
}

export interface MissionRecord {
  id: string;
  status: "PENDING_APPROVAL" | "APPROVED" | "IN_TRANSIT" | "DELAYED" | "DELIVERED" | "CANCELLED" | "REPLANNED" | "ON_HOLD";
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  request_id?: string;
  warehouse_id?: string;
  vehicle_id?: string;
  route_id?: string;
  origin?: { warehouse_id?: string; id?: string; name: string; lat?: number; lng?: number };
  destination?: { habitation_id?: string; id?: string; name: string; lat?: number; lng?: number };
  resources?: { resource_type: string; quantity: number; unit?: string }[];
  vehicle?: { id: string; type: string; capacity?: number };
  route?: { id: string; name?: string; distance_km?: number; eta_min?: number; risk_score?: number };
  eta?: string;
  risk_score?: number;
  progress?: number;
  replanning_status?: "NONE" | "REQUIRED" | "IN_PROGRESS" | "REPLANNED";
  created_at?: string;
  started_at?: string;
  title?: string;
  cause?: string;
}

export interface InventoryItemRecord {
  id: string;
  warehouse_id: string;
  resource_type: string;
  stock: number;
  reserved: number;
  available: number;
  unit: string;
}

export interface WarehouseRecord {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  capacity?: number;
  used_capacity?: number;
  status: string;
  available_stock_types?: number;
  inventory?: string[] | InventoryItemRecord[];
}

export interface VehicleRecord {
  id: string;
  vehicle_id?: string;
  callsign?: string;
  type: string;
  status: "AVAILABLE" | "ASSIGNED" | "IN_TRANSIT" | "MAINTENANCE";
  capacity: number;
  terrain_capability?: string;
  coordinates?: { lat: number; lng: number };
  current_location?: { lat: number; lng: number };
  speed?: number;
  heading?: number;
  last_seen?: string;
  assigned_driver?: string;
  current_mission_id?: string | null;
}

export interface ShelterRecord {
  id: string;
  shelter_id?: string;
  name: string;
  capacity: number;
  occupancy: number;
  remaining_capacity: number;
  safety_score: number;
  accessibility_score: number;
  readiness: "READY" | "NEAR_CAPACITY" | "FULL";
  services: string[];
  coordinates: { lat: number; lng: number };
  status?: string;
}

export interface FieldReportRecord {
  id: string;
  type: string;
  reporter: string;
  reporter_name?: string;
  reporter_role?: string;
  location: { lat: number; lng: number };
  severity: string;
  description?: string;
  photos?: string[];
  evidence?: string[];
  status: "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED";
  created_at: string;
  time_ago?: string;
}

export interface ReplanCaseRecord {
  id: string;
  replanning_id?: string;
  mission_id: string;
  status: "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
  current_plan?: any;
  recommended_plan?: {
    route: { id: string; name: string; distance_km: number; eta_min: number };
    vehicle?: { id: string; type?: string };
    resources?: Record<string, number>;
    eta?: string;
  };
  alternatives?: any[];
  reason: string;
  impact?: { delay_min: number; risk_change: number };
  evidence?: string[];
  approved_by?: string | null;
  created_at?: string;
}

export interface GISLayerItem {
  id: string;
  name: string;
  source_type: string;
  available: boolean;
}

export interface GISFeature {
  type: "Feature";
  properties: {
    id: string;
    name: string;
    type: string;
    risk_level?: string;
    population?: number;
    severity?: string;
    status?: string;
    [key: string]: any;
  };
  geometry: {
    type: "Point" | "LineString" | "Polygon";
    coordinates: any;
  };
}

export interface GISFeatureCollection {
  type: "FeatureCollection";
  features: GISFeature[];
}

export interface RoadSegmentRecord {
  edge_id: string;
  from_node: string;
  to_node: string;
  road_name: string;
  status: "CLEAR" | "PARTIALLY_BLOCKED" | "BLOCKED" | "WARNING";
  distance_km: number;
  typical_speed_kmh: number;
  terrain_difficulty: string;
  blockage_reason?: string | null;
}

// API Methods
export const disasterApi = {
  // Auth
  login: (username: string, password: string = "admin123") =>
    fetchApi<{ access_token: string; token_type: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  getMe: () => fetchApi<any>("/auth/me"),

  // Dashboard Overview
  getDashboardOverview: () => fetchApi<DashboardOverview>("/dashboard/overview"),
  approvePriorityAction: (actionId: string) =>
    fetchApi<{ approved_action_id: string; remaining_count: number; priority_actions: PriorityAction[] }>(
      `/dashboard/priority-actions/${actionId}/approve`,
      { method: "POST" }
    ),
  declinePriorityAction: (actionId: string) =>
    fetchApi<{ declined_action_id: string; remaining_count: number; priority_actions: PriorityAction[] }>(
      `/dashboard/priority-actions/${actionId}/decline`,
      { method: "POST" }
    ),

  // Incidents
  getIncidents: (params?: { severity?: string; status?: string; type?: string; page?: number; page_size?: number }) => {
    const q = new URLSearchParams();
    if (params?.severity) q.append("severity", params.severity);
    if (params?.status) q.append("status", params.status);
    if (params?.type) q.append("type", params.type);
    if (params?.page) q.append("page", params.page.toString());
    if (params?.page_size) q.append("page_size", params.page_size.toString());
    const query = q.toString() ? `?${q.toString()}` : "";
    return fetchApi<{ items: IncidentRecord[]; pagination?: any }>(`/incidents${query}`);
  },
  createIncident: (data: { type: string; severity: string; description: string; location?: { lat: number; lng: number } }) =>
    fetchApi<IncidentRecord>("/incidents", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getIncidentDetail: (incidentId: string) => fetchApi<IncidentRecord>(`/incidents/${incidentId}`),
  updateIncident: (incidentId: string, data: { severity?: string; description?: string; status?: string }) =>
    fetchApi<any>(`/incidents/${incidentId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  verifyIncident: (incidentId: string, verificationNote?: string) =>
    fetchApi<any>(`/incidents/${incidentId}/verify`, {
      method: "POST",
      body: JSON.stringify({ verification_note: verificationNote }),
    }),
  closeIncident: (incidentId: string, reason?: string) =>
    fetchApi<any>(`/incidents/${incidentId}/close`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),
  getIncidentImpact: (incidentId: string) => fetchApi<any>(`/incidents/${incidentId}/impact`),
  getIncidentAffectedMissions: (incidentId: string) => fetchApi<any>(`/incidents/${incidentId}/affected-missions`),

  // Logistics & Supply Requests
  getLogisticsRequests: (params?: { destination_id?: string; priority?: string; status?: string }) => {
    const q = new URLSearchParams();
    if (params?.destination_id) q.append("destination_id", params.destination_id);
    if (params?.priority) q.append("priority", params.priority);
    if (params?.status) q.append("status", params.status);
    const query = q.toString() ? `?${q.toString()}` : "";
    return fetchApi<{ items: SupplyRequestRecord[] }>(`/logistics/requests${query}`);
  },
  createLogisticsRequest: (data: {
    destination_id?: string;
    need_type?: string;
    quantity?: number;
    unit?: string;
    priority?: string;
    required_by?: string;
    reason?: string;
    items?: { resource_type: string; quantity: number; unit: string }[];
  }) =>
    fetchApi<any>("/logistics/requests", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getSupplyRequest: (requestId: string) => fetchApi<SupplyRequestRecord>(`/logistics/requests/${requestId}`),
  updateSupplyRequest: (requestId: string, data: { status?: string; reason?: string; required_by?: string }) =>
    fetchApi<any>(`/logistics/requests/${requestId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  prioritizeSupplyRequest: (requestId: string) =>
    fetchApi<any>(`/logistics/requests/${requestId}/prioritize`, { method: "POST" }),

  // Missions
  getMissions: (params?: { status?: string; priority?: string }) => {
    const q = new URLSearchParams();
    if (params?.status) q.append("status", params.status);
    if (params?.priority) q.append("priority", params.priority);
    const query = q.toString() ? `?${q.toString()}` : "";
    return fetchApi<{ items: MissionRecord[] }>(`/logistics/missions${query}`);
  },
  createMission: (data: {
    request_id?: string;
    warehouse_id?: string;
    vehicle_id?: string;
    route_id?: string;
    cargo_manifest?: any[];
  }) =>
    fetchApi<any>("/logistics/missions", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getMissionDetail: (missionId: string) => fetchApi<MissionRecord>(`/logistics/missions/${missionId}`),
  approveMission: (missionId: string, reason?: string) =>
    fetchApi<any>(`/logistics/missions/${missionId}/approve`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),
  startMission: (missionId: string) => fetchApi<any>(`/logistics/missions/${missionId}/start`, { method: "POST" }),
  completeMission: (missionId: string) => fetchApi<any>(`/logistics/missions/${missionId}/complete`, { method: "POST" }),
  cancelMission: (missionId: string, reason?: string) =>
    fetchApi<any>(`/logistics/missions/${missionId}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),
  reportMission: (missionId: string, status: string, note?: string) =>
    fetchApi<any>(`/logistics/missions/${missionId}/report`, {
      method: "POST",
      body: JSON.stringify({ status, note }),
    }),

  // Resources & Inventory
  getResourceTypes: () => fetchApi<{ items: any[] }>("/resources/types"),
  getWarehouseInventory: (params?: { warehouse_id?: string; resource_type?: string }) => {
    const q = new URLSearchParams();
    if (params?.warehouse_id) q.append("warehouse_id", params.warehouse_id);
    if (params?.resource_type) q.append("resource_type", params.resource_type);
    const query = q.toString() ? `?${q.toString()}` : "";
    return fetchApi<{ items: InventoryItemRecord[] }>(`/resources/inventory${query}`);
  },
  addInventoryStock: (data: { warehouse_id: string; resource_type: string; quantity: number; unit?: string }) =>
    fetchApi<any>("/resources/inventory", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  reserveInventory: (inventoryId: string, quantity: number, missionId: string) =>
    fetchApi<any>(`/resources/inventory/${inventoryId}/reserve`, {
      method: "POST",
      body: JSON.stringify({ quantity, mission_id: missionId }),
    }),
  getWarehouses: () => fetchApi<{ items: WarehouseRecord[] }>("/warehouses"),
  createWarehouse: (data: { name: string; coordinates?: { lat: number; lng: number }; capacity?: number }) =>
    fetchApi<any>("/warehouses", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getWarehouseDetail: (warehouseId: string) => fetchApi<any>(`/warehouses/${warehouseId}`),
  dispatchWarehouse: (warehouseId: string, missionId: string, items: any[]) =>
    fetchApi<any>(`/warehouses/${warehouseId}/dispatch`, {
      method: "POST",
      body: JSON.stringify({ mission_id: missionId, items }),
    }),

  // Vehicles & Fleet
  getVehicles: (params?: { status?: string; type?: string }) => {
    const q = new URLSearchParams();
    if (params?.status) q.append("status", params.status);
    if (params?.type) q.append("type", params.type);
    const query = q.toString() ? `?${q.toString()}` : "";
    return fetchApi<{ items: VehicleRecord[] }>(`/vehicles${query}`);
  },
  getVehicleDetail: (vehicleId: string) => fetchApi<VehicleRecord>(`/vehicles/${vehicleId}`),
  getVehicleLocation: (vehicleId: string) => fetchApi<any>(`/vehicles/${vehicleId}/location`),
  updateVehicleLocation: (vehicleId: string, data: { lat: number; lng: number; speed?: number; heading?: number }) =>
    fetchApi<any>(`/vehicles/${vehicleId}/location`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateVehicleStatus: (vehicleId: string, status: string, reason?: string) =>
    fetchApi<any>(`/vehicles/${vehicleId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, reason }),
    }),
  assignVehicle: (vehicleId: string, missionId: string) =>
    fetchApi<any>(`/vehicles/${vehicleId}/assign`, {
      method: "POST",
      body: JSON.stringify({ mission_id: missionId }),
    }),
  getVehicleHistory: (vehicleId: string) => fetchApi<any>(`/vehicles/${vehicleId}/history`),

  // Roads & Routing
  getRoadsStatus: () => fetchApi<RoadSegmentRecord[]>("/roads/status"),
  updateRoadSegment: (segmentId: string, status: string, blockageReason?: string) =>
    fetchApi<any>(`/roads/segments/${segmentId}`, {
      method: "PATCH",
      body: JSON.stringify({ status, blockage_reason: blockageReason }),
    }),
  calculateRoute: (originNode?: string, destNode?: string, require4x4: boolean = false) =>
    fetchApi<any>("/routes/calculate", {
      method: "POST",
      body: JSON.stringify({ origin_node: originNode, destination_node: destNode, require_4x4: require4x4 }),
    }),
  compareRoutes: (origin?: any, destination?: any, vehicleId?: string) =>
    fetchApi<{ routes: any[] }>("/routes/compare", {
      method: "POST",
      body: JSON.stringify({ origin, destination, vehicle_id: vehicleId }),
    }),
  getRouteDetail: (routeId: string) => fetchApi<any>(`/routes/${routeId}`),

  // Replanning
  checkReplanning: (incidentId: string) =>
    fetchApi<{ replanning_required: boolean; affected_missions: any[] }>("/replanning/check", {
      method: "POST",
      body: JSON.stringify({ incident_id: incidentId }),
    }),
  generateReplan: (missionId: string) =>
    fetchApi<ReplanCaseRecord>("/replanning/generate", {
      method: "POST",
      body: JSON.stringify({ mission_id: missionId }),
    }),
  getReplanDetail: (replanId: string) => fetchApi<ReplanCaseRecord>(`/replanning/${replanId}`),
  approveReplan: (replanId: string, reason?: string) =>
    fetchApi<any>(`/replanning/${replanId}/approve`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),
  rejectReplan: (replanId: string, reason?: string) =>
    fetchApi<any>(`/replanning/${replanId}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),

  // GIS
  getGISLayers: () => fetchApi<{ layers: GISLayerItem[] }>("/gis/layers"),
  getGISFeatures: (layer?: string, bbox?: string) => {
    const q = new URLSearchParams();
    if (layer) q.append("layer", layer);
    if (bbox) q.append("bbox", bbox);
    const query = q.toString() ? `?${q.toString()}` : "";
    return fetchApi<GISFeatureCollection>(`/gis/features${query}`);
  },
  getNearbyEntities: (lat: number = 25.4, lng: number = 93.2, radiusKm: number = 10) =>
    fetchApi<{ items: any[] }>(`/gis/nearby?lat=${lat}&lng=${lng}&radius_km=${radiusKm}`),

  // Field Reports
  getFieldReports: (params?: { status?: string; type?: string }) => {
    const q = new URLSearchParams();
    if (params?.status) q.append("status", params.status);
    if (params?.type) q.append("type", params.type);
    const query = q.toString() ? `?${q.toString()}` : "";
    return fetchApi<{ items: FieldReportRecord[] }>(`/reports/field${query}`);
  },
  createFieldReport: (data: { type: string; severity: string; description: string; location?: { lat: number; lng: number }; photos?: string[] }) =>
    fetchApi<any>("/reports/field", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getFieldReportDetail: (reportId: string) => fetchApi<FieldReportRecord>(`/reports/field/${reportId}`),
  verifyFieldReport: (reportId: string, promoteToIncident: boolean = true, note?: string) =>
    fetchApi<any>(`/reports/field/${reportId}/verify`, {
      method: "POST",
      body: JSON.stringify({ promote_to_incident: promoteToIncident, note }),
    }),
  rejectFieldReport: (reportId: string, reason?: string) =>
    fetchApi<any>(`/reports/field/${reportId}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),

  // Shelters
  getShelters: () => fetchApi<{ shelters?: ShelterRecord[]; items?: ShelterRecord[] }>("/shelters"),
  getShelterDetail: (shelterId: string) => fetchApi<ShelterRecord>(`/shelters/${shelterId}`),
  updateShelterOccupancy: (shelterId: string, occupancy: number) =>
    fetchApi<any>(`/shelters/${shelterId}/occupancy`, {
      method: "PATCH",
      body: JSON.stringify({ occupancy }),
    }),

  // Relocation
  getRelocationCases: () => fetchApi<any[]>("/relocation/cases"),
  getRelocationMissions: () => fetchApi<any[]>("/relocation/missions"),
  createRelocationCase: (habitationId: string, triggerIncidentId?: string) =>
    fetchApi<any>("/relocation/cases", {
      method: "POST",
      body: JSON.stringify({ habitation_id: habitationId, trigger_incident_id: triggerIncidentId }),
    }),

  // Copilot & Decision
  getCopilotSummary: (scope: string = "DISTRICT", districtId: string = "D01") =>
    fetchApi<{ current_situation: string; new_incidents: string[]; critical_shortages: string[]; at_risk_missions: string[] }>("/copilot/summarize", {
      method: "POST",
      body: JSON.stringify({ scope, district_id: districtId }),
    }),
  queryCopilot: (query: string) =>
    fetchApi<{ answer: string; sources: any[]; related_entities: string[] }>("/copilot/query", {
      method: "POST",
      body: JSON.stringify({ query }),
    }),
  explainDecision: (entityType: string, entityId: string) =>
    fetchApi<any>("/copilot/explain", {
      method: "POST",
      body: JSON.stringify({ entity_type: entityType, entity_id: entityId }),
    }),

  // Alerts & Audit
  getAlerts: () => fetchApi<any[]>("/alerts"),
  acknowledgeAlert: (alertId: string) =>
    fetchApi<any>(`/alerts/${alertId}/ack`, { method: "POST" }),
  getAuditLedger: () => fetchApi<any[]>("/audit/ledger"),
};

