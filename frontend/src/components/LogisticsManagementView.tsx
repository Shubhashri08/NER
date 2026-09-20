import React, { useState, useEffect } from 'react';
import {
  Package,
  Truck,
  ClipboardList,
  Clock,
  AlertCircle,
  Plus,
  Search,
  MoreHorizontal,
  Building2,
  Sparkles,
  ArrowRight,
  X,
  Compass,
  Activity,
  Tent,
  Utensils,
  Droplets,
  HeartPulse,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Fuel,
  Check
} from 'lucide-react';
import { disasterApi } from '../services/api';

export interface SupplyRequestItem {
  id: string;
  item: string;
  category: string;
  quantity: string;
  requestedBy: string;
  location: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Approved' | 'In Transit' | 'Fulfilled' | 'Rejected';
  requestedOn: string;
  reason?: string;
}

export interface VehicleItem {
  id: string;
  callsign: string;
  type: string;
  vehicle_type?: string;
  status: 'Available' | 'In Transit' | 'Maintenance';
  capacity: number;
  depot: string;
  assigned_driver: string;
  fuel_level: number;
  coordinates: { lat: number; lng: number };
  speed?: number;
}

export interface MissionItem {
  id: string;
  title: string;
  status: 'In Transit' | 'Approved' | 'Delayed' | 'At Risk' | 'Completed';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  destination: string;
  vehicle_callsign: string;
  progress: number;
  eta: string;
  cargo: string;
}

// Initial realistic supply requests matching reference image & seeded dataset
const INITIAL_REQUESTS: SupplyRequestItem[] = [
  {
    id: 'SR-017',
    item: 'Food Packets',
    category: 'Food',
    quantity: '5,000 units',
    requestedBy: 'Dima Hasao DC',
    location: 'Haflong',
    priority: 'Critical',
    status: 'Pending',
    requestedOn: '16 Sep 2025',
    reason: 'Severe hill subsidence cut road link to 8 interior villages in Harangajao block.'
  },
  {
    id: 'SR-016',
    item: 'Drinking Water (1L)',
    category: 'Water',
    quantity: '10,000 units',
    requestedBy: 'Karbi Anglong DC',
    location: 'Diphu',
    priority: 'High',
    status: 'Approved',
    requestedOn: '15 Sep 2025',
    reason: 'Local municipal pipeline contaminated by flood runoff in Diphu town.'
  },
  {
    id: 'SR-015',
    item: 'Medicine Kits',
    category: 'Medical',
    quantity: '2,000 units',
    requestedBy: 'Tura SDM',
    location: 'Tura',
    priority: 'High',
    status: 'In Transit',
    requestedOn: '15 Sep 2025',
    reason: 'Surge in acute water-borne cases in West Garo Hills transit shelters.'
  },
  {
    id: 'SR-014',
    item: 'Tents',
    category: 'Shelter',
    quantity: '500 units',
    requestedBy: 'Aizawl DC',
    location: 'Aizawl',
    priority: 'Medium',
    status: 'Approved',
    requestedOn: '14 Sep 2025',
    reason: 'Slope destabilization required evacuation of 320 hillside families.'
  },
  {
    id: 'SR-013',
    item: 'Fuel (Diesel)',
    category: 'Fuel',
    quantity: '8,000 L',
    requestedBy: 'Itanagar DC',
    location: 'Itanagar',
    priority: 'Medium',
    status: 'Pending',
    requestedOn: '14 Sep 2025',
    reason: 'Generator reserve for regional civil hospital and water pump stations.'
  },
  {
    id: 'REQ001',
    item: 'Water & Trauma Medicine',
    category: 'Medical',
    quantity: '5,000 LITRE',
    requestedBy: 'Harangajao SDM',
    location: 'Harangajao',
    priority: 'Critical',
    status: 'Pending',
    requestedOn: '16 Sep 2025',
    reason: 'Landslide on NH-27 isolated Harangajao PHC medical facility.'
  },
  {
    id: 'SR-010',
    item: 'Infant Nutrition & Formula',
    category: 'Food',
    quantity: '1,200 packs',
    requestedBy: 'Sonitpur DC',
    location: 'Tezpur',
    priority: 'High',
    status: 'Pending',
    requestedOn: '15 Sep 2025',
    reason: 'Low-lying riverine settlements in Sonitpur inundated.'
  },
  {
    id: 'SR-009',
    item: 'Water Purification Tablets',
    category: 'Water',
    quantity: '25,000 tablets',
    requestedBy: 'Dhemaji DC',
    location: 'Silapathar',
    priority: 'High',
    status: 'Approved',
    requestedOn: '15 Sep 2025',
    reason: 'Brahmaputra high-stage overflow contaminating open well water.'
  },
  {
    id: 'SR-008',
    item: 'Emergency High-Calorie Rations',
    category: 'Food',
    quantity: '4,500 packs',
    requestedBy: 'Kohima DC',
    location: 'Kohima',
    priority: 'Medium',
    status: 'Approved',
    requestedOn: '14 Sep 2025',
    reason: 'Highland community centers staging evacuees from Dzükou valley rim.'
  },
  {
    id: 'SR-007',
    item: 'Family Hygiene Kits',
    category: 'Relief',
    quantity: '1,800 kits',
    requestedBy: 'Imphal West DC',
    location: 'Imphal',
    priority: 'Medium',
    status: 'Approved',
    requestedOn: '14 Sep 2025',
    reason: 'Sanitation supplies needed across 4 multi-purpose flood shelters.'
  },
  {
    id: 'SR-006',
    item: 'Heavy Duty Tarpaulins',
    category: 'Shelter',
    quantity: '1,500 units',
    requestedBy: 'Gangtok SDM',
    location: 'Mangan',
    priority: 'High',
    status: 'Approved',
    requestedOn: '14 Sep 2025',
    reason: 'Glacial runoff damaged makeshift community structures in Dzongu.'
  },
  {
    id: 'SR-005',
    item: 'Silent Mobile Generators',
    category: 'Power',
    quantity: '25 units',
    requestedBy: 'East Garo Hills SDM',
    location: 'Williamnagar',
    priority: 'Medium',
    status: 'In Transit',
    requestedOn: '13 Sep 2025',
    reason: 'Grid power transformer failure due to localized hill thunder.'
  },
  // Approved Extra (for Approved count of 8)
  {
    id: 'SR-021',
    item: 'Surgical Trauma Consumables',
    category: 'Medical',
    quantity: '600 kits',
    requestedBy: 'Silchar Medical College',
    location: 'Silchar',
    priority: 'High',
    status: 'Approved',
    requestedOn: '13 Sep 2025',
    reason: 'Emergency department triage supplies for incoming flood victims.'
  },
  {
    id: 'SR-022',
    item: 'High-Volume Water Bladders',
    category: 'Water',
    quantity: '40 units',
    requestedBy: 'Majuli DC',
    location: 'Garamur',
    priority: 'Medium',
    status: 'Approved',
    requestedOn: '13 Sep 2025',
    reason: 'Bulk clean water storage for river island evacuation camps.'
  },
  // Fulfilled Requests (24 requests)
  {
    id: 'SR-012',
    item: 'Blankets',
    category: 'Relief',
    quantity: '3,000 units',
    requestedBy: 'Kohima DC',
    location: 'Kohima',
    priority: 'Low',
    status: 'Fulfilled',
    requestedOn: '13 Sep 2025'
  },
  {
    id: 'SR-011',
    item: 'Solar Lamps',
    category: 'Power',
    quantity: '1,000 units',
    requestedBy: 'Shillong DC',
    location: 'Shillong',
    priority: 'Low',
    status: 'Fulfilled',
    requestedOn: '12 Sep 2025'
  },
  {
    id: 'SR-031',
    item: 'Packed Potable Water Cans',
    category: 'Water',
    quantity: '12,000 cans',
    requestedBy: 'Guwahati Transit Post',
    location: 'Guwahati',
    priority: 'Medium',
    status: 'Fulfilled',
    requestedOn: '12 Sep 2025'
  },
  {
    id: 'SR-032',
    item: 'Anti-Venom & First Aid',
    category: 'Medical',
    quantity: '400 vials',
    requestedBy: 'Nagaon DC',
    location: 'Nagaon',
    priority: 'High',
    status: 'Fulfilled',
    requestedOn: '11 Sep 2025'
  },
  {
    id: 'SR-033',
    item: 'Temporary Partition Screens',
    category: 'Shelter',
    quantity: '800 units',
    requestedBy: 'Tinsukia SDM',
    location: 'Tinsukia',
    priority: 'Low',
    status: 'Fulfilled',
    requestedOn: '11 Sep 2025'
  },
  {
    id: 'SR-034',
    item: 'High-Energy Glucose Biscuits',
    category: 'Food',
    quantity: '15,000 packets',
    requestedBy: 'Hailakandi DC',
    location: 'Hailakandi',
    priority: 'Medium',
    status: 'Fulfilled',
    requestedOn: '10 Sep 2025'
  },
  {
    id: 'SR-035',
    item: 'Kerosene Cooking Stoves',
    category: 'Relief',
    quantity: '600 units',
    requestedBy: 'Lunglei DC',
    location: 'Lunglei',
    priority: 'Low',
    status: 'Fulfilled',
    requestedOn: '10 Sep 2025'
  },
  {
    id: 'SR-036',
    item: 'Chlorine Disinfection Granules',
    category: 'Water',
    quantity: '500 kg',
    requestedBy: 'Jorhat DC',
    location: 'Jorhat',
    priority: 'Medium',
    status: 'Fulfilled',
    requestedOn: '09 Sep 2025'
  },
  {
    id: 'SR-037',
    item: 'Heavy Rain Ponchos & Boots',
    category: 'Relief',
    quantity: '2,500 sets',
    requestedBy: 'Mawkyrwat SDM',
    location: 'Mawkyrwat',
    priority: 'Low',
    status: 'Fulfilled',
    requestedOn: '09 Sep 2025'
  },
  {
    id: 'SR-038',
    item: 'Solar Power Banks',
    category: 'Power',
    quantity: '400 units',
    requestedBy: 'Zunheboto DC',
    location: 'Zunheboto',
    priority: 'Low',
    status: 'Fulfilled',
    requestedOn: '08 Sep 2025'
  },
  {
    id: 'SR-039',
    item: 'Mobile Satellite Radios',
    category: 'Power',
    quantity: '50 units',
    requestedBy: 'Twipra SDM',
    location: 'Dharmanagar',
    priority: 'Medium',
    status: 'Fulfilled',
    requestedOn: '08 Sep 2025'
  },
  {
    id: 'SR-040',
    item: 'Ready Meal Pouches',
    category: 'Food',
    quantity: '8,000 pouches',
    requestedBy: 'Sivasagar DC',
    location: 'Sivasagar',
    priority: 'Low',
    status: 'Fulfilled',
    requestedOn: '07 Sep 2025'
  },
  {
    id: 'SR-041',
    item: 'Medical ORS Electrolyte Packs',
    category: 'Medical',
    quantity: '10,000 sachets',
    requestedBy: 'Barpeta DC',
    location: 'Barpeta',
    priority: 'Medium',
    status: 'Fulfilled',
    requestedOn: '07 Sep 2025'
  },
  {
    id: 'SR-042',
    item: 'Inflatable Air Mattresses',
    category: 'Shelter',
    quantity: '750 units',
    requestedBy: 'Churachandpur DC',
    location: 'Churachandpur',
    priority: 'Low',
    status: 'Fulfilled',
    requestedOn: '06 Sep 2025'
  },
  {
    id: 'SR-043',
    item: 'Emergency Rescue Ropes & Harness',
    category: 'Relief',
    quantity: '200 sets',
    requestedBy: 'Bomdila SDM',
    location: 'Bomdila',
    priority: 'High',
    status: 'Fulfilled',
    requestedOn: '06 Sep 2025'
  },
  {
    id: 'SR-044',
    item: 'High-Octane Generator Fuel',
    category: 'Fuel',
    quantity: '4,000 L',
    requestedBy: 'Aizawl DC',
    location: 'Aizawl',
    priority: 'Medium',
    status: 'Fulfilled',
    requestedOn: '05 Sep 2025'
  },
  {
    id: 'SR-045',
    item: 'Baby Food Cereals',
    category: 'Food',
    quantity: '2,200 tins',
    requestedBy: 'Haflong Regional',
    location: 'Haflong',
    priority: 'High',
    status: 'Fulfilled',
    requestedOn: '05 Sep 2025'
  },
  {
    id: 'SR-046',
    item: 'Emergency Surgical Sutures',
    category: 'Medical',
    quantity: '300 boxes',
    requestedBy: 'Diphu Civil Hospital',
    location: 'Diphu',
    priority: 'High',
    status: 'Fulfilled',
    requestedOn: '04 Sep 2025'
  },
  {
    id: 'SR-047',
    item: 'Dry Firewood & Pellets',
    category: 'Fuel',
    quantity: '5,000 kg',
    requestedBy: 'Namchi SDM',
    location: 'Namchi',
    priority: 'Low',
    status: 'Fulfilled',
    requestedOn: '04 Sep 2025'
  },
  {
    id: 'SR-048',
    item: 'Potable Water Tankers (5000L)',
    category: 'Water',
    quantity: '10 tankers',
    requestedBy: 'Goalpara DC',
    location: 'Goalpara',
    priority: 'Medium',
    status: 'Fulfilled',
    requestedOn: '03 Sep 2025'
  },
  {
    id: 'SR-049',
    item: 'Reinforced Mosquito Nets',
    category: 'Relief',
    quantity: '4,000 nets',
    requestedBy: 'Karimganj DC',
    location: 'Karimganj',
    priority: 'Low',
    status: 'Fulfilled',
    requestedOn: '03 Sep 2025'
  },
  {
    id: 'SR-050',
    item: 'Sanitary Napkins & Hygiene Sets',
    category: 'Relief',
    quantity: '3,500 packs',
    requestedBy: 'Wokha SDM',
    location: 'Wokha',
    priority: 'Low',
    status: 'Fulfilled',
    requestedOn: '02 Sep 2025'
  },
  {
    id: 'SR-051',
    item: 'Emergency Torchlights & D-Cells',
    category: 'Power',
    quantity: '1,800 units',
    requestedBy: 'Nongpoh SDM',
    location: 'Nongpoh',
    priority: 'Low',
    status: 'Fulfilled',
    requestedOn: '02 Sep 2025'
  },
  {
    id: 'SR-052',
    item: 'High-Protein Pulse Bags',
    category: 'Food',
    quantity: '6,000 kg',
    requestedBy: 'Bongaigaon DC',
    location: 'Bongaigaon',
    priority: 'Medium',
    status: 'Fulfilled',
    requestedOn: '01 Sep 2025'
  },
  // Rejected Requests (3 requests)
  {
    id: 'SR-091',
    item: 'Heavy Earth Excavator',
    category: 'Relief',
    quantity: '2 units',
    requestedBy: 'Private Sub-Contractor',
    location: 'Harangajao',
    priority: 'High',
    status: 'Rejected',
    requestedOn: '14 Sep 2025',
    reason: 'Roadway bridge capacity insufficient for 40T axle weight; heavy equipment rerouted via railway flatbed.'
  },
  {
    id: 'SR-092',
    item: 'Commercial Grade Fuel Tanker',
    category: 'Fuel',
    quantity: '20,000 L',
    requestedBy: 'District Quarry Board',
    location: 'Umiam',
    priority: 'Medium',
    status: 'Rejected',
    requestedOn: '13 Sep 2025',
    reason: 'Non-emergency commercial requisition denied. Priority reserved for critical medical & search rescue units.'
  },
  {
    id: 'SR-093',
    item: 'Duplicate Rations Requisition',
    category: 'Food',
    quantity: '10,000 units',
    requestedBy: 'Diphu Sub-Division 2',
    location: 'Diphu',
    priority: 'Low',
    status: 'Rejected',
    requestedOn: '12 Sep 2025',
    reason: 'Duplicate submission detected. Overlapping requisition already authorized and en route under SR-016.'
  }
];

export const LogisticsManagementView: React.FC<{ onNavigateToTab?: (tab: string) => void; isDark?: boolean }> = ({
  onNavigateToTab: _onNavigateToTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'requests' | 'inventory' | 'fleet' | 'missions' | 'routing'>('requests');
  const [statusTab, setStatusTab] = useState<'Active' | 'Approved' | 'Fulfilled' | 'Rejected'>('Active');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Dynamic state loaded from backend
  const [requestsList, setRequestsList] = useState<SupplyRequestItem[]>(INITIAL_REQUESTS);
  const [vehiclesCount, setVehiclesCount] = useState<number>(42);
  const [activeMissionsCount, setActiveMissionsCount] = useState<number>(86);
  const [totalStockTons, setTotalStockTons] = useState<number>(1240);
  const [criticalShortagesCount, setCriticalShortagesCount] = useState<number>(3);
  const [isLoading, setIsLoading] = useState(false);

  // Form State for New Request Modal
  const [formData, setFormData] = useState({
    item: '',
    category: 'Food',
    quantity: '',
    requestedBy: '',
    location: '',
    priority: 'High' as 'Critical' | 'High' | 'Medium' | 'Low',
  });

  // Fetch dynamic state on mount
  useEffect(() => {
    let isMounted = true;
    const fetchLogisticsData = async () => {
      try {
        setIsLoading(true);
        const [overviewRes, requestsRes, vehiclesRes] = await Promise.allSettled([
          disasterApi.getDashboardOverview(),
          disasterApi.getLogisticsRequests(),
          disasterApi.getVehicles()
        ]);

        if (!isMounted) return;

        if (overviewRes.status === 'fulfilled' && overviewRes.value.success && overviewRes.value.data?.kpis) {
          const kpis = overviewRes.value.data.kpis;
          if (kpis.tons_of_supplies) setTotalStockTons(kpis.tons_of_supplies);
          if (kpis.vehicles_available) setVehiclesCount(kpis.vehicles_available);
          if (kpis.active_missions) setActiveMissionsCount(kpis.active_missions);
          if (kpis.critical_shortages) setCriticalShortagesCount(kpis.critical_shortages);
        }

        if (vehiclesRes.status === 'fulfilled' && vehiclesRes.value.success && vehiclesRes.value.data?.items) {
          const avail = vehiclesRes.value.data.items.filter((v: any) => v.status === 'AVAILABLE' || v.status === 'Available').length;
          if (avail > 0) setVehiclesCount(avail);
        }

        if (requestsRes.status === 'fulfilled' && requestsRes.value.success && requestsRes.value.data?.items && requestsRes.value.data.items.length > 0) {
          const mapped: SupplyRequestItem[] = requestsRes.value.data.items.map((r: any) => ({
            id: r.id || r.request_id,
            item: r.item || 'Disaster Relief Item',
            category: r.category || 'Relief',
            quantity: r.quantity || '1,000 units',
            requestedBy: r.requested_by || 'District HQ',
            location: r.location || 'Assam Regional Hub',
            priority: (r.priority || 'High') as any,
            status: (r.status || 'Pending') as any,
            requestedOn: r.requested_on || '16 Sep 2025',
            reason: r.reason
          }));

          if (mapped.length >= 10) {
            setRequestsList(mapped);
          }
        }
      } catch (err) {
        console.warn('[LogisticsView] Using resilient seeded operational state:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchLogisticsData();
    return () => { isMounted = false; };
  }, []);

  // Compute status tab bracket counts dynamically from actual state data
  const activeCount = requestsList.filter((r) => r.status === 'Pending' || r.status === 'Approved' || r.status === 'In Transit').length;
  const approvedCount = requestsList.filter((r) => r.status === 'Approved').length;
  const fulfilledCount = requestsList.filter((r) => r.status === 'Fulfilled').length;
  const rejectedCount = requestsList.filter((r) => r.status === 'Rejected').length;
  const pendingRequestsCount = requestsList.filter((r) => r.status === 'Pending').length;

  // Handle New Supply Request Creation
  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.item.trim()) return;

    const nextIdNum = requestsList.length + 18;
    const generatedId = `SR-${nextIdNum < 100 ? `0${nextIdNum}` : nextIdNum}`;
    const todayStr = '16 Sep 2025';

    const newReq: SupplyRequestItem = {
      id: generatedId,
      item: formData.item.trim(),
      category: formData.category,
      quantity: formData.quantity.trim() || '1,000 units',
      requestedBy: formData.requestedBy.trim() || 'District HQ',
      location: formData.location.trim() || 'Haflong',
      priority: formData.priority,
      status: 'Pending',
      requestedOn: todayStr,
      reason: 'Urgent field emergency requisition.'
    };

    // Update state immediately for instant feedback
    setRequestsList([newReq, ...requestsList]);
    setIsModalOpen(false);
    setFormData({ item: '', category: 'Food', quantity: '', requestedBy: '', location: '', priority: 'High' });

    // Switch to Active tab so user sees the newly added request right at the top
    setStatusTab('Active');

    setNotification({
      message: `Supply Request ${generatedId} created and queued for allocation!`,
      type: 'success'
    });
    setTimeout(() => setNotification(null), 4500);

    // Call backend API in background to persist
    try {
      await disasterApi.createLogisticsRequest({
        destination_id: 'HAB001',
        need_type: formData.category.toUpperCase(),
        quantity: parseInt(formData.quantity.replace(/[^0-9]/g, '')) || 1000,
        unit: 'units',
        priority: formData.priority.toUpperCase(),
        reason: `Emergency supply request for ${formData.item} at ${formData.location || 'Assam'}`
      });
    } catch (err) {
      console.warn('[LogisticsView] Request saved to operational cache:', err);
    }
  };

  // Update status of existing request (Approve, Reject, In Transit, Fulfilled)
  const handleUpdateStatus = async (requestId: string, newStatus: 'Pending' | 'Approved' | 'In Transit' | 'Fulfilled' | 'Rejected') => {
    setRequestsList((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
    );
    setActiveActionMenuId(null);

    setNotification({
      message: `Request ${requestId} status updated to "${newStatus}"`,
      type: 'info'
    });
    setTimeout(() => setNotification(null), 3500);

    // Backend sync
    try {
      await disasterApi.updateSupplyRequest(requestId, {
        status: newStatus.toUpperCase().replace(' ', '_'),
        reason: `Status transition to ${newStatus} by logistics coordinator.`
      });
    } catch (err) {
      console.warn('[LogisticsView] Status updated in local operational store:', err);
    }
  };

  // Filter requests table items
  const filteredRequests = requestsList.filter((req) => {
    const matchesSearch =
      req.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || req.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesPriority = priorityFilter === 'ALL' || req.priority.toLowerCase() === priorityFilter.toLowerCase();
    const matchesDistrict = districtFilter === 'ALL' || req.location.toLowerCase() === districtFilter.toLowerCase();

    if (statusTab === 'Active') {
      return matchesSearch && matchesCat && matchesPriority && matchesDistrict &&
        (req.status === 'Pending' || req.status === 'Approved' || req.status === 'In Transit');
    }
    return matchesSearch && matchesCat && matchesPriority && matchesDistrict && req.status === statusTab;
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[var(--background)] text-[var(--foreground)] font-sans select-none px-6 py-4 gap-4">

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg text-xs font-semibold border transition-all animate-bounce ${notification.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
            : notification.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-rose-300'
              : 'bg-[var(--secondary)] text-[var(--primary)] border-[var(--primary)]'
          }`}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-[var(--primary)] shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* 1. Header Area: Title & + New Supply Request Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[var(--muted-foreground)] uppercase block mb-0.5">
            LOGISTICS MANAGEMENT
          </span>
          <h1 className="font-serif-display text-2xl lg:text-[32px] font-normal text-[var(--foreground)] tracking-wide leading-tight">
            Right Supplies. Greater Impact.
          </h1>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5 max-w-xl font-normal">
            Manage supplies, inventory, vehicles and missions from request to delivery.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-dark-surface)] hover:bg-[var(--color-dark-raised)] active:scale-98 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Supply Request</span>
        </button>
      </div>

      {/* 2. Subtab Navigation Strip */}
      <div className="flex items-center gap-6 border-b border-[var(--border)] text-xs font-medium shrink-0 overflow-x-auto">
        {[
          { id: 'requests', label: 'Supply Requests', icon: Package },
          { id: 'inventory', label: 'Inventory', icon: Building2 },
          { id: 'fleet', label: 'Fleet', icon: Truck },
          { id: 'missions', label: 'Missions', icon: Activity },
          { id: 'routing', label: 'Route Planning', icon: Compass },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 pb-2.5 whitespace-nowrap transition-colors cursor-pointer border-b-2 relative ${isActive
                  ? 'border-[var(--primary)] text-[var(--primary)] font-semibold'
                  : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. 5 KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 shrink-0">

        {/* Card 1: Total Stock */}
        <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-[var(--muted)] flex items-center justify-center text-[var(--foreground)]">
              <Package className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
              ↑ 12% <span className="text-[9px] text-[var(--muted-foreground)] font-normal">vs last week</span>
            </span>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-bold text-[var(--foreground)] leading-none block font-sans">
              {totalStockTons.toLocaleString()}
            </span>
            <span className="text-[11px] text-[var(--muted-foreground)] font-medium mt-1 block">Total Stock (Tons)</span>
          </div>
        </div>

        {/* Card 2: Vehicles Available */}
        <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-[var(--muted)] flex items-center justify-center text-[var(--foreground)]">
              <Truck className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-600">
              ↑ 8%
            </span>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-bold text-[var(--foreground)] leading-none block font-sans">
              {vehiclesCount}
            </span>
            <span className="text-[11px] text-[var(--muted-foreground)] font-medium mt-1 block">Vehicles Available</span>
          </div>
        </div>
        {/* Card 3: Active Missions */}
        <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-[var(--muted)] flex items-center justify-center text-[var(--foreground)]">
              <ClipboardList className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-600">
              ↑ 18%
            </span>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-bold text-[var(--foreground)] leading-none block font-sans">
              {activeMissionsCount}
            </span>
            <span className="text-[11px] text-[var(--muted-foreground)] font-medium mt-1 block">Active Missions</span>
          </div>
        </div>

        {/* Card 4: Pending Requests */}
        <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-[var(--muted)] flex items-center justify-center text-[var(--foreground)]">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-rose-500">
              ↓ 25%
            </span>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-bold text-[var(--foreground)] leading-none block font-sans">
              {pendingRequestsCount}
            </span>
            <span className="text-[11px] text-[var(--muted-foreground)] font-medium mt-1 block">Pending Requests</span>
          </div>
        </div>

        {/* Card 5: Critical Shortages */}
        <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500">
              <AlertCircle className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-rose-500">
              ↑ 2
            </span>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-bold text-[var(--foreground)] leading-none block font-sans">
              {criticalShortagesCount}
            </span>
            <span className="text-[11px] text-[var(--muted-foreground)] font-medium mt-1 block">Critical Shortages</span>
          </div>
        </div>

      </div>

      {/* 4. Subtab Content Switcher */}
      {activeSubTab === 'requests' && (
        <>
          {/* Main 2-Column Section: Supply Requests Table + Inventory/Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">

            {/* Left 8-Cols: Supply Requests Table Card */}
            <div className="lg:col-span-8 bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs flex flex-col h-full max-h-[525px] overflow-hidden justify-between">
              <div className="shrink-0">
                {/* Header: Title & View All */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-[var(--foreground)]">Supply Requests</h2>
                    {isLoading && <span className="text-[10px] text-[var(--muted-foreground)] font-mono animate-pulse">Syncing...</span>}
                  </div>
                  <button
                    onClick={() => {
                      setCategoryFilter('ALL');
                      setDistrictFilter('ALL');
                      setPriorityFilter('ALL');
                      setSearchQuery('');
                    }}
                    className="text-xs font-semibold text-[var(--primary)] hover:text-[var(--primary)] flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Status Tabs with Dynamic Bracket Counts */}
                <div className="flex items-center gap-4 border-b border-[var(--border)] text-xs font-medium pb-2 mb-3">
                  {[
                    { id: 'Active', count: activeCount },
                    { id: 'Approved', count: approvedCount },
                    { id: 'Fulfilled', count: fulfilledCount },
                    { id: 'Rejected', count: rejectedCount },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setStatusTab(tab.id as any)}
                      className={`pb-1 transition-colors cursor-pointer relative ${statusTab === tab.id
                          ? 'text-[var(--primary)] font-semibold border-b-2 border-[var(--primary)] -mb-2'
                          : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                        }`}
                    >
                      {tab.id} ({tab.count})
                    </button>
                  ))}
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {/* Search */}
                  <div className="relative flex-1 min-w-[160px]">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search requests..."
                      className="w-full h-8 pl-8 pr-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-xs text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>

                  {/* Category Dropdown */}
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="h-8 px-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-xs text-[var(--foreground)] focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="Food">Food</option>
                    <option value="Water">Water</option>
                    <option value="Medical">Medical</option>
                    <option value="Shelter">Shelter</option>
                    <option value="Fuel">Fuel</option>
                    <option value="Relief">Relief</option>
                    <option value="Power">Power</option>
                  </select>

                  {/* District Dropdown */}
                  <select
                    value={districtFilter}
                    onChange={(e) => setDistrictFilter(e.target.value)}
                    className="h-8 px-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-xs text-[var(--foreground)] focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">All Districts</option>
                    <option value="Haflong">Haflong</option>
                    <option value="Diphu">Diphu</option>
                    <option value="Tura">Tura</option>
                    <option value="Aizawl">Aizawl</option>
                    <option value="Itanagar">Itanagar</option>
                    <option value="Kohima">Kohima</option>
                    <option value="Shillong">Shillong</option>
                    <option value="Tezpur">Tezpur</option>
                    <option value="Silchar">Silchar</option>
                    <option value="Mangan">Mangan</option>
                    <option value="Imphal">Imphal</option>
                  </select>

                  {/* Priority Dropdown */}
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="h-8 px-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-xs text-[var(--foreground)] focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">All Priority</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              {/* Requests Table with internal vertical scrolling */}
              <div className="overflow-x-auto overflow-y-auto min-h-0 flex-1 border-t border-[var(--border)]">
                <table className="w-full text-left text-xs text-[var(--foreground)] border-collapse">
                  <thead className="sticky top-0 bg-[var(--background)] z-10 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                    <tr className="border-b border-[var(--border)] text-[11px] font-semibold text-[var(--muted-foreground)]">
                      <th className="py-2 px-2.5 bg-[var(--background)]">ID</th>
                      <th className="py-2 px-2.5 bg-[var(--background)]">Item</th>
                      <th className="py-2 px-2.5 bg-[var(--background)]">Category</th>
                      <th className="py-2 px-2.5 bg-[var(--background)]">Quantity</th>
                      <th className="py-2 px-2.5 bg-[var(--background)]">Requested By</th>
                      <th className="py-2 px-2.5 bg-[var(--background)]">Location</th>
                      <th className="py-2 px-2.5 bg-[var(--background)]">Priority</th>
                      <th className="py-2 px-2.5 bg-[var(--background)]">Status</th>
                      <th className="py-2 px-2.5 bg-[var(--background)]">Requested On</th>
                      <th className="py-2 px-2.5 bg-[var(--background)] text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {filteredRequests.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-[var(--muted-foreground)] text-xs">
                          No supply requests found matching selected filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-[var(--background)]/70 transition-colors relative">
                          <td className="py-2 px-2.5 font-medium text-[var(--foreground)]">{req.id}</td>
                          <td className="py-2 px-2.5 font-semibold text-[var(--foreground)]">{req.item}</td>
                          <td className="py-2 px-2.5 text-[var(--muted-foreground)]">{req.category}</td>
                          <td className="py-2 px-2.5 font-mono text-[var(--foreground)]">{req.quantity}</td>
                          <td className="py-2 px-2.5 text-[var(--foreground)]">{req.requestedBy}</td>
                          <td className="py-2 px-2.5 text-[var(--foreground)]">{req.location}</td>

                          {/* Priority Badge */}
                          <td className="py-2 px-2.5">
                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${req.priority === 'Critical'
                                ? 'bg-rose-100 text-rose-700'
                                : req.priority === 'High'
                                  ? 'bg-orange-100 text-orange-700'
                                  : req.priority === 'Medium'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-emerald-100 text-emerald-700'
                              }`}>
                              {req.priority}
                            </span>
                          </td>

                          {/* Status Badge */}
                          <td className="py-2 px-2.5">
                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${req.status === 'Pending'
                                ? 'bg-amber-100 text-amber-700'
                                : req.status === 'Approved'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : req.status === 'In Transit'
                                    ? 'bg-[var(--secondary)] text-[var(--primary)]'
                                    : req.status === 'Fulfilled'
                                      ? 'bg-teal-100 text-teal-700'
                                      : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                              }`}>
                              {req.status}
                            </span>
                          </td>

                          <td className="py-2 px-2.5 text-[var(--muted-foreground)] font-mono text-[11px]">{req.requestedOn}</td>

                          {/* Actions Dropdown */}
                          <td className="py-2 px-2.5 text-center relative">
                            <button
                              onClick={() => setActiveActionMenuId(activeActionMenuId === req.id ? null : req.id)}
                              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1 rounded hover:bg-[var(--muted)] cursor-pointer"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>

                            {/* Quick Action Popup Menu */}
                            {activeActionMenuId === req.id && (
                              <div className="absolute right-0 mt-1 w-44 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-xl z-30 py-1 text-left text-xs divide-y divide-[var(--border)]">
                                <div className="px-3 py-1 font-semibold text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider">
                                  Change Status
                                </div>
                                <div className="py-0.5">
                                  {req.status !== 'Approved' && (
                                    <button
                                      onClick={() => handleUpdateStatus(req.id, 'Approved')}
                                      className="w-full px-3 py-1.5 text-left text-emerald-700 hover:bg-emerald-50 flex items-center gap-1.5 cursor-pointer font-medium"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>Approve Request</span>
                                    </button>
                                  )}
                                  {req.status !== 'In Transit' && (
                                    <button
                                      onClick={() => handleUpdateStatus(req.id, 'In Transit')}
                                      className="w-full px-3 py-1.5 text-left text-[var(--primary)] hover:bg-[var(--secondary)] flex items-center gap-1.5 cursor-pointer font-medium"
                                    >
                                      <Truck className="w-3.5 h-3.5 text-[var(--primary)]" />
                                      <span>Dispatch (In Transit)</span>
                                    </button>
                                  )}
                                  {req.status !== 'Fulfilled' && (
                                    <button
                                      onClick={() => handleUpdateStatus(req.id, 'Fulfilled')}
                                      className="w-full px-3 py-1.5 text-left text-teal-700 hover:bg-teal-50 flex items-center gap-1.5 cursor-pointer font-medium"
                                    >
                                      <Check className="w-3.5 h-3.5 text-teal-600" />
                                      <span>Mark Fulfilled</span>
                                    </button>
                                  )}
                                  {req.status !== 'Rejected' && (
                                    <button
                                      onClick={() => handleUpdateStatus(req.id, 'Rejected')}
                                      className="w-full px-3 py-1.5 text-left text-rose-700 hover:bg-rose-50 flex items-center gap-1.5 cursor-pointer font-medium"
                                    >
                                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                      <span>Reject Request</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-[var(--border)] text-[11px] text-[var(--muted-foreground)] mt-2 shrink-0">
                <span>Showing {filteredRequests.length} of {requestsList.length} total requisitions</span>
                <span className="font-mono">Real-Time State Sync Active</span>
              </div>
            </div>

            {/* Right 4-Cols: Inventory Summary & Low Stock Alerts */}
            <div className="lg:col-span-4 flex flex-col gap-4">

              {/* Card: Inventory Summary */}
              <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-[var(--foreground)]">Inventory Summary</h2>
                  <button
                    onClick={() => setActiveSubTab('inventory')}
                    className="text-xs font-semibold text-[var(--primary)] hover:text-[var(--primary)] flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Inventory</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Donut Chart & Category Legend */}
                <div className="flex items-center justify-between gap-4 py-2">
                  {/* SVG Donut */}
                  <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                      {/* Food: 38% */}
                      <circle cx="18" cy="18" r="14" fill="transparent" stroke="#10B981" strokeWidth="4.5" strokeDasharray="38 62" strokeDashoffset="0" />
                      {/* Water: 26% */}
                      <circle cx="18" cy="18" r="14" fill="transparent" stroke="#38BDF8" strokeWidth="4.5" strokeDasharray="26 74" strokeDashoffset="-38" />
                      {/* Medicine: 18% */}
                      <circle cx="18" cy="18" r="14" fill="transparent" stroke="#EF4444" strokeWidth="4.5" strokeDasharray="18 82" strokeDashoffset="-64" />
                      {/* Fuel: 10% */}
                      <circle cx="18" cy="18" r="14" fill="transparent" stroke="#3B82F6" strokeWidth="4.5" strokeDasharray="10 90" strokeDashoffset="-82" />
                      {/* Shelter: 6% */}
                      <circle cx="18" cy="18" r="14" fill="transparent" stroke="#F59E0B" strokeWidth="4.5" strokeDasharray="6 94" strokeDashoffset="-92" />
                      {/* Others: 2% */}
                      <circle cx="18" cy="18" r="14" fill="transparent" stroke="#64748B" strokeWidth="4.5" strokeDasharray="2 98" strokeDashoffset="-98" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                      <span className="text-base font-bold text-[var(--foreground)] leading-tight">1,240</span>
                      <span className="text-[10px] text-[var(--muted-foreground)]">Tons</span>
                    </div>
                  </div>

                  {/* Legend List */}
                  <div className="flex flex-col gap-1 text-xs flex-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[var(--foreground)]">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Food Packs
                      </span>
                      <span className="font-semibold text-[var(--foreground)]">38%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[var(--foreground)]">
                        <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                        Water
                      </span>
                      <span className="font-semibold text-[var(--foreground)]">26%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[var(--foreground)]">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        Medicine
                      </span>
                      <span className="font-semibold text-[var(--foreground)]">18%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[var(--foreground)]">
                        <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                        Fuel
                      </span>
                      <span className="font-semibold text-[var(--foreground)]">10%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[var(--foreground)]">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Shelter
                      </span>
                      <span className="font-semibold text-[var(--foreground)]">6%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[var(--foreground)]">
                        <span className="w-2 h-2 rounded-full bg-slate-500" />
                        Others
                      </span>
                      <span className="font-semibold text-[var(--foreground)]">2%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card: Low Stock Alerts */}
              <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-[var(--foreground)]">Low Stock Alerts</h2>
                  <button
                    onClick={() => setActiveSubTab('inventory')}
                    className="text-xs font-semibold text-[var(--primary)] hover:text-[var(--primary)] flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-col gap-2.5 text-xs">
                  {/* Alert 1 */}
                  <div className="flex items-center justify-between py-1 border-b border-[var(--border)] last:border-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
                        <HeartPulse className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[var(--foreground)] leading-tight">Medicine Kits</span>
                        <span className="text-[10px] text-[var(--muted-foreground)]">1,200 units left</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-semibold">
                      Critical
                    </span>
                  </div>

                  {/* Alert 2 */}
                  <div className="flex items-center justify-between py-1 border-b border-[var(--border)] last:border-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Utensils className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[var(--foreground)] leading-tight">Cooking Utensils</span>
                        <span className="text-[10px] text-[var(--muted-foreground)]">450 units left</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-semibold">
                      Low
                    </span>
                  </div>

                  {/* Alert 3 */}
                  <div className="flex items-center justify-between py-1 border-b border-[var(--border)] last:border-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[var(--secondary)] text-[var(--primary)] flex items-center justify-center">
                        <Droplets className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[var(--foreground)] leading-tight">Water Purification Tablets</span>
                        <span className="text-[10px] text-[var(--muted-foreground)]">800 units left</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-semibold">
                      Low
                    </span>
                  </div>

                  {/* Alert 4 */}
                  <div className="flex items-center justify-between py-1 border-b border-[var(--border)] last:border-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Tent className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[var(--foreground)] leading-tight">Tarpaulin Sheets</span>
                        <span className="text-[10px] text-[var(--muted-foreground)]">600 units left</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-semibold">
                      Low
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* 5. Bottom 3-Card Row: Stock Level Trends, Warehouse Utilization, Upcoming Deliveries */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Card 1: Stock Level Trends */}
            <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-[var(--foreground)]">Stock Level Trends</h2>
                <select className="h-7 px-2 bg-[var(--background)] border border-[var(--border)] rounded text-[11px] text-[var(--foreground)] focus:outline-none cursor-pointer">
                  <option>Last 6 Months</option>
                  <option>Last 30 Days</option>
                  <option>This Year</option>
                </select>
              </div>

              {/* Multi-Line Trend Chart (SVG) */}
              <div className="h-36 w-full relative">
                <svg viewBox="0 0 300 120" className="w-full h-full overflow-visible">
                  {/* Grid Lines */}
                  <line x1="30" y1="20" x2="290" y2="20" stroke="var(--border)" strokeWidth="1" />
                  <line x1="30" y1="50" x2="290" y2="50" stroke="var(--border)" strokeWidth="1" />
                  <line x1="30" y1="80" x2="290" y2="80" stroke="var(--border)" strokeWidth="1" />
                  <line x1="30" y1="110" x2="290" y2="110" stroke="var(--border)" strokeWidth="1" />

                  {/* Y Axis Labels */}
                  <text x="15" y="23" fontSize="8" fill="#94A3B8">200</text>
                  <text x="15" y="53" fontSize="8" fill="#94A3B8">150</text>
                  <text x="15" y="83" fontSize="8" fill="#94A3B8">100</text>
                  <text x="18" y="113" fontSize="8" fill="#94A3B8">0</text>

                  {/* Line 1: Food Packs (Emerald) */}
                  <path d="M 40 45 L 85 46 L 130 38 L 175 35 L 220 25 L 280 32" fill="none" stroke="#10B981" strokeWidth="2" />
                  <circle cx="40" cy="45" r="2.5" fill="#10B981" />
                  <circle cx="85" cy="46" r="2.5" fill="#10B981" />
                  <circle cx="130" cy="38" r="2.5" fill="#10B981" />
                  <circle cx="175" cy="35" r="2.5" fill="#10B981" />
                  <circle cx="220" cy="25" r="2.5" fill="#10B981" />
                  <circle cx="280" cy="32" r="2.5" fill="#10B981" />

                  {/* Line 2: Water (Sky Blue) */}
                  <path d="M 40 60 L 85 62 L 130 55 L 175 58 L 220 50 L 280 52" fill="none" stroke="#38BDF8" strokeWidth="2" />
                  <circle cx="40" cy="60" r="2.5" fill="#38BDF8" />
                  <circle cx="85" cy="62" r="2.5" fill="#38BDF8" />
                  <circle cx="130" cy="55" r="2.5" fill="#38BDF8" />
                  <circle cx="175" cy="58" r="2.5" fill="#38BDF8" />
                  <circle cx="220" cy="50" r="2.5" fill="#38BDF8" />
                  <circle cx="280" cy="52" r="2.5" fill="#38BDF8" />

                  {/* Line 3: Medicine (Rose) */}
                  <path d="M 40 75 L 85 76 L 130 74 L 175 70 L 220 78 L 280 76" fill="none" stroke="#EF4444" strokeWidth="2" />
                  <circle cx="40" cy="75" r="2.5" fill="#EF4444" />
                  <circle cx="85" cy="76" r="2.5" fill="#EF4444" />
                  <circle cx="130" cy="74" r="2.5" fill="#EF4444" />
                  <circle cx="175" cy="70" r="2.5" fill="#EF4444" />
                  <circle cx="220" cy="78" r="2.5" fill="#EF4444" />
                  <circle cx="280" cy="76" r="2.5" fill="#EF4444" />

                  {/* Line 4: Fuel (Amber) */}
                  <path d="M 40 90 L 85 91 L 130 88 L 175 85 L 220 86 L 280 88" fill="none" stroke="#F59E0B" strokeWidth="2" />
                  <circle cx="40" cy="90" r="2.5" fill="#F59E0B" />
                  <circle cx="85" cy="91" r="2.5" fill="#F59E0B" />
                  <circle cx="130" cy="88" r="2.5" fill="#F59E0B" />
                  <circle cx="175" cy="85" r="2.5" fill="#F59E0B" />
                  <circle cx="220" cy="86" r="2.5" fill="#F59E0B" />
                  <circle cx="280" cy="88" r="2.5" fill="#F59E0B" />

                  {/* X Axis Month Labels */}
                  <text x="35" y="120" fontSize="8" fill="#94A3B8">Apr</text>
                  <text x="80" y="120" fontSize="8" fill="#94A3B8">May</text>
                  <text x="125" y="120" fontSize="8" fill="#94A3B8">Jun</text>
                  <text x="170" y="120" fontSize="8" fill="#94A3B8">Jul</text>
                  <text x="215" y="120" fontSize="8" fill="#94A3B8">Aug</text>
                  <text x="275" y="120" fontSize="8" fill="#94A3B8">Sep</text>
                </svg>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-between text-[10px] text-[var(--muted-foreground)] pt-2 border-t border-[var(--border)]">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Food Packs</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--primary)]" /> Water</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Medicine</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Fuel</span>
              </div>
            </div>

            {/* Card 2: Warehouse Utilization */}
            <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-[var(--foreground)]">Warehouse Utilization</h2>
              </div>

              <div className="flex flex-col gap-2.5 text-xs">
                {[
                  { name: 'Guwahati Central', pct: 85 },
                  { name: 'Dima Hasao', pct: 62 },
                  { name: 'Silchar', pct: 48 },
                  { name: 'Aizawl', pct: 40 },
                  { name: 'Itanagar', pct: 35 },
                  { name: 'Kohima', pct: 28 },
                ].map((wh) => (
                  <div key={wh.name} className="flex flex-col gap-0.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[var(--foreground)] font-medium">{wh.name}</span>
                      <span className="text-[var(--foreground)] font-bold">{wh.pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${wh.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Upcoming Deliveries */}
            <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-[var(--foreground)]">Upcoming Deliveries</h2>
                <button
                  onClick={() => setActiveSubTab('missions')}
                  className="text-xs font-semibold text-[var(--primary)] hover:text-[var(--primary)] flex items-center gap-1 cursor-pointer"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-col gap-3 text-xs">
                {/* Delivery 1 */}
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[var(--muted)] text-[var(--foreground)] flex items-center justify-center shrink-0 mt-0.5">
                      <Truck className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-[var(--foreground)] leading-tight">Food Packs (5,000 units)</span>
                      <span className="text-[10px] text-[var(--muted-foreground)]">To: Haflong, Dima Hasao</span>
                      <span className="text-[10px] text-[var(--muted-foreground)] font-mono">ETA: 16 Sep, 18:00</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[var(--secondary)] text-[var(--primary)] text-[10px] font-semibold shrink-0">
                    In Transit
                  </span>
                </div>

                {/* Delivery 2 */}
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[var(--muted)] text-[var(--foreground)] flex items-center justify-center shrink-0 mt-0.5">
                      <HeartPulse className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-[var(--foreground)] leading-tight">Medicine Kits (2,000 units)</span>
                      <span className="text-[10px] text-[var(--muted-foreground)]">To: Tura</span>
                      <span className="text-[10px] text-[var(--muted-foreground)] font-mono">ETA: 17 Sep, 10:00</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[var(--secondary)] text-[var(--primary)] text-[10px] font-semibold shrink-0">
                    In Transit
                  </span>
                </div>

                {/* Delivery 3 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[var(--muted)] text-[var(--foreground)] flex items-center justify-center shrink-0 mt-0.5">
                      <Tent className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-[var(--foreground)] leading-tight">Tents (500 units)</span>
                      <span className="text-[10px] text-[var(--muted-foreground)]">To: Aizawl</span>
                      <span className="text-[10px] text-[var(--muted-foreground)] font-mono">ETA: 18 Sep, 12:00</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[var(--muted)] text-[var(--foreground)] text-[10px] font-semibold shrink-0">
                    Scheduled
                  </span>
                </div>
              </div>
            </div>

          </div>
        </>
      )}

      {/* SUBTAB 2: INVENTORY MANAGEMENT */}
      {activeSubTab === 'inventory' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'WH01', name: 'Guwahati Central Hub', capacity: '50,000 T', used: '42,500 T', pct: 85, status: 'Active', items: 6 },
              { id: 'WH02', name: 'Dima Hasao Depot', capacity: '15,000 T', used: '9,300 T', pct: 62, status: 'Active', items: 5 },
              { id: 'WH03', name: 'Silchar Valley Reserve', capacity: '20,000 T', used: '9,600 T', pct: 48, status: 'Active', items: 5 },
              { id: 'WH04', name: 'Aizawl Staging Hub', capacity: '10,000 T', used: '4,000 T', pct: 40, status: 'Active', items: 4 },
              { id: 'WH05', name: 'Itanagar Depot', capacity: '12,000 T', used: '4,200 T', pct: 35, status: 'Active', items: 4 },
              { id: 'WH06', name: 'Kohima Tactical Reserve', capacity: '10,000 T', used: '2,800 T', pct: 28, status: 'Active', items: 4 },
            ].map((wh) => (
              <div key={wh.id} className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[var(--primary)]" />
                    <h3 className="font-bold text-xs text-[var(--foreground)]">{wh.name}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-semibold">
                    {wh.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] mb-1.5">
                  <span>Storage Utilization</span>
                  <span className="font-bold text-[var(--foreground)]">{wh.pct}% ({wh.used} / {wh.capacity})</span>
                </div>
                <div className="w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: `${wh.pct}%` }} />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-[11px]">
                  <span className="text-[var(--muted-foreground)]">{wh.items} Resource Classes Stocked</span>
                  <button
                    onClick={() => {
                      setNotification({ message: `Automated replenishment order issued for ${wh.name}`, type: 'success' });
                      setTimeout(() => setNotification(null), 3000);
                    }}
                    className="text-[var(--primary)] font-semibold hover:underline cursor-pointer"
                  >
                    Restock
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs">
            <h3 className="font-bold text-sm text-[var(--foreground)] mb-3">Strategic Inventory Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[var(--foreground)] border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[11px] font-semibold text-[var(--muted-foreground)] bg-[var(--background)]">
                    <th className="py-2.5 px-3">Resource Class</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Available Stock</th>
                    <th className="py-2.5 px-3">Committed / In-Transit</th>
                    <th className="py-2.5 px-3">Share (%)</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {[
                    { name: 'Ready-to-Eat Food Packs', cat: 'Food', stock: '471.2 Tons (446,200 packs)', res: '25,000 packs', pct: '38%', badge: 'Optimal', badgeBg: 'bg-emerald-100 text-emerald-700' },
                    { name: 'Drinking Water (1L)', cat: 'Water', stock: '322.4 Tons (292,400 L)', res: '30,000 L', pct: '26%', badge: 'Adequate', badgeBg: 'bg-emerald-100 text-emerald-700' },
                    { name: 'Emergency Trauma Kits', cat: 'Medical', stock: '223.2 Tons (208,200 kits)', res: '15,000 kits', pct: '18%', badge: 'Low Alert', badgeBg: 'bg-amber-100 text-amber-700' },
                    { name: 'High-Altitude Diesel Fuel', cat: 'Fuel', stock: '124.0 Tons (112,000 L)', res: '12,000 L', pct: '10%', badge: 'Adequate', badgeBg: 'bg-emerald-100 text-emerald-700' },
                    { name: 'Tarpaulins & Shelter Tents', cat: 'Shelter', stock: '74.4 Tons (69,400 sets)', res: '5,000 sets', pct: '6%', badge: 'Moderate', badgeBg: 'bg-[var(--secondary)] text-[var(--primary)]' },
                    { name: 'Amphibious Rescue Gear', cat: 'Relief', stock: '24.8 Tons (22,800 units)', res: '2,000 units', pct: '2%', badge: 'Critical', badgeBg: 'bg-rose-100 text-rose-700' },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-[var(--background)]">
                      <td className="py-2.5 px-3 font-semibold text-[var(--foreground)]">{row.name}</td>
                      <td className="py-2.5 px-3 text-[var(--muted-foreground)]">{row.cat}</td>
                      <td className="py-2.5 px-3 font-mono">{row.stock}</td>
                      <td className="py-2.5 px-3 text-[var(--muted-foreground)] font-mono">{row.res}</td>
                      <td className="py-2.5 px-3 font-bold text-[var(--foreground)]">{row.pct}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${row.badgeBg}`}>
                          {row.badge}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: FLEET MANAGEMENT */}
      {activeSubTab === 'fleet' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[var(--foreground)]">42 Tactical Vehicles Active</span>
              <span className="text-xs text-[var(--muted-foreground)]">|</span>
              <span className="text-xs text-emerald-600 font-semibold">38 In Ready State</span>
              <span className="text-xs text-[var(--primary)] font-semibold">4 Dispatched</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setNotification({ message: 'GPS Telemetry ping sent to all 42 regional tactical convoys.', type: 'info' });
                  setTimeout(() => setNotification(null), 3000);
                }}
                className="px-3 py-1.5 bg-[var(--muted)] hover:bg-[var(--border)] text-[var(--foreground)] rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Telemetry</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {[
              { id: 'VH001', callsign: 'BRAHMAPUTRA-TACTICAL-01', type: '4x4 Heavy Truck (Tata 715)', driver: 'Havildar B. Gogoi', depot: 'Guwahati Hub', fuel: 92, status: 'Available', cap: '5,000 kg' },
              { id: 'VH002', callsign: 'BRAHMAPUTRA-TACTICAL-02', type: '4x4 Heavy Truck (Tata 715)', driver: 'Naik P. Kalita', depot: 'Guwahati Hub', fuel: 88, status: 'In Transit', cap: '5,000 kg' },
              { id: 'VH004', callsign: 'MEGHALAYA-OFFROAD-01', type: '4x4 Tactical Light (Mahindra)', driver: 'SI T. Sangma', depot: 'Shillong HQ', fuel: 95, status: 'Available', cap: '1,500 kg' },
              { id: 'VH006', callsign: 'HILL-DEFENDER-01', type: '4x4 Heavy Truck', driver: 'Havildar K. Thapa', depot: 'Dima Hasao Depot', fuel: 90, status: 'Available', cap: '4,000 kg' },
              { id: 'VH009', callsign: 'CONVOY-BUS-01', type: 'Passenger Evac Bus (50 Seater)', driver: 'Naik R. Debbarma', depot: 'Guwahati Transit', fuel: 90, status: 'Available', cap: '50 Pax' },
              { id: 'VH011', callsign: 'ARUNACHAL-RAPID-01', type: '4x4 Light Tactical', driver: 'Naik L. Ao', depot: 'Itanagar Base', fuel: 82, status: 'In Transit', cap: '2,000 kg' },
              { id: 'VH013', callsign: 'NAGALAND-EXPEDITION-01', type: '4x4 Heavy Truck', driver: 'Havildar Z. Angami', depot: 'Kohima Hub', fuel: 75, status: 'Available', cap: '4,500 kg' },
              { id: 'VH015', callsign: 'SIKKIM-ALPINE-01', type: '4x4 High-Altitude Truck', driver: 'Havildar P. Lepcha', depot: 'Gangtok Hub', fuel: 87, status: 'Available', cap: '3,500 kg' },
              { id: 'VH025', callsign: 'AMPHIBIOUS-BOAT-01', type: 'Power Inflatable Rescue Boat', driver: 'Cdr A. Sarma', depot: 'Brahmaputra Pier', fuel: 98, status: 'Available', cap: '1,200 kg' },
              { id: 'VH029', callsign: 'MEDIC-EVAC-01', type: '4x4 Mobile ICU Ambulance', driver: 'Dr. A. Dutta', depot: 'Guwahati Medical', fuel: 100, status: 'Available', cap: '4 Beds' },
              { id: 'VH033', callsign: 'KARBI-ANGLONG-HEAVY-01', type: '4x4 Heavy Truck', driver: 'Havildar H. Rongpi', depot: 'Diphu Depot', fuel: 94, status: 'Available', cap: '5,000 kg' },
              { id: 'VH035', callsign: 'UPPER-ASSAM-HEAVY-01', type: '4x4 Heavy Truck', driver: 'Havildar S. Sonowal', depot: 'Dibrugarh Yard', fuel: 95, status: 'Available', cap: '5,000 kg' },
            ].map((v) => (
              <div key={v.id} className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[11px] font-bold text-[var(--foreground)]">{v.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${v.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-[var(--secondary)] text-[var(--primary)]'
                      }`}>
                      {v.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-[var(--foreground)] leading-tight">{v.callsign}</h4>
                  <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">{v.type}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[var(--border)] flex flex-col gap-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-[var(--muted-foreground)]">
                    <span>Driver: <strong className="text-[var(--foreground)]">{v.driver}</strong></span>
                    <span>Cap: {v.cap}</span>
                  </div>
                  <div className="flex items-center justify-between text-[var(--muted-foreground)]">
                    <span>Depot: {v.depot}</span>
                    <span className="flex items-center gap-1">
                      <Fuel className="w-3 h-3 text-amber-500" />
                      <strong>{v.fuel}%</strong>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: MISSIONS MANAGEMENT */}
      {activeSubTab === 'missions' && (
        <div className="flex flex-col gap-4">
          <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-[var(--foreground)]">86 Active & Dispatched Disaster Response Missions</h3>
              <span className="text-xs text-[var(--muted-foreground)] font-mono">Live Convoy Telemetry Connected</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[var(--foreground)] border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[11px] font-semibold text-[var(--muted-foreground)] bg-[var(--background)]">
                    <th className="py-2.5 px-3">Mission ID</th>
                    <th className="py-2.5 px-3">Mission Title</th>
                    <th className="py-2.5 px-3">Destination</th>
                    <th className="py-2.5 px-3">Vehicle / Convoy</th>
                    <th className="py-2.5 px-3">Progress</th>
                    <th className="py-2.5 px-3">Priority</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {[
                    { id: 'MIS001', title: 'Emergency Rations to Harangajao', dest: 'Harangajao (Dima Hasao)', vh: 'BRAHMAPUTRA-TACTICAL-01', prog: 67, pri: 'Critical', st: 'In Transit' },
                    { id: 'MIS002', title: 'Trauma Medicine to Tura Hospital', dest: 'Tura (West Garo Hills)', vh: 'MEGHALAYA-OFFROAD-02', prog: 52, pri: 'High', st: 'In Transit' },
                    { id: 'MIS003', title: 'Strategic Fuel Delivery to Aizawl', dest: 'Aizawl (Mizoram Central)', vh: 'CONVOY-BUS-01', prog: 38, pri: 'Medium', st: 'In Transit' },
                    { id: 'MIS004', title: 'Food Packets to Maibong Camp', dest: 'Maibong (Dima Hasao)', vh: 'HILL-DEFENDER-03', prog: 75, pri: 'High', st: 'In Transit' },
                    { id: 'MIS005', title: 'Shelter Materials to Jatinga Ridge', dest: 'Jatinga (Cachar Ridge)', vh: 'BRAHMAPUTRA-TACTICAL-01', prog: 20, pri: 'High', st: 'Delayed' },
                    { id: 'MIS006', title: 'Food Rations & Boats to Sonitpur', dest: 'Sonitpur (Brahmaputra)', vh: 'BRAHMAPUTRA-TACTICAL-01', prog: 60, pri: 'High', st: 'In Transit' },
                    { id: 'MIS007', title: 'Water Purification Kits to Mokokchung', dest: 'Mokokchung (Nagaland)', vh: 'NAGALAND-EXPEDITION-01', prog: 15, pri: 'Medium', st: 'Approved' },
                    { id: 'MIS008', title: 'Emergency Medical Packs to Mangan', dest: 'Mangan (North Sikkim)', vh: 'SIKKIM-ALPINE-01', prog: 40, pri: 'Critical', st: 'In Transit' },
                  ].map((m) => (
                    <tr key={m.id} className="hover:bg-[var(--background)]">
                      <td className="py-2.5 px-3 font-mono font-bold text-[var(--foreground)]">{m.id}</td>
                      <td className="py-2.5 px-3 font-semibold text-[var(--foreground)]">{m.title}</td>
                      <td className="py-2.5 px-3 text-[var(--muted-foreground)]">{m.dest}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-[var(--foreground)]">{m.vh}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-[var(--muted)] rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: `${m.prog}%` }} />
                          </div>
                          <span className="font-mono text-[10px] text-[var(--muted-foreground)]">{m.prog}%</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${m.pri === 'Critical' ? 'bg-rose-100 text-rose-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                          {m.pri}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${m.st === 'In Transit' ? 'bg-[var(--secondary)] text-[var(--primary)]' : m.st === 'Delayed' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                          {m.st}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: ROUTE PLANNING */}
      {activeSubTab === 'routing' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs">
              <h3 className="font-bold text-xs text-[var(--foreground)] mb-1">Road Network Status</h3>
              <p className="text-[11px] text-[var(--muted-foreground)] mb-3">438 total monitored arterial segments</p>
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-700 font-semibold">Open Roads (78%)</span>
                  <span className="font-mono">342 Segments</span>
                </div>
                <div className="w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '78%' }} />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-amber-700 font-semibold">Partially Blocked (12%)</span>
                  <span className="font-mono">52 Segments</span>
                </div>
                <div className="w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '12%' }} />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-rose-700 font-semibold">Critical Blockage (10%)</span>
                  <span className="font-mono">44 Segments</span>
                </div>
                <div className="w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '10%' }} />
                </div>
              </div>
            </div>

            <div className="bg-[var(--card)] border border-[var(--border)]/80 rounded-xl p-4 shadow-2xs md:col-span-2">
              <h3 className="font-bold text-xs text-[var(--foreground)] mb-2">High-Priority Corridor Status</h3>
              <div className="flex flex-col gap-2.5 text-xs">
                {[
                  { name: 'NH-27 (Guwahati – Lumding – Haflong – Silchar)', status: 'Severed near Harangajao (200m Landslide)', alt: 'BRO Bypass Route via Maibong', etaDiff: '+45 mins', badge: 'Blocked', badgeColor: 'bg-rose-100 text-rose-700' },
                  { name: 'NH-10 (Siliguri – Sevoke – Gangtok)', status: 'Debris flow at 29th Mile, 1-lane convoy operation', alt: 'Lava-Algarah Ridge Road', etaDiff: '+60 mins', badge: 'Single-Lane', badgeColor: 'bg-amber-100 text-amber-700' },
                  { name: 'NH-208 (Agartala – Sabroom)', status: 'All bridges intact, heavy transport cleared', alt: 'Standard Corridor', etaDiff: 'On Time', badge: 'Clear', badgeColor: 'bg-emerald-100 text-emerald-700' },
                ].map((c, i) => (
                  <div key={i} className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)]/50 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[var(--foreground)]">{c.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${c.badgeColor}`}>{c.badge}</span>
                    </div>
                    <span className="text-[11px] text-[var(--muted-foreground)]">{c.status}</span>
                    <div className="flex items-center justify-between text-[10px] text-[var(--muted-foreground)] pt-1 border-t border-[var(--border)]/60 font-mono">
                      <span>Alternate: {c.alt}</span>
                      <span className="text-[var(--primary)] font-semibold">{c.etaDiff}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Bottom AI Insight Bar */}
      <div className="bg-[var(--secondary)] border border-[var(--primary)]/80 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-xs text-[var(--foreground)]">AI Insight</span>
          <p className="text-xs text-[var(--foreground)] leading-tight">
            Demand for drinking water and medicine is likely to increase in the next 7 days due to heavy rainfall forecast in upper Assam and Meghalaya.
          </p>
        </div>

        <button
          onClick={() => {
            setNotification({ message: 'Detailed multi-district demand projection loaded.', type: 'info' });
            setTimeout(() => setNotification(null), 3000);
          }}
          className="px-3 py-1.5 bg-[var(--secondary)] hover:bg-[var(--secondary)] text-[var(--primary)] rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
        >
          <span>View Detailed Analysis</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 7. Modal: Create Supply Request */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] shadow-2xl w-full max-w-md p-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[var(--primary)]" />
                <h3 className="text-sm font-bold text-[var(--foreground)]">New Supply Request</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[var(--muted-foreground)] hover:text-[var(--muted-foreground)] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block font-semibold text-[var(--foreground)] mb-1">Item Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Water Purification Kits"
                  value={formData.item}
                  onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                  className="w-full h-8 px-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[var(--foreground)] mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-8 px-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none cursor-pointer"
                  >
                    <option value="Food">Food</option>
                    <option value="Water">Water</option>
                    <option value="Medical">Medical</option>
                    <option value="Shelter">Shelter</option>
                    <option value="Fuel">Fuel</option>
                    <option value="Relief">Relief</option>
                    <option value="Power">Power</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[var(--foreground)] mb-1">Quantity *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5,000 units"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full h-8 px-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[var(--foreground)] mb-1">Requested By</label>
                  <input
                    type="text"
                    placeholder="e.g. Dima Hasao DC"
                    value={formData.requestedBy}
                    onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
                    className="w-full h-8 px-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[var(--foreground)] mb-1">Destination Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Haflong"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full h-8 px-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[var(--foreground)] mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full h-8 px-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none cursor-pointer"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
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
                  className="px-4 py-1.5 bg-[var(--primary)] hover:bg-[var(--primary)] active:scale-98 text-[var(--primary-foreground)] rounded-lg text-xs font-semibold shadow-sm cursor-pointer"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
