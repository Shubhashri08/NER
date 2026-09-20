import React from 'react';
import { 
  Home, 
  BookOpen, 
  Package, 
  RefreshCw, 
  Users, 
  TrendingUp 
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  activeAlertCount?: number;
  isDark?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  isDark = false,
}) => {
  const primaryNavItems = [
    { id: 'command', label: 'Command Center', icon: Home },
    { id: 'map', label: 'Live Map', icon: BookOpen },
    { id: 'logistics', label: 'Logistics', icon: Package },
    { id: 'replanning', label: 'Response & Replanning', icon: RefreshCw },
    { id: 'relocation', label: 'Relocation', icon: Users },
    { id: 'intelligence', label: 'Intelligence', icon: TrendingUp },
  ];

  return (
    <aside className={`workspace-sidebar w-[230px] flex flex-col justify-between shrink-0 select-none z-20 h-full transition-colors font-sans ${
      isDark 
        ? 'bg-[var(--color-dark-paper)] border-r border-[var(--color-dark-rule)] text-slate-200'
        : 'bg-white border-r border-[var(--color-rule)] text-slate-800'
    }`}>
      
      {/* Top Nav List */}
      <div className="flex flex-col py-4 px-3 gap-5 overflow-y-auto">
        
        {/* Primary Operational Links */}
        <div className="flex flex-col gap-1">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                title={item.label}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? isDark 
                      ? 'bg-[var(--color-dark-raised)] text-white font-semibold shadow-xs'
                      : 'bg-[var(--secondary)] text-[var(--primary)] font-semibold border border-[var(--primary)]/80 shadow-xs'
                    : isDark
                      ? 'text-[var(--color-dark-muted)] hover:text-slate-200 hover:bg-[#0E1B2B]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${
                  isActive 
                    ? isDark ? 'text-white' : 'text-[var(--primary)]'
                    : isDark ? 'text-[var(--color-dark-muted)]' : 'text-slate-500'
                }`} />
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Bottom Misty Mountain Graphic & Typography Motto */}
      <div className={`relative min-h-[160px] overflow-hidden p-5 flex flex-col justify-end shrink-0 ${
        isDark 
          ? 'bg-gradient-to-t from-[#04080E] to-transparent' 
          : 'bg-gradient-to-t from-slate-100/90 to-transparent'
      }`}>
        {/* Mountain Image Background */}
        <div 
          className={`absolute inset-0 bg-cover bg-bottom pointer-events-none transition-opacity ${
            isDark ? 'opacity-25' : 'opacity-15'
          }`}
          style={{ backgroundImage: `url('/images/hero-bg-mountains.jpg')` }}
        />

        {/* Text Motto */}
        <div className="relative z-10 text-left">
          <div className={`font-serif-display text-sm leading-snug tracking-wide font-medium ${
            isDark ? 'text-[#CBD5E1]' : 'text-slate-700'
          }`}>
            Resilient<br />
            Northeast<br />
            Stronger<br />
            Tomorrow
          </div>
        </div>
      </div>

    </aside>
  );
};
