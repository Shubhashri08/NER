import React, { useEffect, useState } from 'react';
import { 
  AlertTriangle, 
  Home, 
  Truck, 
  Building2, 
  ArrowUpRight, 
  CloudRain, 
  ChevronDown, 
  Check, 
  Clock, 
  Users, 
  Lock, 
  ArrowRight,
  ShieldAlert,
  Layers,
  MapPin,
  Search
} from 'lucide-react';
import { InteractiveMap } from './InteractiveMap';
import { disasterApi } from '../services/api';
import type { 
  IncidentRecord, 
  ShelterRecord, 
  WarehouseRecord, 
  VehicleRecord, 
  MissionRecord, 
  RoadSegmentRecord, 
  DashboardOverview 
} from '../services/api';

interface LiveMapViewProps {
  onNavigateToTab?: (tab: string) => void;
  initialSelectedIncidentId?: string;
  isDark?: boolean;
}

interface RegionalLocation {
  id: string;
  title: string;
  state: string;
  impact: string;
  impactColor: string;
  coordinates: string;
  lat: number;
  lng: number;
  incidentType: string;
  time: string;
  status: string;
  peopleAffected: string;
  access: string;
  affectedHabitations: string;
  image: string;
}

const defaultRegionalLocations: RegionalLocation[] = [
  {
    id: 'LOC-DIMA-HASAO',
    title: 'Dima Hasao',
    state: 'Assam',
    impact: 'Critical Impact',
    impactColor: 'text-rose-400 bg-rose-500/20 border-rose-500/30',
    coordinates: '25.4000° N, 93.2000° E',
    lat: 25.40,
    lng: 93.20,
    incidentType: 'Landslide on NH-27',
    time: '2 hours ago',
    status: 'Road Blocked',
    peopleAffected: '~ 5,300',
    access: 'Limited',
    affectedHabitations: '3',
    image: '/images/road-valley-bg.jpg',
  },
  {
    id: 'LOC-TURA',
    title: 'West Garo Hills (Tura)',
    state: 'Meghalaya',
    impact: 'High Impact',
    impactColor: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
    coordinates: '25.5200° N, 90.2200° E',
    lat: 25.52,
    lng: 90.22,
    incidentType: 'Bridge Damage & Flash Flood',
    time: '4 hours ago',
    status: 'Limited Access',
    peopleAffected: '~ 3,200',
    access: 'Caution',
    affectedHabitations: '2',
    image: '/images/hero-bg-mountains.jpg',
  },
  {
    id: 'LOC-SONITPUR',
    title: 'Sonitpur',
    state: 'Assam',
    impact: 'High Impact',
    impactColor: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
    coordinates: '26.6500° N, 92.8000° E',
    lat: 26.65,
    lng: 92.80,
    incidentType: 'Flash Flooding',
    time: '4 hours ago',
    status: 'Multiple Villages Inundated',
    peopleAffected: '~ 8,400',
    access: 'Boats Only',
    affectedHabitations: '8',
    image: '/images/road-valley-bg.jpg',
  },
  {
    id: 'LOC-AIZAWL',
    title: 'Aizawl',
    state: 'Mizoram',
    impact: 'Medium Impact',
    impactColor: 'text-[var(--primary)] bg-[var(--primary)]/20 border-[var(--primary)]/30',
    coordinates: '23.7300° N, 92.7200° E',
    lat: 23.73,
    lng: 92.72,
    incidentType: 'Heavy Rainfall Alert',
    time: '8 hours ago',
    status: 'High Risk (140mm)',
    peopleAffected: '~ 2,100',
    access: 'Passable (4x4)',
    affectedHabitations: '1',
    image: '/images/globe-ner.jpg',
  },
  {
    id: 'LOC-JORHAT',
    title: 'Jorhat Logistics Hub',
    state: 'Assam',
    impact: 'Fleet Staging',
    impactColor: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
    coordinates: '26.7500° N, 94.2200° E',
    lat: 26.75,
    lng: 94.22,
    incidentType: 'Logistics Deployment Base',
    time: 'Active Depot',
    status: 'Operational',
    peopleAffected: 'Fleet Base',
    access: 'Open',
    affectedHabitations: 'None',
    image: '/images/globe-ner.jpg',
  },
  {
    id: 'LOC-GUWAHATI',
    title: 'Guwahati Central Transshipment Base',
    state: 'Assam',
    impact: 'Major Base',
    impactColor: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
    coordinates: '26.1800° N, 91.7400° E',
    lat: 26.18,
    lng: 91.74,
    incidentType: 'Central Relief Depot',
    time: 'Active Depot',
    status: 'Full Readiness (50k tons)',
    peopleAffected: 'State Hub',
    access: 'All Weather',
    affectedHabitations: 'None',
    image: '/images/globe-ner.jpg',
  },
  {
    id: 'LOC-SILCHAR',
    title: 'Silchar Forward Staging Depot',
    state: 'Assam',
    impact: 'Active Hub',
    impactColor: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
    coordinates: '24.8300° N, 92.7900° E',
    lat: 24.83,
    lng: 92.79,
    incidentType: 'Corridor Transit Depot',
    time: 'Active Depot',
    status: 'Dispatches Ongoing',
    peopleAffected: 'Cachar Hub',
    access: 'Open',
    affectedHabitations: 'None',
    image: '/images/hero-bg-mountains.jpg',
  },
  {
    id: 'LOC-MAIBONG',
    title: 'Maibong Higher Secondary Safe Haven',
    state: 'Assam',
    impact: 'Shelter Active',
    impactColor: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
    coordinates: '25.3000° N, 93.1500° E',
    lat: 25.30,
    lng: 93.15,
    incidentType: 'Emergency Shelter Post',
    time: 'Active Shelter',
    status: '320 / 800 Occupied',
    peopleAffected: '320 sheltered',
    access: 'Passable',
    affectedHabitations: '2',
    image: '/images/road-valley-bg.jpg',
  },
  {
    id: 'LOC-ITANAGAR',
    title: 'Itanagar Dikrong Patrol',
    state: 'Arunachal Pradesh',
    impact: 'Low Impact',
    impactColor: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
    coordinates: '27.0800° N, 93.6000° E',
    lat: 27.08,
    lng: 93.60,
    incidentType: 'River Overflow Monitoring',
    time: '11 hours ago',
    status: 'Monitoring',
    peopleAffected: '~ 1,400',
    access: 'Open',
    affectedHabitations: '1',
    image: '/images/hero-bg-mountains.jpg',
  },
  {
    id: 'LOC-MOKOKCHUNG',
    title: 'Mokokchung',
    state: 'Nagaland',
    impact: 'High Impact',
    impactColor: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
    coordinates: '26.3200° N, 94.5200° E',
    lat: 26.32,
    lng: 94.52,
    incidentType: 'Flash Flood Watch',
    time: '5 hours ago',
    status: 'Hill Inundation',
    peopleAffected: '~ 2,800',
    access: 'Limited Access',
    affectedHabitations: '2',
    image: '/images/road-valley-bg.jpg',
  },
  {
    id: 'LOC-MANGAN',
    title: 'Mangan (North Sikkim)',
    state: 'Sikkim',
    impact: 'Critical Impact',
    impactColor: 'text-rose-400 bg-rose-500/20 border-rose-500/30',
    coordinates: '27.5100° N, 88.5300° E',
    lat: 27.51,
    lng: 88.53,
    incidentType: 'Glacial Runoff & Landslide',
    time: '3 hours ago',
    status: 'Debris Flow on NH-10',
    peopleAffected: '~ 1,800',
    access: 'Cut Off (Air Only)',
    affectedHabitations: '4',
    image: '/images/hero-bg-mountains.jpg',
  },
  {
    id: 'LOC-CHURACHANDPUR',
    title: 'Churachandpur',
    state: 'Manipur',
    impact: 'Medium Impact',
    impactColor: 'text-[var(--primary)] bg-[var(--primary)]/20 border-[var(--primary)]/30',
    coordinates: '24.3300° N, 93.6700° E',
    lat: 24.33,
    lng: 93.67,
    incidentType: 'Valley Inundation Alert',
    time: '7 hours ago',
    status: 'Valley Waterlogging',
    peopleAffected: '~ 3,600',
    access: 'Passable (4x4)',
    affectedHabitations: '3',
    image: '/images/road-valley-bg.jpg',
  }
];

export const LiveMapView: React.FC<LiveMapViewProps> = ({
  onNavigateToTab,
  isDark = false,
}) => {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [shelters, setShelters] = useState<ShelterRecord[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseRecord[]>([]);
  const [vehicles, setVehicles] = useState<VehicleRecord[]>([]);
  const [missions, setMissions] = useState<MissionRecord[]>([]);
  const [roads, setRoads] = useState<RoadSegmentRecord[]>([]);

  // Map center and zoom
  const [mapCenter, setMapCenter] = useState({ lat: 25.8, lng: 93.4, zoom: 7 });

  // Layer visibility toggles
  const [layers, setLayers] = useState({
    incidents: true,
    shelters: true,
    warehouses: true,
    vehicles: true,
    missions: true,
    roadStatus: true,
    weather: true,
    population: false,
    habitations: false,
    adminBoundaries: false,
  });

  // Active top tab in side panel: 'layers' | 'locations'
  const [panelTab, setPanelTab] = useState<'layers' | 'locations'>('layers');

  // Search query for locations tab
  const [searchQuery, setSearchQuery] = useState('');

  // Legend collapsible state
  const [legendOpen, setLegendOpen] = useState<boolean>(true);

  // Selected location details state
  const [selectedLocation, setSelectedLocation] = useState<RegionalLocation>(defaultRegionalLocations[0]);

  useEffect(() => {
    const fetchLiveMapData = async () => {
      try {
        const [ovRes, incRes, shRes, whRes, vehRes, misRes, rdRes] = await Promise.all([
          disasterApi.getDashboardOverview().catch(() => ({ data: null })),
          disasterApi.getIncidents().catch(() => ({ data: { items: [] } })),
          disasterApi.getShelters().catch(() => ({ data: { shelters: [], items: [] } })),
          disasterApi.getWarehouses().catch(() => ({ data: { items: [] } })),
          disasterApi.getVehicles().catch(() => ({ data: { items: [] } })),
          disasterApi.getMissions().catch(() => ({ data: { items: [] } })),
          disasterApi.getRoadsStatus().catch(() => ({ data: [] })),
        ]);

        if (ovRes.data) setOverview(ovRes.data);
        if (incRes.data?.items?.length) setIncidents(incRes.data.items);
        const shelterList = shRes.data?.shelters || shRes.data?.items || [];
        if (shelterList.length) setShelters(shelterList);
        if (whRes.data?.items?.length) setWarehouses(whRes.data.items);
        if (vehRes.data?.items?.length) setVehicles(vehRes.data.items);
        if (misRes.data?.items?.length) setMissions(misRes.data.items);
        if (Array.isArray(rdRes.data)) setRoads(rdRes.data);
      } catch (err) {
        console.warn('Live map data fetch fallback:', err);
      }
    };

    fetchLiveMapData();
  }, []);

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const handleToggleAllLayers = () => {
    const anyActive = Object.values(layers).some(v => v);
    const nextState = !anyActive;
    setLayers({
      incidents: nextState,
      shelters: nextState,
      warehouses: nextState,
      vehicles: nextState,
      missions: nextState,
      roadStatus: nextState,
      weather: nextState,
      population: nextState,
      habitations: nextState,
      adminBoundaries: nextState,
    });
  };

  const handleEntitySelect = (entity: { type: string; data: any }) => {
    if (entity.type === 'incident') {
      const inc = entity.data;
      const matched = defaultRegionalLocations.find(l => l.title.toLowerCase().includes((inc.title || inc.location_name || '').toLowerCase()));
      if (matched) {
        setSelectedLocation(matched);
      } else {
        setSelectedLocation({
          id: inc.id,
          title: inc.title || inc.location_name?.split(',')[0] || inc.type || 'Incident Zone',
          state: inc.location_name?.split(',')[1]?.trim() || 'Assam',
          impact: inc.severity === 'CRITICAL' ? 'Critical Impact' : 'High Impact',
          impactColor: inc.severity === 'CRITICAL' ? 'text-rose-400 bg-rose-500/20 border-rose-500/30' : 'text-amber-400 bg-amber-500/20 border-amber-500/30',
          coordinates: `${inc.lat?.toFixed(4) || '25.4000'}° N, ${inc.lng?.toFixed(4) || '93.2000'}° E`,
          lat: inc.lat || 25.4,
          lng: inc.lng || 93.2,
          incidentType: inc.subtitle || inc.type || 'Landslide',
          time: inc.time_ago || '2 hours ago',
          status: inc.impact_status || 'Road Blocked',
          peopleAffected: `~ ${(inc.affected_population || 2400).toLocaleString()}`,
          access: 'Limited',
          affectedHabitations: String(inc.affected_habitations?.length || 3),
          image: '/images/road-valley-bg.jpg',
        });
      }
    } else if (entity.type === 'shelter') {
      const sh = entity.data;
      setSelectedLocation({
        id: sh.id || 'SH-01',
        title: sh.name || 'Emergency Shelter Post',
        state: 'Assam',
        impact: 'Shelter Operational',
        impactColor: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
        coordinates: `${sh.lat?.toFixed(4) || '25.1850'}° N, ${sh.lng?.toFixed(4) || '93.0250'}° E`,
        lat: sh.lat || 25.185,
        lng: sh.lng || 93.025,
        incidentType: 'Evacuation Shelter Facility',
        time: 'Active Shelter',
        status: `${sh.occupancy || 480} / ${sh.capacity || 1200} Occupied`,
        peopleAffected: `${sh.occupancy || 480} Sheltered`,
        access: 'Ready',
        affectedHabitations: 'Direct Shelter Refuge',
        image: '/images/road-valley-bg.jpg',
      });
    } else if (entity.type === 'warehouse') {
      const wh = entity.data;
      setSelectedLocation({
        id: wh.id || 'WH-01',
        title: wh.name || 'Regional Transshipment Base',
        state: 'Assam',
        impact: 'Supply Base',
        impactColor: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
        coordinates: `${wh.lat?.toFixed(4) || '26.1800'}° N, ${wh.lng?.toFixed(4) || '91.7400'}° E`,
        lat: wh.lat || 26.18,
        lng: wh.lng || 91.74,
        incidentType: 'Warehouse & Food Reserve Depot',
        time: 'Active Operations',
        status: 'Operational Base',
        peopleAffected: 'Stock Hub',
        access: 'Open Corridor',
        affectedHabitations: 'Regional Distribution',
        image: '/images/globe-ner.jpg',
      });
    }
  };

  const handleLocationClick = (loc: RegionalLocation) => {
    setSelectedLocation(loc);
    setMapCenter({ lat: loc.lat, lng: loc.lng, zoom: 9 });
  };

  const filteredLocations = defaultRegionalLocations.filter(loc => 
    loc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.incidentType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden font-sans select-none px-6 py-3 justify-between gap-2.5 transition-colors ${
      isDark ? 'bg-[var(--color-dark-paper)] text-slate-100' : 'bg-[var(--color-paper)] text-slate-800'
    }`}>
      
      {/* 1. Header Area (Headline & 4 Stat Cards) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 shrink-0">
        {/* Left Headline */}
        <div>
          <span className={`text-[10px] font-bold tracking-widest uppercase block mb-0.5 ${
            isDark ? 'text-[#72879D]' : 'text-[var(--primary)]'
          }`}>
            LIVE MAP
          </span>
          <h1 className={`font-serif-display text-2xl lg:text-[28px] font-normal tracking-wide leading-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            See the Ground. Act with Clarity.
          </h1>
          <p className={`text-xs mt-0.5 max-w-xl font-normal leading-tight ${
            isDark ? 'text-[var(--color-dark-muted)]' : 'text-slate-600'
          }`}>
            Real-time view of incidents, resources, infrastructure and operations across the North Eastern Region.
          </p>
        </div>

        {/* Right: 4 Stat Cards */}
        <div className="flex items-center gap-2.5 overflow-x-auto shrink-0">
          {/* 1. Active Incidents (Red) */}
          <div className={`flex items-center gap-3 border rounded-lg px-4 py-2 min-w-[135px] shadow-sm transition-colors ${
            isDark ? 'bg-[var(--color-dark-surface)] border-[var(--color-dark-rule)]' : 'bg-white border-[var(--color-rule)]'
          }`}>
            <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-500 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className={`text-lg font-bold leading-tight font-sans ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {overview?.kpis?.active_incidents || (incidents.length > 0 ? incidents.length : 12)}
              </span>
              <span className={`text-[10px] font-medium leading-none mt-0.5 ${
                isDark ? 'text-[var(--color-dark-muted)]' : 'text-slate-500'
              }`}>Active Incidents</span>
            </div>
          </div>

          {/* 2. Shelters Open (Purple) */}
          <div className={`flex items-center gap-3 border rounded-lg px-4 py-2 min-w-[135px] shadow-sm transition-colors ${
            isDark ? 'bg-[var(--color-dark-surface)] border-[var(--color-dark-rule)]' : 'bg-white border-[var(--color-rule)]'
          }`}>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <Home className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className={`text-lg font-bold leading-tight font-sans ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {overview?.kpis?.operational_shelters || (shelters.length > 0 ? shelters.length : 28)}
              </span>
              <span className={`text-[10px] font-medium leading-none mt-0.5 ${
                isDark ? 'text-[var(--color-dark-muted)]' : 'text-slate-500'
              }`}>Shelters Open</span>
            </div>
          </div>

          {/* 3. Vehicles Deployed (Blue) */}
          <div className={`flex items-center gap-3 border rounded-lg px-4 py-2 min-w-[140px] shadow-sm transition-colors ${
            isDark ? 'bg-[var(--color-dark-surface)] border-[var(--color-dark-rule)]' : 'bg-white border-[var(--color-rule)]'
          }`}>
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/20 border border-[var(--primary)]/40 flex items-center justify-center text-[var(--primary)] shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className={`text-lg font-bold leading-tight font-sans ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {overview?.kpis?.vehicles_active || (vehicles.length > 0 ? vehicles.length : 42)}
              </span>
              <span className={`text-[10px] font-medium leading-none mt-0.5 ${
                isDark ? 'text-[var(--color-dark-muted)]' : 'text-slate-500'
              }`}>Vehicles Deployed</span>
            </div>
          </div>

          {/* 4. Blocked Roads (Slate) */}
          <div className={`flex items-center gap-3 border rounded-lg px-4 py-2 min-w-[135px] shadow-sm transition-colors ${
            isDark ? 'bg-[var(--color-dark-surface)] border-[var(--color-dark-rule)]' : 'bg-white border-[var(--color-rule)]'
          }`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              isDark ? 'bg-slate-700/40 border border-slate-600/40 text-slate-300' : 'bg-slate-100 border border-slate-200 text-slate-600'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className={`text-lg font-bold leading-tight font-sans ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {overview?.kpis?.blocked_roads_count || (roads.length > 0 ? roads.filter(r => r.status === 'BLOCKED').length : 5)}
              </span>
              <span className={`text-[10px] font-medium leading-none mt-0.5 ${
                isDark ? 'text-[var(--color-dark-muted)]' : 'text-slate-500'
              }`}>Blocked Roads</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter Toolbar Strip */}
      <div className={`py-1.5 border rounded-lg px-3 flex items-center justify-between gap-2 overflow-x-auto shrink-0 transition-colors ${
        isDark ? 'bg-[var(--color-dark-paper)] border-[var(--color-dark-rule)]' : 'bg-white border-[var(--color-rule)] shadow-xs'
      }`}>
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* All Layers Toggle */}
          <button 
            onClick={handleToggleAllLayers}
            className={`flex items-center gap-1.5 px-3 py-1 rounded border text-xs font-medium transition-colors cursor-pointer ${
              isDark 
                ? 'bg-[var(--color-dark-raised)] hover:bg-[#182B40] text-slate-200 border-[var(--color-dark-rule)]'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 opacity-70" />
            <span>All Layers</span>
          </button>

          {/* Incidents Toggle */}
          <button 
            onClick={() => toggleLayer('incidents')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded border text-xs font-medium transition-colors cursor-pointer ${
              layers.incidents 
                ? (isDark ? 'bg-[var(--color-dark-raised)] text-white border-[var(--color-dark-rule)]' : 'bg-rose-50 text-rose-800 border-rose-200 shadow-2xs font-semibold')
                : (isDark ? 'bg-[var(--color-dark-paper)] text-slate-400 border-transparent opacity-60' : 'bg-transparent text-slate-500 border-transparent opacity-70 hover:opacity-100')
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Incidents</span>
          </button>

          {/* Shelters Toggle */}
          <button 
            onClick={() => toggleLayer('shelters')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded border text-xs font-medium transition-colors cursor-pointer ${
              layers.shelters 
                ? (isDark ? 'bg-[var(--color-dark-raised)] text-white border-[var(--color-dark-rule)]' : 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-2xs font-semibold')
                : (isDark ? 'bg-[var(--color-dark-paper)] text-slate-400 border-transparent opacity-60' : 'bg-transparent text-slate-500 border-transparent opacity-70 hover:opacity-100')
            }`}
          >
            <Home className="w-3.5 h-3.5 text-emerald-500" />
            <span>Shelters</span>
          </button>

          {/* Warehouses Toggle */}
          <button 
            onClick={() => toggleLayer('warehouses')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded border text-xs font-medium transition-colors cursor-pointer ${
              layers.warehouses 
                ? (isDark ? 'bg-[var(--color-dark-raised)] text-white border-[var(--color-dark-rule)]' : 'bg-indigo-50 text-indigo-800 border-indigo-200 shadow-2xs font-semibold')
                : (isDark ? 'bg-[var(--color-dark-paper)] text-slate-400 border-transparent opacity-60' : 'bg-transparent text-slate-500 border-transparent opacity-70 hover:opacity-100')
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>Warehouses</span>
          </button>

          {/* Vehicles Toggle */}
          <button 
            onClick={() => toggleLayer('vehicles')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded border text-xs font-medium transition-colors cursor-pointer ${
              layers.vehicles 
                ? (isDark ? 'bg-[var(--color-dark-raised)] text-white border-[var(--color-dark-rule)]' : 'bg-[var(--secondary)] text-[var(--primary)] border-[var(--primary)] shadow-2xs font-semibold')
                : (isDark ? 'bg-[var(--color-dark-paper)] text-slate-400 border-transparent opacity-60' : 'bg-transparent text-slate-500 border-transparent opacity-70 hover:opacity-100')
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>Vehicles</span>
          </button>

          {/* Missions Toggle */}
          <button 
            onClick={() => toggleLayer('missions')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded border text-xs font-medium transition-colors cursor-pointer ${
              layers.missions 
                ? (isDark ? 'bg-[var(--color-dark-raised)] text-white border-[var(--color-dark-rule)]' : 'bg-amber-50 text-amber-800 border-amber-200 shadow-2xs font-semibold')
                : (isDark ? 'bg-[var(--color-dark-paper)] text-slate-400 border-transparent opacity-60' : 'bg-transparent text-slate-500 border-transparent opacity-70 hover:opacity-100')
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" />
            <span>Missions</span>
          </button>

          {/* Road Status Toggle */}
          <button 
            onClick={() => toggleLayer('roadStatus')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded border text-xs font-medium transition-colors cursor-pointer ${
              layers.roadStatus 
                ? (isDark ? 'bg-[var(--color-dark-raised)] text-white border-[var(--color-dark-rule)]' : 'bg-slate-100 text-slate-900 border-slate-300 shadow-2xs font-semibold')
                : (isDark ? 'bg-[var(--color-dark-paper)] text-slate-400 border-transparent opacity-60' : 'bg-transparent text-slate-500 border-transparent opacity-70 hover:opacity-100')
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Road Status</span>
          </button>

          {/* Weather Toggle */}
          <button 
            onClick={() => toggleLayer('weather')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded border text-xs font-medium transition-colors cursor-pointer ${
              layers.weather 
                ? (isDark ? 'bg-[#15273C] text-[var(--primary)] border-[var(--primary)]/40 shadow-sm' : 'bg-[var(--secondary)] text-[var(--primary)] border-[var(--primary)] shadow-2xs font-semibold')
                : (isDark ? 'bg-[var(--color-dark-paper)] text-slate-400 border-transparent opacity-60' : 'bg-transparent text-slate-500 border-transparent opacity-70 hover:opacity-100')
            }`}
          >
            <CloudRain className={`w-3.5 h-3.5 ${layers.weather ? 'text-[var(--primary)] animate-pulse' : 'opacity-70'}`} />
            <span>Weather</span>
          </button>
        </div>

        {/* Right Live Status indicator */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 border rounded text-xs font-medium shrink-0 ${
          isDark ? 'bg-[#101F2F] border-[#1C3048] text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
        }`}>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live (Real-time)</span>
        </div>
      </div>

      {/* 3. Center Section: Main Map & Right Layers Drawer */}
      <div className="flex-1 min-h-0 flex overflow-hidden relative gap-4">
        
        {/* Map View Container */}
        <div className={`flex-1 h-full min-h-0 rounded-xl overflow-hidden border relative shadow-md transition-colors ${
          isDark ? 'border-[var(--color-dark-raised)] bg-[var(--color-dark-paper)]' : 'border-[var(--color-rule)] bg-white'
        }`}>
          <InteractiveMap
            incidents={incidents}
            shelters={shelters}
            warehouses={warehouses}
            vehicles={vehicles}
            missions={missions}
            roads={roads}
            activeLayers={{
              incidents: layers.incidents,
              shelters: layers.shelters,
              warehouses: layers.warehouses,
              vehicles: layers.vehicles,
              missions: layers.missions,
              roads: layers.roadStatus,
              weather: layers.weather,
              boundaries: true,
            }}
            onSelectEntity={handleEntitySelect}
            centerLat={mapCenter.lat}
            centerLng={mapCenter.lng}
            zoomLevel={mapCenter.zoom}
            mapType="satellite"
            showControls={true}
            isDark={isDark}
          />
        </div>

        {/* Right Layer & Locations Side Panel */}
        <div className={`w-[280px] h-full min-h-0 border rounded-xl flex flex-col justify-between overflow-hidden shrink-0 shadow-lg backdrop-blur-md transition-colors ${
          isDark ? 'bg-[#0A131F]/95 border-[var(--color-dark-raised)]' : 'bg-white/95 border-[var(--color-rule)]'
        }`}>
          
          {/* Top Tabs: Layers | Locations */}
          <div className="flex flex-col min-h-0 overflow-hidden flex-1">
            <div className={`flex items-center border-b text-xs font-medium shrink-0 ${
              isDark ? 'border-[var(--color-dark-raised)]' : 'border-slate-200'
            }`}>
              <button
                onClick={() => setPanelTab('layers')}
                className={`flex-1 py-2.5 text-center transition-colors cursor-pointer border-b-2 ${
                  panelTab === 'layers'
                    ? (isDark ? 'border-[var(--primary)] text-white font-semibold bg-[#112032]/40' : 'border-[var(--primary)] text-[var(--primary)] font-semibold bg-[var(--secondary)]/50')
                    : (isDark ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-500 hover:text-slate-800')
                }`}
              >
                Layers
              </button>
              <button
                onClick={() => setPanelTab('locations')}
                className={`flex-1 py-2.5 text-center transition-colors cursor-pointer border-b-2 ${
                  panelTab === 'locations'
                    ? (isDark ? 'border-[var(--primary)] text-white font-semibold bg-[#112032]/40' : 'border-[var(--primary)] text-[var(--primary)] font-semibold bg-[var(--secondary)]/50')
                    : (isDark ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-500 hover:text-slate-800')
                }`}
              >
                Locations
              </button>
            </div>

            {/* TAB 1: LAYERS */}
            {panelTab === 'layers' && (
              <div className="py-2 px-3 flex flex-col gap-0.5 overflow-y-auto min-h-0 flex-1">
                {/* 1. Incidents */}
                <div 
                  onClick={() => toggleLayer('incidents')}
                  className={`flex items-center justify-between p-1.5 rounded text-xs transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-[var(--color-dark-surface)] text-slate-200' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center ${layers.incidents ? 'bg-emerald-600 text-white' : (isDark ? 'border border-slate-600' : 'border border-slate-300')}`}>
                      {layers.incidents && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Incidents</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isDark ? 'text-slate-400 bg-[var(--color-dark-surface)]' : 'text-slate-500 bg-slate-100'}`}>
                    {incidents.length > 0 ? incidents.length : 8}
                  </span>
                </div>

                {/* 2. Shelters */}
                <div 
                  onClick={() => toggleLayer('shelters')}
                  className={`flex items-center justify-between p-1.5 rounded text-xs transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-[var(--color-dark-surface)] text-slate-200' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center ${layers.shelters ? 'bg-emerald-600 text-white' : (isDark ? 'border border-slate-600' : 'border border-slate-300')}`}>
                      {layers.shelters && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <Home className="w-3.5 h-3.5 text-emerald-500" />
                    <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Shelters</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isDark ? 'text-slate-400 bg-[var(--color-dark-surface)]' : 'text-slate-500 bg-slate-100'}`}>
                    {shelters.length > 0 ? shelters.length : 5}
                  </span>
                </div>

                {/* 3. Warehouses */}
                <div 
                  onClick={() => toggleLayer('warehouses')}
                  className={`flex items-center justify-between p-1.5 rounded text-xs transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-[var(--color-dark-surface)] text-slate-200' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center ${layers.warehouses ? 'bg-emerald-600 text-white' : (isDark ? 'border border-slate-600' : 'border border-slate-300')}`}>
                      {layers.warehouses && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                    <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Warehouses</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isDark ? 'text-slate-400 bg-[var(--color-dark-surface)]' : 'text-slate-500 bg-slate-100'}`}>
                    {warehouses.length > 0 ? warehouses.length : 4}
                  </span>
                </div>

                {/* 4. Vehicles */}
                <div 
                  onClick={() => toggleLayer('vehicles')}
                  className={`flex items-center justify-between p-1.5 rounded text-xs transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-[var(--color-dark-surface)] text-slate-200' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center ${layers.vehicles ? 'bg-emerald-600 text-white' : (isDark ? 'border border-slate-600' : 'border border-slate-300')}`}>
                      {layers.vehicles && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <Truck className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Vehicles</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isDark ? 'text-slate-400 bg-[var(--color-dark-surface)]' : 'text-slate-500 bg-slate-100'}`}>
                    {vehicles.length >= 15 ? vehicles.length : 15}
                  </span>
                </div>

                {/* 5. Missions */}
                <div 
                  onClick={() => toggleLayer('missions')}
                  className={`flex items-center justify-between p-1.5 rounded text-xs transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-[var(--color-dark-surface)] text-slate-200' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center ${layers.missions ? 'bg-emerald-600 text-white' : (isDark ? 'border border-slate-600' : 'border border-slate-300')}`}>
                      {layers.missions && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" />
                    <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Missions</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isDark ? 'text-slate-400 bg-[var(--color-dark-surface)]' : 'text-slate-500 bg-slate-100'}`}>
                    {missions.length >= 6 ? missions.length : 6}
                  </span>
                </div>

                {/* 6. Road Status */}
                <div 
                  onClick={() => toggleLayer('roadStatus')}
                  className={`flex items-center justify-between p-1.5 rounded text-xs transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-[var(--color-dark-surface)] text-slate-200' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center ${layers.roadStatus ? 'bg-emerald-600 text-white' : (isDark ? 'border border-slate-600' : 'border border-slate-300')}`}>
                      {layers.roadStatus && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Road Status</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isDark ? 'text-slate-400 bg-[var(--color-dark-surface)]' : 'text-slate-500 bg-slate-100'}`}>
                    {roads.length > 0 ? roads.length : 5}
                  </span>
                </div>

                {/* 7. Weather (Rain) */}
                <div 
                  onClick={() => toggleLayer('weather')}
                  className={`flex items-center justify-between p-1.5 rounded text-xs transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-[var(--color-dark-surface)] text-slate-200' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center ${layers.weather ? 'bg-emerald-600 text-white' : (isDark ? 'border border-slate-600' : 'border border-slate-300')}`}>
                      {layers.weather && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <CloudRain className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Weather (Radar)</span>
                  </div>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                    layers.weather 
                      ? (isDark ? 'bg-[var(--primary)]/20 text-[var(--primary)]' : 'bg-[var(--secondary)] text-[var(--primary)]')
                      : (isDark ? 'bg-[var(--color-dark-surface)] text-slate-400' : 'bg-slate-100 text-slate-500')
                  }`}>
                    {layers.weather ? 'Active' : 'Off'}
                  </span>
                </div>

                {/* 8. Population (At Risk) */}
                <div 
                  onClick={() => toggleLayer('population')}
                  className={`flex items-center justify-between p-1.5 rounded text-xs transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-[var(--color-dark-surface)] text-slate-400' : 'hover:bg-slate-50 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center ${layers.population ? 'bg-emerald-600 text-white' : (isDark ? 'border border-slate-700' : 'border border-slate-300')}`}>
                      {layers.population && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <Users className="w-3.5 h-3.5 opacity-60" />
                    <span>Population (At Risk)</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isDark ? 'text-slate-400 bg-[var(--color-dark-surface)]' : 'text-slate-500 bg-slate-100'}`}>
                    30.7k
                  </span>
                </div>
              </div>
            )}

            {/* TAB 2: LOCATIONS */}
            {panelTab === 'locations' && (
              <div className="py-2 px-2.5 flex flex-col gap-1.5 overflow-y-auto min-h-0 flex-1">
                {/* Search Bar */}
                <div className="relative mb-1">
                  <Search className="w-3.5 h-3.5 opacity-50 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full border rounded-md py-1.5 pl-8 pr-2.5 text-xs transition-colors focus:outline-none focus:border-[var(--primary)] ${
                      isDark 
                        ? 'bg-[#112032] border-[#1C2F46] text-slate-200 placeholder-slate-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                    }`}
                  />
                </div>

                {/* Location List */}
                <div className="space-y-1 overflow-y-auto">
                  {filteredLocations.map((loc) => {
                    const isSelected = selectedLocation.id === loc.id;
                    return (
                      <button
                        key={loc.id}
                        onClick={() => handleLocationClick(loc)}
                        className={`w-full flex items-start gap-2 p-2 rounded text-left transition-colors cursor-pointer ${
                          isSelected 
                            ? (isDark ? 'bg-[#14263C] border border-[var(--primary)]/40 text-white shadow-sm' : 'bg-[var(--secondary)] border border-[var(--primary)] text-slate-900 shadow-xs')
                            : (isDark ? 'hover:bg-[#101E2E] border border-transparent text-slate-300' : 'hover:bg-slate-50 border border-transparent text-slate-700')
                        }`}
                      >
                        <MapPin className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isSelected ? 'text-[var(--primary)]' : 'opacity-40'}`} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <b className="text-xs truncate block">{loc.title}</b>
                            <span className="text-[9px] font-mono opacity-60 shrink-0">{loc.state}</span>
                          </div>
                          <p className="text-[10px] opacity-70 truncate mt-0.5">{loc.incidentType}</p>
                          <div className="flex items-center gap-1.5 mt-1 text-[9px]">
                            <span className={`px-1.5 py-0.2 rounded font-medium ${loc.impactColor}`}>
                              {loc.impact}
                            </span>
                            <span className="opacity-60 font-mono">{loc.peopleAffected}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Section: Map Legend (Collapsible) */}
          <div className={`border-t shrink-0 transition-colors ${
            isDark ? 'border-[var(--color-dark-raised)] bg-[#08101A]/90' : 'border-slate-200 bg-slate-50/90'
          }`}>
            <button
              onClick={() => setLegendOpen(!legendOpen)}
              className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                isDark ? 'text-slate-300 hover:bg-[#101C2B]' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>Map Legend</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${legendOpen ? 'rotate-180' : ''}`} />
            </button>

            {legendOpen && (
              <div className={`px-3 pb-2 text-[10px] flex flex-col gap-1 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-sm" />
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-sm" />
                    <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-sm" />
                  </div>
                  <span>Incident (High / Medium / Low)</span>
                </div>

                <div className="flex items-center gap-2">
                  <Home className="w-3 h-3 text-emerald-500" />
                  <span>Shelter (Open / Near Full)</span>
                </div>

                <div className="flex items-center gap-2">
                  <Building2 className="w-3 h-3 text-indigo-500" />
                  <span>Warehouse</span>
                </div>

                <div className="flex items-center gap-2">
                  <Truck className="w-3 h-3 text-[var(--primary)]" />
                  <span>Vehicle (En Route / Idle)</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 border-t border-amber-500 border-dashed" />
                  <span>Mission Route</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 border-t border-rose-500 border-dashed" />
                  <span>Blocked Road</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`w-4 h-0.5 ${isDark ? 'bg-slate-400' : 'bg-slate-300'}`} />
                  <span>State Boundary</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 border-t border-slate-400 border-dashed" />
                  <span>International Boundary</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Bottom Selected Location Panel */}
      <div className="shrink-0">
        <div className={`border rounded-xl p-3 shadow-md flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 transition-colors ${
          isDark ? 'bg-[#09121E] border-[#1A2C40]' : 'bg-white border-[var(--color-rule)]'
        }`}>
          
          {/* Left Thumbnail & Title */}
          <div className="flex items-center gap-3.5 min-w-[250px]">
            {/* Image Thumbnail */}
            <div className={`w-20 h-16 rounded-lg overflow-hidden border relative shrink-0 shadow-sm ${
              isDark ? 'border-[var(--color-dark-rule)] bg-slate-800' : 'border-slate-200 bg-slate-100'
            }`}>
              <img 
                src={selectedLocation.image} 
                alt="Selected Location" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/globe-ner.jpg';
                }}
              />
            </div>

            {/* Location Title & Badges */}
            <div className="flex flex-col">
              <h2 className={`text-sm font-bold leading-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {selectedLocation.title}
              </h2>
              <span className={`text-[11px] mt-0.5 ${
                isDark ? 'text-[var(--color-dark-muted)]' : 'text-slate-500'
              }`}>
                {selectedLocation.state}
              </span>
              
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${selectedLocation.impactColor}`}>
                  <AlertTriangle className="w-2.5 h-2.5" />
                  {selectedLocation.impact}
                </span>
              </div>

              <span className={`text-[10px] font-mono mt-1 flex items-center gap-1 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                <MapPin className="w-2.5 h-2.5 opacity-60" />
                {selectedLocation.coordinates}
              </span>
            </div>
          </div>

          {/* Center Details Grid */}
          <div className={`flex-1 flex flex-col gap-1.5 border-t lg:border-t-0 lg:border-l pt-2 lg:pt-0 lg:pl-4 min-w-0 justify-center ${
            isDark ? 'border-[#1A2C40]' : 'border-slate-200'
          }`}>
            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1 text-xs pt-0.5">
              <div>
                <span className={`text-[10px] block leading-tight ${isDark ? 'text-[var(--color-dark-muted)]' : 'text-slate-500'}`}>Incident Type</span>
                <span className={`font-medium flex items-center gap-1 mt-0.5 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  <AlertTriangle className="w-3 h-3 text-rose-500" />
                  {selectedLocation.incidentType}
                </span>
              </div>

              <div>
                <span className={`text-[10px] block leading-tight ${isDark ? 'text-[var(--color-dark-muted)]' : 'text-slate-500'}`}>Time</span>
                <span className={`font-medium flex items-center gap-1 mt-0.5 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                  <Clock className="w-3 h-3 opacity-60" />
                  {selectedLocation.time}
                </span>
              </div>

              <div>
                <span className={`text-[10px] block leading-tight ${isDark ? 'text-[var(--color-dark-muted)]' : 'text-slate-500'}`}>Status</span>
                <span className={`font-medium flex items-center gap-1 mt-0.5 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  {selectedLocation.status}
                </span>
              </div>

              <div>
                <span className={`text-[10px] block leading-tight ${isDark ? 'text-[var(--color-dark-muted)]' : 'text-slate-500'}`}>People Affected</span>
                <span className={`font-medium flex items-center gap-1 mt-0.5 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                  <Users className="w-3 h-3 opacity-60" />
                  {selectedLocation.peopleAffected}
                </span>
              </div>

              <div>
                <span className={`text-[10px] block leading-tight ${isDark ? 'text-[var(--color-dark-muted)]' : 'text-slate-500'}`}>Access</span>
                <span className={`font-medium flex items-center gap-1 mt-0.5 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                  <Lock className="w-3 h-3 text-amber-500" />
                  {selectedLocation.access}
                </span>
              </div>

              <div>
                <span className={`text-[10px] block leading-tight ${isDark ? 'text-[var(--color-dark-muted)]' : 'text-slate-500'}`}>Affected Habitations</span>
                <span className={`font-medium flex items-center gap-1 mt-0.5 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                  <Home className="w-3 h-3 opacity-60" />
                  {selectedLocation.affectedHabitations}
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 justify-center">
            <button
              onClick={() => onNavigateToTab?.('replanning')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer ${
                isDark ? 'bg-[#89CFF0] hover:bg-[#A0D9F5] text-[#071321]' : 'bg-[var(--primary)] hover:bg-[var(--primary)] text-[var(--primary-foreground)]'
              }`}
            >
              <span>View Detailed Information</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigateToTab?.('replanning')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer border ${
                isDark 
                  ? 'bg-[#0C1726] hover:bg-[#122238] border-[var(--color-dark-rule)] text-slate-200'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              }`}
            >
              <span>Plan Response</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
