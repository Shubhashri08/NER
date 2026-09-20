import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Box,
  CheckCircle2,
  ChevronDown,
  Home,
  Package,
  ShieldCheck,
  Sparkles,
  Truck,
  Users
} from 'lucide-react';
import { InteractiveMap } from './InteractiveMap';
import { IncidentDetailModal } from './IncidentDetailModal';
import { disasterApi } from '../services/api';
import type {
  DashboardOverview,
  IncidentRecord,
  MissionRecord,
  PriorityAction,
  ShelterRecord,
  WarehouseRecord
} from '../services/api';

interface Props {
  onNavigateToTab?: (tab: string) => void;
  onSelectIncident?: (incident: IncidentRecord) => void;
  isDark?: boolean;
}

const defaultIncidents: IncidentRecord[] = [
  {
    id: 'INC-001',
    type: 'LANDSLIDE',
    severity: 'CRITICAL',
    status: 'ACTIVE',
    location_name: 'Dima Hasao, Assam',
    impact_status: 'Road Blocked',
    description: 'Landslide on NH-27',
    time_ago: '2 hours ago',
    location: { lat: 25.18, lng: 93.02 }
  },
  {
    id: 'INC-002',
    type: 'FLOOD',
    severity: 'HIGH',
    status: 'ACTIVE',
    location_name: 'Sonitpur, Assam',
    impact_status: 'Multiple Villages',
    description: 'Flash Flooding',
    time_ago: '4 hours ago',
    location: { lat: 26.12, lng: 92.68 }
  },
  {
    id: 'INC-003',
    type: 'BRIDGE_DAMAGE',
    severity: 'HIGH',
    status: 'ACTIVE',
    location_name: 'West Garo Hills, Meghalaya',
    impact_status: 'Limited Access',
    description: 'Bridge Damage',
    time_ago: '6 hours ago',
    location: { lat: 25.49, lng: 91.36 }
  },
  {
    id: 'INC-004',
    type: 'HEAVY_RAINFALL',
    severity: 'MEDIUM',
    status: 'ACTIVE',
    location_name: 'Aizawl, Mizoram',
    impact_status: 'High Risk',
    description: 'Heavy Rainfall',
    time_ago: '8 hours ago',
    location: { lat: 23.73, lng: 92.72 }
  },
  {
    id: 'INC-005',
    type: 'RIVER_OVERFLOW',
    severity: 'LOW',
    status: 'ACTIVE',
    location_name: 'Itanagar, Arunachal Pradesh',
    impact_status: 'Monitoring',
    description: 'River Overflow',
    time_ago: '11 hours ago',
    location: { lat: 27.08, lng: 93.61 }
  }
];

const defaultPriorityActions: PriorityAction[] = [
  {
    id: 'ACT01',
    type: 'APPROVE',
    severity: 'CRITICAL',
    title: 'Approve relief convoy to Maibong',
    subtitle: 'Medicines and food supplies (2.5 tons)',
    time_ago: '2 min ago',
    action_type: 'approve_mission',
    target_id: 'MIS001',
    button_text: 'Approve'
  },
  {
    id: 'ACT02',
    type: 'REVIEW',
    severity: 'HIGH',
    title: 'Assess shelter capacity in Tura',
    subtitle: 'Increase inflow due to flooding',
    time_ago: '15 min ago',
    action_type: 'review_shelter',
    target_id: 'FAC10',
    button_text: 'Review'
  },
  {
    id: 'ACT03',
    type: 'ALLOCATE',
    severity: 'MEDIUM',
    title: 'Reallocate fuel to Aizawl',
    subtitle: 'Low stock alert (800 L remaining)',
    time_ago: '28 min ago',
    action_type: 'allocate_resource',
    target_id: 'WH04',
    button_text: 'Allocate'
  },
  {
    id: 'ACT04',
    type: 'PLAN_ROUTE',
    severity: 'INFO',
    title: 'Clear alternate route for NH-27',
    subtitle: 'Primary route blocked',
    time_ago: '42 min ago',
    action_type: 'plan_route',
    target_id: 'R2',
    button_text: 'Plan Route'
  },
  {
    id: 'ACT05',
    type: 'CONFIRM',
    severity: 'SUCCESS',
    title: 'Confirm relocation readiness',
    subtitle: 'Rengma Village, Assam (5,200 people)',
    time_ago: '1 hour ago',
    action_type: 'confirm_relocation',
    target_id: 'REL001',
    button_text: 'Review'
  }
];

export function CommandCenterView({ onNavigateToTab, onSelectIncident, isDark = false }: Props) {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [missions, setMissions] = useState<MissionRecord[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseRecord[]>([]);
  const [shelters, setShelters] = useState<ShelterRecord[]>([]);
  const [priorityActionsList, setPriorityActionsList] = useState<PriorityAction[]>(defaultPriorityActions);
  const [selectedIncident, setSelectedIncident] = useState<IncidentRecord | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [activeLayers, setActiveLayers] = useState({
    incidents: true,
    missions: true,
    shelters: true,
    warehouses: true,
    boundaries: true,
  });

  const loadData = async () => {
    try {
      const [overviewRes, incidentsRes, missionsRes, warehousesRes, sheltersRes] = await Promise.all([
        disasterApi.getDashboardOverview(),
        disasterApi.getIncidents(),
        disasterApi.getMissions(),
        disasterApi.getWarehouses(),
        disasterApi.getShelters()
      ]);

      setOverview(overviewRes.data);
      if (overviewRes.data?.priority_actions) {
        setPriorityActionsList(overviewRes.data.priority_actions);
      }
      if (incidentsRes.data?.items?.length) {
        setIncidents(incidentsRes.data.items);
      }
      if (missionsRes.data?.items?.length) {
        setMissions(missionsRes.data.items);
      }
      if (warehousesRes.data?.items?.length) {
        setWarehouses(warehousesRes.data.items);
      }
      const shelterList = sheltersRes.data?.shelters || sheltersRes.data?.items || [];
      if (shelterList.length) {
        setShelters(shelterList);
      }
    } catch (err) {
      console.warn('Dashboard data fetch sync fallback:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const incidentList = incidents.length ? incidents.slice(0, 5) : defaultIncidents;
  const peopleAffected = (overview?.kpis?.people_affected ?? 30700).toLocaleString();

  const handleSelectIncident = (incident: IncidentRecord) => {
    setSelectedIncident(incident);
    onSelectIncident?.(incident);
  };

  const handleExecuteAction = async (action: PriorityAction) => {
    setPriorityActionsList(prev => prev.filter(a => a.id !== action.id));

    try {
      if (action.action_type === 'approve_mission' && action.target_id) {
        await disasterApi.approveMission(action.target_id, 'Approved via Command Center fast-track').catch(() => {});
      }
      const res = await disasterApi.approvePriorityAction(action.id);
      if (res.data?.priority_actions) {
        setPriorityActionsList(res.data.priority_actions);
      }
      setNotification(`${action.title} approved and cleared from queue`);
    } catch {
      setNotification(`${action.title} processed`);
    }

    if (action.action_type === 'plan_route') {
      onNavigateToTab?.('replanning');
    } else if (action.action_type === 'review_shelter') {
      onNavigateToTab?.('relocation');
    }

    setTimeout(() => setNotification(null), 3000);
  };

  const metrics = [
    [AlertTriangle, overview?.kpis?.active_incidents ?? incidentList.length ?? 8, 'Active Incidents', overview?.kpis?.incidents_delta_24h || '↑ 3', '#ff595e'],
    [Users, peopleAffected, 'People Affected', overview?.kpis?.people_affected_delta || '↑ 12%', '#4abafa'],
    [Truck, overview?.kpis?.active_missions ?? missions.length ?? 1, 'Active Missions', overview?.kpis?.active_missions_delta || '↑ 8%', '#41e89c'],
    [Box, (overview?.kpis?.tons_of_supplies ?? 1240).toLocaleString(), 'Tons of Supplies', overview?.kpis?.supplies_delta || '↑ 12% vs last week', '#ffc55b'],
    [Home, overview?.kpis?.operational_shelters ?? shelters.length ?? 5, 'Shelters Operational', '', '#b47bff'],
    [ShieldCheck, `${overview?.kpis?.system_readiness_pct ?? 84}%`, 'System Readiness', '', '#cce0ff']
  ] as const;

  const peopleAtRisk = overview?.people_at_risk || [
    { state: 'Assam', count: 18400, pct: 100 },
    { state: 'Arunachal Pradesh', count: 9120, pct: 55 },
    { state: 'Meghalaya', count: 6280, pct: 38 },
    { state: 'Manipur', count: 5400, pct: 32 },
    { state: 'Mizoram', count: 4320, pct: 26 },
    { state: 'Nagaland', count: 3860, pct: 18 },
    { state: 'Tripura', count: 850, pct: 7 }
  ];

  const missionStatus = overview?.mission_status || {
    in_transit: 18,
    at_risk: 7,
    delayed: 6,
    completed: 8,
    planned: 3,
    total: 42
  };

  const supplyDelivery = overview?.supply_delivery_progress || {
    overall_delivered_tons: 1240,
    overall_target_tons: 2000,
    overall_pct: 62,
    categories: [
      { name: 'Food Packs', progress_pct: 78, delivered: '3,900 units', target: '5,000 units' },
      { name: 'Water', progress_pct: 65, delivered: '65,000 L', target: '100,000 L' },
      { name: 'Medicine', progress_pct: 54, delivered: '540 kits', target: '1,000 kits' },
      { name: 'Fuel', progress_pct: 48, delivered: '4,800 L', target: '10,000 L' },
      { name: 'Shelter Kits', progress_pct: 72, delivered: '360 sets', target: '500 sets' }
    ]
  };

  const recentUpdates = overview?.recent_updates?.length ? overview.recent_updates : [
    { time_ago: '2 min ago', text: 'Relief convoy departed from Guwahati depot', type: 'departure' },
    { time_ago: '15 min ago', text: '320 people arrived at Maibong shelter', type: 'shelter' },
    { time_ago: '28 min ago', text: 'Alternate route identified for NH-27 via BRO bypass', type: 'route' },
    { time_ago: '1 hour ago', text: 'Weather alert issued for upper Assam and Meghalaya', type: 'weather' },
    { time_ago: '2 hours ago', text: 'New emergency shelter activated in Tura', type: 'shelter' },
    { time_ago: '3 hours ago', text: 'Landslide cleared on NH-6 corridor', type: 'clearance' },
    { time_ago: '4 hours ago', text: 'Fuel resupply convoy completed in Aizawl', type: 'resupply' }
  ];

  const aiSummary = overview?.ai_summary ||
    'Heavy rainfall is expected in upper Assam over the next 24 hours. 3 missions are at risk due to possible road closures. Consider pre-positioning supplies in Sonitpur and Tura.';

  return (
    <div className={`flex-1 min-h-0 overflow-y-auto px-5 py-4 lg:px-6 transition-colors ${
      isDark ? 'bg-[var(--color-dark-paper)] text-[var(--color-dark-ink)]' : 'bg-[var(--color-paper)] text-slate-800'
    }`}>
      {notification && (
        <div className="fixed right-6 top-20 z-50 flex items-center gap-2 rounded-lg border border-emerald-400/40 bg-emerald-950/90 text-emerald-200 px-4 py-3 text-xs shadow-xl backdrop-blur-md">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Hero Header */}
      <div
        className={`relative -mx-5 -mt-4 mb-4 min-h-[120px] overflow-hidden border-b px-5 pt-4 lg:-mx-6 lg:px-7 rounded-b-xl shadow-xs transition-colors ${
          isDark 
            ? 'border-[var(--color-dark-rule)] text-[var(--color-dark-ink)]'
            : 'border-[var(--color-rule)] text-slate-900 bg-gradient-to-r from-sky-50 via-white to-sky-50/50'
        }`}
        style={isDark ? {
          backgroundImage: "linear-gradient(90deg,rgba(3,18,27,.97),rgba(3,18,27,.84),rgba(3,18,27,.22)),url('/images/hero-bg-mountains.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : undefined}
      >
        <p className={`text-[11px] font-bold tracking-[.18em] ${isDark ? 'text-[#ead5a8]' : 'text-[var(--primary)]'}`}>
          COMMAND CENTER
        </p>
        <h1 className={`font-serif-display text-[32px] md:text-[42px] leading-none tracking-[-.025em] ${
          isDark ? 'text-[var(--color-dark-ink)]' : 'text-slate-900'
        }`}>
          Situation Awareness. Faster Decisions.
        </h1>
        <p className={`mt-2 text-sm font-medium ${isDark ? 'text-[var(--color-dark-muted)]' : 'text-slate-600'}`}>
          Real-time intelligence for a safer, stronger North East.
        </p>
        <p className={`absolute right-9 top-6 hidden text-center font-serif-display text-[15px] italic leading-tight xl:block ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}>
          “Resilient People.<br />Stronger Communities.<br />A Safer Tomorrow.”<br />
          <span className={`not-italic text-[11px] font-sans ${isDark ? 'text-[#ead5a8]' : 'text-[var(--primary)] font-medium'}`}>
            — Government of India
          </span>
        </p>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        {metrics.map(([IconComponent, value, label, delta, color]) => (
          <div 
            key={label} 
            className={`flex h-[74px] items-center gap-3 rounded-md border px-3.5 transition-all ${
              isDark 
                ? 'border-[var(--color-dark-rule)] bg-[var(--color-dark-surface)] text-white shadow-sm'
                : 'border-[var(--color-rule)] bg-white text-slate-800 shadow-2xs hover:border-[var(--primary)]'
            }`}
          >
            <IconComponent className="h-9 w-9 shrink-0" style={{ color }} />
            <div>
              <div className="flex items-center gap-2">
                <b className={`font-serif-display text-[22px] leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</b>
                {delta && <em className="text-[11px] font-bold not-italic text-[#43e99e]">{delta}</em>}
              </div>
              <p className={`mt-1 text-[11px] ${isDark ? 'text-[#d4dfe1]' : 'text-slate-500'}`}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main 3-Column Layout */}
      <div className="mt-4 grid grid-cols-1 gap-3.5 xl:grid-cols-[.95fr_1.25fr_1.12fr]">
        {/* Active Incidents */}
        <Panel title="Active Incidents" action="View All" go={() => onNavigateToTab?.('map')} isDark={isDark}>
          <div className={`divide-y ${isDark ? 'divide-[var(--color-dark-rule)]' : 'divide-slate-100'}`}>
            {incidentList.map((incident) => {
              const severity = incident.severity || 'LOW';
              const isCritical = severity === 'CRITICAL';
              const isHighOrMed = severity === 'HIGH' || severity === 'MEDIUM';
              const locName = incident.location_name || (incident.location ? `${incident.location.lat}, ${incident.location.lng}` : 'North East Region');
              const impactStatus = incident.impact_status || (isCritical ? 'Road Blocked' : isHighOrMed ? 'High Risk' : 'Monitoring');

              return (
                <button
                  onClick={() => handleSelectIncident(incident)}
                  key={incident.id}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-white/[.04]' : 'hover:bg-slate-50'
                  }`}
                >
                  <i className={`h-[52px] w-1 rounded-full shrink-0 ${isCritical ? 'bg-[#ff4e5d]' : isHighOrMed ? 'bg-[#ffc050]' : 'bg-[#44e59b]'}`} />
                  <span className="h-[52px] w-[76px] shrink-0 rounded bg-[url('/images/road-valley-bg.jpg')] bg-cover bg-center shadow-xs" />
                  <span className="min-w-0 flex-1">
                    <b className={`block truncate text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {incident.type || incident.description}
                    </b>
                    <small className={`block truncate text-[10px] ${isDark ? 'text-[var(--color-dark-muted)]' : 'text-slate-500'}`}>
                      {locName}
                    </small>
                    <small className="block truncate text-[10px] mt-0.5">
                      {incident.time_ago || 'Recent'} ·{' '}
                      <em className={isCritical || isHighOrMed ? 'not-italic font-medium text-rose-500' : 'not-italic font-medium text-emerald-500'}>
                        {impactStatus}
                      </em>
                    </small>
                  </span>
                  <em className={`rounded-md border px-2 py-0.5 text-[10px] not-italic font-semibold shrink-0 ${
                    isCritical
                      ? 'border-rose-500/40 bg-rose-500/10 text-rose-500'
                      : isHighOrMed
                      ? 'border-amber-500/40 bg-amber-500/10 text-amber-600'
                      : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600'
                  }`}>
                    {severity}
                  </em>
                </button>
              );
            })}
          </div>
        </Panel>

        {/* Live Overview Map */}
        <Panel
          title="North Eastern Region - Live Overview"
          isDark={isDark}
          right={
            <div className="relative">
              <button
                onClick={() => setShowLayerMenu(!showLayerMenu)}
                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                  isDark 
                    ? 'border-[#244252] bg-[#081e2b] text-slate-200 hover:bg-[#112d3e]' 
                    : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Map Layers <ChevronDown className="h-3 w-3" />
              </button>
              {showLayerMenu && (
                <div className={`absolute right-0 top-full z-50 mt-1.5 w-40 rounded-xl border p-2.5 text-xs shadow-2xl space-y-1.5 backdrop-blur-md ${
                  isDark 
                    ? 'border-[var(--color-dark-rule)] bg-[var(--color-dark-surface)] text-slate-200'
                    : 'border-slate-200 bg-white text-slate-800'
                }`}>
                  {Object.entries(activeLayers).map(([key, val]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer capitalize text-xs">
                      <input
                        type="checkbox"
                        checked={val}
                        onChange={(e) => setActiveLayers({ ...activeLayers, [key]: e.target.checked })}
                        className="rounded border-slate-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                      />
                      <span>{key}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          }
        >
          <div className="h-[304px]">
            <InteractiveMap
              incidents={incidentList}
              missions={missions}
              warehouses={warehouses}
              shelters={shelters}
              activeLayers={activeLayers}
              centerLat={25.7}
              centerLng={92.8}
              zoomLevel={7}
              height="100%"
              isDark={isDark}
              onSelectEntity={(e) => e.type === 'incident' && handleSelectIncident(e.data)}
            />
          </div>
          <div className={`flex h-[36px] items-center justify-center gap-4 border-t text-[11px] font-medium ${
            isDark ? 'border-[var(--color-dark-rule)] text-slate-300' : 'border-slate-200 text-slate-600 bg-slate-50/50'
          }`}>
            <Dot c="#ff4b55" t="Incident" />
            <Dot c="#40e89d" t="Mission" />
            <Dot c="#4daeff" t="Shelter" />
            <Dot c="#b47cff" t="Warehouse" />
            <Dot c="#ffc65c" t="At-Risk Area" />
          </div>
        </Panel>

        {/* Priority Actions */}
        <Panel
          title="Priority Actions"
          action="View All"
          isDark={isDark}
          badge={priorityActionsList.length > 0 ? String(priorityActionsList.length) : undefined}
          go={() => onNavigateToTab?.('replanning')}
        >
          <div className={`divide-y ${isDark ? 'divide-[var(--color-dark-rule)]' : 'divide-slate-100'}`}>
            {priorityActionsList.length > 0 ? (
              priorityActionsList.slice(0, 5).map((action, idx) => {
                const borderColors = ['#ff515c', '#ffbe52', '#bb7aff', '#58bafa', '#4fe69c'];
                const itemColor = borderColors[idx % borderColors.length];

                return (
                  <div
                    key={action.id || action.title}
                    className={`flex min-h-[64px] items-center gap-3 border-l-[3px] px-3.5 py-2 transition-all ${
                      isDark ? 'hover:bg-white/[.02]' : 'hover:bg-slate-50'
                    }`}
                    style={{ borderLeftColor: itemColor }}
                  >
                    <div className="min-w-0 flex-1">
                      <b className={`block truncate text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {action.title}
                      </b>
                      <p className={`truncate text-[11px] ${isDark ? 'text-[var(--color-dark-muted)]' : 'text-slate-500'}`}>
                        {action.subtitle}
                      </p>
                      <small className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                        {action.time_ago}
                      </small>
                    </div>
                    <button
                      onClick={() => handleExecuteAction(action)}
                      className="rounded-lg border border-amber-500/60 bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-300 hover:bg-amber-500/25 transition-all cursor-pointer shrink-0 active:scale-95"
                    >
                      {action.button_text}
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="flex h-[180px] flex-col items-center justify-center gap-2 px-4 text-center text-slate-400">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                <b className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>All Priority Actions Addressed</b>
                <p className="text-xs">No urgent pending actions in queue.</p>
              </div>
            )}
          </div>
        </Panel>
      </div>

      {/* Bottom 4-Column Grid */}
      <div className="mt-3.5 grid grid-cols-1 gap-3.5 xl:grid-cols-[1fr_1.05fr_1.25fr_1.15fr]">
        {/* People at Risk */}
        <Panel title="People at Risk" isDark={isDark}>
          <div className="px-4 py-3">
            <div className="mb-3 flex items-end gap-3">
              <Users className="h-7 w-7 text-[var(--primary)]" />
              <span>
                <b className={`font-serif-display text-[21px] leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {peopleAffected}
                </b>
                <em className="ml-2.5 text-xs font-bold not-italic text-emerald-500">
                  {overview?.kpis?.people_affected_delta || '↑ 12%'}
                </em>
                <small className={`block text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Across 12 districts</small>
              </span>
            </div>
            <div className="space-y-2">
              {peopleAtRisk.map((item) => (
                <div className="flex items-center gap-2 text-xs" key={item.state}>
                  <span className={`w-28 truncate font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {item.state}
                  </span>
                  <span className={`h-2 flex-1 rounded-full overflow-hidden ${isDark ? 'bg-[var(--color-dark-raised)]' : 'bg-slate-200'}`}>
                    <i
                      className="block h-full rounded-full bg-rose-500 transition-all duration-500"
                      style={{ width: `${Math.min(item.pct, 100)}%` }}
                    />
                  </span>
                  <span className={`w-12 text-right font-semibold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {item.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        {/* Mission Status */}
        <Panel title="Mission Status" isDark={isDark}>
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            {(() => {
              const totalSum = (missionStatus.in_transit + missionStatus.at_risk + missionStatus.delayed + missionStatus.completed + missionStatus.planned) || 1;
              const p1 = (missionStatus.in_transit / totalSum) * 100;
              const p2 = p1 + (missionStatus.at_risk / totalSum) * 100;
              const p3 = p2 + (missionStatus.delayed / totalSum) * 100;
              const p4 = p3 + (missionStatus.completed / totalSum) * 100;
              const conicBg = `conic-gradient(#49e99f 0% ${p1}%, #ff4f58 ${p1}% ${p2}%, #ffc758 ${p2}% ${p3}%, #53b7fa ${p3}% ${p4}%, #b4bed0 ${p4}% 100%)`;

              return (
                <div
                  className="relative flex aspect-square h-[116px] w-[116px] min-h-[116px] min-w-[116px] shrink-0 items-center justify-center rounded-full shadow-inner"
                  style={{ background: conicBg }}
                >
                  <div className={`flex aspect-square h-[72px] w-[72px] min-h-[72px] min-w-[72px] shrink-0 flex-col items-center justify-center rounded-full text-center ${
                    isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white shadow-xs'
                  }`}>
                    <b className={`font-serif-display text-[21px] leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {overview?.kpis?.active_missions || 8}
                    </b>
                    <small className={`mt-0.5 text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Missions
                    </small>
                  </div>
                </div>
              );
            })()}
            <div className="space-y-1.5 text-xs min-w-0 flex-1 pl-1">
              {[
                ['#49e99f', 'In Transit', missionStatus.in_transit],
                ['#ff4f58', 'At Risk', missionStatus.at_risk],
                ['#ffc758', 'Delayed', missionStatus.delayed],
                ['#53b7fa', 'Completed', missionStatus.completed],
                ['#b4bed0', 'Planned', missionStatus.planned]
              ].map(([color, statusName, count]) => (
                <div className="flex items-center gap-2" key={statusName as string}>
                  <i className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: color as string }} />
                  <span className={`flex-1 truncate ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{statusName}</span>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        {/* Supply Delivery Progress */}
        <Panel title="Supply Delivery Progress" isDark={isDark}>
          <div className="px-4 py-3">
            <div className="mb-3 flex items-center gap-3">
              <Package className="h-7 w-7 text-[#ffe1a1]" />
              <b className={`font-serif-display text-[19px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {supplyDelivery.overall_delivered_tons.toLocaleString()} / {supplyDelivery.overall_target_tons.toLocaleString()}{' '}
                <small className={`font-sans text-[11px] ${isDark ? 'text-[var(--color-dark-muted)]' : 'text-slate-500'}`}>tons</small>
              </b>
              <span className="ml-auto text-[11px] font-bold text-[#43e99e]">{supplyDelivery.overall_pct}%</span>
            </div>
            <div className="space-y-2">
              {supplyDelivery.categories.map((cat, idx) => {
                const progColors = ['#49e99f', '#4ebafa', '#ff5058', '#ffc758', '#b47cff'];
                const c = progColors[idx % progColors.length];
                return (
                  <div className="flex items-center gap-2 text-[10px]" key={cat.name}>
                    <span className={`w-[67px] truncate ${isDark ? 'text-[#d4dfe1]' : 'text-slate-600'}`}>{cat.name}</span>
                    <span className={`h-2 flex-1 rounded overflow-hidden ${isDark ? 'bg-[var(--color-dark-raised)]' : 'bg-slate-200'}`}>
                      <i
                        className="block h-full rounded transition-all duration-500"
                        style={{ width: `${Math.min(cat.progress_pct, 100)}%`, background: c }}
                      />
                    </span>
                    <span className={`w-7 text-right font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{cat.progress_pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Panel>

        {/* Recent Updates */}
        <Panel title="Recent Updates" action="View All" go={() => onNavigateToTab?.('map')} isDark={isDark}>
          <div className="px-4 py-3 space-y-2.5">
            {recentUpdates.map((update, idx) => {
              const dotColors = ['#4ee79f', '#54b9fa', '#ff535d', '#b8e87f', '#ffc65b'];
              const c = dotColors[idx % dotColors.length];
              return (
                <div className="flex items-start gap-2.5 text-xs" key={update.text + idx}>
                  <i className="mt-1.5 h-2 w-2 rounded-full shrink-0" style={{ background: c }} />
                  <span className={`w-16 shrink-0 text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {update.time_ago}
                  </span>
                  <span className={`truncate flex-1 font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {update.text}
                  </span>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      {/* AI Summary Banner */}
      <button
        onClick={() => onNavigateToTab?.('replanning')}
        className={`mt-4 flex w-full items-center gap-4 rounded-xl border p-3.5 text-left transition-all cursor-pointer shadow-xs ${
          isDark 
            ? 'border-[#7049a4] bg-gradient-to-r from-[#171232] to-[#0b1931] text-[var(--color-dark-ink)] hover:brightness-110'
            : 'border-purple-200 bg-gradient-to-r from-purple-50 via-sky-50 to-white text-slate-900 hover:border-purple-300'
        }`}
      >
        <Sparkles className="h-6 w-6 text-purple-500 shrink-0" />
        <b className={`font-serif-display text-[17px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
          AI Summary
        </b>
        <span className={`flex-1 text-xs ${isDark ? 'text-[#d8e0e6]' : 'text-slate-600'}`}>
          {aiSummary}
        </span>
        <span className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold shrink-0 ${
          isDark 
            ? 'border-[#8158ad] text-[#ead5a8] bg-[#8158ad]/20' 
            : 'border-purple-300 text-purple-800 bg-white shadow-2xs'
        }`}>
          View Detailed Analysis <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </button>

      {/* Incident Detail Modal */}
      <IncidentDetailModal
        incident={selectedIncident}
        isOpen={!!selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onNavigateToTab={onNavigateToTab || (() => {})}
        onStateUpdated={loadData}
      />
    </div>
  );
}

function Panel({
  title,
  action,
  badge,
  go,
  right,
  isDark = false,
  children
}: {
  title: string;
  action?: string;
  badge?: string;
  go?: () => void;
  right?: React.ReactNode;
  isDark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`overflow-hidden rounded-xl border transition-all ${
      isDark 
        ? 'border-[var(--color-dark-rule)] bg-[var(--color-dark-surface)] shadow-md text-slate-200'
        : 'border-[var(--color-rule)] bg-white shadow-2xs text-slate-800'
    }`}>
      <header className={`flex h-[42px] items-center justify-between border-b px-4 transition-colors ${
        isDark 
          ? 'border-[var(--color-dark-rule)] text-slate-200 bg-[#081e2b]/40'
          : 'border-slate-100 text-slate-900 bg-slate-50/70'
      }`}>
        <h2 className={`font-serif-display text-[16px] flex items-center font-semibold ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          {title}
          {badge && (
            <i className="ml-2 inline-grid h-4 min-w-[16px] px-1 place-items-center rounded-full bg-rose-500 font-sans text-[10px] font-bold text-white not-italic">
              {badge}
            </i>
          )}
        </h2>
        {right ||
          (action && (
            <button onClick={go} className={`flex items-center gap-1 text-xs font-semibold hover:underline cursor-pointer ${
              isDark ? 'text-[var(--primary)]' : 'text-[var(--primary)]'
            }`}>
              {action}
              <ArrowRight className="h-3 w-3" />
            </button>
          ))}
      </header>
      {children}
    </section>
  );
}

function Dot({ c, t }: { c: string; t: string }) {
  return (
    <span className="flex items-center gap-1.5 font-medium">
      <i className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: c }} />
      {t}
    </span>
  );
}
