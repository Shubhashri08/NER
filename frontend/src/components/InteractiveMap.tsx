import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Plus, 
  Minus, 
  Crosshair,
  Maximize2
} from 'lucide-react';
import type { 
  IncidentRecord, 
  WarehouseRecord, 
  VehicleRecord, 
  ShelterRecord, 
  MissionRecord, 
  RoadSegmentRecord 
} from '../services/api';

export interface InteractiveMapProps {
  incidents?: IncidentRecord[];
  warehouses?: WarehouseRecord[];
  vehicles?: VehicleRecord[];
  shelters?: ShelterRecord[];
  missions?: MissionRecord[];
  roads?: RoadSegmentRecord[];
  activeLayers?: {
    incidents?: boolean;
    shelters?: boolean;
    warehouses?: boolean;
    vehicles?: boolean;
    missions?: boolean;
    roads?: boolean;
    weather?: boolean;
    boundaries?: boolean;
  };
  onSelectEntity?: (entity: { type: string; data: any }) => void;
  selectedEntity?: { type: string; data: any } | null;
  height?: string | number;
  interactive?: boolean;
  showControls?: boolean;
  mapType?: 'satellite' | 'terrain';
  centerLat?: number;
  centerLng?: number;
  zoomLevel?: number;
  isDark?: boolean;
  compact?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  incidents = [],
  warehouses = [],
  vehicles = [],
  shelters = [],
  missions = [],
  roads = [],
  activeLayers = {
    incidents: true,
    shelters: true,
    warehouses: true,
    vehicles: true,
    missions: true,
    roads: true,
    weather: true,
    boundaries: true,
  },
  onSelectEntity,
  selectedEntity: _selectedEntity,
  height = '100%',
  interactive = true,
  showControls = true,
  mapType: initialMapType = 'satellite',
  centerLat = 25.8,
  centerLng = 93.4,
  zoomLevel = 7,
  isDark = false,
  compact = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupsRef = useRef<{
    tileLayer?: L.TileLayer;
    incidents?: L.LayerGroup;
    warehouses?: L.LayerGroup;
    vehicles?: L.LayerGroup;
    shelters?: L.LayerGroup;
    missions?: L.LayerGroup;
    roads?: L.LayerGroup;
    labels?: L.LayerGroup;
  }>({});

  const [currentMapType, setCurrentMapType] = useState<'satellite' | 'terrain'>(initialMapType);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: zoomLevel,
        zoomControl: false,
        attributionControl: false,
        dragging: interactive,
        scrollWheelZoom: interactive,
        doubleClickZoom: interactive,
        boxZoom: interactive,
        touchZoom: interactive,
      });

      mapInstanceRef.current = map;

      // Layer Groups
      layerGroupsRef.current.incidents = L.layerGroup().addTo(map);
      layerGroupsRef.current.warehouses = L.layerGroup().addTo(map);
      layerGroupsRef.current.vehicles = L.layerGroup().addTo(map);
      layerGroupsRef.current.shelters = L.layerGroup().addTo(map);
      layerGroupsRef.current.missions = L.layerGroup().addTo(map);
      layerGroupsRef.current.roads = L.layerGroup().addTo(map);
      layerGroupsRef.current.labels = L.layerGroup().addTo(map);

      // Force recalculation of dimensions
      setTimeout(() => {
        map.invalidateSize();
      }, 100);

      // Setup ResizeObserver for responsive adjustment
      const ro = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      ro.observe(mapContainerRef.current);

      return () => {
        ro.disconnect();
        map.remove();
        mapInstanceRef.current = null;
      };
    }
  }, []);

  // Update Base Tile Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (layerGroupsRef.current.tileLayer) {
      map.removeLayer(layerGroupsRef.current.tileLayer);
    }

    let tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    let maxZoom = 18;

    if (currentMapType === 'terrain') {
      tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      maxZoom = 17;
    }

    const newTileLayer = L.tileLayer(tileUrl, {
      maxZoom,
      subdomains: 'abc',
    }).addTo(map);

    layerGroupsRef.current.tileLayer = newTileLayer;

    // Trigger invalidateSize to ensure tiles render immediately
    map.invalidateSize();
  }, [currentMapType]);

  // Update Regional Labels (States and neighboring countries)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const labelsGroup = layerGroupsRef.current.labels;
    if (!map || !labelsGroup) return;

    labelsGroup.clearLayers();

    const stateLabels = [
      { name: 'BHUTAN', lat: 27.25, lng: 90.45, border: true },
      { name: 'ARUNACHAL\nPRADESH', lat: 27.7, lng: 94.2 },
      { name: 'ASSAM', lat: 26.25, lng: 92.8 },
      { name: 'MEGHALAYA', lat: 25.35, lng: 91.2 },
      { name: 'NAGALAND', lat: 26.15, lng: 94.6 },
      { name: 'MANIPUR', lat: 24.8, lng: 93.9 },
      { name: 'TRIPURA', lat: 23.8, lng: 91.5 },
      { name: 'MIZORAM', lat: 23.2, lng: 92.8 },
      { name: 'BANGLADESH', lat: 24.5, lng: 90.3, border: true },
      { name: 'MYANMAR', lat: 24.0, lng: 95.1, border: true },
    ];

    stateLabels.forEach((lbl) => {
      const isMultiLine = lbl.name.includes('\n');
      const formattedName = isMultiLine ? lbl.name.replace('\n', '<br/>') : lbl.name;

      const icon = L.divIcon({
        className: 'custom-state-label',
        html: `<div style="
          color: ${lbl.border ? 'rgba(215, 225, 235, 0.45)' : 'rgba(255, 255, 255, 0.8)'};
          font-family: 'Inter', -apple-system, sans-serif;
          font-size: ${lbl.border ? '11px' : '10px'};
          font-weight: 800;
          letter-spacing: 0.2em;
          text-align: center;
          line-height: 1.25;
          text-shadow: 0 1px 4px rgba(0,0,0,0.95), 0 0 10px rgba(0,0,0,0.9);
          white-space: nowrap;
          pointer-events: none;
          transform: translate(-50%, -50%);
        ">${formattedName}</div>`,
        iconSize: [140, 30],
        iconAnchor: [70, 15],
      });
      L.marker([lbl.lat, lbl.lng], { icon, interactive: false }).addTo(labelsGroup);
    });
  }, []);

  // Render Markers and Features
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Fly to centerLat/centerLng when changed
    if (centerLat && centerLng) {
      map.flyTo([centerLat, centerLng], zoomLevel || 7, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }

    // 1. Incidents Layer (8 Distinct Active Regional Incidents)
    const incidentsGroup = layerGroupsRef.current.incidents;
    if (incidentsGroup) {
      incidentsGroup.clearLayers();
      if (activeLayers.incidents) {
        const defaultIncidents = [
          { id: 'INC-001', title: 'Dima Hasao', subtitle: 'Landslide on NH-27', lat: 25.40, lng: 93.20, severity: 'CRITICAL', impact_status: 'Road Blocked' },
          { id: 'INC-002', title: 'Sonitpur', subtitle: 'Flash Flooding', lat: 26.65, lng: 92.80, severity: 'HIGH', impact_status: 'Multiple Villages Inundated' },
          { id: 'INC-003', title: 'Tura', subtitle: 'Bridge Damage', lat: 25.52, lng: 90.22, severity: 'HIGH', impact_status: 'Limited Access' },
          { id: 'INC-004', title: 'Aizawl', subtitle: 'Heavy Rainfall Alert', lat: 23.73, lng: 92.72, severity: 'MEDIUM', impact_status: 'High Risk (140mm)' },
          { id: 'INC-005', title: 'Itanagar', subtitle: 'River Overflow Monitoring', lat: 27.08, lng: 93.60, severity: 'LOW', impact_status: 'Monitoring' },
          { id: 'INC-006', title: 'Mokokchung', subtitle: 'Flash Flood Watch', lat: 26.32, lng: 94.52, severity: 'HIGH', impact_status: 'Hill Inundation' },
          { id: 'INC-007', title: 'Mangan', subtitle: 'Glacial Runoff & Landslide', lat: 27.51, lng: 88.53, severity: 'CRITICAL', impact_status: 'Debris Flow on NH-10' },
          { id: 'INC-008', title: 'Churachandpur', subtitle: 'Valley Inundation Alert', lat: 24.33, lng: 93.67, severity: 'MEDIUM', impact_status: 'Valley Inundation' },
        ];

        const activeIncidents = incidents.length >= 8 ? incidents.map((inc) => {
          const loc = inc.location || (inc.coordinates ? { lat: (inc.coordinates as any).lat ?? (inc.coordinates as any).latitude, lng: (inc.coordinates as any).lng ?? (inc.coordinates as any).longitude } : { lat: 25.4, lng: 93.2 });
          return {
            ...inc,
            lat: loc.lat || 25.4,
            lng: loc.lng || 93.2,
            title: inc.location_name?.split(',')[0] || inc.title || inc.type || 'Incident',
            subtitle: inc.impact_status || inc.description?.split('—')[0]?.trim() || inc.type || 'Active Alert',
            severity: inc.severity || 'HIGH',
          };
        }) : defaultIncidents;

        activeIncidents.forEach((inc) => {
          const isCritical = inc.severity === 'CRITICAL';
          const isHigh = inc.severity === 'HIGH';
          const ringColor = isCritical ? '#EF4444' : isHigh ? '#F59E0B' : '#38BDF8';

          const titleTag = inc.title
            ? `${inc.title}<br/><span style="font-size:9px;color:#cbd5e1;font-weight:normal">${inc.subtitle}</span>`
            : '';

          const icon = L.divIcon({
            className: 'custom-incident-marker',
            html: `
              <div style="position: relative; display: flex; align-items: center; cursor: pointer;">
                <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
                  <div style="
                    position: absolute;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: ${ringColor};
                    opacity: 0.35;
                    animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                  "></div>
                  <div style="
                    width: 26px;
                    height: 26px;
                    border-radius: 50%;
                    background: #0B0E17;
                    border: 2px solid ${ringColor};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.9);
                    color: ${ringColor};
                  ">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                  </div>
                </div>
                ${titleTag ? `
                  <div style="
                    margin-left: 6px;
                    padding: 3px 8px;
                    background: rgba(8, 14, 24, 0.95);
                    border: 1px solid rgba(45, 65, 90, 0.85);
                    border-radius: 4px;
                    color: #FFFFFF;
                    font-family: 'Inter', sans-serif;
                    font-size: 11px;
                    font-weight: 600;
                    line-height: 1.2;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.7);
                    white-space: nowrap;
                    pointer-events: none;
                  ">${titleTag}</div>
                ` : ''}
              </div>
            `,
            iconSize: [170, 34],
            iconAnchor: [17, 17],
          });

          const marker = L.marker([inc.lat, inc.lng], { icon });
          marker.on('click', () => {
            if (onSelectEntity) onSelectEntity({ type: 'incident', data: inc });
          });
          marker.addTo(incidentsGroup);
        });
      }
    }

    // 2. Shelters Layer (5 Operational Safe Havens across NER)
    const sheltersGroup = layerGroupsRef.current.shelters;
    if (sheltersGroup) {
      sheltersGroup.clearLayers();
      if (activeLayers.shelters) {
        const defaultShelters = [
          { id: 'SH-01', name: 'Haflong Safe Haven', lat: 25.185, lng: 93.027, occupancy: 210, capacity: 650, state: 'Assam' },
          { id: 'SH-02', name: 'Silchar Mega Shelter', lat: 24.835, lng: 92.795, occupancy: 740, capacity: 2500, state: 'Assam' },
          { id: 'SH-03', name: 'Mangan High-Ground Shelter', lat: 27.508, lng: 88.530, occupancy: 320, capacity: 400, state: 'Sikkim' },
          { id: 'SH-04', name: 'Shillong Central Auditorium', lat: 25.571, lng: 91.885, occupancy: 350, capacity: 1500, state: 'Meghalaya' },
          { id: 'SH-05', name: 'Chimpu Youth Hostel Shelter', lat: 27.086, lng: 93.618, occupancy: 180, capacity: 800, state: 'Arunachal Pradesh' },
        ];

        const shelterPositions = shelters.length >= 5 ? shelters.map((s) => {
          const loc = s.coordinates || { lat: (s as any).lat || 25.185, lng: (s as any).lng || 93.027 };
          return {
            ...s,
            lat: loc.lat || (s as any).lat || 25.185,
            lng: loc.lng || (s as any).lng || 93.027,
            name: s.name || 'Shelter Safe Haven',
          };
        }) : defaultShelters;

        shelterPositions.forEach((sh) => {
          const icon = L.divIcon({
            className: 'custom-shelter-marker',
            html: `
              <div style="position: relative; display: flex; align-items: center; cursor: pointer;">
                <div style="
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: #0B0E17;
                  border: 2px solid #10B981;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 0 0 10px rgba(16, 185, 129, 0.5), 0 2px 8px rgba(0,0,0,0.9);
                  color: #10B981;
                ">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <div style="
                  margin-left: 5px;
                  padding: 2px 6px;
                  background: rgba(8, 14, 24, 0.90);
                  border: 1px solid rgba(16, 185, 129, 0.4);
                  border-radius: 3px;
                  color: #E2E8F0;
                  font-family: 'Inter', sans-serif;
                  font-size: 10px;
                  font-weight: 600;
                  white-space: nowrap;
                  pointer-events: none;
                ">${sh.name}</div>
              </div>
            `,
            iconSize: [160, 24],
            iconAnchor: [12, 12],
          });

          const marker = L.marker([sh.lat, sh.lng], { icon });
          marker.on('click', () => {
            if (onSelectEntity) onSelectEntity({ type: 'shelter', data: sh });
          });
          marker.addTo(sheltersGroup);
        });
      }
    }

    // 3. Warehouses Layer (4 Strategic Supply Hubs)
    const warehousesGroup = layerGroupsRef.current.warehouses;
    if (warehousesGroup) {
      warehousesGroup.clearLayers();
      if (activeLayers.warehouses) {
        const defaultWarehouses = [
          { id: 'WH01', name: 'Guwahati Strategic Hub', lat: 26.14, lng: 91.73, capacity: 50000, state: 'Assam' },
          { id: 'WH02', name: 'Dima Hasao Regional Depot', lat: 25.185, lng: 93.025, capacity: 15000, state: 'Assam' },
          { id: 'WH03', name: 'Silchar Strategic Reserve', lat: 24.833, lng: 92.778, capacity: 25000, state: 'Assam' },
          { id: 'WH04', name: 'Aizawl Staging Depot', lat: 23.73, lng: 92.72, capacity: 10000, state: 'Mizoram' },
        ];

        const warehousePositions = warehouses.length >= 4 ? warehouses.map((w) => {
          const loc = w.coordinates || { lat: 26.18, lng: 91.74 };
          return {
            ...w,
            lat: loc.lat,
            lng: loc.lng,
            name: w.name || 'Warehouse Depot',
          };
        }) : defaultWarehouses;

        warehousePositions.forEach((wh) => {
          const icon = L.divIcon({
            className: 'custom-warehouse-marker',
            html: `
              <div style="position: relative; display: flex; align-items: center; cursor: pointer;">
                <div style="
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: #0B0E17;
                  border: 2px solid #8B5CF6;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 0 0 10px rgba(139, 92, 246, 0.5), 0 2px 8px rgba(0,0,0,0.9);
                  color: #8B5CF6;
                ">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="m7.5 4.27 9 5.15"/>
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                    <path d="m3.3 7 8.7 5 8.7-5"/>
                    <path d="M12 22V12"/>
                  </svg>
                </div>
                <div style="
                  margin-left: 5px;
                  padding: 2px 6px;
                  background: rgba(8, 14, 24, 0.90);
                  border: 1px solid rgba(139, 92, 246, 0.4);
                  border-radius: 3px;
                  color: #E2E8F0;
                  font-family: 'Inter', sans-serif;
                  font-size: 10px;
                  font-weight: 600;
                  white-space: nowrap;
                  pointer-events: none;
                ">${wh.name}</div>
              </div>
            `,
            iconSize: [160, 24],
            iconAnchor: [12, 12],
          });

          const marker = L.marker([wh.lat, wh.lng], { icon });
          marker.on('click', () => {
            if (onSelectEntity) onSelectEntity({ type: 'warehouse', data: wh });
          });
          marker.addTo(warehousesGroup);
        });
      }
    }

    // 4. Vehicles Layer (5 Tactical Transport & QRV Fleet)
    const vehiclesGroup = layerGroupsRef.current.vehicles;
    if (vehiclesGroup) {
      vehiclesGroup.clearLayers();
      if (activeLayers.vehicles) {
        const defaultVehicles = [
          { id: 'VH001', callsign: 'BRAHMAPUTRA-TACTICAL-01', lat: 26.14, lng: 91.73, status: 'Available', tag: 'Guwahati<br/><span style="font-size:9px;color:#cbd5e1;font-weight:normal">Heavy 4x4 Cargo</span>' },
          { id: 'VH002', callsign: 'BRAHMAPUTRA-TACTICAL-02', lat: 26.75, lng: 94.22, status: 'In Transit', tag: 'Jorhat<br/><span style="font-size:9px;color:#cbd5e1;font-weight:normal">Relief Convoy</span>' },
          { id: 'VH004', callsign: 'MEGHALAYA-OFFROAD-01', lat: 25.57, lng: 91.88, status: 'Available', tag: 'Shillong<br/><span style="font-size:9px;color:#cbd5e1;font-weight:normal">Command QRV</span>' },
          { id: 'VH005', callsign: 'MEGHALAYA-OFFROAD-02', lat: 25.52, lng: 90.22, status: 'In Transit', tag: 'Tura<br/><span style="font-size:9px;color:#cbd5e1;font-weight:normal">Tactical 4x4 QRV</span>' },
          { id: 'VH006', callsign: 'HILL-DEFENDER-01', lat: 25.18, lng: 93.02, status: 'Available', tag: 'Haflong<br/><span style="font-size:9px;color:#cbd5e1;font-weight:normal">All-Terrain Fleet</span>' },
          { id: 'VH007', callsign: 'HILL-DEFENDER-02', lat: 25.35, lng: 93.15, status: 'In Transit', tag: 'Maibong<br/><span style="font-size:9px;color:#cbd5e1;font-weight:normal">All-Terrain 4x4</span>' },
          { id: 'VH008', callsign: 'HILL-DEFENDER-03', lat: 25.40, lng: 93.20, status: 'In Transit', tag: 'Harangajao<br/><span style="font-size:9px;color:#cbd5e1;font-weight:normal">Heavy Cargo</span>' },
          { id: 'VH009', callsign: 'CONVOY-BUS-01', lat: 26.18, lng: 91.75, status: 'Available', tag: 'Guwahati Transit<br/><span style="font-size:9px;color:#cbd5e1;font-weight:normal">Evac Bus (50 Pax)</span>' },
          { id: 'VH010', callsign: 'CONVOY-BUS-02', lat: 24.83, lng: 92.79, status: 'Available', tag: 'Silchar<br/><span style="font-size:9px;color:#cbd5e1;font-weight:normal">Evacuation Bus</span>' },
          { id: 'VH011', callsign: 'ARUNACHAL-RAPID-01', lat: 27.08, lng: 93.60, status: 'In Transit', tag: 'Itanagar<br/><span style="font-size:9px;color:#cbd5e1;font-weight:normal">Rapid 4x4</span>' },
          { id: 'VH013', callsign: 'NAGALAND-EXPEDITION-01', lat: 25.67, lng: 94.11, status: 'Available', tag: 'Kohima<br/><span style="font-size:9px;color:#cbd5e1;font-weight:normal">Highland 4x4</span>' },
          { id: 'VH015', callsign: 'SIKKIM-ALPINE-01', lat: 27.33, lng: 88.61, status: 'Available', tag: 'Gangtok<br/><span style="font-size:9px;color:#cbd5e1;font-weight:normal">Alpine Truck</span>' },
          { id: 'VH016', callsign: 'SIKKIM-ALPINE-02', lat: 27.51, lng: 88.53, status: 'In Transit', tag: 'Mangan<br/><span style="font-size:9px;color:#cbd5e1;font-weight:normal">Alpine QRV</span>' },
          { id: 'VH021', callsign: 'MANIPUR-RELIEF-01', lat: 24.81, lng: 93.94, status: 'Available', tag: 'Imphal<br/><span style="font-size:9px;color:#cbd5e1;font-weight:normal">Relief Heavy 4x4</span>' },
          { id: 'VH023', callsign: 'TRIPURA-CORRIDOR-01', lat: 23.83, lng: 91.28, status: 'Available', tag: 'Agartala<br/><span style="font-size:9px;color:#cbd5e1;font-weight:normal">Corridor Transporter</span>' },
        ];

        const vehicleData = vehicles.length >= 15 ? vehicles.map((v) => {
          const loc = v.coordinates || v.current_location || { lat: (v as any).lat || 26.75, lng: (v as any).lng || 94.22 };
          return {
            ...v,
            lat: loc.lat || (v as any).lat || 26.75,
            lng: loc.lng || (v as any).lng || 94.22,
            tag: `${v.callsign || v.type || 'Relief Convoy'}<br/><span style="font-size:9px;color:#cbd5e1;font-weight:normal">${v.status || 'En Route'}</span>`,
          };
        }) : defaultVehicles;

        vehicleData.forEach((vh) => {
          const icon = L.divIcon({
            className: 'custom-vehicle-marker',
            html: `
              <div style="position: relative; display: flex; align-items: center; cursor: pointer;">
                <div style="
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: #0B0E17;
                  border: 2px solid #38BDF8;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 0 0 10px rgba(56, 189, 248, 0.5), 0 2px 8px rgba(0,0,0,0.9);
                  color: #38BDF8;
                ">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M10 17h4V5H2v12h3"/>
                    <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1"/>
                    <circle cx="7.5" cy="17.5" r="2.5"/>
                    <circle cx="17.5" cy="17.5" r="2.5"/>
                  </svg>
                </div>
                ${vh.tag ? `
                  <div style="
                    margin-left: 6px;
                    padding: 3px 8px;
                    background: rgba(8, 14, 24, 0.95);
                    border: 1px solid rgba(45, 65, 90, 0.85);
                    border-radius: 4px;
                    color: #FFFFFF;
                    font-family: 'Inter', sans-serif;
                    font-size: 11px;
                    font-weight: 600;
                    line-height: 1.2;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.7);
                    white-space: nowrap;
                    pointer-events: none;
                  ">${vh.tag}</div>
                ` : ''}
              </div>
            `,
            iconSize: [160, 24],
            iconAnchor: [12, 12],
          });

          const marker = L.marker([vh.lat, vh.lng], { icon });
          marker.on('click', () => {
            if (onSelectEntity) onSelectEntity({ type: 'vehicle', data: vh });
          });
          marker.addTo(vehiclesGroup);
        });
      }
    }

    // 5. Missions Layer (8 Active Operational Missions)
    const missionsGroup = layerGroupsRef.current.missions;
    if (missionsGroup) {
      missionsGroup.clearLayers();
      if (activeLayers.missions) {
        const defaultMissions = [
          { id: 'MIS001', title: 'Harangajao Supply', lat: 25.40, lng: 93.20, origin: [26.14, 91.73], dest: [25.40, 93.20], status: 'In Transit' },
          { id: 'MIS002', title: 'Tura Hospital Kits', lat: 25.52, lng: 90.22, origin: [26.14, 91.73], dest: [25.52, 90.22], status: 'In Transit' },
          { id: 'MIS003', title: 'Aizawl Fuel Delivery', lat: 23.73, lng: 92.72, origin: [24.83, 92.78], dest: [23.73, 92.72], status: 'In Transit' },
          { id: 'MIS004', title: 'Maibong Food Packets', lat: 25.30, lng: 93.16, origin: [25.185, 93.025], dest: [25.30, 93.16], status: 'Started' },
          { id: 'MIS005', title: 'Jatinga Shelter Kits', lat: 25.12, lng: 93.04, origin: [26.14, 91.73], dest: [25.12, 93.04], status: 'Delayed' },
          { id: 'MIS006', title: 'Sonitpur Food Rations', lat: 26.65, lng: 92.80, origin: [26.14, 91.73], dest: [26.65, 92.80], status: 'In Transit' },
          { id: 'MIS007', title: 'Mokokchung Water Kits', lat: 26.32, lng: 94.52, origin: [26.75, 94.22], dest: [26.32, 94.52], status: 'Approved' },
          { id: 'MIS008', title: 'Mangan Medical Packs', lat: 27.51, lng: 88.53, origin: [27.33, 88.61], dest: [27.51, 88.53], status: 'In Transit' },
        ];

        const missionList = missions.length >= 8 ? missions.map((m) => {
          const destLoc = m.destination || { lat: 25.4, lng: 93.2 };
          const origLoc = m.origin || { lat: 26.14, lng: 91.73 };
          return {
            id: m.id || 'MIS001',
            title: m.title || 'Relief Mission',
            lat: destLoc.lat || 25.4,
            lng: destLoc.lng || 93.2,
            origin: [origLoc.lat || 26.14, origLoc.lng || 91.73] as [number, number],
            dest: [destLoc.lat || 25.4, destLoc.lng || 93.2] as [number, number],
            status: m.status || 'In Transit',
          };
        }) : defaultMissions;

        missionList.forEach((msn) => {
          const icon = L.divIcon({
            className: 'custom-mission-marker',
            html: `
              <div style="position: relative; display: flex; align-items: center; cursor: pointer;">
                <div style="
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: #0B0E17;
                  border: 2px solid #F59E0B;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 0 0 10px rgba(245, 158, 11, 0.5), 0 2px 8px rgba(0,0,0,0.9);
                  color: #F59E0B;
                ">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                  </svg>
                </div>
                <div style="
                  margin-left: 6px;
                  padding: 3px 8px;
                  background: rgba(8, 14, 24, 0.95);
                  border: 1px solid rgba(245, 158, 11, 0.5);
                  border-radius: 4px;
                  color: #FFFFFF;
                  font-family: 'Inter', sans-serif;
                  font-size: 11px;
                  font-weight: 600;
                  line-height: 1.2;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.7);
                  white-space: nowrap;
                  pointer-events: none;
                ">
                  ${msn.title}<br/><span style="font-size:9px;color:#cbd5e1;font-weight:normal">${msn.status}</span>
                </div>
              </div>
            `,
            iconSize: [160, 24],
            iconAnchor: [12, 12],
          });

          L.marker([msn.lat, msn.lng], { icon }).addTo(missionsGroup);

          // Render dashed Amber Mission Route polyline
          if (msn.origin && msn.dest) {
            L.polyline([msn.origin as [number, number], msn.dest as [number, number]], {
              color: '#F59E0B',
              weight: 2.5,
              dashArray: '5, 5',
              opacity: 0.85,
            }).addTo(missionsGroup);
          }
        });
      }
    }

    // 6. Road Status Layer (5 Distinct Road Segments)
    const roadsGroup = layerGroupsRef.current.roads;
    if (roadsGroup) {
      roadsGroup.clearLayers();
      if (activeLayers.roads) {
        // 1. RD-01: NH-27 Jatinga-Harangajao Corridor (BLOCKED - Landslide)
        const rd1: [number, number][] = [
          [25.40, 93.20],
          [25.28, 93.12],
          [25.12, 93.04],
        ];
        L.polyline(rd1, {
          color: '#EF4444',
          weight: 4,
          dashArray: '6, 6',
          opacity: 0.95,
        }).addTo(roadsGroup);

        // 2. RD-02: NH-51 Tura-Rongram Highway (RESTRICTED - Bridge Scour)
        const rd2: [number, number][] = [
          [25.52, 90.22],
          [25.64, 90.31],
          [25.75, 90.40],
        ];
        L.polyline(rd2, {
          color: '#F59E0B',
          weight: 3.5,
          dashArray: '6, 6',
          opacity: 0.9,
        }).addTo(roadsGroup);

        // 3. RD-03: NH-6 Jowai-Silchar Corridor (BLOCKED - Rockfall)
        const rd3: [number, number][] = [
          [25.45, 92.20],
          [25.15, 92.50],
          [24.83, 92.79],
        ];
        L.polyline(rd3, {
          color: '#EF4444',
          weight: 4,
          dashArray: '6, 6',
          opacity: 0.95,
        }).addTo(roadsGroup);

        // 4. RD-04: BRO Old Mahur Bypass Corridor (CLEAR - 4x4 Passable)
        const rd4: [number, number][] = [
          [25.185, 93.025],
          [25.29, 93.10],
          [25.40, 93.20],
        ];
        L.polyline(rd4, {
          color: '#10B981',
          weight: 3,
          dashArray: '4, 4',
          opacity: 0.85,
        }).addTo(roadsGroup);

        // 5. RD-05: NH-29 Kohima-Dimapur Expressway (CLEAR - Open Route)
        const rd5: [number, number][] = [
          [25.90, 93.75],
          [25.78, 93.93],
          [25.67, 94.11],
        ];
        L.polyline(rd5, {
          color: '#38BDF8',
          weight: 3,
          opacity: 0.85,
        }).addTo(roadsGroup);
      }
    }

    // 7. Weather Radar Layer (Precipitation circles & gauges when active)
    if (activeLayers.weather && incidentsGroup) {
      const weatherAlerts = [
        { lat: 26.65, lng: 92.80, text: 'Sonitpur: 85mm Rain', radius: 45000, color: '#38BDF8' },
        { lat: 23.73, lng: 92.72, text: 'Aizawl: 140mm Heavy Rain', radius: 35000, color: '#60A5FA' },
        { lat: 25.40, lng: 93.20, text: 'Haflong: Landslide Risk Zone', radius: 30000, color: '#F87171' },
      ];

      weatherAlerts.forEach((w) => {
        L.circle([w.lat, w.lng], {
          radius: w.radius,
          color: w.color,
          fillColor: w.color,
          fillOpacity: 0.18,
          weight: 1.5,
          dashArray: '4, 4',
        }).addTo(incidentsGroup);
      });
    }
  }, [incidents, warehouses, vehicles, shelters, missions, roads, activeLayers]);

  // Controls
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetView = () => mapInstanceRef.current?.setView([centerLat, centerLng], zoomLevel);
  const handleToggleFullscreen = () => {
    if (!mapContainerRef.current) return;
    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <div 
      style={{ height }}
      className={`relative w-full h-full min-h-[300px] overflow-hidden ${isDark ? 'bg-[var(--color-dark-paper)]' : 'bg-slate-100'} ${compact ? 'text-xs' : ''}`}
    >
      <div 
        ref={mapContainerRef} 
        className={`w-full h-full min-h-[300px] z-0 ${isDark ? 'bg-[var(--color-dark-paper)]' : 'bg-slate-100'}`}
      />

      {/* Floating Map Controls (Top Right: +, -, 🎯, ⛶) */}
      {showControls && (
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 shadow-md">
          <button
            onClick={handleZoomIn}
            className={`w-8 h-8 rounded flex items-center justify-center transition-colors cursor-pointer backdrop-blur-sm border ${
              isDark 
                ? 'bg-[var(--color-dark-surface)]/90 hover:bg-[var(--color-dark-raised)] text-slate-200 border-[var(--color-dark-rule)]'
                : 'bg-white/95 hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
            }`}
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className={`w-8 h-8 rounded flex items-center justify-center transition-colors cursor-pointer backdrop-blur-sm border ${
              isDark 
                ? 'bg-[var(--color-dark-surface)]/90 hover:bg-[var(--color-dark-raised)] text-slate-200 border-[var(--color-dark-rule)]'
                : 'bg-white/95 hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
            }`}
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            className={`w-8 h-8 rounded flex items-center justify-center transition-colors cursor-pointer backdrop-blur-sm border ${
              isDark 
                ? 'bg-[var(--color-dark-surface)]/90 hover:bg-[var(--color-dark-raised)] text-slate-200 border-[var(--color-dark-rule)]'
                : 'bg-white/95 hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
            }`}
            title="Center Region"
          >
            <Crosshair className="w-4 h-4" />
          </button>
          <button
            onClick={handleToggleFullscreen}
            className={`w-8 h-8 rounded flex items-center justify-center transition-colors cursor-pointer backdrop-blur-sm border ${
              isDark 
                ? 'bg-[var(--color-dark-surface)]/90 hover:bg-[var(--color-dark-raised)] text-slate-200 border-[var(--color-dark-rule)]'
                : 'bg-white/95 hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
            }`}
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Distance Scale Bar (Bottom Right-Center) */}
      <div className={`absolute bottom-4 right-36 z-20 hidden sm:flex items-center gap-2 border px-3 py-1 rounded text-[10px] font-mono shadow-md backdrop-blur-sm ${
        isDark ? 'bg-[var(--color-dark-surface)]/85 border-[var(--color-dark-rule)] text-slate-300' : 'bg-white/90 border-slate-200 text-slate-700'
      }`}>
        <span>0</span>
        <div className={`w-10 h-1 relative ${isDark ? 'bg-slate-400' : 'bg-slate-300'}`}>
          <div className={`absolute top-0 left-1/2 w-px h-1.5 -translate-x-1/2 ${isDark ? 'bg-slate-200' : 'bg-slate-600'}`} />
        </div>
        <span>50</span>
        <div className={`w-10 h-1 relative ${isDark ? 'bg-slate-400' : 'bg-slate-300'}`}>
          <div className={`absolute top-0 left-1/2 w-px h-1.5 -translate-x-1/2 ${isDark ? 'bg-slate-200' : 'bg-slate-600'}`} />
        </div>
        <span>100</span>
        <div className={`w-12 h-1 relative ${isDark ? 'bg-slate-400' : 'bg-slate-300'}`}>
          <div className={`absolute top-0 left-1/2 w-px h-1.5 -translate-x-1/2 ${isDark ? 'bg-slate-200' : 'bg-slate-600'}`} />
        </div>
        <span>200 km</span>
      </div>

      {/* Satellite / Terrain Toggle (Bottom Right) */}
      {showControls && (
        <div className={`absolute bottom-4 right-4 z-20 flex items-center border rounded p-0.5 shadow-md text-[11px] font-medium backdrop-blur-sm ${
          isDark ? 'bg-[var(--color-dark-surface)]/90 border-[var(--color-dark-rule)]' : 'bg-white/95 border-slate-200'
        }`}>
          <button
            onClick={() => setCurrentMapType('satellite')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              currentMapType === 'satellite'
                ? (isDark ? 'bg-[#182B42] text-white font-semibold shadow-inner' : 'bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold shadow-xs')
                : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900')
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setCurrentMapType('terrain')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              currentMapType === 'terrain'
                ? (isDark ? 'bg-[#182B42] text-white font-semibold shadow-inner' : 'bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold shadow-xs')
                : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900')
            }`}
          >
            Terrain
          </button>
        </div>
      )}
    </div>
  );
};
