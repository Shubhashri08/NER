import React, { useState, useEffect } from 'react';
import { Search, X, AlertTriangle, Building2, Truck, Package, ArrowRight } from 'lucide-react';
import { disasterApi } from '../services/api';
import type { IncidentRecord, WarehouseRecord, VehicleRecord, MissionRecord } from '../services/api';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const [query, setQuery] = useState('');
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseRecord[]>([]);
  const [vehicles, setVehicles] = useState<VehicleRecord[]>([]);
  const [missions, setMissions] = useState<MissionRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const loadAll = async () => {
      try {
        setLoading(true);
        const [incRes, whRes, vehRes, misRes] = await Promise.all([
          disasterApi.getIncidents(),
          disasterApi.getWarehouses(),
          disasterApi.getVehicles(),
          disasterApi.getMissions(),
        ]);
        setIncidents(incRes.data?.items || []);
        setWarehouses(whRes.data?.items || []);
        setVehicles(vehRes.data?.items || []);
        setMissions(misRes.data?.items || []);
      } catch (err) {
        console.error('Search data fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredIncidents = incidents.filter(i => 
    !q || i.id.toLowerCase().includes(q) || (i.type || '').toLowerCase().includes(q) || (i.description || '').toLowerCase().includes(q)
  );

  const filteredWarehouses = warehouses.filter(w => 
    !q || w.id.toLowerCase().includes(q) || (w.name || '').toLowerCase().includes(q)
  );

  const filteredVehicles = vehicles.filter(v => 
    !q || v.id.toLowerCase().includes(q) || (v.callsign || '').toLowerCase().includes(q) || (v.type || '').toLowerCase().includes(q)
  );

  const filteredMissions = missions.filter(m => 
    !q || m.id.toLowerCase().includes(q) || (m.title || '').toLowerCase().includes(q) || (m.status || '').toLowerCase().includes(q)
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-fade-in">
      <div className="bg-white dark:bg-[#101726] border border-slate-200 dark:border-[var(--color-dark-raised)] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 dark:border-[var(--color-dark-raised)] flex items-center gap-3 bg-slate-50 dark:bg-[#131C2E]">
          <Search className="w-5 h-5 text-[var(--primary)] dark:text-[var(--primary)] shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search incidents, warehouses, vehicles, missions across 8 NER states..."
            className="flex-1 bg-transparent border-none text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-[var(--color-dark-raised)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {loading ? (
            <div className="py-8 text-center text-slate-400">Loading directory...</div>
          ) : (
            <>
              {/* Incidents Group */}
              {filteredIncidents.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    Incidents ({filteredIncidents.length})
                  </div>
                  <div className="space-y-1.5">
                    {filteredIncidents.slice(0, 4).map(inc => (
                      <div 
                        key={inc.id}
                        onClick={() => { onNavigateToTab('command'); onClose(); }}
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-[var(--color-dark-raised)] hover:bg-[var(--secondary)] dark:hover:bg-[var(--color-dark-rule)] border border-slate-200 dark:border-[var(--color-dark-rule)] flex items-center justify-between cursor-pointer transition"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[var(--primary)] dark:text-[var(--primary)]">{inc.id}</span>
                          <span className="text-slate-800 dark:text-slate-200 font-medium">{inc.description || inc.type}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-semibold">{inc.severity}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warehouses Group */}
              {filteredWarehouses.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[var(--primary)]" />
                    Warehouses & Logistics Hubs ({filteredWarehouses.length})
                  </div>
                  <div className="space-y-1.5">
                    {filteredWarehouses.slice(0, 3).map(wh => (
                      <div 
                        key={wh.id}
                        onClick={() => { onNavigateToTab('logistics'); onClose(); }}
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-[var(--color-dark-raised)] hover:bg-[var(--secondary)] dark:hover:bg-[var(--color-dark-rule)] border border-slate-200 dark:border-[var(--color-dark-rule)] flex items-center justify-between cursor-pointer transition"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[var(--primary)] dark:text-[var(--primary)]">{wh.id}</span>
                          <span className="text-slate-800 dark:text-slate-200 font-medium">{wh.name}</span>
                          <span className="text-slate-500 text-[10px]">{wh.status}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vehicles Group */}
              {filteredVehicles.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-purple-500" />
                    Fleet & Convoys ({filteredVehicles.length})
                  </div>
                  <div className="space-y-1.5">
                    {filteredVehicles.slice(0, 3).map(veh => (
                      <div 
                        key={veh.id}
                        onClick={() => { onNavigateToTab('map'); onClose(); }}
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-[var(--color-dark-raised)] hover:bg-[var(--secondary)] dark:hover:bg-[var(--color-dark-rule)] border border-slate-200 dark:border-[var(--color-dark-rule)] flex items-center justify-between cursor-pointer transition"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{veh.callsign || veh.id}</span>
                          <span className="text-slate-800 dark:text-slate-200 font-medium">{veh.type}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--secondary)] dark:bg-[var(--primary)] text-[var(--primary)] dark:text-[var(--primary)]">{veh.status}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Missions Group */}
              {filteredMissions.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-emerald-500" />
                    Active Missions ({filteredMissions.length})
                  </div>
                  <div className="space-y-1.5">
                    {filteredMissions.slice(0, 3).map(mis => (
                      <div 
                        key={mis.id}
                        onClick={() => { onNavigateToTab('replanning'); onClose(); }}
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-[var(--color-dark-raised)] hover:bg-[var(--secondary)] dark:hover:bg-[var(--color-dark-rule)] border border-slate-200 dark:border-[var(--color-dark-rule)] flex items-center justify-between cursor-pointer transition"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{mis.id}</span>
                          <span className="text-slate-800 dark:text-slate-200 font-medium">{mis.title || 'Relief Convoy'}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">{mis.status}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredIncidents.length === 0 && filteredWarehouses.length === 0 && filteredVehicles.length === 0 && (
                <div className="py-8 text-center text-slate-400">
                  No matching operational entities found for "{query}".
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 border-t border-slate-200 dark:border-[var(--color-dark-raised)] bg-slate-100 dark:bg-[var(--color-dark-surface)] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Press <strong>ESC</strong> to close</span>
          <span>Click any item to inspect in module</span>
        </div>
      </div>
    </div>
  );
};
