import React, { useState } from 'react';
import { Search, LogOut, ChevronDown, Sun, Moon } from 'lucide-react';

export interface RoleInfo {
  id: string;
  name: string;
  username: string;
  canApprove: boolean;
  canPlan: boolean;
  canReport: boolean;
}

export const ROLE_DEFINITIONS: Record<string, RoleInfo> = {
  ROLE_DISTRICT_AUTH: {
    id: 'ROLE_DISTRICT_AUTH',
    name: 'District Authority',
    username: 'dist_officer',
    canApprove: true,
    canPlan: true,
    canReport: true,
  },
  ROLE_STATE_AUTH: {
    id: 'ROLE_STATE_AUTH',
    name: 'State Disaster Authority (SDMA)',
    username: 'state_officer',
    canApprove: true,
    canPlan: true,
    canReport: true,
  },
  ROLE_LOGISTICS_COORD: {
    id: 'ROLE_LOGISTICS_COORD',
    name: 'Logistics Coordinator',
    username: 'logistics_lead',
    canApprove: false,
    canPlan: true,
    canReport: false,
  },
  ROLE_FIELD_OFFICER: {
    id: 'ROLE_FIELD_OFFICER',
    name: 'Field Officer (Ground SITREP)',
    username: 'field_officer',
    canApprove: false,
    canPlan: false,
    canReport: true,
  },
  ROLE_SHELTER_COORD: {
    id: 'ROLE_SHELTER_COORD',
    name: 'Shelter Coordinator',
    username: 'shelter_coord',
    canApprove: false,
    canPlan: false,
    canReport: false,
  },
  ROLE_TRANSPORT_OP: {
    id: 'ROLE_TRANSPORT_OP',
    name: 'Transport / Fleet Operator',
    username: 'transport_op',
    canApprove: false,
    canPlan: false,
    canReport: false,
  },
  ROLE_RESPONSE_AGENCY: {
    id: 'ROLE_RESPONSE_AGENCY',
    name: 'Response Agency (NDRF/SDRF)',
    username: 'response_agency',
    canApprove: false,
    canPlan: false,
    canReport: true,
  },
  ROLE_SYS_ADMIN: {
    id: 'ROLE_SYS_ADMIN',
    name: 'System Administrator',
    username: 'admin',
    canApprove: false,
    canPlan: false,
    canReport: false,
  },
};

export const ROLE_USER_MAP: Record<string, { full_name: string; role_title: string; initials: string; department: string }> = {
  ROLE_DISTRICT_AUTH: {
    full_name: 'Dr. Pranjal Borah, IAS',
    role_title: 'District Authority',
    initials: 'PB',
    department: 'Dima Hasao DDMA',
  },
  ROLE_STATE_AUTH: {
    full_name: 'Gyanendra Dev Tripathi, IAS',
    role_title: 'State Disaster Authority (SDMA)',
    initials: 'GT',
    department: 'Assam SDMA Apex',
  },
  ROLE_LOGISTICS_COORD: {
    full_name: 'Col. B. K. Sarma (Retd)',
    role_title: 'Logistics Coordinator',
    initials: 'BS',
    department: 'Regional Supply Depot',
  },
  ROLE_FIELD_OFFICER: {
    full_name: 'Romen Deka, Circle Officer',
    role_title: 'Field Tactical Officer',
    initials: 'RD',
    department: 'Harangajao Field SITREP',
  },
  ROLE_SHELTER_COORD: {
    full_name: 'Ananya Hazarika, ACS',
    role_title: 'Shelter Coordinator',
    initials: 'AH',
    department: 'Relief & Camp Directorate',
  },
  ROLE_TRANSPORT_OP: {
    full_name: 'Subedar M. K. Thapa',
    role_title: 'Transport / Fleet Operator',
    initials: 'MT',
    department: 'BRO Convoy Wing',
  },
  ROLE_RESPONSE_AGENCY: {
    full_name: 'Commandant Rajesh Pathak',
    role_title: 'Response Agency (NDRF)',
    initials: 'RP',
    department: '1st Bn NDRF Patgaon',
  },
  ROLE_SYS_ADMIN: {
    full_name: 'Himangshu Sharma',
    role_title: 'System Administrator',
    initials: 'HS',
    department: 'NIC Disaster Tech Unit',
  },
};

interface NavbarProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
  isDark?: boolean;
  onToggleTheme?: (event?: React.MouseEvent) => void;
  activeIncidentsCount?: number;
  currentUser?: any;
  onLogout?: () => void;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  onOpenSearchModal?: () => void;
  onOpenAlertsDrawer?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  isDark = false,
  onToggleTheme,
  activeIncidentsCount: _activeIncidentsCount,
  currentUser,
  onLogout,
  searchPlaceholder = "Search incidents, locations, missions, resources...",
  onSearch,
  onOpenSearchModal,
  onOpenAlertsDrawer: _onOpenAlertsDrawer,
}) => {
  const [searchVal, setSearchVal] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const timeStr = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date());

  const fallbackUser = ROLE_USER_MAP[currentRole] || ROLE_USER_MAP.ROLE_DISTRICT_AUTH;
  const displayName = currentUser?.full_name || fallbackUser.full_name;
  const displayRole = currentUser?.department || currentUser?.role_title || fallbackUser.role_title;

  const getInitials = (name: string) => {
    if (!name) return 'GOI';
    const clean = name.replace(/^(Dr\.|Col\.|Subedar|Commandant)\s+/i, '').trim();
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  };

  const displayInitials = currentUser?.initials || getInitials(displayName);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onOpenSearchModal) {
      onOpenSearchModal();
    } else if (onSearch) {
      onSearch(searchVal);
    }
  };

  return (
    <header className={`workspace-navbar h-[64px] border-b flex items-center justify-between px-6 select-none z-30 shrink-0 transition-colors ${
      isDark 
        ? 'bg-[var(--color-dark-paper)] border-[var(--color-dark-rule)] text-slate-100'
        : 'bg-white border-[var(--color-rule)] text-slate-800 shadow-2xs'
    }`}>
      
      {/* 1. Left Brand & Gov Emblem */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className={`font-serif-display text-[32px] tracking-wide leading-none ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            NER
          </div>
          <div className="flex flex-col justify-center">
            <span className={`text-[10px] font-bold tracking-wider uppercase leading-tight ${
              isDark ? 'text-slate-100' : 'text-slate-900'
            }`}>
              DISASTER LOGISTICS
            </span>
            <span className={`text-[8px] font-semibold tracking-widest uppercase leading-tight ${
              isDark ? 'text-[var(--color-dark-muted)]' : 'text-slate-500'
            }`}>
              INTELLIGENCE PLATFORM
            </span>
          </div>
        </div>

        {/* State / Gov Emblem */}
        <div className={`hidden md:flex items-center gap-3 pl-4 border-l ${
          isDark ? 'border-[#1E2638] text-slate-300' : 'border-slate-200 text-slate-700'
        }`}>
          <img 
            src="/emblem.png" 
            alt="National Emblem of India" 
            className="h-9 w-auto object-contain drop-shadow-xs brightness-105"
          />
          <div className="flex flex-col text-[10px] leading-tight">
            <span className={`font-semibold tracking-wide ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
              Government of India
            </span>
            <span className={`text-[9px] ${isDark ? 'text-[var(--color-dark-muted)]' : 'text-slate-500'}`}>
              North Eastern Region
            </span>
          </div>
        </div>
      </div>

      {/* 2. Center Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl mx-8 hidden md:block">
        <div 
          onClick={onOpenSearchModal}
          className="relative flex items-center cursor-pointer group"
        >
          <Search className={`w-4 h-4 absolute left-3.5 pointer-events-none transition-colors ${
            isDark ? 'text-[#5C7084] group-hover:text-[var(--primary)]' : 'text-slate-400 group-hover:text-[var(--primary)]'
          }`} />
          <input
            type="text"
            readOnly={!!onOpenSearchModal}
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder={searchPlaceholder}
            className={`w-full h-9 pl-9 pr-14 rounded-lg text-xs transition-colors cursor-pointer focus:outline-none ${
              isDark 
                ? 'bg-[var(--color-dark-surface)] border border-[var(--color-dark-rule)] text-slate-200 placeholder-[#5C7084] focus:border-[var(--primary)]'
                : 'bg-[var(--color-paper)] border border-[var(--color-rule)] text-slate-800 placeholder-slate-400 focus:border-[var(--primary)]'
            }`}
          />
          <div className={`absolute right-2 px-2 py-0.5 rounded text-[10px] font-mono border ${
            isDark 
              ? 'bg-[var(--color-dark-raised)] border-[#23354A] text-[var(--color-dark-muted)]'
              : 'bg-white border-slate-200 text-slate-400 shadow-2xs'
          }`}>
            Ctrl K
          </div>
        </div>
      </form>

      {/* 3. Right Section: Systems Status, Time, Theme Toggle, User Profile */}
      <div className="flex items-center gap-4 relative">
        {/* All Systems Operational */}
        <div className={`hidden lg:flex items-center gap-2 text-xs font-medium ${
          isDark ? 'text-emerald-400' : 'text-emerald-600'
        }`}>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shrink-0 shadow-xs" />
          <span className="text-[11px] font-medium tracking-wide">Operations workspace</span>
        </div>

        {/* Date / Time */}
        <div className={`hidden xl:block whitespace-nowrap text-[11px] font-mono ${
          isDark ? 'text-[var(--color-dark-muted)]' : 'text-slate-500'
        }`}>
          {timeStr}
        </div>

        {/* Theme Toggle Button (Light/Dark) */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
              isDark 
                ? 'border-[#1E2C3E] bg-[var(--color-dark-surface)] text-amber-300 hover:text-amber-200 hover:border-amber-400/50 shadow-xs'
                : 'border-slate-200 bg-slate-100 text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-xs'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        )}

        {/* Authenticated User Pill (Dynamic) */}
        <div className="relative">
          <div 
            role="button"
            tabIndex={0}
            aria-label="Account menu"
            aria-expanded={isUserMenuOpen}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsUserMenuOpen(!isUserMenuOpen); } if (e.key === 'Escape') setIsUserMenuOpen(false); }}
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={`flex items-center gap-3 pl-3 pr-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
              isDark 
                ? 'border-[#1E2C3E] hover:border-[var(--primary)]/50 bg-[var(--color-dark-surface)]/80'
                : 'border-slate-200 hover:border-[var(--primary)] bg-slate-50 shadow-xs'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shadow-inner ${
              isDark 
                ? 'bg-[#1A2C40] border border-[#2B435F] text-[var(--primary)]'
                : 'bg-[var(--primary)] text-[var(--primary-foreground)]'
            }`}>
              {displayInitials}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-semibold leading-tight max-w-[170px] truncate ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {displayName}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </div>
              <span className={`text-[10px] leading-tight max-w-[170px] truncate ${
                isDark ? 'text-[var(--color-dark-muted)]' : 'text-slate-500'
              }`}>
                {displayRole}
              </span>
            </div>

            {onLogout && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLogout();
                }}
                title="Sign Out"
                className="text-slate-400 hover:text-rose-500 p-1 transition-colors ml-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* User / Persona Switcher Dropdown */}
          {isUserMenuOpen && (
            <div className={`absolute right-0 mt-2 w-80 max-w-[calc(100vw-24px)] rounded-xl shadow-2xl border p-2 z-50 backdrop-blur-xl ${
              isDark 
                ? 'bg-[var(--color-dark-surface)] border-[#1E2C3E] text-slate-200'
                : 'bg-white border-slate-200 text-slate-800'
            }`}>
              {/* Active Authenticated Session Banner */}
              <div className={`px-3 py-2.5 rounded-lg border mb-2 ${
                isDark 
                  ? 'bg-[var(--primary)]/10 border-[var(--primary)]/30 text-slate-200'
                  : 'bg-[var(--secondary)] border-[var(--primary)]/80 text-slate-900'
              }`}>
                <div className={`text-[10px] uppercase font-bold tracking-wider ${
                  isDark ? 'text-[var(--primary)]' : 'text-[var(--primary)]'
                }`}>
                  Active Authenticated Session
                </div>
                <div className={`text-xs font-bold mt-0.5 truncate ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {displayName}
                </div>
                <div className={`text-[10px] truncate ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {displayRole}
                </div>
              </div>

              <div className={`text-[9px] uppercase font-semibold px-3 py-1 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Switch Operational Persona
              </div>

              <div className="space-y-1 max-h-60 overflow-y-auto custom-scrollbar">
                {Object.entries(ROLE_USER_MAP).map(([roleKey, u]) => {
                  const isActive = (currentUser?.role || currentRole) === roleKey;
                  return (
                    <button
                      key={roleKey}
                      onClick={() => {
                        onRoleChange(roleKey);
                        setIsUserMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        isActive 
                          ? isDark
                            ? 'bg-[var(--primary)]/20 text-[var(--primary)] font-semibold border border-[var(--primary)]/40 shadow-xs'
                            : 'bg-[var(--secondary)] text-[var(--primary)] font-bold border border-[var(--primary)] shadow-xs'
                          : isDark
                            ? 'hover:bg-white/5 text-slate-300' 
                            : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="truncate font-medium">{u.full_name}</div>
                        <div className={`text-[10px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{u.role_title}</div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono shrink-0 font-semibold ${
                        isActive 
                          ? isDark ? 'bg-[var(--primary)]/30 text-[var(--primary)]' : 'bg-[var(--secondary)] text-[var(--primary)]'
                          : isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {u.initials}
                      </span>
                    </button>
                  );
                })}
              </div>

              {onLogout && (
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onLogout();
                  }}
                  className={`w-full mt-2 pt-2 border-t text-xs font-medium flex items-center justify-center gap-2 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    isDark 
                      ? 'border-white/10 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10' 
                      : 'border-slate-200 text-rose-600 hover:text-rose-700 hover:bg-rose-50'
                  }`}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out Session</span>
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
