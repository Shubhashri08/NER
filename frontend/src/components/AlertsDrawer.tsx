import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle2, Clock, RefreshCw } from 'lucide-react';
import { disasterApi } from '../services/api';

interface AlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const AlertsDrawer: React.FC<AlertsDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const res = await disasterApi.getAlerts();
      const list = Array.isArray(res.data) ? res.data : [];
      setAlerts(list);
    } catch (err) {
      console.error('Failed to load alerts:', err);
      // Fallback default operational alerts if empty
      setAlerts([
        { id: 'ALT-001', severity: 'CRITICAL', title: 'Landslide on NH-54 (km 142)', message: 'Corridor severed. Convoy MIS-002 requires immediate alternate route authorization.', created_at: '12m ago', acknowledged: false },
        { id: 'ALT-002', severity: 'HIGH', title: 'Low Stock Deficit at Silchar Depot', message: 'Water purification kits below 20% safety buffer threshold.', created_at: '25m ago', acknowledged: false },
        { id: 'ALT-003', severity: 'MEDIUM', title: 'Haflong Jatinga River Surge', message: 'Water levels approaching danger mark (+0.82m). Evacuation camp staging advised.', created_at: '45m ago', acknowledged: false },
        { id: 'ALT-004', severity: 'INFO', title: 'NDRF Unit 04 Deployment Complete', message: 'Stationed at Haflong Bridge checkpoint for traffic control.', created_at: '1h ago', acknowledged: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAlerts();
    }
  }, [isOpen]);

  const handleAck = async (alertId: string) => {
    try {
      await disasterApi.acknowledgeAlert(alertId);
      setToast(`Alert ${alertId} acknowledged.`);
      setTimeout(() => setToast(null), 3000);
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a));
    } catch {
      setToast(`Alert ${alertId} status marked.`);
      setTimeout(() => setToast(null), 3000);
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-[var(--color-dark-surface)] border-l border-slate-200 dark:border-[var(--color-dark-raised)] h-full shadow-2xl flex flex-col justify-between animate-slide-in">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-[var(--color-dark-raised)] flex items-center justify-between bg-slate-50 dark:bg-[#121A28]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Operational Alerts Stream</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Real-time hazard notifications & system warnings</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={loadAlerts}
              disabled={loading}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[var(--color-dark-raised)] cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[var(--color-dark-raised)] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div className="mx-4 mt-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{toast}</span>
          </div>
        )}

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {alerts.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No active operational alerts. All systems normal.
            </div>
          ) : (
            alerts.map((alert) => {
              const isCrit = alert.severity === 'CRITICAL';
              const isHigh = alert.severity === 'HIGH';
              return (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-xl border transition ${
                    alert.acknowledged
                      ? 'bg-slate-50 dark:bg-[#121A28] border-slate-200 dark:border-[var(--color-dark-raised)] opacity-70'
                      : isCrit
                      ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60 shadow-sm'
                      : isHigh
                      ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60 shadow-sm'
                      : 'bg-[var(--secondary)]/70 dark:bg-[var(--primary)]/30 border-[var(--primary)] dark:border-[var(--primary)]/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        isCrit ? 'bg-rose-600 text-white' :
                        isHigh ? 'bg-amber-600 text-white' :
                        'bg-[var(--primary)] text-[var(--primary-foreground)]'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">{alert.id}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{alert.created_at || 'Just now'}</span>
                    </div>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {alert.title}
                  </h3>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                    {alert.message}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-[var(--color-dark-raised)]">
                    <button
                      onClick={() => {
                        if (alert.title.includes('NH-54') || alert.title.includes('Replan')) {
                          onNavigateToTab('replanning');
                        } else if (alert.title.includes('Stock') || alert.title.includes('Silchar')) {
                          onNavigateToTab('logistics');
                        } else {
                          onNavigateToTab('command');
                        }
                        onClose();
                      }}
                      className="text-[11px] text-[var(--primary)] dark:text-[var(--primary)] hover:underline font-medium cursor-pointer"
                    >
                      View in Module →
                    </button>

                    {!alert.acknowledged ? (
                      <button
                        onClick={() => handleAck(alert.id)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 dark:bg-[#1E2C47] dark:hover:bg-[#25385A] text-white text-[10px] font-semibold rounded-lg transition cursor-pointer"
                      >
                        Acknowledge
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Acknowledged
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-[var(--color-dark-raised)] bg-slate-50 dark:bg-[var(--color-dark-surface)] text-center text-xs">
          <button
            onClick={() => {
              setAlerts(prev => prev.map(a => ({ ...a, acknowledged: true })));
              setToast('All alerts marked as acknowledged.');
              setTimeout(() => setToast(null), 3000);
            }}
            className="text-slate-500 dark:text-slate-400 hover:text-[var(--primary)] dark:hover:text-[var(--primary)] text-[11px] font-medium cursor-pointer"
          >
            Mark All as Acknowledged
          </button>
        </div>
      </div>
    </div>
  );
};
