import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Truck, 
  Users, 
  RefreshCw, 
  Layers, 
  ChevronDown, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  MapPin, 
  Route, 
  Check, 
  Plus, 
  Search, 
  XCircle, 
  Volume2, 
  Navigation
} from 'lucide-react';
import { InteractiveMap } from './InteractiveMap';

export const ResponseReplanningView: React.FC<{ onNavigateToTab?: (tab: string) => void; isDark?: boolean }> = ({
  onNavigateToTab: _onNavigateToTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'incidents' | 'impact' | 'replanning' | 'routes' | 'reports' | 'approvals'>('incidents');
  const [selectedIncident, setSelectedIncident] = useState<string>('INC-01');
  const [isReplanModalOpen, setIsReplanModalOpen] = useState<boolean>(false);
  const [modalMission, setModalMission] = useState<string>('MS-017');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Field Reports State
  const [reportFilter, setReportFilter] = useState<'ALL' | 'VERIFIED' | 'PENDING'>('ALL');
  const [reportSearch, setReportSearch] = useState('');
  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);
  const [newReportForm, setNewReportForm] = useState({
    title: '',
    location: 'Haflong, Dima Hasao',
    category: 'Landslide',
    description: '',
    reporterName: 'Field Recon Officer',
    severity: 'HIGH'
  });

  // Approvals State
  const [approvalList, setApprovalList] = useState([
    {
      id: 'APR-101',
      title: 'Authorize BRO Old Mahur Bypass for Convoy MS-017',
      category: 'Reroute Authorization',
      priority: 'CRITICAL',
      origin: 'Haflong Depot',
      destination: 'Harangajao PHC',
      cargo: '5,000L Potable Water & Trauma Kits',
      requestedBy: 'Capt. A. Roy (Field Logistics)',
      timeAgo: '12 min ago',
      status: 'Pending',
      details: 'Avoids 200m active debris channel on NH-27 km 65. Verified passable for 4x4 high-clearance tactical vehicles.'
    },
    {
      id: 'APR-102',
      title: 'Emergency Fuel Allocation to Aizawl Civil Hospital',
      category: 'Resource Allocation',
      priority: 'HIGH',
      origin: 'Silchar Strategic Depot',
      destination: 'Aizawl Staging Hub',
      cargo: '8,000L High-Speed Diesel',
      requestedBy: 'Aizawl DC Logistics Cell',
      timeAgo: '28 min ago',
      status: 'Pending',
      details: 'Hospital backup power down to 14% reserve following localized grid transmission tower collapse.'
    },
    {
      id: 'APR-103',
      title: 'Helicopter Airdrop Authorization for Isolated Dzongu Pockets',
      category: 'Airlift Order',
      priority: 'CRITICAL',
      origin: 'Gangtok Air Force Staging',
      destination: 'Upper Dzongu Habitation',
      cargo: '1,500 High-Calorie Ration Packs',
      requestedBy: 'Mangan District Magistrate',
      timeAgo: '45 min ago',
      status: 'Approved',
      details: 'Bridges washed away by glacial burst. Ground corridors completely severed for at least 5 days.'
    },
    {
      id: 'APR-104',
      title: 'Activate Secondary Transit Shelter in Tura Stadium',
      category: 'Shelter Activation',
      priority: 'MEDIUM',
      origin: 'West Garo Hills HQ',
      destination: 'Tura Municipal Stadium',
      cargo: '500 All-Weather Tents & Sanitation Packs',
      requestedBy: 'Tura SDM',
      timeAgo: '1.5 hours ago',
      status: 'Approved',
      details: 'Existing primary shelter reached 94% occupancy headroom following flash flood evacuation.'
    }
  ]);

  // Dynamic Incidents List State
  const [incidentsList, setIncidentsList] = useState([
    {
      id: 'INC-01',
      title: 'Landslide on NH-27',
      location: 'Dima Hasao, Assam',
      time: '2 hours ago',
      severity: 'CRITICAL' as const,
      image: '/images/road-valley-bg.jpg',
      impactedPeople: '14,200',
      roadsBlocked: 'NH-27 (km 65)',
      description: 'Severe hill slope subsidence blocked NH-27 near Jatinga, severing main vehicular access.'
    },
    {
      id: 'INC-02',
      title: 'Flash Flooding',
      location: 'Sonitpur, Assam',
      time: '4 hours ago',
      severity: 'HIGH' as const,
      image: '/images/road-valley-bg.jpg',
      impactedPeople: '18,400',
      roadsBlocked: 'SH-12 (Tezpur Link)',
      description: 'Brahmaputra tributary overflow inundated low-lying riverine communities.'
    },
    {
      id: 'INC-03',
      title: 'Bridge Damage',
      location: 'West Garo Hills, Meghalaya',
      time: '6 hours ago',
      severity: 'HIGH' as const,
      image: '/images/road-valley-bg.jpg',
      impactedPeople: '9,120',
      roadsBlocked: 'Simsang Bridge Approach',
      description: 'Substructure scouring on bridge approach road restricting heavy vehicle transit.'
    },
    {
      id: 'INC-04',
      title: 'Heavy Rainfall & Mudslides',
      location: 'Aizawl, Mizoram',
      time: '8 hours ago',
      severity: 'MEDIUM' as const,
      image: '/images/road-valley-bg.jpg',
      impactedPeople: '4,320',
      roadsBlocked: 'Aizawl-Lunglei Highway',
      description: 'Continuous torrential downpour causing localized hillside debris accumulation.'
    },
    {
      id: 'INC-05',
      title: 'River Overflow',
      location: 'Itanagar, Arunachal Pradesh',
      time: '11 hours ago',
      severity: 'LOW' as const,
      image: '/images/road-valley-bg.jpg',
      impactedPeople: '2,180',
      roadsBlocked: 'Dikrong River Bank Road',
      description: 'Water levels above warning stage; monitoring embankment integrity.'
    },
  ]);

  // Affected Missions List State
  const [affectedMissions, setAffectedMissions] = useState([
    {
      id: 'MS-017',
      title: 'Medical Supplies to Village A',
      cause: 'Delayed due to landslide on NH-27',
      status: 'Delayed',
      badgeClass: 'bg-rose-100 text-rose-700',
      origin: 'Haflong Depot',
      destination: 'Harangajao PHC',
      alternate: 'BRO Old Mahur Bypass (+22.9 min)'
    },
    {
      id: 'MS-021',
      title: 'Food Packets to Maibong',
      cause: 'Rerouting via alternate route',
      status: 'Replanning',
      badgeClass: 'bg-[var(--secondary)] text-[var(--primary)]',
      origin: 'Lumding Hub',
      destination: 'Maibong Community Center',
      alternate: 'Umrangso-Lanka Corridor (+38 min)'
    },
    {
      id: 'MS-038',
      title: 'Shelter Materials to NH-27',
      cause: 'On hold due to road closure',
      status: 'On Hold',
      badgeClass: 'bg-amber-100 text-amber-700',
      origin: 'Silchar Strategic Depot',
      destination: 'Jatinga Staging Camp',
      alternate: 'Waiting for NHIDCL clearance window'
    },
    {
      id: 'MS-042',
      title: 'Fuel Delivery to Aizawl',
      cause: 'New route assigned',
      status: 'Replanned',
      badgeClass: 'bg-emerald-100 text-emerald-700',
      origin: 'Silchar Depot',
      destination: 'Aizawl Hospital',
      alternate: 'Bairabi Lateral Rail Link (+15 min)'
    },
    {
      id: 'MS-044',
      title: 'Medicine Kits to Tura',
      cause: 'Pending approval for route change',
      status: 'Pending',
      badgeClass: 'bg-amber-100 text-amber-700',
      origin: 'Guwahati Depot',
      destination: 'Tura Civil Hospital',
      alternate: 'Goalpara-Phulbari Diversion (+28 min)'
    },
  ]);

  // Verified Alternate Routes Catalogue
  const alternateRoutes = [
    {
      id: 'RTE-BRO-01',
      name: 'BRO Old Mahur Mountain Bypass',
      corridor: 'Haflong - Mahur - Harangajao Axis',
      distance: '18.0 km (Detour: +6.2 km)',
      transitTimeDelta: '+22.9 min',
      surface: 'Unpaved / Compacted Graded Gravel',
      vehicleFeasibility: '100% Passable for 4WD / High Clearance',
      riskScore: 'Low (CR = 1.25)',
      authority: 'BRO Project Pushpak',
      status: 'VERIFIED CLEAR',
      statusColor: 'bg-emerald-100 text-emerald-700'
    },
    {
      id: 'RTE-PWD-02',
      name: 'Umrangso-Lanka Lateral Corridor',
      corridor: 'Dima Hasao - Hojai Regional Link',
      distance: '42.5 km (Detour: +14.8 km)',
      transitTimeDelta: '+45.0 min',
      surface: 'All-Weather Bitumen Paved',
      vehicleFeasibility: 'Passable for Heavy 6x6 Logistics Trucks',
      riskScore: 'Low-Medium (CR = 1.40)',
      authority: 'PWD Assam (Highway Div)',
      status: 'ACTIVE DIVERSION',
      statusColor: 'bg-[var(--secondary)] text-[var(--primary)]'
    },
    {
      id: 'RTE-EMG-03',
      name: 'Jatinga Highland Ridge Spur',
      corridor: 'North Cachar Hillcrest Spur',
      distance: '9.4 km (Detour: +3.1 km)',
      transitTimeDelta: '+14.2 min',
      surface: 'Narrow Hill Track / Single Lane',
      vehicleFeasibility: 'Light 4x4 & Emergency First Responders Only',
      riskScore: 'Medium (CR = 1.65)',
      authority: 'District Police Recon Unit',
      status: 'RESTRICTED PASSAGE',
      statusColor: 'bg-amber-100 text-amber-700'
    },
    {
      id: 'RTE-SEC-04',
      name: 'Lumding-Haflong Forest Perimeter Line',
      corridor: 'Barail Wildlife Sanctuary Boundary Track',
      distance: '31.2 km (Detour: +11.5 km)',
      transitTimeDelta: '+34.0 min',
      surface: 'Graded Earthen / Forest Track',
      vehicleFeasibility: 'Heavy 4WD with Armed/Forest Escort',
      riskScore: 'Medium-High (CR = 1.82)',
      authority: 'Forest Dept / Assam Rifles',
      status: 'ESCORT REQUIRED',
      statusColor: 'bg-rose-100 text-rose-700'
    }
  ];

  // Field Reports Stream Data State
  const [fieldReportsList, setFieldReportsList] = useState([
    {
      id: 'REP-801',
      title: 'Road completely blocked near Jorhat bridge approach',
      author: 'Village Volunteer (Anil Bora)',
      role: 'Community First Responder',
      time: '12 min ago',
      category: 'Road Obstruction',
      status: 'Verified' as 'Verified' | 'Pending Review' | 'Actioned',
      location: 'Jorhat, Assam (26.75° N, 94.22° E)',
      description: 'Flood water overflowed over 200m of the bridge approach road. Water current is strong; small vehicles cannot cross.',
      hasAudio: true,
      audioDuration: '0:38',
      escalatedToIncidentId: undefined as string | undefined
    },
    {
      id: 'REP-802',
      title: 'Water level rising rapidly in Sonitpur lowlands',
      author: 'Field Officer (R. Hazarika)',
      role: 'District Disaster Management Authority',
      time: '36 min ago',
      category: 'Flood Surge',
      status: 'Verified' as 'Verified' | 'Pending Review' | 'Actioned',
      location: 'Tezpur, Sonitpur (26.65° N, 92.79° E)',
      description: 'Embankment seepage observed near Jamugurihat. 4 villages advised to move to elevated school shelters.',
      hasAudio: false,
      escalatedToIncidentId: undefined as string | undefined
    },
    {
      id: 'REP-803',
      title: 'Bridge abutment crack on Simsang River link',
      author: 'Sub-Divisional Officer (SDO Tura)',
      role: 'Civil Administration',
      time: '1 hour ago',
      category: 'Structural Damage',
      status: 'Pending Review' as 'Verified' | 'Pending Review' | 'Actioned',
      location: 'Williamnagar, Meghalaya (25.51° N, 90.62° E)',
      description: 'Heavy riverbed scouring has exposed left pier foundation. Heavy load trucks restricted until structural audit.',
      hasAudio: true,
      audioDuration: '1:12',
      escalatedToIncidentId: undefined as string | undefined
    },
    {
      id: 'REP-804',
      title: 'Massive landslide reported on NH-27 km 65',
      author: 'Local Resident Voice Report',
      role: 'Citizen Telemetry (Verified AI Parse)',
      time: '2 hours ago',
      category: 'Landslide',
      status: 'Actioned' as 'Verified' | 'Pending Review' | 'Actioned',
      location: 'Jatinga, Dima Hasao (25.12° N, 93.04° E)',
      description: 'Huge boulder fall and mud flow covered both lanes. 3 trucks stranded on Haflong side. NHIDCL earthmovers dispatched.',
      hasAudio: true,
      audioDuration: '0:45',
      escalatedToIncidentId: 'INC-01'
    }
  ]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenReplan = (missionId: string) => {
    setModalMission(missionId);
    setIsReplanModalOpen(true);
  };

  const handleConfirmReplan = () => {
    setAffectedMissions((prev) => 
      prev.map((m) => m.id === modalMission ? { 
        ...m, 
        status: 'Replanned', 
        badgeClass: 'bg-emerald-100 text-emerald-700', 
        cause: 'BRO Bypass R2 Route Authorized & Active' 
      } : m)
    );
    setIsReplanModalOpen(false);
    showToast(`Mission ${modalMission} replanned successfully! Dispatched via BRO Bypass.`, 'success');
  };

  const handleApproveAction = (approvalId: string) => {
    setApprovalList((prev) => 
      prev.map((a) => a.id === approvalId ? { ...a, status: 'Approved' } : a)
    );
    showToast(`Action ${approvalId} authorized by District Authority!`, 'success');
  };

  const handleRejectAction = (approvalId: string) => {
    setApprovalList((prev) => 
      prev.map((a) => a.id === approvalId ? { ...a, status: 'Rejected' } : a)
    );
    showToast(`Action ${approvalId} rejected. Coordinator notified.`, 'info');
  };

  const handleVerifyReport = (reportId: string) => {
    setFieldReportsList((prev) =>
      prev.map((r) => r.id === reportId ? { ...r, status: 'Verified' } : r)
    );
    showToast(`Field report ${reportId} marked as Verified!`, 'success');
  };

  // Dynamic Escalation from Field Report to Official Incident
  const handlePromoteToIncident = (reportId: string) => {
    const report = fieldReportsList.find((r) => r.id === reportId);
    if (!report) return;

    const nextIncNum = incidentsList.length + 1;
    const newIncId = `INC-${nextIncNum < 10 ? `0${nextIncNum}` : nextIncNum}`;

    const newIncident = {
      id: newIncId,
      title: report.title,
      location: report.location.split('(')[0].trim() || 'Assam Regional Sector',
      time: 'Just now',
      severity: (report.category === 'Landslide' || report.category === 'Road Obstruction') ? ('CRITICAL' as const) : ('HIGH' as const),
      image: '/images/road-valley-bg.jpg',
      impactedPeople: '4,500',
      roadsBlocked: report.location.includes('Jorhat') ? 'Jorhat Bridge Approach' : report.location.includes('Sonitpur') ? 'SH-12 Bypass' : 'Regional Access Road',
      description: report.description
    };

    // Prepend new incident so it appears immediately at the top of Active Incidents & Map
    setIncidentsList([newIncident, ...incidentsList]);
    setSelectedIncident(newIncId);

    // Update field report state
    setFieldReportsList((prev) =>
      prev.map((r) => r.id === reportId ? { ...r, status: 'Actioned', escalatedToIncidentId: newIncId } : r)
    );

    showToast(`Report ${reportId} escalated to Official Incident ${newIncId}! Added to Active Incidents queue.`, 'success');
  };

  const handleCreateNewReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReportForm.title.trim()) return;

    const newRep = {
      id: `REP-${Math.floor(100 + Math.random() * 900)}`,
      title: newReportForm.title.trim(),
      author: newReportForm.reporterName.trim() || 'Field Officer',
      role: 'Field Recon Officer',
      time: 'Just now',
      category: newReportForm.category,
      status: 'Pending Review' as const,
      location: newReportForm.location,
      description: newReportForm.description.trim() || 'Observation submitted from mobile field client.',
      hasAudio: false,
      escalatedToIncidentId: undefined
    };

    setFieldReportsList([newRep, ...fieldReportsList]);
    setIsNewReportModalOpen(false);
    setNewReportForm({
      title: '',
      location: 'Haflong, Dima Hasao',
      category: 'Landslide',
      description: '',
      reporterName: 'Field Recon Officer',
      severity: 'HIGH'
    });
    showToast(`Field report ${newRep.id} submitted and queued for verification!`, 'success');
  };

  const filteredReports = fieldReportsList.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(reportSearch.toLowerCase()) || 
                          r.location.toLowerCase().includes(reportSearch.toLowerCase()) ||
                          r.author.toLowerCase().includes(reportSearch.toLowerCase());
    if (reportFilter === 'ALL') return matchesSearch;
    if (reportFilter === 'VERIFIED') return matchesSearch && (r.status === 'Verified' || r.status === 'Actioned');
    return matchesSearch && r.status === 'Pending Review';
  });

  // Dynamic KPI counts derived from actual operational state
  const activeIncidentsCount = 12 + (incidentsList.length - 5);
  const blockedRoadsCount = 5 + (incidentsList.filter(i => i.roadsBlocked).length - 5);
  const affectedMissionsCount = affectedMissions.length + 3;
  const missionsReplannedCount = 6 + (affectedMissions.filter(m => m.status === 'Replanned').length - 1);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[var(--background)] text-[var(--foreground)] font-sans select-none px-6 py-4 gap-4">
      
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg text-xs font-semibold border transition-all animate-bounce ${
          notification.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
            : notification.type === 'error'
            ? 'bg-rose-50 text-rose-800 border-rose-300'
            : 'bg-[var(--secondary)] text-[var(--primary)] border-[var(--primary)]'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-[var(--primary)] shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* 1. Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[var(--muted-foreground)] uppercase block mb-0.5">
            RESPONSE & REPLANNING
          </span>
          <h1 className="font-serif-display text-2xl lg:text-[32px] font-normal text-[var(--foreground)] tracking-wide leading-tight">
            When Situations Change, We Adapt.
          </h1>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5 max-w-xl font-normal">
            Identify disruptions. Assess impact. Replan missions. Keep communities safe.
          </p>
        </div>

        {activeSubTab === 'reports' && (
          <button
            onClick={() => setIsNewReportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-dark-surface)] hover:bg-[var(--color-dark-raised)] text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Field Report</span>
          </button>
        )}
      </div>

      {/* 2. Subtab Navigation Strip (Divided Segment Bar matching Reference Image) */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg flex items-center shrink-0 overflow-x-auto shadow-2xs">
        {[
          { 
            id: 'incidents', 
            label: 'Incidents', 
            icon: () => (
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path d="M12 2L1 21h22L12 2zm0 3.5l8.5 14.5H3.5L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z" />
              </svg>
            )
          },
          { 
            id: 'impact', 
            label: 'Impact Assessment', 
            icon: () => (
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
                <path d="M4 10l6-6 4 4 6-6" />
              </svg>
            )
          },
          { 
            id: 'replanning', 
            label: 'Replanning', 
            icon: () => (
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round">
                <circle cx="5" cy="18" r="3" />
                <circle cx="12" cy="7" r="3" />
                <circle cx="19" cy="12" r="3" />
                <line x1="7.5" y1="16" x2="10" y2="9.5" />
                <line x1="14" y1="8.5" x2="17" y2="10.5" />
              </svg>
            )
          },
          { 
            id: 'routes', 
            label: 'Alternate Routes', 
            icon: () => (
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round">
                <circle cx="6" cy="19" r="2" />
                <circle cx="18" cy="5" r="2" />
                <path d="M6 17v-4a4 4 0 0 1 4-4h4a4 4 0 0 0 4-4V5" />
                <circle cx="14" cy="12" r="1.5" />
              </svg>
            )
          },
          { id: 'reports', label: 'Field Reports', icon: () => <FileText className="w-3.5 h-3.5" /> },
          { id: 'approvals', label: 'Approvals', icon: () => <ShieldCheck className="w-3.5 h-3.5" /> },
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
                <span className={isActive ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'}>
                  <Icon />
                </span>
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

      {/* 3. 5 KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 shrink-0">
        
        {/* Card 1: Active Incidents */}
        <div className="bg-[var(--card)] border border-[var(--border)]/90 rounded-xl p-3 shadow-2xs flex items-center justify-between min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#EF4444] text-white flex items-center justify-center shadow-xs shrink-0">
              <AlertTriangle className="w-4 h-4 text-white fill-white" />
            </div>
            <div className="min-w-0">
              <span className="text-xl lg:text-2xl font-bold text-[var(--foreground)] leading-none block font-sans">
                {activeIncidentsCount}
              </span>
              <span className="text-[11px] text-[var(--muted-foreground)] font-medium mt-1 block truncate">Active Incidents</span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end shrink-0 pl-1">
            <span className="text-[11px] font-semibold text-rose-500 whitespace-nowrap">↑ 3</span>
            <span className="text-[10px] text-[var(--muted-foreground)] font-normal whitespace-nowrap hidden xl:block">vs 24h</span>
          </div>
        </div>

        {/* Card 2: Blocked Roads */}
        <div className="bg-[var(--card)] border border-[var(--border)]/90 rounded-xl p-3 shadow-2xs flex items-center justify-between min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[var(--muted)] flex items-center justify-center text-[var(--foreground)] shrink-0">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M4 22L7.5 2H9.5L6 22H4ZM18 22L14.5 2H16.5L20 22H18ZM11 5H13V8H11V5ZM11 11H13V14H11V11ZM11 17H13V20H11V17Z" />
              </svg>
            </div>
            <div className="min-w-0">
              <span className="text-xl lg:text-2xl font-bold text-[var(--foreground)] leading-none block font-sans">
                {blockedRoadsCount}
              </span>
              <span className="text-[11px] text-[var(--muted-foreground)] font-medium mt-1 block truncate">Blocked Roads</span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end shrink-0 pl-1">
            <span className="text-[11px] font-semibold text-rose-500 whitespace-nowrap">↑ 2</span>
          </div>
        </div>

        {/* Card 3: Affected Missions */}
        <div className="bg-[var(--card)] border border-[var(--border)]/90 rounded-xl p-3 shadow-2xs flex items-center justify-between min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[var(--muted)] flex items-center justify-center text-[var(--foreground)] shrink-0">
              <Truck className="w-4 h-4 fill-current stroke-none" />
            </div>
            <div className="min-w-0">
              <span className="text-xl lg:text-2xl font-bold text-[var(--foreground)] leading-none block font-sans">
                {affectedMissionsCount}
              </span>
              <span className="text-[11px] text-[var(--muted-foreground)] font-medium mt-1 block truncate">Affected Missions</span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end shrink-0 pl-1">
            <span className="text-[11px] font-semibold text-rose-500 whitespace-nowrap">↑ 3</span>
          </div>
        </div>

        {/* Card 4: People Impacted */}
        <div className="bg-[var(--card)] border border-[var(--border)]/90 rounded-xl p-3 shadow-2xs flex items-center justify-between min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[var(--muted)] flex items-center justify-center text-[var(--foreground)] shrink-0">
              <Users className="w-4 h-4 fill-current stroke-none" />
            </div>
            <div className="min-w-0">
              <span className="text-xl lg:text-2xl font-bold text-[var(--foreground)] leading-none block font-sans">
                48,220
              </span>
              <span className="text-[11px] text-[var(--muted-foreground)] font-medium mt-1 block truncate">People Impacted</span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end shrink-0 pl-1">
            <span className="text-[11px] font-semibold text-emerald-600 whitespace-nowrap">↓ 12%</span>
            <span className="text-[10px] text-[var(--muted-foreground)] font-normal whitespace-nowrap hidden xl:block">vs 24h</span>
          </div>
        </div>

        {/* Card 5: Missions Replanned (Properly aligned & bounded) */}
        <div className="bg-[var(--card)] border border-[var(--border)]/90 rounded-xl p-3 shadow-2xs flex items-center justify-between min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[var(--secondary)] flex items-center justify-center text-[#2563EB] shrink-0">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xl lg:text-2xl font-bold text-[var(--foreground)] leading-none block font-sans">
                {missionsReplannedCount}
              </span>
              <span className="text-[11px] text-[var(--muted-foreground)] font-medium mt-1 block truncate">Missions Replanned</span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end shrink-0 pl-1">
            <span className="text-[11px] font-semibold text-emerald-600 whitespace-nowrap">↑ 200%</span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 1: INCIDENTS (Default Incident Command View) */}
      {/* ========================================================================= */}
      {activeSubTab === 'incidents' && (
        <>
          {/* Middle 3-Column Section: Active Incidents + Map + Affected Missions/Road Status */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Left Column (3.5 Cols): Active Incidents */}
            <div className="lg:col-span-3 bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-[var(--foreground)]">Active Incidents</h2>
                  <button className="text-xs font-semibold text-[var(--primary)] hover:text-[var(--primary)] flex items-center gap-1 cursor-pointer">
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {incidentsList.map((inc) => (
                    <div 
                      key={inc.id}
                      onClick={() => setSelectedIncident(inc.id)}
                      className={`flex items-center gap-2.5 p-2 rounded-lg border transition-all cursor-pointer ${
                        selectedIncident === inc.id
                          ? 'border-[var(--primary)] bg-[var(--secondary)]/40 shadow-2xs'
                          : 'border-[var(--border)] hover:bg-[var(--background)]/80'
                      }`}
                    >
                      <div className="w-14 h-12 rounded overflow-hidden bg-slate-800 shrink-0">
                        <img 
                          src={inc.image} 
                          alt={inc.title} 
                          className="w-full h-full object-cover" 
                          onError={(e) => { (e.target as HTMLImageElement).src = '/images/globe-ner.jpg'; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-[var(--foreground)] leading-tight block whitespace-normal">
                          {inc.title}
                        </span>
                        <span className="text-[10px] text-[var(--muted-foreground)] block truncate">
                          {inc.location}
                        </span>
                        <span className="text-[9px] text-[var(--muted-foreground)] font-mono block mt-0.5">
                          {inc.time}
                        </span>
                      </div>
                      <div className="shrink-0 pl-1">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider block text-center ${
                          inc.severity === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : inc.severity === 'HIGH'
                            ? 'bg-orange-100 text-orange-700 border border-orange-200'
                            : inc.severity === 'MEDIUM'
                            ? 'bg-amber-100 text-amber-700 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}>
                          {inc.severity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center Column (5.5 Cols): Incident Impact Overview Map */}
            <div className="lg:col-span-6 bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between min-h-[360px]">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-[var(--foreground)]">Incident Impact Overview</h2>
                <button className="flex items-center gap-1 px-2.5 py-1 bg-[var(--background)] border border-[var(--border)] rounded text-xs text-[var(--foreground)] cursor-pointer">
                  <Layers className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                  <span>All Layers</span>
                  <ChevronDown className="w-3 h-3 text-[var(--muted-foreground)]" />
                </button>
              </div>

              {/* Map Container */}
              <div className="flex-1 min-h-[260px] rounded-lg overflow-hidden border border-[var(--border)] relative">
                <InteractiveMap
                  centerLat={25.8}
                  centerLng={93.4}
                  zoomLevel={7}
                  mapType="satellite"
                  showControls={true}
                  height="100%"
                />
              </div>

              {/* Map Legend Footer */}
              <div className="flex items-center justify-between text-[10px] text-[var(--muted-foreground)] pt-2 border-t border-[var(--border)] mt-2 flex-wrap gap-1">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Incident</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 rounded-xs" /> Blocked Road</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[var(--primary)] rounded-xs" /> Affected Mission</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Shelter</span>
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 border-t border-rose-500 border-dashed" /> Alternate Route</span>
              </div>
            </div>

            {/* Right Column (3.5 Cols): Affected Missions & Road Status */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              
              {/* Top Card: Affected Missions */}
              <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2.5">
                  <h2 className="text-sm font-bold text-[var(--foreground)]">Affected Missions</h2>
                  <button className="text-xs font-semibold text-[var(--primary)] hover:text-[var(--primary)] flex items-center gap-1 cursor-pointer">
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-col gap-2 text-xs">
                  {affectedMissions.map((m) => (
                    <div 
                      key={m.id}
                      onClick={() => handleOpenReplan(m.id)}
                      className="flex items-start justify-between py-1 border-b border-[var(--border)] last:border-0 hover:bg-[var(--background)]/80 p-1 rounded cursor-pointer transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <Truck className="w-3.5 h-3.5 text-[var(--muted-foreground)] mt-0.5 shrink-0" />
                        <div className="flex flex-col">
                          <span className="font-bold text-[var(--foreground)] leading-tight">
                            {m.id} <span className="font-medium text-[var(--foreground)]">— {m.title}</span>
                          </span>
                          <span className="text-[10px] text-[var(--muted-foreground)] mt-0.5">
                            {m.cause}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 ${m.badgeClass}`}>
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Card: Road Status */}
              <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-bold text-[var(--foreground)]">Road Status</h2>
                  <button className="text-xs font-semibold text-[var(--primary)] hover:text-[var(--primary)] flex items-center gap-1 cursor-pointer">
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--foreground)] font-medium text-[11px] w-28">Open</span>
                    <span className="text-[var(--muted-foreground)] font-semibold text-[11px] w-10">78%</span>
                    <div className="flex-1 h-2 bg-[var(--muted)] rounded-full overflow-hidden mx-2">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '78%' }} />
                    </div>
                    <span className="text-[var(--foreground)] font-bold font-mono text-[11px] w-8 text-right">342</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[var(--foreground)] font-medium text-[11px] w-28">Partially Blocked</span>
                    <span className="text-[var(--muted-foreground)] font-semibold text-[11px] w-10">12%</span>
                    <div className="flex-1 h-2 bg-[var(--muted)] rounded-full overflow-hidden mx-2">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '12%' }} />
                    </div>
                    <span className="text-[var(--foreground)] font-bold font-mono text-[11px] w-8 text-right">52</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[var(--foreground)] font-medium text-[11px] w-28">Fully Blocked</span>
                    <span className="text-[var(--muted-foreground)] font-semibold text-[11px] w-10">10%</span>
                    <div className="flex-1 h-2 bg-[var(--muted)] rounded-full overflow-hidden mx-2">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: '10%' }} />
                    </div>
                    <span className="text-[var(--foreground)] font-bold font-mono text-[11px] w-8 text-right">44</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom 3-Card Row: Incident Trend, Impact on Population, Recent Field Reports */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Card 1: Incident Trend */}
            <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-[var(--foreground)]">Incident Trend</h2>
                <select className="h-7 px-2 bg-[var(--background)] border border-[var(--border)] rounded text-[11px] text-[var(--foreground)] focus:outline-none cursor-pointer">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>

              {/* SVG Multi-line Chart */}
              <div className="h-32 w-full relative">
                <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                  <line x1="25" y1="15" x2="290" y2="15" stroke="var(--border)" strokeWidth="1" />
                  <line x1="25" y1="40" x2="290" y2="40" stroke="var(--border)" strokeWidth="1" />
                  <line x1="25" y1="65" x2="290" y2="65" stroke="var(--border)" strokeWidth="1" />
                  <line x1="25" y1="90" x2="290" y2="90" stroke="var(--border)" strokeWidth="1" />

                  <text x="10" y="18" fontSize="8" fill="#94A3B8">20</text>
                  <text x="10" y="43" fontSize="8" fill="#94A3B8">15</text>
                  <text x="10" y="68" fontSize="8" fill="#94A3B8">10</text>
                  <text x="12" y="93" fontSize="8" fill="#94A3B8">0</text>

                  {/* High Severity (Red) */}
                  <path d="M 35 75 L 75 55 L 115 50 L 155 45 L 195 65 L 235 48 L 280 62" fill="none" stroke="#EF4444" strokeWidth="2" />
                  <circle cx="35" cy="75" r="2.5" fill="#EF4444" />
                  <circle cx="75" cy="55" r="2.5" fill="#EF4444" />
                  <circle cx="115" cy="50" r="2.5" fill="#EF4444" />
                  <circle cx="155" cy="45" r="2.5" fill="#EF4444" />
                  <circle cx="195" cy="65" r="2.5" fill="#EF4444" />
                  <circle cx="235" cy="48" r="2.5" fill="#EF4444" />
                  <circle cx="280" cy="62" r="2.5" fill="#EF4444" />

                  {/* Medium Severity (Yellow) */}
                  <path d="M 35 85 L 75 70 L 115 65 L 155 60 L 195 72 L 235 60 L 280 68" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
                  <circle cx="35" cy="85" r="2" fill="#F59E0B" />
                  <circle cx="75" cy="70" r="2" fill="#F59E0B" />
                  <circle cx="115" cy="65" r="2" fill="#F59E0B" />
                  <circle cx="155" cy="60" r="2" fill="#F59E0B" />
                  <circle cx="195" cy="72" r="2" fill="#F59E0B" />
                  <circle cx="235" cy="60" r="2" fill="#F59E0B" />
                  <circle cx="280" cy="68" r="2" fill="#F59E0B" />

                  {/* Low Severity (Green) */}
                  <path d="M 35 90 L 75 88 L 115 85 L 155 82 L 195 85 L 235 80 L 280 84" fill="none" stroke="#10B981" strokeWidth="1.5" />
                  <circle cx="35" cy="90" r="2" fill="#10B981" />
                  <circle cx="75" cy="88" r="2" fill="#10B981" />
                  <circle cx="115" cy="85" r="2" fill="#10B981" />
                  <circle cx="155" cy="82" r="2" fill="#10B981" />
                  <circle cx="195" cy="85" r="2" fill="#10B981" />
                  <circle cx="235" cy="80" r="2" fill="#10B981" />
                  <circle cx="280" cy="84" r="2" fill="#10B981" />

                  <text x="28" y="100" fontSize="7.5" fill="#94A3B8">10 Sep</text>
                  <text x="68" y="100" fontSize="7.5" fill="#94A3B8">11 Sep</text>
                  <text x="108" y="100" fontSize="7.5" fill="#94A3B8">12 Sep</text>
                  <text x="148" y="100" fontSize="7.5" fill="#94A3B8">13 Sep</text>
                  <text x="188" y="100" fontSize="7.5" fill="#94A3B8">14 Sep</text>
                  <text x="228" y="100" fontSize="7.5" fill="#94A3B8">15 Sep</text>
                  <text x="268" y="100" fontSize="7.5" fill="#94A3B8">16 Sep</text>
                </svg>
              </div>

              <div className="flex items-center gap-4 text-[10px] text-[var(--muted-foreground)] pt-1 border-t border-[var(--border)]">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> High</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Medium</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Low</span>
              </div>
            </div>

            {/* Card 2: Impact on Population */}
            <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-[var(--foreground)]">Impact on Population</h2>
              </div>

              <div className="flex flex-col gap-1.5 text-xs">
                {[
                  { name: 'Assam', count: '18,400', pct: 90 },
                  { name: 'Meghalaya', count: '9,120', pct: 55 },
                  { name: 'Arunachal Pradesh', count: '6,280', pct: 38 },
                  { name: 'Manipur', count: '5,400', pct: 30 },
                  { name: 'Mizoram', count: '4,320', pct: 24 },
                  { name: 'Nagaland', count: '3,860', pct: 20 },
                  { name: 'Tripura', count: '850', pct: 8 },
                ].map((state) => (
                  <div key={state.name} className="flex items-center gap-2 text-[11px]">
                    <span className="text-[var(--foreground)] font-medium w-32 truncate">{state.name}</span>
                    <div className="flex-1 h-3 bg-[var(--muted)] rounded-xs overflow-hidden">
                      <div className="h-full bg-rose-400 rounded-xs transition-all" style={{ width: `${state.pct}%` }} />
                    </div>
                    <span className="text-[var(--foreground)] font-mono text-[10px] w-12 text-right">{state.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Recent Field Reports */}
            <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-[var(--foreground)]">Recent Field Reports</h2>
                <button 
                  onClick={() => setActiveSubTab('reports')}
                  className="text-xs font-semibold text-[var(--primary)] hover:text-[var(--primary)] flex items-center gap-1 cursor-pointer"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-col gap-2 text-xs">
                {fieldReportsList.slice(0, 4).map((rep) => (
                  <div key={rep.id} className="flex items-start justify-between py-1 border-b border-[var(--border)] last:border-0">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded bg-[var(--muted)] text-[var(--foreground)] flex items-center justify-center shrink-0 mt-0.5">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[var(--foreground)] leading-tight">{rep.title}</span>
                        <span className="text-[10px] text-[var(--muted-foreground)]">{rep.author}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-[var(--muted-foreground)] shrink-0">{rep.time}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom AI Insight Bar */}
          <div className="bg-[var(--secondary)] border border-[var(--primary)]/80 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-xs text-[var(--foreground)]">AI Insight</span>
              <p className="text-xs text-[var(--foreground)] leading-tight">
                3 missions are affected due to the landslide on NH-27. Alternate routes are available for 2 missions. Recommend immediate approval for route changes.
              </p>
            </div>

            <button 
              onClick={() => handleOpenReplan('MS-017')}
              className="px-3 py-1.5 bg-[var(--secondary)] hover:bg-[var(--secondary)] text-[var(--primary)] rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
            >
              <span>View Replanning Options</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: IMPACT ASSESSMENT */}
      {/* ========================================================================= */}
      {activeSubTab === 'impact' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
            <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs">
              <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider block">Total Impacted Population</span>
              <span className="text-2xl font-bold text-[var(--foreground)] mt-1 block">48,220</span>
              <span className="text-[11px] text-rose-500 font-semibold mt-1 block">Across 7 Northeast States</span>
            </div>
            <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs">
              <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider block">Habitations Cut Off</span>
              <span className="text-2xl font-bold text-[var(--foreground)] mt-1 block">14 Villages</span>
              <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Harangajao & Dzongu Sectors</span>
            </div>
            <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs">
              <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider block">Critical Facilities at Risk</span>
              <span className="text-2xl font-bold text-[var(--foreground)] mt-1 block">9 Facilities</span>
              <span className="text-[11px] text-[var(--muted-foreground)] font-semibold mt-1 block">4 PHCs, 3 Bridges, 2 Water Pumps</span>
            </div>
            <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs">
              <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider block">Life-Support Depletion Zero-Point</span>
              <span className="text-2xl font-bold text-rose-600 mt-1 block">4.2 Hours</span>
              <span className="text-[11px] text-rose-500 font-semibold mt-1 block">Harangajao Drinking Water</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* District Vulnerability Matrix */}
            <div className="lg:col-span-8 bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center justify-between mb-3 border-b border-[var(--border)] pb-2.5">
                <h3 className="text-sm font-bold text-[var(--foreground)]">District-Level Spatial Impact & Vulnerability Matrix</h3>
                <span className="text-xs font-mono text-[var(--muted-foreground)]">GIS Intersection Active</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[var(--foreground)]">
                  <thead className="bg-[var(--background)] text-[11px] font-semibold text-[var(--muted-foreground)] border-b border-[var(--border)]">
                    <tr>
                      <th className="py-2.5 px-3">District</th>
                      <th className="py-2.5 px-3">State</th>
                      <th className="py-2.5 px-3">Primary Threat</th>
                      <th className="py-2.5 px-3">Severed Links</th>
                      <th className="py-2.5 px-3">Population Exposed</th>
                      <th className="py-2.5 px-3">Stock Headroom</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {[
                      { district: 'Dima Hasao', state: 'Assam', threat: 'Landslide Subsidence', links: 'NH-27 (Lumding-Haflong)', pop: '14,200', headroom: '4.2h (Critical)', color: 'text-rose-600 font-bold' },
                      { district: 'Sonitpur', state: 'Assam', threat: 'River Inundation', links: 'SH-12 (Tezpur Link)', pop: '18,400', headroom: '16.5h (Moderate)', color: 'text-amber-600 font-medium' },
                      { district: 'West Garo Hills', state: 'Meghalaya', threat: 'Bridge Scouring', links: 'Simsang Approach', pop: '9,120', headroom: '22.0h (Stable)', color: 'text-emerald-600 font-medium' },
                      { district: 'Aizawl', state: 'Mizoram', threat: 'Slope Destabilization', links: 'Aizawl-Lunglei Highway', pop: '4,320', headroom: '11.4h (Warning)', color: 'text-amber-600 font-medium' },
                      { district: 'Papum Pare', state: 'Arunachal Pradesh', threat: 'River Overflow', links: 'Dikrong River Bank Rd', pop: '2,180', headroom: '36.0h (Stable)', color: 'text-emerald-600 font-medium' }
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-[var(--background)]/60">
                        <td className="py-2.5 px-3 font-semibold text-[var(--foreground)]">{row.district}</td>
                        <td className="py-2.5 px-3 text-[var(--muted-foreground)]">{row.state}</td>
                        <td className="py-2.5 px-3 font-medium text-[var(--foreground)]">{row.threat}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-[var(--muted-foreground)]">{row.links}</td>
                        <td className="py-2.5 px-3 font-mono font-semibold text-[var(--foreground)]">{row.pop}</td>
                        <td className={`py-2.5 px-3 font-mono ${row.color}`}>{row.headroom}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Critical Infrastructure Exposure */}
            <div className="lg:col-span-4 bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-[var(--foreground)] mb-3 border-b border-[var(--border)] pb-2.5">Critical Infrastructure at Risk</h3>
                <div className="flex flex-col gap-3 text-xs">
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg">
                    <div className="flex items-center justify-between font-bold text-rose-800">
                      <span>Harangajao PHC Facility</span>
                      <span className="text-[10px] bg-rose-200 px-1.5 py-0.5 rounded">High Risk</span>
                    </div>
                    <p className="text-rose-700 text-[11px] mt-1">
                      Cut off from medical stock deliveries. 14 critical fever & trauma patients stranded.
                    </p>
                  </div>
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center justify-between font-bold text-amber-800">
                      <span>Jatinga Bridge Span 3</span>
                      <span className="text-[10px] bg-amber-200 px-1.5 py-0.5 rounded">Warning</span>
                    </div>
                    <p className="text-amber-700 text-[11px] mt-1">
                      Upstream debris accumulation exerting lateral pressure against Pier 2.
                    </p>
                  </div>
                  <div className="p-2.5 bg-[var(--secondary)] border border-[var(--primary)] rounded-lg">
                    <div className="flex items-center justify-between font-bold text-[var(--primary)]">
                      <span>Diphu Municipal Water Pump</span>
                      <span className="text-[10px] bg-[var(--secondary)] px-1.5 py-0.5 rounded">Monitoring</span>
                    </div>
                    <p className="text-[var(--primary)] text-[11px] mt-1">
                      Turbidity levels elevated; auxiliary chlorine purification units deployed.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveSubTab('replanning')}
                className="w-full mt-3 py-2 bg-[var(--primary)] hover:bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Initiate Replanning Protocols</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 3: REPLANNING */}
      {/* ========================================================================= */}
      {activeSubTab === 'replanning' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Left Column: Affected Missions Queue */}
            <div className="lg:col-span-5 bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-[var(--border)] pb-2.5">
                  <h3 className="text-sm font-bold text-[var(--foreground)]">Missions Requiring Rerouting</h3>
                  <span className="text-xs bg-rose-100 text-rose-700 font-semibold px-2 py-0.5 rounded">
                    {affectedMissions.filter(m => m.status !== 'Replanned').length} Urgent
                  </span>
                </div>

                <div className="flex flex-col gap-2.5 text-xs">
                  {affectedMissions.map((m) => (
                    <div 
                      key={m.id}
                      onClick={() => handleOpenReplan(m.id)}
                      className="p-3 border border-[var(--border)] rounded-lg hover:border-[var(--primary)] hover:bg-[var(--secondary)]/20 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-[var(--foreground)] text-xs">{m.id} — {m.title}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${m.badgeClass}`}>
                          {m.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-[var(--muted-foreground)] mb-2">
                        <span>From: <strong>{m.origin}</strong></span>
                        <span>To: <strong>{m.destination}</strong></span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-[11px]">
                        <span className="text-[var(--muted-foreground)]">Alternate: <strong>{m.alternate}</strong></span>
                        <button className="text-[var(--primary)] hover:text-[var(--primary)] font-semibold flex items-center gap-0.5">
                          <span>Replan</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Algorithmic Replan Comparison & Simulation */}
            <div className="lg:col-span-7 bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-[var(--border)] pb-2.5">
                  <h3 className="text-sm font-bold text-[var(--foreground)]">Co-Pilot Multi-Corridor Trade-off Analysis (MS-017)</h3>
                  <span className="text-xs font-mono text-emerald-600 font-semibold">Algorithm: Risk-Adjusted A* (CR)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {/* Severed Option */}
                  <div className="p-3 rounded-lg border border-rose-300 bg-rose-50/60 text-xs">
                    <span className="font-bold text-rose-800 block text-[11px] uppercase tracking-wider mb-1">
                      Option A: Primary Corridor (NH-27)
                    </span>
                    <span className="font-semibold text-[var(--foreground)] block mb-1">Lumding - Haflong - Harangajao Axis</span>
                    <p className="text-rose-700 text-[11px] leading-relaxed mb-2">
                      Blocked by 200m mudslide at Jatinga Gorge. Estimated clearance window: 72-96 hours.
                    </p>
                    <div className="bg-[var(--card)]/80 p-2 rounded border border-rose-200 text-rose-800 font-mono text-[10px]">
                      Status: SEVERED · Rejection Required
                    </div>
                  </div>

                  {/* Recommended Option */}
                  <div className="p-3 rounded-lg border border-emerald-300 bg-emerald-50/60 text-xs">
                    <span className="font-bold text-emerald-800 block text-[11px] uppercase tracking-wider mb-1">
                      Option B: BRO Old Mahur Bypass (Recommended)
                    </span>
                    <span className="font-semibold text-[var(--foreground)] block mb-1">Graded Mountain Bypass Corridor</span>
                    <p className="text-emerald-700 text-[11px] leading-relaxed mb-2">
                      Detour: +18.0 km (+22.9 min). Surface graded & compacted. 100% passable for 4WD convoys.
                    </p>
                    <div className="bg-[var(--card)]/80 p-2 rounded border border-emerald-200 text-emerald-800 font-mono text-[10px]">
                      Status: VERIFIED CLEAR · Risk Score: Low
                    </div>
                  </div>
                </div>

                {/* Simulation Metrics Bar */}
                <div className="bg-[var(--background)] border border-[var(--border)] rounded-lg p-3 text-xs flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-[var(--muted-foreground)] block font-mono uppercase">Est. Arrival Time</span>
                    <strong className="text-[var(--foreground)] font-mono text-sm">99.5 Minutes</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--muted-foreground)] block font-mono uppercase">Safety Headroom</span>
                    <strong className="text-emerald-600 font-mono text-sm">+2.1 Hours Before Depletion</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--muted-foreground)] block font-mono uppercase">Assigned Asset</span>
                    <strong className="text-[var(--foreground)] font-mono text-sm">Brahmaputra Tactical 01 (4x4)</strong>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                <span className="text-xs text-[var(--muted-foreground)] font-mono">Sign-off Ready for District Logistics Authority</span>
                <button
                  onClick={() => handleConfirmReplan()}
                  className="px-5 py-2 bg-[var(--primary)] hover:bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorize Alternate Corridor Dispatch</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 4: ALTERNATE ROUTES */}
      {/* ========================================================================= */}
      {activeSubTab === 'routes' && (
        <div className="flex flex-col gap-4">
          <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-3 border-b border-[var(--border)] pb-2.5">
              <div>
                <h3 className="text-sm font-bold text-[var(--foreground)]">Verified Strategic Bypass Corridors (NER Region)</h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                  Pre-mapped secondary routes maintained by Border Roads Organisation and State Public Works Departments.
                </p>
              </div>
              <span className="text-xs font-mono text-[var(--muted-foreground)]">4 Corridors Active</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alternateRoutes.map((rte) => (
                <div key={rte.id} className="p-4 border border-[var(--border)] rounded-xl bg-[var(--card)] shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Route className="w-4 h-4 text-[var(--primary)]" />
                        <h4 className="font-bold text-sm text-[var(--foreground)]">{rte.name}</h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${rte.statusColor}`}>
                        {rte.status}
                      </span>
                    </div>
                    <span className="text-xs text-[var(--muted-foreground)] block mb-3 font-medium">{rte.corridor}</span>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-[var(--background)] p-2.5 rounded-lg mb-3">
                      <div>
                        <span className="text-[10px] text-[var(--muted-foreground)] block font-mono">Distance & Detour:</span>
                        <strong className="text-[var(--foreground)]">{rte.distance}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--muted-foreground)] block font-mono">Transit Delta:</span>
                        <strong className="text-[var(--primary)]">{rte.transitTimeDelta}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--muted-foreground)] block font-mono">Road Surface:</span>
                        <strong className="text-[var(--foreground)]">{rte.surface}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--muted-foreground)] block font-mono">Controlling Authority:</span>
                        <strong className="text-[var(--foreground)]">{rte.authority}</strong>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--muted-foreground)] mb-3">
                      <strong>Vehicle Feasibility:</strong> {rte.vehicleFeasibility}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-[var(--border)] text-xs">
                    <span className="text-[var(--muted-foreground)] font-mono text-[11px]">Risk Index: {rte.riskScore}</span>
                    <button 
                      onClick={() => showToast(`Route ${rte.id} selected for active route planning!`, 'info')}
                      className="px-3 py-1.5 bg-[var(--secondary)] hover:bg-[var(--secondary)] text-[var(--primary)] rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Use for Dispatch</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 5: FIELD REPORTS */}
      {/* ========================================================================= */}
      {activeSubTab === 'reports' && (
        <div className="flex flex-col gap-4">
          <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-[var(--border)] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[var(--foreground)]">Live Field Observation & Citizen Reports Stream</h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                  Real-time incoming observations from first responders, volunteers, and citizen voice reports.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                  <input
                    type="text"
                    value={reportSearch}
                    onChange={(e) => setReportSearch(e.target.value)}
                    placeholder="Search field reports..."
                    className="h-8 pl-8 pr-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-xs text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
                <select
                  value={reportFilter}
                  onChange={(e) => setReportFilter(e.target.value as any)}
                  className="h-8 px-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-xs text-[var(--foreground)] focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Reports ({fieldReportsList.length})</option>
                  <option value="VERIFIED">Verified Only</option>
                  <option value="PENDING">Pending Review</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {filteredReports.map((rep) => (
                <div key={rep.id} className="p-3.5 border border-[var(--border)] rounded-xl hover:border-[var(--border)] transition-colors bg-[var(--card)]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[var(--foreground)]">{rep.title}</span>
                      <span className="text-[10px] font-mono text-[var(--muted-foreground)]">({rep.id})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rep.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' :
                        rep.status === 'Actioned' ? 'bg-[var(--secondary)] text-[var(--primary)]' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {rep.status}
                      </span>
                      <span className="text-[11px] font-mono text-[var(--muted-foreground)]">{rep.time}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--muted-foreground)] mb-2 leading-relaxed">
                    {rep.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-[var(--border)] text-xs">
                    <div className="flex items-center gap-4 text-[var(--muted-foreground)] text-[11px]">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                        <span>{rep.author} ({rep.role})</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                        <span>{rep.location}</span>
                      </span>
                      {rep.hasAudio && (
                        <span className="flex items-center gap-1 text-[var(--primary)] font-semibold bg-[var(--secondary)] px-2 py-0.5 rounded">
                          <Volume2 className="w-3 h-3" />
                          <span>Voice Recording ({rep.audioDuration})</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {rep.status === 'Pending Review' && (
                        <button
                          onClick={() => handleVerifyReport(rep.id)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Check className="w-3 h-3" />
                          <span>Verify</span>
                        </button>
                      )}
                      {rep.status !== 'Actioned' ? (
                        <button
                          onClick={() => handlePromoteToIncident(rep.id)}
                          className="px-2.5 py-1 bg-[var(--primary)] hover:bg-[var(--primary)] text-[var(--primary-foreground)] rounded text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          <span>Escalate to Incident</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveSubTab('incidents');
                            if (rep.escalatedToIncidentId) {
                              setSelectedIncident(rep.escalatedToIncidentId);
                            }
                          }}
                          className="px-2.5 py-1 bg-[var(--secondary)] hover:bg-[var(--secondary)] text-[var(--primary)] rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors border border-[var(--primary)]"
                        >
                          <span>View in Incidents ({rep.escalatedToIncidentId || 'INC-01'})</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 6: APPROVALS */}
      {/* ========================================================================= */}
      {activeSubTab === 'approvals' && (
        <div className="flex flex-col gap-4">
          <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-3 border-b border-[var(--border)] pb-2.5">
              <div>
                <h3 className="text-sm font-bold text-[var(--foreground)]">Sovereign Authority Authorization Queue</h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                  Review and sign off on high-impact emergency reroutes, relief airdrops, and shelter activations.
                </p>
              </div>
              <span className="text-xs font-mono bg-[var(--secondary)] text-[var(--primary)] font-bold px-2.5 py-1 rounded-lg">
                Role: District Magistrate / Incident Commander
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {approvalList.map((item) => (
                <div key={item.id} className="p-4 border border-[var(--border)] rounded-xl bg-[var(--card)] shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
                        <h4 className="font-bold text-xs text-[var(--foreground)]">{item.title}</h4>
                        <span className="text-[10px] font-mono text-[var(--muted-foreground)]">({item.id})</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                        item.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--muted-foreground)] mb-3 leading-relaxed">
                      {item.details}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-[var(--background)] p-2.5 rounded-lg mb-3">
                      <div>
                        <span className="text-[10px] text-[var(--muted-foreground)] block font-mono">Category:</span>
                        <strong className="text-[var(--foreground)]">{item.category}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--muted-foreground)] block font-mono">Cargo / Impact:</span>
                        <strong className="text-[var(--foreground)]">{item.cargo}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--muted-foreground)] block font-mono">Origin → Dest:</span>
                        <strong className="text-[var(--foreground)]">{item.origin} → {item.destination}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--muted-foreground)] block font-mono">Requested By:</span>
                        <strong className="text-[var(--foreground)]">{item.requestedBy}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-[var(--border)] text-xs">
                    <span className="text-[11px] font-mono text-[var(--muted-foreground)]">{item.timeAgo}</span>
                    
                    {item.status === 'Pending' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRejectAction(item.id)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => handleApproveAction(item.id)}
                          className="px-4 py-1.5 bg-[var(--primary)] hover:bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Authorize & Dispatch</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-mono text-[var(--muted-foreground)] font-semibold">
                        Action Recorded in Sovereign Cryptographic Audit Trail
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Field Report Submission */}
      {isNewReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] shadow-2xl w-full max-w-lg p-5">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[var(--primary)]" />
                <h3 className="text-sm font-bold text-[var(--foreground)]">Submit Field Observation Report</h3>
              </div>
              <button 
                onClick={() => setIsNewReportModalOpen(false)}
                className="text-[var(--muted-foreground)] hover:text-[var(--muted-foreground)] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewReport} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="font-semibold text-[var(--foreground)] block mb-1">Observation Title *</label>
                <input
                  type="text"
                  required
                  value={newReportForm.title}
                  onChange={(e) => setNewReportForm({ ...newReportForm, title: e.target.value })}
                  placeholder="e.g. Hillside mudslide covering SH-12 bypass"
                  className="w-full h-8 px-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-xs text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[var(--foreground)] block mb-1">Hazard Category</label>
                  <select
                    value={newReportForm.category}
                    onChange={(e) => setNewReportForm({ ...newReportForm, category: e.target.value })}
                    className="w-full h-8 px-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-xs text-[var(--foreground)] focus:outline-none"
                  >
                    <option value="Landslide">Landslide / Subsidence</option>
                    <option value="Flood Surge">Flood Surge</option>
                    <option value="Bridge Damage">Bridge Damage</option>
                    <option value="Road Blockage">Road Blockage</option>
                    <option value="Power Outage">Power Outage</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[var(--foreground)] block mb-1">Severity Level</label>
                  <select
                    value={newReportForm.severity}
                    onChange={(e) => setNewReportForm({ ...newReportForm, severity: e.target.value })}
                    className="w-full h-8 px-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-xs text-[var(--foreground)] focus:outline-none"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[var(--foreground)] block mb-1">Location / GPS</label>
                  <input
                    type="text"
                    value={newReportForm.location}
                    onChange={(e) => setNewReportForm({ ...newReportForm, location: e.target.value })}
                    className="w-full h-8 px-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-xs text-[var(--foreground)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[var(--foreground)] block mb-1">Reporter Name</label>
                  <input
                    type="text"
                    value={newReportForm.reporterName}
                    onChange={(e) => setNewReportForm({ ...newReportForm, reporterName: e.target.value })}
                    className="w-full h-8 px-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-xs text-[var(--foreground)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[var(--foreground)] block mb-1">Field Description</label>
                <textarea
                  rows={3}
                  value={newReportForm.description}
                  onChange={(e) => setNewReportForm({ ...newReportForm, description: e.target.value })}
                  placeholder="Provide specific details, passage clearance, stranded vehicles, or immediate relief needs..."
                  className="w-full p-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-xs text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)] mt-1">
                <button
                  type="button"
                  onClick={() => setIsNewReportModalOpen(false)}
                  className="px-3 py-1.5 bg-[var(--muted)] hover:bg-[var(--border)] text-[var(--foreground)] rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[var(--primary)] hover:bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-xs font-semibold shadow-sm cursor-pointer"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Replan Proposal Action Modal */}
      {isReplanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] shadow-2xl w-full max-w-md p-5">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-[var(--primary)]" />
                <h3 className="text-sm font-bold text-[var(--foreground)]">Approve Route Replan ({modalMission})</h3>
              </div>
              <button 
                onClick={() => setIsReplanModalOpen(false)}
                className="text-[var(--muted-foreground)] hover:text-[var(--muted-foreground)] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
                <span className="font-bold block mb-1">Disruption Detected</span>
                <span>NH-27 Blockage (km 65). Primary corridor blocked by massive mudslide.</span>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800">
                <span className="font-bold block mb-1">Proposed Alternate Route</span>
                <span>BRO Old Mahur Mountain Bypass Corridor (+22.9 min, Feasible for 4x4 & Light Trucks).</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)] mt-2">
                <button
                  type="button"
                  onClick={() => setIsReplanModalOpen(false)}
                  className="px-3 py-1.5 bg-[var(--muted)] hover:bg-[var(--border)] text-[var(--foreground)] rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReplan}
                  className="px-4 py-1.5 bg-[var(--primary)] hover:bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-xs font-semibold shadow-sm cursor-pointer"
                >
                  Authorize Alternate Route
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
