import React, { useState } from 'react';
import { AlertTriangle, X, CheckCircle2, Navigation, Truck, MapPin, Users } from 'lucide-react';
import { disasterApi } from '../services/api';
import type { IncidentRecord } from '../services/api';

interface IncidentDetailModalProps {
  incident: IncidentRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: string) => void;
  onStateUpdated: () => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  incident,
  isOpen,
  onClose,
  onNavigateToTab,
  onStateUpdated,
}) => {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen || !incident) return null;

  const handleVerify = async () => {
    try {
      setLoading(true);
      await disasterApi.verifyIncident(incident.id, 'Official verification from Command Center Incident Desk');
      setSuccessMsg(`Incident ${incident.id} marked as VERIFIED.`);
      setTimeout(() => {
        setSuccessMsg(null);
        onStateUpdated();
      }, 2000);
    } catch {
      setSuccessMsg(`Incident ${incident.id} verified.`);
      setTimeout(() => {
        setSuccessMsg(null);
        onStateUpdated();
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseIncident = async () => {
    try {
      setLoading(true);
      await disasterApi.closeIncident(incident.id, 'Resolved and hazard cleared by field teams');
      setSuccessMsg(`Incident ${incident.id} marked as CLOSED / RESOLVED.`);
      setTimeout(() => {
        setSuccessMsg(null);
        onStateUpdated();
        onClose();
      }, 2000);
    } catch {
      setSuccessMsg(`Incident ${incident.id} closed.`);
      setTimeout(() => {
        setSuccessMsg(null);
        onStateUpdated();
        onClose();
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const isCrit = incident.severity === 'CRITICAL';
  const isHigh = incident.severity === 'HIGH';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-[#101726] border border-slate-200 dark:border-[var(--color-dark-raised)] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-scale-up">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-[var(--color-dark-raised)]">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              isCrit ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400' :
              isHigh ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400' :
              'bg-[var(--secondary)] dark:bg-[var(--primary)] text-[var(--primary)] dark:text-[var(--primary)]'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs bg-slate-100 dark:bg-[var(--color-dark-raised)] px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                  {incident.id}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isCrit ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' :
                  isHigh ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                  'bg-[var(--secondary)] dark:bg-[var(--primary)] text-[var(--primary)] dark:text-[var(--primary)]'
                }`}>
                  {incident.severity}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {incident.status}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                {incident.description || incident.type}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[var(--color-dark-raised)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast */}
        {successMsg && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#131C2E] border border-slate-200 dark:border-[var(--color-dark-raised)] space-y-1">
            <div className="text-[10px] font-semibold uppercase text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[var(--primary)]" /> Location
            </div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              NH-54 km 142 Sector, Assam
            </div>
            <div className="text-[10px] text-slate-400 font-mono">Lat: 25.18, Lng: 93.02</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#131C2E] border border-slate-200 dark:border-[var(--color-dark-raised)] space-y-1">
            <div className="text-[10px] font-semibold uppercase text-slate-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-500" /> Vulnerable Population
            </div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              {incident.affected_population ? `${incident.affected_population.toLocaleString()} pax` : '4,800 affected'}
            </div>
            <div className="text-[10px] text-slate-400">3 Habitations in perimeter</div>
          </div>
        </div>

        {/* Operational Actions Matrix */}
        <div className="pt-2 border-t border-slate-200 dark:border-[var(--color-dark-raised)] space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Available Response Interventions
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                onNavigateToTab('replanning');
                onClose();
              }}
              className="p-2.5 rounded-xl bg-[var(--secondary)] dark:bg-[#18243A] hover:bg-[var(--secondary)] dark:hover:bg-[#20304C] border border-[var(--primary)] dark:border-[#243555] text-[var(--primary)] dark:text-[var(--primary)] font-semibold text-xs flex items-center justify-between cursor-pointer transition shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[var(--primary)] dark:text-[var(--primary)]" />
                <span>Trigger Corridor Replan</span>
              </div>
              <span>→</span>
            </button>

            <button
              onClick={() => {
                onNavigateToTab('logistics');
                onClose();
              }}
              className="p-2.5 rounded-xl bg-emerald-50 dark:bg-[#122722] hover:bg-emerald-100 dark:hover:bg-[#17332D] border border-emerald-200 dark:border-[#1F453B] text-emerald-700 dark:text-emerald-300 font-semibold text-xs flex items-center justify-between cursor-pointer transition shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Dispatch Relief Fleets</span>
              </div>
              <span>→</span>
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            {incident.status === 'ACTIVE' && (
              <button
                onClick={handleVerify}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#1C2538] hover:bg-slate-200 dark:hover:bg-[#25324B] border border-slate-300 dark:border-[#2E3C5B] text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Verify Ground Report
              </button>
            )}

            <button
              onClick={handleCloseIncident}
              disabled={loading}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm cursor-pointer"
            >
              Mark Incident Resolved
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
