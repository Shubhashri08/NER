import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Home, 
  Shield, 
  Building2, 
  CheckCircle2, 
  Plus, 
  Search, 
  ChevronDown, 
  ArrowRight, 
  MoreHorizontal, 
  TrendingUp, 
  MapPin, 
  Truck, 
  Layers, 
  Crosshair, 
  X, 
  Activity, 
  Navigation, 
  Clock 
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface HabitationItem {
  id: string;
  habitation: string;
  district: string;
  state: string;
  population: number;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  threat: string;
  status: 'Planned' | 'In Progress' | 'Assessment' | 'Monitoring' | 'Not Started' | 'Evacuated';
  lat: number;
  lng: number;
  assignedShelter?: string;
  evacuationProgress?: number;
}

// 25+ Realistic At-Risk Habitations across North East India
const INITIAL_HABITATIONS: HabitationItem[] = [
  {
    id: 'HB-035',
    habitation: 'Rengma Village',
    district: 'Dima Hasao',
    state: 'Assam',
    population: 2400,
    riskLevel: 'Critical',
    threat: 'Heavy Monsoon Rainfall & Flash Flood',
    status: 'Planned',
    lat: 25.18,
    lng: 93.02,
    assignedShelter: 'Haflong Relief Center',
    evacuationProgress: 35
  },
  {
    id: 'HB-027',
    habitation: 'Rengma Village (Sector B)',
    district: 'Dima Hasao',
    state: 'Assam',
    population: 2400,
    riskLevel: 'Critical',
    threat: 'Landslide',
    status: 'Planned',
    lat: 25.20,
    lng: 93.04,
    assignedShelter: 'Haflong Relief Center',
    evacuationProgress: 20
  },
  {
    id: 'HB-026',
    habitation: 'Maibong',
    district: 'Dima Hasao',
    state: 'Assam',
    population: 1850,
    riskLevel: 'High',
    threat: 'Flooding',
    status: 'In Progress',
    lat: 25.30,
    lng: 93.16,
    assignedShelter: 'Maibong Higher Secondary Shelter',
    evacuationProgress: 65
  },
  {
    id: 'HB-025',
    habitation: 'Sonitpur Gaon',
    district: 'Sonitpur',
    state: 'Assam',
    population: 3120,
    riskLevel: 'High',
    threat: 'River Overflow',
    status: 'Assessment',
    lat: 26.65,
    lng: 92.79,
    assignedShelter: 'Tezpur Indoor Stadium',
    evacuationProgress: 10
  },
  {
    id: 'HB-024',
    habitation: 'Tura Basti',
    district: 'West Garo Hills',
    state: 'Meghalaya',
    population: 4200,
    riskLevel: 'Medium',
    threat: 'Flooding',
    status: 'Not Started',
    lat: 25.51,
    lng: 90.22,
    assignedShelter: 'Tura Municipal Transit Camp',
    evacuationProgress: 0
  },
  {
    id: 'HB-023',
    habitation: 'Aizawl North',
    district: 'Aizawl',
    state: 'Mizoram',
    population: 2800,
    riskLevel: 'High',
    threat: 'Landslide',
    status: 'Planned',
    lat: 23.74,
    lng: 92.71,
    assignedShelter: 'Aizawl Multi-Purpose Hall',
    evacuationProgress: 40
  },
  {
    id: 'HB-022',
    habitation: 'Vairengte',
    district: 'Mamit',
    state: 'Mizoram',
    population: 1600,
    riskLevel: 'Medium',
    threat: 'Heavy Rainfall',
    status: 'Monitoring',
    lat: 24.31,
    lng: 92.76,
    assignedShelter: 'Vairengte Community Shelter',
    evacuationProgress: 0
  },
  {
    id: 'HB-021',
    habitation: 'Haflong Town',
    district: 'Dima Hasao',
    state: 'Assam',
    population: 5200,
    riskLevel: 'Critical',
    threat: 'Landslide',
    status: 'In Progress',
    lat: 25.17,
    lng: 93.01,
    assignedShelter: 'Haflong College Ground Shelter',
    evacuationProgress: 80
  },
  {
    id: 'HB-020',
    habitation: 'Silchar Fringe',
    district: 'Cachar',
    state: 'Assam',
    population: 3900,
    riskLevel: 'High',
    threat: 'River Overflow',
    status: 'Assessment',
    lat: 24.83,
    lng: 92.79,
    assignedShelter: 'Silchar District Sports Complex',
    evacuationProgress: 15
  },
  {
    id: 'HB-019',
    habitation: 'Dzongu Valley',
    district: 'Mangan',
    state: 'Sikkim',
    population: 1240,
    riskLevel: 'Critical',
    threat: 'Glacial Runoff / Hill Subsidence',
    status: 'Planned',
    lat: 27.52,
    lng: 88.55,
    assignedShelter: 'Mangan High Ground Transit Center',
    evacuationProgress: 30
  },
  {
    id: 'HB-018',
    habitation: 'Banderdewa Riverside',
    district: 'Papum Pare',
    state: 'Arunachal Pradesh',
    population: 2900,
    riskLevel: 'High',
    threat: 'Dikrong Flash Surge',
    status: 'In Progress',
    lat: 27.12,
    lng: 93.82,
    assignedShelter: 'Naharlagun Staging Shelter',
    evacuationProgress: 55
  },
  {
    id: 'HB-017',
    habitation: 'Mokokchung Slopes',
    district: 'Mokokchung',
    state: 'Nagaland',
    population: 2150,
    riskLevel: 'Medium',
    threat: 'Slope Subsidence',
    status: 'Monitoring',
    lat: 26.32,
    lng: 94.52,
    assignedShelter: 'Mokokchung Town Hall',
    evacuationProgress: 0
  },
  {
    id: 'HB-016',
    habitation: 'Churachandpur Basin',
    district: 'Churachandpur',
    state: 'Manipur',
    population: 3400,
    riskLevel: 'High',
    threat: 'Riverine Flash Inundation',
    status: 'Assessment',
    lat: 24.33,
    lng: 93.68,
    assignedShelter: 'Churachandpur Peace Hall',
    evacuationProgress: 10
  },
  {
    id: 'HB-015',
    habitation: 'Khowai Basin',
    district: 'Khowai',
    state: 'Tripura',
    population: 1800,
    riskLevel: 'Medium',
    threat: 'Embankment Seepage',
    status: 'Not Started',
    lat: 24.06,
    lng: 91.60,
    assignedShelter: 'Khowai Town School Center',
    evacuationProgress: 0
  },
  {
    id: 'HB-014',
    habitation: 'Harangajao Valley',
    district: 'Dima Hasao',
    state: 'Assam',
    population: 3680,
    riskLevel: 'Critical',
    threat: 'Jatinga Debris Corridor Block',
    status: 'In Progress',
    lat: 25.10,
    lng: 92.88,
    assignedShelter: 'Haflong Relief Center',
    evacuationProgress: 75
  },
  {
    id: 'HB-013',
    habitation: 'Majuli Lowbank',
    district: 'Majuli',
    state: 'Assam',
    population: 4100,
    riskLevel: 'High',
    threat: 'Brahmaputra Island Inundation',
    status: 'Planned',
    lat: 26.95,
    lng: 94.20,
    assignedShelter: 'Garamur High-Platform Camp',
    evacuationProgress: 25
  },
  {
    id: 'HB-012',
    habitation: 'Williamnagar Bank',
    district: 'East Garo Hills',
    state: 'Meghalaya',
    population: 2300,
    riskLevel: 'High',
    threat: 'Simsang Riverbank Scouring',
    status: 'Assessment',
    lat: 25.50,
    lng: 90.62,
    assignedShelter: 'Williamnagar Stadium',
    evacuationProgress: 10
  },
  {
    id: 'HB-011',
    habitation: 'Lunglei Ridge',
    district: 'Lunglei',
    state: 'Mizoram',
    population: 2750,
    riskLevel: 'Medium',
    threat: 'Hillside Mud Accumulation',
    status: 'Monitoring',
    lat: 22.88,
    lng: 92.74,
    assignedShelter: 'Lunglei Convention Center',
    evacuationProgress: 0
  },
  {
    id: 'HB-010',
    habitation: 'Pasighat Floodplain',
    district: 'East Siang',
    state: 'Arunachal Pradesh',
    population: 3200,
    riskLevel: 'High',
    threat: 'Siang River Overflow',
    status: 'Planned',
    lat: 28.06,
    lng: 95.33,
    assignedShelter: 'Pasighat Polytechnic Ground',
    evacuationProgress: 30
  },
  {
    id: 'HB-009',
    habitation: 'Diphu Foothills',
    district: 'Karbi Anglong',
    state: 'Assam',
    population: 3100,
    riskLevel: 'Medium',
    threat: 'Flash Water Runoff',
    status: 'Not Started',
    lat: 25.84,
    lng: 93.43,
    assignedShelter: 'Diphu Multi-Purpose Shelter',
    evacuationProgress: 0
  },
  {
    id: 'HB-008',
    habitation: 'Tuensang Slopes',
    district: 'Tuensang',
    state: 'Nagaland',
    population: 1950,
    riskLevel: 'Low',
    threat: 'Soil Erosion',
    status: 'Monitoring',
    lat: 26.28,
    lng: 94.83,
    assignedShelter: 'Tuensang Sports Center',
    evacuationProgress: 0
  },
  {
    id: 'HB-007',
    habitation: 'Dimapur Corridor',
    district: 'Dimapur',
    state: 'Nagaland',
    population: 4800,
    riskLevel: 'High',
    threat: 'Dhansiri River Overflow',
    status: 'In Progress',
    lat: 25.91,
    lng: 93.73,
    assignedShelter: 'Dimapur Agri-Expo Hall',
    evacuationProgress: 60
  },
  {
    id: 'HB-006',
    habitation: 'Tezu Valley',
    district: 'Lohit',
    state: 'Arunachal Pradesh',
    population: 2100,
    riskLevel: 'Medium',
    threat: 'Hill Slope Runoff',
    status: 'Assessment',
    lat: 27.91,
    lng: 96.16,
    assignedShelter: 'Tezu District Stadium',
    evacuationProgress: 10
  },
  {
    id: 'HB-005',
    habitation: 'Dhemaji Basin',
    district: 'Dhemaji',
    state: 'Assam',
    population: 4600,
    riskLevel: 'Critical',
    threat: 'Embankment Breach',
    status: 'Planned',
    lat: 27.48,
    lng: 94.58,
    assignedShelter: 'Dhemaji Central Higher Secondary',
    evacuationProgress: 45
  },
  {
    id: 'HB-004',
    habitation: 'Umrangso Reservoir Bank',
    district: 'Dima Hasao',
    state: 'Assam',
    population: 1500,
    riskLevel: 'High',
    threat: 'Spillway Discharge Risk',
    status: 'In Progress',
    lat: 25.51,
    lng: 92.74,
    assignedShelter: 'Umrangso Township Shelter',
    evacuationProgress: 70
  }
];

export const RelocationView: React.FC<{ onNavigateToTab?: (tab: string) => void; isDark?: boolean }> = ({
  onNavigateToTab: _onNavigateToTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'habitations' | 'assessment' | 'destinations' | 'shelters' | 'missions'>('habitations');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedRisk, setSelectedRisk] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [mapType, setMapType] = useState<'satellite' | 'terrain'>('satellite');
  const [selectedHabitationId, setSelectedHabitationId] = useState<string>('HB-035');
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);

  // Dynamic Habitations State
  const [habitationsList, setHabitationsList] = useState<HabitationItem[]>(INITIAL_HABITATIONS);

  // Modal State for New Relocation Plan
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newHabitation, setNewHabitation] = useState('');
  const [newDistrict, setNewDistrict] = useState('Dima Hasao');
  const [newPopulation, setNewPopulation] = useState('2,400');
  const [newShelter, setNewShelter] = useState('Haflong Relief Center');
  const [newPriority, setNewPriority] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('Critical');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Relocation Missions State
  const [relocationMissions, setRelocationMissions] = useState([
    {
      id: 'REL-01',
      title: 'Convoy Alpha: Harangajao Valley to Haflong',
      habitation: 'Harangajao Valley (HB-014)',
      destination: 'Haflong Relief Center',
      vehicles: '6 Tactical 4x4 Convoys + 4 Buses',
      evacueesCount: 1850,
      status: 'In Transit',
      progress: 75,
      eta: '45 mins',
      escort: 'Assam Rifles / BRO Escort'
    },
    {
      id: 'REL-02',
      title: 'Convoy Bravo: Maibong Flood Evacuation',
      habitation: 'Maibong (HB-026)',
      destination: 'Maibong High Ground Center',
      vehicles: '4 Heavy 6x6 Trucks + 3 Mini-buses',
      evacueesCount: 1200,
      status: 'In Transit',
      progress: 65,
      eta: '1.2 hours',
      escort: 'State Disaster Response Force'
    },
    {
      id: 'REL-03',
      title: 'Convoy Charlie: Rengma Village Sector A',
      habitation: 'Rengma Village (HB-035)',
      destination: 'Haflong College Grounds',
      vehicles: '8 All-Terrain Passenger Carriers',
      evacueesCount: 1400,
      status: 'Planned',
      progress: 35,
      eta: 'Departing in 20m',
      escort: 'District Police Recon Unit'
    },
    {
      id: 'REL-04',
      title: 'Convoy Delta: Banderdewa Riverside Evacuation',
      habitation: 'Banderdewa (HB-018)',
      destination: 'Naharlagun Staging Shelter',
      vehicles: '5 State Transport Buses',
      evacueesCount: 1600,
      status: 'In Transit',
      progress: 55,
      eta: '30 mins',
      escort: 'CRPF Escort'
    }
  ]);

  // Map Container Ref
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  const showToast = (message: string) => {
    setToastMsg(message);
    setTimeout(() => setToastMsg(null), 4000);
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Leaflet Map centered on North East India
    const map = L.map(mapContainerRef.current, {
      center: [25.8, 93.2],
      zoom: 6.8,
      zoomControl: false,
      attributionControl: false,
    });

    const tileUrl = mapType === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, {
      maxZoom: 18,
    }).addTo(map);

    markersRef.current = {};

    // State Labels
    const stateLabels = [
      { name: 'ARUNACHAL PRADESH', lat: 27.5, lng: 94.0 },
      { name: 'ASSAM', lat: 26.2, lng: 92.8 },
      { name: 'NAGALAND', lat: 26.1, lng: 94.5 },
      { name: 'MEGHALAYA', lat: 25.4, lng: 91.3 },
      { name: 'MANIPUR', lat: 24.8, lng: 93.9 },
      { name: 'MIZORAM', lat: 23.3, lng: 92.9 },
      { name: 'TRIPURA', lat: 23.8, lng: 91.5 },
      { name: 'SIKKIM', lat: 27.4, lng: 88.5 },
    ];

    stateLabels.forEach((st) => {
      const labelIcon = L.divIcon({
        className: 'custom-state-label',
        html: `<div style="color: rgba(255,255,255,0.75); font-weight: 700; font-size: 10px; letter-spacing: 0.1em; text-shadow: 0 1px 3px rgba(0,0,0,0.9); text-align: center; white-space: nowrap;">${st.name}</div>`,
        iconSize: [120, 20],
        iconAnchor: [60, 10],
      });
      L.marker([st.lat, st.lng], { icon: labelIcon, interactive: false }).addTo(map);
    });

    // Render All 25 Habitations on Leaflet GIS Risk Map
    habitationsList.forEach((hab) => {
      let iconHtml = '';
      let size = 26;

      if (hab.riskLevel === 'Critical') {
        size = 30;
        iconHtml = `
          <div style="width: 30px; height: 30px; border-radius: 50%; background: #EF4444; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 14px rgba(239,68,68,0.9); cursor: pointer;">
            <svg style="width: 14px; height: 14px; color: white; fill: white; margin: auto;" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.5l8.5 14.5H3.5L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z" /></svg>
          </div>
        `;
      } else if (hab.riskLevel === 'High') {
        size = 26;
        iconHtml = `
          <div style="width: 26px; height: 26px; border-radius: 50%; background: #F59E0B; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(245,158,11,0.8); cursor: pointer;">
            <svg style="width: 12px; height: 12px; color: white; fill: white; margin: auto;" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.5l8.5 14.5H3.5L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z" /></svg>
          </div>
        `;
      } else if (hab.riskLevel === 'Medium') {
        size = 22;
        iconHtml = `
          <div style="width: 22px; height: 22px; border-radius: 50%; background: #FBBF24; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 8px rgba(251,191,36,0.7); cursor: pointer;">
            <svg style="width: 10px; height: 10px; color: white; fill: white; margin: auto;" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.5l8.5 14.5H3.5L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z" /></svg>
          </div>
        `;
      } else {
        size = 20;
        iconHtml = `
          <div style="width: 20px; height: 20px; border-radius: 50%; background: #10B981; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 6px rgba(16,185,129,0.7); cursor: pointer;">
            <div style="width: 6px; height: 6px; border-radius: 50%; background: white;"></div>
          </div>
        `;
      }

      const icon = L.divIcon({
        className: `custom-hab-marker-${hab.id}`,
        html: iconHtml,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([hab.lat, hab.lng], { icon })
        .bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; color: #0F172A; min-width: 140px;">
            <strong style="font-size: 13px;">${hab.habitation}</strong> (${hab.id})<br/>
            <span style="color: #64748B;">District: ${hab.district}, ${hab.state}</span><br/>
            <span>Pop: <strong>${hab.population.toLocaleString()}</strong></span><br/>
            <span style="color: ${hab.riskLevel === 'Critical' ? '#EF4444' : hab.riskLevel === 'High' ? '#F59E0B' : '#10B981'}; font-weight: bold;">Risk: ${hab.riskLevel}</span><br/>
            <span>Status: <strong>${hab.status}</strong></span>
          </div>
        `)
        .on('click', () => {
          setSelectedHabitationId(hab.id);
        })
        .addTo(map);

      markersRef.current[hab.id] = marker;
    });

    // Also Plot Green Shelters on Map
    const sheltersOnMap = [
      { name: 'Haflong Relief Center', lat: 25.18, lng: 93.03, cap: '3,500' },
      { name: 'Tezpur Indoor Stadium Shelter', lat: 26.63, lng: 92.79, cap: '4,200' },
      { name: 'Shillong Central Transit Hub', lat: 25.57, lng: 91.89, cap: '5,000' },
      { name: 'Aizawl Multi-Purpose Shelter', lat: 23.73, lng: 92.72, cap: '2,800' },
      { name: 'Mangan High Ground Shelter', lat: 27.50, lng: 88.53, cap: '1,500' },
    ];

    sheltersOnMap.forEach((sh) => {
      const shelterIcon = L.divIcon({
        className: 'custom-shelter-marker',
        html: `
          <div style="width: 26px; height: 26px; border-radius: 50%; background: #10B981; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(16,185,129,0.8); cursor: pointer;">
            <svg style="width: 14px; height: 14px; color: white; fill: currentColor; margin: auto;" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      L.marker([sh.lat, sh.lng], { icon: shelterIcon })
        .bindPopup(`<b>${sh.name}</b><br/><span style="color:#10B981;font-weight:bold">Capacity: ${sh.cap} Beds</span>`)
        .addTo(map);
    });

    mapInstanceRef.current = map;

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [mapType, habitationsList]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetCenter = () => mapInstanceRef.current?.setView([25.8, 93.2], 6.8);

  const handleFocusHabitation = (hab: HabitationItem) => {
    setSelectedHabitationId(hab.id);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([hab.lat, hab.lng], 9.5, { animate: true });
      const marker = markersRef.current[hab.id];
      if (marker) {
        marker.openPopup();
      }
    }
  };

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitation.trim()) return;

    const nextIdNum = habitationsList.length + 36;
    const generatedId = `HB-0${nextIdNum}`;
    const parsedPop = parseInt(newPopulation.replace(/[^0-9]/g, '')) || 2400;

    const newPlan: HabitationItem = {
      id: generatedId,
      habitation: newHabitation.trim(),
      district: newDistrict,
      state: 'Assam',
      population: parsedPop,
      riskLevel: newPriority,
      threat: 'Heavy Monsoon Rainfall & Flash Flood',
      status: 'Planned',
      lat: 25.18 + (Math.random() * 0.4 - 0.2),
      lng: 93.02 + (Math.random() * 0.4 - 0.2),
      assignedShelter: newShelter,
      evacuationProgress: 10
    };

    setHabitationsList([newPlan, ...habitationsList]);
    setIsModalOpen(false);
    setNewHabitation('');
    showToast(`New Relocation Plan for ${newPlan.habitation} (${newPlan.district}) created & mapped!`);
  };

  const handleUpdateStatus = (habId: string, newStatus: HabitationItem['status']) => {
    let targetHab: HabitationItem | undefined;
    setHabitationsList((prev) =>
      prev.map((h) => {
        if (h.id === habId) {
          targetHab = h;
          const progress = newStatus === 'Evacuated' ? 100 : newStatus === 'In Progress' ? 65 : newStatus === 'Planned' ? 30 : 0;
          return { ...h, status: newStatus, evacuationProgress: progress };
        }
        return h;
      })
    );

    if (newStatus === 'In Progress' && targetHab) {
      setRelocationMissions((prevMissions) => {
        const existingIdx = prevMissions.findIndex(m => m.habitation.includes(habId));
        if (existingIdx >= 0) {
          const updated = [...prevMissions];
          updated[existingIdx] = { ...updated[existingIdx], status: 'In Transit', progress: 65 };
          return updated;
        }
        const newMissionId = `REL-0${prevMissions.length + 1}`;
        return [
          {
            id: newMissionId,
            title: `Convoy: ${targetHab!.habitation} Rapid Resettlement`,
            habitation: `${targetHab!.habitation} (${targetHab!.id})`,
            destination: targetHab!.assignedShelter || 'Haflong Relief Center',
            vehicles: '6 All-Terrain Heavy Carriers',
            evacueesCount: targetHab!.population,
            status: 'In Transit',
            progress: 50,
            eta: '35 mins',
            escort: 'State Disaster Response Force'
          },
          ...prevMissions
        ];
      });
    }

    setActiveActionMenuId(null);
    showToast(`Habitation ${habId} status updated to "${newStatus}"!`);
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Critical':
        return 'bg-rose-100 text-rose-700 border border-rose-200';
      case 'High':
        return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-600 border border-amber-200';
      default:
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Planned':
        return 'bg-[var(--secondary)] text-[var(--primary)]';
      case 'In Progress':
        return 'bg-[var(--secondary)] text-[var(--primary)]';
      case 'Assessment':
        return 'bg-amber-100 text-amber-700';
      case 'Monitoring':
        return 'bg-[var(--muted)] text-[var(--foreground)]';
      case 'Not Started':
        return 'bg-[var(--muted)] text-[var(--muted-foreground)]';
      case 'Evacuated':
        return 'bg-emerald-100 text-emerald-700';
      default:
        return 'bg-emerald-100 text-emerald-700';
    }
  };

  const filteredHabitations = habitationsList.filter((item) => {
    const matchesSearch = item.habitation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.threat.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = selectedDistrict === 'All' || item.district === selectedDistrict;
    const matchesRisk = selectedRisk === 'All' || item.riskLevel === selectedRisk;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    return matchesSearch && matchesDistrict && matchesRisk && matchesStatus;
  });

  // Dynamic KPI counts derived from actual operational habitations state
  const totalPeopleAtRisk = habitationsList.filter(h => h.status !== 'Evacuated').reduce((acc, h) => acc + h.population, 0);
  const totalHabitationsAtRisk = habitationsList.filter(h => h.status !== 'Evacuated').length;
  const highRiskZonesCount = habitationsList.filter(h => h.riskLevel === 'Critical' || h.riskLevel === 'High').length;
  const peopleRelocatedCount = 6800 + habitationsList.filter(h => h.status === 'Evacuated').reduce((acc, h) => acc + h.population, 0);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[var(--background)] text-[var(--foreground)] font-sans select-none px-6 py-4 gap-4">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-slide-in text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. Header Area matching Reference Image */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[var(--muted-foreground)] uppercase block mb-0.5">
            RELOCATION MANAGEMENT
          </span>
          <h1 className="font-serif-display text-2xl lg:text-[32px] font-normal text-[var(--foreground)] tracking-wide leading-tight">
            Safer People. Stronger Communities.
          </h1>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5 max-w-xl font-normal">
            Identify at-risk habitations, assess relocation needs and coordinate safe resettlement.
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-dark-surface)] hover:bg-[var(--color-dark-raised)] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Relocation Plan</span>
          </button>
        </div>
      </div>

      {/* 2. Subtab Navigation Strip (Divided Segment Bar matching Reference Image) */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg flex items-center shrink-0 overflow-x-auto shadow-2xs">
        {[
          { id: 'habitations', label: 'At-Risk Habitations', icon: Users },
          { id: 'assessment', label: 'Risk Assessment', icon: TrendingUp },
          { id: 'destinations', label: 'Destinations', icon: MapPin },
          { id: 'shelters', label: 'Shelters', icon: Home },
          { id: 'missions', label: 'Relocation Missions', icon: Truck },
        ].map((tab, idx, arr) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <React.Fragment key={tab.id}>
              <button
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer relative ${
                  isActive
                    ? 'text-[var(--primary)] font-semibold'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--background)]/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'}`} />
                <span>{tab.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[var(--primary)]" />
                )}
              </button>
              {idx < arr.length - 1 && (
                <div className="h-5 w-px bg-[var(--border)] shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* 3. 5 KPI Stat Cards (Matching Reference Layout & Icons) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 shrink-0">
        
        {/* Card 1: People at Risk */}
        <div className="bg-[var(--card)] border border-[var(--border)]/90 rounded-xl p-3.5 shadow-2xs flex items-center justify-between min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 flex items-center justify-center text-[var(--foreground)] shrink-0">
              <Users className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="min-w-0">
              <span className="text-2xl font-bold text-[var(--foreground)] leading-none block font-sans">
                {totalPeopleAtRisk.toLocaleString()}
              </span>
              <span className="text-[11px] text-[var(--muted-foreground)] font-medium mt-1 block whitespace-nowrap">People at Risk</span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end shrink-0 pl-1">
            <span className="text-[11px] font-semibold text-rose-500">↑ 12%</span>
            <span className="text-[10px] text-[var(--muted-foreground)] font-normal whitespace-nowrap">vs last week</span>
          </div>
        </div>

        {/* Card 2: Habitations at Risk */}
        <div className="bg-[var(--card)] border border-[var(--border)]/90 rounded-xl p-3.5 shadow-2xs flex items-center justify-between min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 flex items-center justify-center text-[var(--foreground)] shrink-0">
              <Home className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="min-w-0">
              <span className="text-2xl font-bold text-[var(--foreground)] leading-none block font-sans">
                {totalHabitationsAtRisk}
              </span>
              <span className="text-[11px] text-[var(--muted-foreground)] font-medium mt-1 block whitespace-nowrap">Habitations at Risk</span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end shrink-0 pl-1">
            <span className="text-[11px] font-semibold text-rose-500">↑ 8%</span>
          </div>
        </div>

        {/* Card 3: High Risk Zones */}
        <div className="bg-[var(--card)] border border-[var(--border)]/90 rounded-xl p-3.5 shadow-2xs flex items-center justify-between min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 flex items-center justify-center text-[var(--foreground)] shrink-0">
              <Shield className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="min-w-0">
              <span className="text-2xl font-bold text-[var(--foreground)] leading-none block font-sans">
                {highRiskZonesCount}
              </span>
              <span className="text-[11px] text-[var(--muted-foreground)] font-medium mt-1 block whitespace-nowrap">High Risk Zones</span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end shrink-0 pl-1">
            <span className="text-[11px] font-semibold text-rose-500">↑ 4</span>
          </div>
        </div>

        {/* Card 4: Shelters Available */}
        <div className="bg-[var(--card)] border border-[var(--border)]/90 rounded-xl p-3.5 shadow-2xs flex items-center justify-between min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 flex items-center justify-center text-[var(--foreground)] shrink-0">
              <Building2 className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="min-w-0">
              <span className="text-2xl font-bold text-[var(--foreground)] leading-none block font-sans">56</span>
              <span className="text-[11px] text-[var(--muted-foreground)] font-medium mt-1 block whitespace-nowrap">Shelters Available</span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end shrink-0 pl-1">
            <span className="text-[11px] font-semibold text-emerald-600">↑ 0%</span>
          </div>
        </div>

        {/* Card 5: People Relocated */}
        <div className="bg-[var(--card)] border border-[var(--border)]/90 rounded-xl p-3.5 shadow-2xs flex items-center justify-between min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 flex items-center justify-center text-[var(--foreground)] shrink-0">
              <CheckCircle2 className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="min-w-0">
              <span className="text-2xl font-bold text-[var(--foreground)] leading-none block font-sans">
                {peopleRelocatedCount.toLocaleString()}
              </span>
              <span className="text-[11px] text-[var(--muted-foreground)] font-medium mt-1 block whitespace-nowrap">People Relocated</span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end shrink-0 pl-1">
            <span className="text-[11px] font-semibold text-emerald-600">↑ 28%</span>
            <span className="text-[10px] text-[var(--muted-foreground)] font-normal whitespace-nowrap">this month</span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 1: AT-RISK HABITATIONS (Default Management View) */}
      {/* ========================================================================= */}
      {activeSubTab === 'habitations' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 shrink-0">
          
          {/* Left: At-Risk Habitations Table (8 Cols) */}
          <div className="lg:col-span-8 bg-[var(--card)] border border-[var(--border)]/90 rounded-xl shadow-2xs overflow-hidden flex flex-col">
            
            {/* Card Header & Filter Row */}
            <div className="p-4 border-b border-[var(--border)] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[var(--foreground)]">At-Risk Habitations</h2>
                <button 
                  onClick={() => {
                    setSelectedDistrict('All');
                    setSelectedRisk('All');
                    setSelectedStatus('All');
                    setSearchQuery('');
                  }}
                  className="text-xs font-semibold text-[var(--primary)] hover:text-[var(--primary)] flex items-center gap-1 cursor-pointer"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                  <input
                    type="text"
                    placeholder="Search habitation, district..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-8 pl-8 pr-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-xs text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div className="relative">
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="h-8 pl-3 pr-7 bg-[var(--card)] border border-[var(--border)] rounded-lg text-xs text-[var(--foreground)] appearance-none cursor-pointer focus:outline-none"
                  >
                    <option value="All">All Districts</option>
                    <option value="Dima Hasao">Dima Hasao</option>
                    <option value="Sonitpur">Sonitpur</option>
                    <option value="West Garo Hills">West Garo Hills</option>
                    <option value="Aizawl">Aizawl</option>
                    <option value="Mamit">Mamit</option>
                    <option value="Cachar">Cachar</option>
                    <option value="Mangan">Mangan</option>
                    <option value="Papum Pare">Papum Pare</option>
                    <option value="Majuli">Majuli</option>
                    <option value="Dhemaji">Dhemaji</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={selectedRisk}
                    onChange={(e) => setSelectedRisk(e.target.value)}
                    className="h-8 pl-3 pr-7 bg-[var(--card)] border border-[var(--border)] rounded-lg text-xs text-[var(--foreground)] appearance-none cursor-pointer focus:outline-none"
                  >
                    <option value="All">Risk Level</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="h-8 pl-3 pr-7 bg-[var(--card)] border border-[var(--border)] rounded-lg text-xs text-[var(--foreground)] appearance-none cursor-pointer focus:outline-none"
                  >
                    <option value="All">Relocation Status</option>
                    <option value="Planned">Planned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Assessment">Assessment</option>
                    <option value="Monitoring">Monitoring</option>
                    <option value="Not Started">Not Started</option>
                    <option value="Evacuated">Evacuated</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto overflow-y-auto max-h-[460px]">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 bg-[var(--background)] z-10">
                  <tr className="border-b border-[var(--border)] text-[11px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                    <th className="py-2.5 px-3 bg-[var(--background)]">ID</th>
                    <th className="py-2.5 px-3 bg-[var(--background)]">HABITATION</th>
                    <th className="py-2.5 px-3 bg-[var(--background)]">DISTRICT</th>
                    <th className="py-2.5 px-3 bg-[var(--background)]">POPULATION</th>
                    <th className="py-2.5 px-3 bg-[var(--background)]">RISK LEVEL</th>
                    <th className="py-2.5 px-3 bg-[var(--background)]">PRIMARY THREAT</th>
                    <th className="py-2.5 px-3 bg-[var(--background)]">RELOCATION STATUS</th>
                    <th className="py-2.5 px-3 bg-[var(--background)] text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filteredHabitations.map((row) => (
                    <tr 
                      key={row.id} 
                      onClick={() => handleFocusHabitation(row)}
                      className={`hover:bg-[var(--background)]/80 transition-colors cursor-pointer ${
                        selectedHabitationId === row.id ? 'bg-[var(--secondary)]/40' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-mono text-[11px] text-[var(--muted-foreground)]">{row.id}</td>
                      <td className="py-2.5 px-3 font-medium text-[var(--foreground)]">{row.habitation}</td>
                      <td className="py-2.5 px-3 text-[var(--muted-foreground)]">{row.district}</td>
                      <td className="py-2.5 px-3 font-medium text-[var(--foreground)]">{row.population.toLocaleString()}</td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${getRiskBadge(row.riskLevel)}`}>
                          {row.riskLevel}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[var(--muted-foreground)]">{row.threat}</td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded text-[10px] font-semibold ${getStatusBadge(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveActionMenuId(activeActionMenuId === row.id ? null : row.id);
                          }}
                          className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1 cursor-pointer rounded hover:bg-[var(--muted)]"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {/* Action Popup Dropdown */}
                        {activeActionMenuId === row.id && (
                          <div 
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 mt-1 w-48 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-xl z-30 py-1 text-left text-xs divide-y divide-[var(--border)]"
                          >
                            <div className="px-3 py-1 font-semibold text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider">
                              Manage Relocation
                            </div>
                            <div className="py-0.5">
                              <button
                                onClick={() => handleUpdateStatus(row.id, 'Planned')}
                                className="w-full px-3 py-1.5 text-left text-[var(--primary)] hover:bg-[var(--secondary)] flex items-center gap-1.5 cursor-pointer font-medium"
                              >
                                <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
                                <span>Set as Planned</span>
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(row.id, 'In Progress')}
                                className="w-full px-3 py-1.5 text-left text-[var(--primary)] hover:bg-[var(--secondary)] flex items-center gap-1.5 cursor-pointer font-medium"
                              >
                                <Truck className="w-3.5 h-3.5 text-[var(--primary)]" />
                                <span>Dispatch Convoy (In Progress)</span>
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(row.id, 'Evacuated')}
                                className="w-full px-3 py-1.5 text-left text-emerald-700 hover:bg-emerald-50 flex items-center gap-1.5 cursor-pointer font-medium"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Mark Evacuated Complete</span>
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(row.id, 'Assessment')}
                                className="w-full px-3 py-1.5 text-left text-amber-700 hover:bg-amber-50 flex items-center gap-1.5 cursor-pointer font-medium"
                              >
                                <Activity className="w-3.5 h-3.5 text-amber-600" />
                                <span>Re-assess Threat Risk</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--muted-foreground)] bg-[var(--background)]/50">
              <span>Showing {filteredHabitations.length} of {habitationsList.length} monitored habitations</span>
              <span className="font-mono">Real-time GIS Sync Active (25 Verified Settlements)</span>
            </div>
          </div>

          {/* Right: Risk Map (4 Cols) */}
          <div className="lg:col-span-4 bg-[var(--card)] border border-[var(--border)]/90 rounded-xl shadow-2xs overflow-hidden flex flex-col min-h-[460px]">
            <div className="p-3 border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-[var(--foreground)]">Risk Map</h2>
                <span className="text-[10px] font-mono text-[var(--muted-foreground)]">25 Settlements Plotted</span>
              </div>
            </div>

            <div className="relative flex-1 min-h-[360px] bg-slate-900">
              <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

              {/* Map Top-Right Controls */}
              <div className="absolute top-3 right-3 z-[400] flex flex-col gap-1">
                <div className="bg-[var(--card)]/95 backdrop-blur-xs rounded-md shadow-md border border-[var(--border)] flex flex-col overflow-hidden">
                  <button
                    onClick={handleZoomIn}
                    className="w-7 h-7 flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--muted)] font-bold text-sm cursor-pointer"
                    title="Zoom in"
                  >
                    +
                  </button>
                  <div className="h-px bg-[var(--border)] w-full" />
                  <button
                    onClick={handleZoomOut}
                    className="w-7 h-7 flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--muted)] font-bold text-sm cursor-pointer"
                    title="Zoom out"
                  >
                    −
                  </button>
                </div>

                <button
                  onClick={() => setMapType(mapType === 'satellite' ? 'terrain' : 'satellite')}
                  className="w-7 h-7 bg-[var(--card)]/95 backdrop-blur-xs rounded-md shadow-md border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--muted)] cursor-pointer"
                  title="Layers"
                >
                  <Layers className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleResetCenter}
                  className="w-7 h-7 bg-[var(--card)]/95 backdrop-blur-xs rounded-md shadow-md border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--muted)] cursor-pointer"
                  title="Recenter"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Map Bottom-Right Satellite/Terrain Toggle */}
              <div className="absolute bottom-11 right-3 z-[400] flex items-center bg-[var(--color-dark-paper)]/80 backdrop-blur-xs rounded-lg p-0.5 border border-white/10 text-[10px]">
                <button
                  onClick={() => setMapType('satellite')}
                  className={`px-2.5 py-1 rounded font-medium transition cursor-pointer ${
                    mapType === 'satellite' ? 'bg-[#1A2536] text-white' : 'text-[var(--muted-foreground)] hover:text-white'
                  }`}
                >
                  Satellite
                </button>
                <button
                  onClick={() => setMapType('terrain')}
                  className={`px-2.5 py-1 rounded font-medium transition cursor-pointer ${
                    mapType === 'terrain' ? 'bg-[#1A2536] text-white' : 'text-[var(--muted-foreground)] hover:text-white'
                  }`}
                >
                  Terrain
                </button>
              </div>

              {/* Bottom Legend Bar */}
              <div className="absolute bottom-0 left-0 right-0 z-[400] bg-[var(--card)]/95 backdrop-blur-xs border-t border-[var(--border)] py-1.5 px-3 flex items-center justify-between text-[10px] text-[var(--foreground)] flex-wrap gap-1">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                  <span>Critical</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  <span>High</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
                  <span>Medium</span>
                </div>
                <div className="flex items-center gap-1">
                  <Home className="w-3 h-3 text-emerald-600" />
                  <span>Shelter</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: RISK ASSESSMENT */}
      {/* ========================================================================= */}
      {activeSubTab === 'assessment' && (
        <div className="flex flex-col gap-4">
          <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-3 border-b border-[var(--border)] pb-2.5">
              <div>
                <h3 className="text-sm font-bold text-[var(--foreground)]">Multi-Criteria Vulnerability & Terrain Risk Matrix</h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                  Automated risk scoring based on satellite SAR displacement, rainfall intensity, slope gradients, and evacuation road clearance.
                </p>
              </div>
              <span className="text-xs font-mono text-[var(--primary)] font-semibold">MCDA Algorithm: Active</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[var(--foreground)]">
                <thead className="bg-[var(--background)] text-[11px] font-semibold text-[var(--muted-foreground)] border-b border-[var(--border)]">
                  <tr>
                    <th className="py-2.5 px-3">Habitation</th>
                    <th className="py-2.5 px-3">District</th>
                    <th className="py-2.5 px-3">Slope Gradient</th>
                    <th className="py-2.5 px-3">Rainfall (24h)</th>
                    <th className="py-2.5 px-3">Displacement Index</th>
                    <th className="py-2.5 px-3">Isolation Time</th>
                    <th className="py-2.5 px-3">MCDA Risk Score</th>
                    <th className="py-2.5 px-3 text-right">Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {habitationsList.slice(0, 10).map((hab) => (
                    <tr key={hab.id} className="hover:bg-[var(--background)]/60">
                      <td className="py-2.5 px-3 font-semibold text-[var(--foreground)]">{hab.habitation}</td>
                      <td className="py-2.5 px-3 text-[var(--muted-foreground)]">{hab.district}</td>
                      <td className="py-2.5 px-3 font-mono">38.4° (Steep)</td>
                      <td className="py-2.5 px-3 font-mono">182 mm</td>
                      <td className="py-2.5 px-3 font-mono text-rose-600 font-bold">14.2 mm/day</td>
                      <td className="py-2.5 px-3 font-mono text-rose-600 font-bold">3.5 hrs</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getRiskBadge(hab.riskLevel)}`}>
                          {hab.riskLevel === 'Critical' ? '92/100 (Critical)' : hab.riskLevel === 'High' ? '78/100 (High)' : '54/100 (Medium)'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button 
                          onClick={() => {
                            setActiveSubTab('missions');
                          }}
                          className="text-[var(--primary)] hover:text-[var(--primary)] font-semibold text-xs"
                        >
                          Stage Relocation →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 3: DESTINATIONS */}
      {/* ========================================================================= */}
      {activeSubTab === 'destinations' && (
        <div className="flex flex-col gap-4">
          <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-3 border-b border-[var(--border)] pb-2.5">
              <div>
                <h3 className="text-sm font-bold text-[var(--foreground)]">Designated Safe Relocation Destinations & Transit Staging Hubs</h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                  High-capacity government staging grounds equipped with water, power generators, medical triage, and road linkages.
                </p>
              </div>
              <span className="text-xs font-mono text-[var(--muted-foreground)]">6 Strategic Hubs Active</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Haflong Relief Center', location: 'Dima Hasao', capacity: '3,500 Beds', occupied: '1,420 (40%)', access: 'BRO Bypass Clear', medical: 'PHC Triage On-Site' },
                { name: 'Tezpur Indoor Stadium', location: 'Sonitpur', capacity: '4,200 Beds', occupied: '2,100 (50%)', access: 'NH-15 Corridor Open', medical: 'Tezpur Medical College Team' },
                { name: 'Shillong Central Transit Hub', location: 'East Khasi Hills', capacity: '5,000 Beds', occupied: '1,800 (36%)', access: 'GS Road Clear', medical: 'NEIGRIHMS Aux Unit' },
                { name: 'Silchar District Sports Complex', location: 'Cachar', capacity: '3,800 Beds', occupied: '1,650 (43%)', access: 'Hailakandi Rd Clear', medical: 'Silchar Civil Hospital Support' },
                { name: 'Aizawl Multi-Purpose Center', location: 'Aizawl', capacity: '2,800 Beds', occupied: '1,120 (40%)', access: 'Tuirial Bypass Active', medical: 'Civil Hospital Emergency Ward' },
                { name: 'Mangan High Ground Center', location: 'Mangan', capacity: '1,500 Beds', occupied: '450 (30%)', access: 'Helipad Available', medical: 'District Health Center' }
              ].map((dest, i) => (
                <div key={i} className="p-4 border border-[var(--border)] rounded-xl bg-[var(--card)] shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-bold text-sm text-[var(--foreground)]">{dest.name}</h4>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">
                        Operational
                      </span>
                    </div>
                    <span className="text-xs text-[var(--muted-foreground)] block mb-3">{dest.location}</span>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-[var(--background)] p-2.5 rounded-lg mb-3">
                      <div>
                        <span className="text-[10px] text-[var(--muted-foreground)] block font-mono">Total Capacity:</span>
                        <strong className="text-[var(--foreground)]">{dest.capacity}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--muted-foreground)] block font-mono">Current Headroom:</span>
                        <strong className="text-emerald-600">{dest.occupied}</strong>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] text-[var(--muted-foreground)] block font-mono">Corridor Access:</span>
                        <strong className="text-[var(--foreground)]">{dest.access}</strong>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => showToast(`Destination "${dest.name}" assigned to active relocation queue!`)}
                    className="w-full py-1.5 bg-[var(--secondary)] hover:bg-[var(--secondary)] text-[var(--primary)] rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Assign Destination</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 4: SHELTERS */}
      {/* ========================================================================= */}
      {activeSubTab === 'shelters' && (
        <div className="flex flex-col gap-4">
          <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-3 border-b border-[var(--border)] pb-2.5">
              <div>
                <h3 className="text-sm font-bold text-[var(--foreground)]">Regional Emergency Shelter Registry (56 Shelters Active)</h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                  Live monitoring of shelter headroom, water purification reserves, food stores, and sanitation health index.
                </p>
              </div>
              <span className="text-xs font-mono bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded">
                Total Beds: 24,500 Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Haflong Relief Center', district: 'Dima Hasao', totalBeds: 3500, occupiedBeds: 1420, waterReserve: '18,000L', foodStock: '5 Days', manager: 'S. Debbarma (SDM Logistics)' },
                { name: 'Tezpur Indoor Stadium Shelter', district: 'Sonitpur', totalBeds: 4200, occupiedBeds: 2100, waterReserve: '25,000L', foodStock: '7 Days', manager: 'P. Kalita (DDMA)' },
                { name: 'Tura Municipal Transit Camp', district: 'West Garo Hills', totalBeds: 3000, occupiedBeds: 850, waterReserve: '12,000L', foodStock: '4 Days', manager: 'M. Sangma (SDO)' },
                { name: 'Aizawl Multi-Purpose Hall Shelter', district: 'Aizawl', totalBeds: 2800, occupiedBeds: 1120, waterReserve: '15,000L', foodStock: '6 Days', manager: 'L. Ralte (Disaster Officer)' },
              ].map((sh, idx) => {
                const pct = Math.round((sh.occupiedBeds / sh.totalBeds) * 100);
                return (
                  <div key={idx} className="p-4 border border-[var(--border)] rounded-xl bg-[var(--card)] shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-emerald-600" />
                        <h4 className="font-bold text-sm text-[var(--foreground)]">{sh.name}</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-[var(--foreground)]">{pct}% Occupied</span>
                    </div>
                    <span className="text-xs text-[var(--muted-foreground)] block mb-2">{sh.district} · Manager: {sh.manager}</span>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 bg-[var(--muted)] rounded-full overflow-hidden mb-3">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          pct > 75 ? 'bg-rose-500' : pct > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} 
                        style={{ width: `${pct}%` }} 
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs bg-[var(--background)] p-2.5 rounded-lg">
                      <div>
                        <span className="text-[10px] text-[var(--muted-foreground)] block font-mono">Capacity:</span>
                        <strong className="text-[var(--foreground)]">{sh.occupiedBeds} / {sh.totalBeds}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--muted-foreground)] block font-mono">Potable Water:</span>
                        <strong className="text-[var(--foreground)]">{sh.waterReserve}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--muted-foreground)] block font-mono">Food Reserves:</span>
                        <strong className="text-emerald-600">{sh.foodStock}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 5: RELOCATION MISSIONS */}
      {/* ========================================================================= */}
      {activeSubTab === 'missions' && (
        <div className="flex flex-col gap-4">
          <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-3 border-b border-[var(--border)] pb-2.5">
              <div>
                <h3 className="text-sm font-bold text-[var(--foreground)]">Active Relocation Evacuation Convoys</h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                  Live tracking of coordinated bus, 4x4, and truck convoys moving at-risk populations to safe shelters.
                </p>
              </div>
              <span className="text-xs bg-[var(--secondary)] text-[var(--primary)] font-bold px-2.5 py-1 rounded">
                4 Convoys in Transit
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {relocationMissions.map((msn) => (
                <div key={msn.id} className="p-4 border border-[var(--border)] rounded-xl bg-[var(--card)] shadow-2xs flex flex-col justify-between">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[var(--primary)]" />
                      <h4 className="font-bold text-xs text-[var(--foreground)]">{msn.title}</h4>
                      <span className="text-[10px] font-mono text-[var(--muted-foreground)]">({msn.id})</span>
                    </div>
                    <span className="px-2 py-0.5 bg-[var(--secondary)] text-[var(--primary)] text-[10px] font-bold rounded">
                      {msn.status} · ETA: {msn.eta}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-[var(--background)] p-2.5 rounded-lg mb-3">
                    <div>
                      <span className="text-[10px] text-[var(--muted-foreground)] block font-mono">Origin Habitation:</span>
                      <strong className="text-[var(--foreground)]">{msn.habitation}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--muted-foreground)] block font-mono">Destination:</span>
                      <strong className="text-[var(--foreground)]">{msn.destination}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--muted-foreground)] block font-mono">Evacuees:</span>
                      <strong className="text-[var(--primary)]">{msn.evacueesCount.toLocaleString()} Citizens</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--muted-foreground)] block font-mono">Fleet Assigned:</span>
                      <strong className="text-[var(--foreground)]">{msn.vehicles}</strong>
                    </div>
                  </div>

                  {/* Convoy Transit Progress */}
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-[var(--muted-foreground)] font-mono text-[11px] w-28">Transit Progress:</span>
                    <div className="flex-1 h-2.5 bg-[var(--muted)] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--primary)] rounded-full transition-all" style={{ width: `${msn.progress}%` }} />
                    </div>
                    <span className="font-mono font-bold text-[var(--foreground)] w-12 text-right">{msn.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Bottom Section: Population at Risk + Relocation Progress + Shelter Capacity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 shrink-0">
        
        {/* Card 1: Population at Risk */}
        <div className="bg-[var(--card)] border border-[var(--border)]/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-[var(--foreground)]">Population at Risk</h3>
            <div className="flex items-center gap-1 text-[11px] text-[var(--muted-foreground)] cursor-pointer">
              <span>Top Districts</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>

          {/* Horizontal Bar Chart */}
          <div className="space-y-2 text-xs">
            {[
              { state: 'Assam', count: '18,400', pct: 92 },
              { state: 'Meghalaya', count: '9,120', pct: 46 },
              { state: 'Arunachal Pradesh', count: '6,280', pct: 31 },
              { state: 'Manipur', count: '5,400', pct: 27 },
              { state: 'Mizoram', count: '4,320', pct: 22 },
              { state: 'Nagaland', count: '3,860', pct: 19 },
              { state: 'Tripura', count: '850', pct: 8 },
            ].map((item) => (
              <div key={item.state} className="flex items-center justify-between gap-3">
                <span className="w-28 text-[11px] text-[var(--muted-foreground)] truncate">{item.state}</span>
                <div className="flex-1 h-3 bg-[var(--muted)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#EF4444] rounded-full transition-all duration-500" 
                    style={{ width: `${item.pct}%` }} 
                  />
                </div>
                <span className="w-12 text-right text-[11px] font-semibold text-[var(--foreground)]">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Relocation Progress */}
        <div className="bg-[var(--card)] border border-[var(--border)]/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-[var(--foreground)]">Relocation Progress</h3>
            <span className="text-[11px] text-[var(--muted-foreground)] font-mono">Overall Status</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-[var(--muted-foreground)]">Completed (6,800 people)</span>
                <span className="font-semibold text-[var(--foreground)]">14%</span>
              </div>
              <div className="w-full h-2.5 bg-[var(--muted)] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '14%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-[var(--muted-foreground)]">In Progress (12,400 people)</span>
                <span className="font-semibold text-[var(--foreground)]">26%</span>
              </div>
              <div className="w-full h-2.5 bg-[var(--muted)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: '26%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-[var(--muted-foreground)]">Planned (18,200 people)</span>
                <span className="font-semibold text-[var(--foreground)]">38%</span>
              </div>
              <div className="w-full h-2.5 bg-[var(--muted)] rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '38%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-[var(--muted-foreground)]">Not Started (10,820 people)</span>
                <span className="font-semibold text-[var(--foreground)]">22%</span>
              </div>
              <div className="w-full h-2.5 bg-[var(--muted)] rounded-full overflow-hidden">
                <div className="h-full bg-slate-300 rounded-full" style={{ width: '22%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Shelter Capacity Breakdown */}
        <div className="bg-[var(--card)] border border-[var(--border)]/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-[var(--foreground)]">Shelter Capacity Breakdown</h3>
            <span className="text-xs font-semibold text-[var(--primary)] hover:text-[var(--primary)] cursor-pointer" onClick={() => setActiveSubTab('shelters')}>
              View All
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 py-1">
            {/* SVG Donut */}
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#10B981" strokeWidth="4.5" strokeDasharray="42 58" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#3B82F6" strokeWidth="4.5" strokeDasharray="36 64" strokeDashoffset="-42" />
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#CBD5E1" strokeWidth="4.5" strokeDasharray="22 78" strokeDashoffset="-78" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-base font-bold text-[var(--foreground)] leading-tight">24.5k</span>
                <span className="text-[9px] text-[var(--muted-foreground)]">Beds</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 text-xs flex-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[var(--foreground)]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Available
                </span>
                <span className="font-semibold text-[var(--foreground)]">42% (10.2k)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[var(--foreground)]">
                  <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                  Occupied
                </span>
                <span className="font-semibold text-[var(--foreground)]">36% (8.8k)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[var(--foreground)]">
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                  Reserved
                </span>
                <span className="font-semibold text-[var(--foreground)]">22% (5.5k)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 6. Modal: New Relocation Plan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] shadow-2xl w-full max-w-lg p-5">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[var(--primary)]" />
                <h3 className="text-sm font-bold text-[var(--foreground)]">Create New Relocation Plan</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[var(--muted-foreground)] hover:text-[var(--muted-foreground)] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="font-semibold text-[var(--foreground)] block mb-1">Habitation Name *</label>
                <input
                  type="text"
                  required
                  value={newHabitation}
                  onChange={(e) => setNewHabitation(e.target.value)}
                  placeholder="e.g. Lower Harangajao Settlement"
                  className="w-full h-8 px-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-xs text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[var(--foreground)] block mb-1">District</label>
                  <select
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full h-8 px-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-xs text-[var(--foreground)] focus:outline-none"
                  >
                    <option value="Dima Hasao">Dima Hasao</option>
                    <option value="Sonitpur">Sonitpur</option>
                    <option value="West Garo Hills">West Garo Hills</option>
                    <option value="Aizawl">Aizawl</option>
                    <option value="Mangan">Mangan</option>
                    <option value="Papum Pare">Papum Pare</option>
                    <option value="Majuli">Majuli</option>
                    <option value="Dhemaji">Dhemaji</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[var(--foreground)] block mb-1">Target Population</label>
                  <input
                    type="text"
                    value={newPopulation}
                    onChange={(e) => setNewPopulation(e.target.value)}
                    placeholder="e.g. 2,400"
                    className="w-full h-8 px-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-xs text-[var(--foreground)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[var(--foreground)] block mb-1">Assigned Shelter</label>
                  <input
                    type="text"
                    value={newShelter}
                    onChange={(e) => setNewShelter(e.target.value)}
                    className="w-full h-8 px-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-xs text-[var(--foreground)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[var(--foreground)] block mb-1">Risk Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full h-8 px-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-xs text-[var(--foreground)] focus:outline-none"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)] mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 bg-[var(--muted)] hover:bg-[var(--border)] text-[var(--foreground)] rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[var(--color-dark-surface)] hover:bg-[var(--color-dark-raised)] text-white rounded-lg text-xs font-semibold shadow-sm cursor-pointer"
                >
                  Create Plan & Map Settlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
