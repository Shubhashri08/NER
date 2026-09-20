import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate, 
  useNavigate, 
  useLocation 
} from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { Navbar, ROLE_DEFINITIONS, ROLE_USER_MAP } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { CommandCenterView } from './components/CommandCenterView';
import { LiveMapView } from './components/LiveMapView';
import { LogisticsManagementView } from './components/LogisticsManagementView';
import { ResponseReplanningView } from './components/ResponseReplanningView';
import { RelocationView } from './components/RelocationView';
import { IntelligenceView } from './components/IntelligenceView';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AlertsDrawer } from './components/AlertsDrawer';
import { ApprovalModal } from './components/ApprovalModal';
import { disasterApi, setAuthToken } from './services/api';

// Route-to-Role Mapping
const ROLE_TO_PATH: Record<string, string> = {
  ROLE_DISTRICT_AUTH: '/command',
  ROLE_STATE_AUTH: '/state',
  ROLE_LOGISTICS_COORD: '/logistics',
  ROLE_FIELD_OFFICER: '/field',
  ROLE_SHELTER_COORD: '/relocation',
  ROLE_TRANSPORT_OP: '/transport',
  ROLE_RESPONSE_AGENCY: '/replanning',
  ROLE_SYS_ADMIN: '/admin',
};

interface ProtectedLayoutProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
  currentUser: any;
  onLogout: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({
  currentRole,
  onRoleChange,
  currentUser,
  onLogout,
  isDark,
  onToggleTheme,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedIncidentForMap, setSelectedIncidentForMap] = useState<string | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState<boolean>(false);

  // Map current pathname to active sidebar tab
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/map')) return 'map';
    if (path.includes('/logistics') || path.includes('/transport')) return 'logistics';
    if (path.includes('/replanning') || path.includes('/response')) return 'replanning';
    if (path.includes('/relocation')) return 'relocation';
    if (path.includes('/intelligence')) return 'intelligence';
    if (path.includes('/alerts')) return 'command';
    return 'command';
  };

  const currentTab = getActiveTab();

  const handleTabChange = (tabId: string) => {
    if (tabId === 'command') {
      navigate('/command');
    } else if (tabId === 'map') {
      navigate('/map');
    } else if (tabId === 'logistics') {
      navigate('/logistics');
    } else if (tabId === 'replanning') {
      navigate('/replanning');
    } else if (tabId === 'relocation') {
      navigate('/relocation');
    } else if (tabId === 'intelligence') {
      navigate('/intelligence');
    } else if (tabId === 'alerts') {
      setIsAlertsOpen(true);
    }
  };

  const handleIncidentSelect = (incident: any) => {
    setSelectedIncidentForMap(incident.id);
    navigate('/map');
  };

  return (
    <div className={`workspace h-screen w-screen flex flex-col relative overflow-hidden font-sans transition-colors ${
      isDark ? 'bg-[var(--color-dark-paper)] text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Tactical Top Bar */}
      <div className="relative z-30 shrink-0">
        <Navbar
          currentRole={currentRole}
          onRoleChange={(newRole) => {
            onRoleChange(newRole);
            const targetPath = ROLE_TO_PATH[newRole] || '/command';
            navigate(targetPath);
          }}
          currentUser={currentUser}
          onLogout={onLogout}
          isDark={isDark}
          onToggleTheme={onToggleTheme}
          activeIncidentsCount={5}
          onOpenSearchModal={() => setIsSearchOpen(true)}
          onOpenAlertsDrawer={() => setIsAlertsOpen(true)}
        />
      </div>

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
        {/* Left Navigation Dock */}
        <Sidebar 
          currentTab={currentTab} 
          onTabChange={handleTabChange} 
          activeAlertCount={5}
          isDark={isDark}
        />

        {/* Operational Canvas Area */}
        <main className={`flex-1 overflow-hidden flex flex-col h-full transition-colors ${
          isDark ? 'bg-[var(--color-dark-paper)]' : 'bg-[var(--color-paper)]'
        }`}>
          {/* 1. Command Center View */}
          {currentTab === 'command' && (
            <CommandCenterView
              onNavigateToTab={handleTabChange}
              onSelectIncident={handleIncidentSelect}
              isDark={isDark}
            />
          )}

          {/* 2. Live Geospatial Map View */}
          {currentTab === 'map' && (
            <LiveMapView
              onNavigateToTab={handleTabChange}
              initialSelectedIncidentId={selectedIncidentForMap}
              isDark={isDark}
            />
          )}

          {/* 3. Logistics & Supply Chain View */}
          {currentTab === 'logistics' && (
            <LogisticsManagementView
              onNavigateToTab={handleTabChange}
              isDark={isDark}
            />
          )}

          {/* 4. Response Replanning View */}
          {currentTab === 'replanning' && (
            <ResponseReplanningView
              onNavigateToTab={handleTabChange}
              isDark={isDark}
            />
          )}

          {/* 5. Relocation & Evacuation View */}
          {currentTab === 'relocation' && (
            <RelocationView
              onNavigateToTab={handleTabChange}
              isDark={isDark}
            />
          )}

          {/* 6. Unified Intelligence & AI Copilot View */}
          {currentTab === 'intelligence' && (
            <IntelligenceView
              onNavigateToTab={handleTabChange}
              isDark={isDark}
            />
          )}
        </main>
      </div>

      {/* Global Command Palette (Ctrl+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateToTab={(tab) => {
          handleTabChange(tab);
          setIsSearchOpen(false);
        }}
      />

      {/* Slide-out Operational Alerts Drawer */}
      <AlertsDrawer
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        onNavigateToTab={handleTabChange}
      />

      {/* Sign-off Modal */}
      <ApprovalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => setIsModalOpen(false)}
        role={currentRole}
      />
    </div>
  );
};

export function App() {
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem('ner_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    const defaultRoleUser = ROLE_USER_MAP.ROLE_DISTRICT_AUTH;
    return {
      username: 'dist_officer',
      full_name: defaultRoleUser.full_name,
      role: 'ROLE_DISTRICT_AUTH',
      role_title: defaultRoleUser.role_title,
      department: defaultRoleUser.department,
      initials: defaultRoleUser.initials,
    };
  });

  const [currentRole, setCurrentRole] = useState<string>(() => {
    const saved = localStorage.getItem('ner_user');
    if (saved) {
      try {
        return JSON.parse(saved).role || 'ROLE_DISTRICT_AUTH';
      } catch {
        return 'ROLE_DISTRICT_AUTH';
      }
    }
    return 'ROLE_DISTRICT_AUTH';
  });

  // Default theme is Light mode as requested (base mode)
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('ner_theme');
    return saved !== null ? saved === 'dark' : false;
  });

  // Sync class on <html> element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ner_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ner_theme', 'light');
    }
  }, [isDark]);

  // Sync token whenever role changes
  useEffect(() => {
    if (!currentUser?.is_demo) return;
    const roleDef = ROLE_DEFINITIONS[currentRole] || ROLE_DEFINITIONS.ROLE_DISTRICT_AUTH;
    disasterApi.login(roleDef.username, "admin123")
      .then((res) => {
        if (res.data?.access_token) {
          setAuthToken(res.data.access_token);
        }
      })
      .catch((err) => {
        console.warn("Backend auth token sync:", err.message);
      });
  }, [currentRole, currentUser?.is_demo]);

  const handleToggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const handleRoleChange = (newRole: string) => {
    setCurrentRole(newRole);
    const roleUser = ROLE_USER_MAP[newRole] || ROLE_USER_MAP.ROLE_DISTRICT_AUTH;
    const roleDef = ROLE_DEFINITIONS[newRole] || ROLE_DEFINITIONS.ROLE_DISTRICT_AUTH;
    const updatedUser = {
      is_demo: true,
      username: roleDef.username,
      full_name: roleUser.full_name,
      role: newRole,
      role_title: roleUser.role_title,
      department: roleUser.department,
      initials: roleUser.initials,
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('ner_user', JSON.stringify(updatedUser));
  };

  const handleLoginSuccess = (user: any, navigate: (to: string) => void) => {
    const assignedRole = user?.role || 'ROLE_DISTRICT_AUTH';
    const roleUser = ROLE_USER_MAP[assignedRole] || ROLE_USER_MAP.ROLE_DISTRICT_AUTH;
    const completeUser = {
      ...user,
      full_name: user.full_name || roleUser.full_name,
      role: assignedRole,
      role_title: roleUser.role_title,
      department: user.department || roleUser.department,
      initials: roleUser.initials,
    };
    setCurrentUser(completeUser);
    localStorage.setItem('ner_user', JSON.stringify(completeUser));
    setCurrentRole(assignedRole);

    const targetRoute = ROLE_TO_PATH[assignedRole] || '/command';
    navigate(targetRoute);
  };

  const handleLogout = (navigate: (to: string) => void) => {
    const defaultRoleUser = ROLE_USER_MAP.ROLE_DISTRICT_AUTH;
    const defaultUser = {
      username: 'dist_officer',
      full_name: defaultRoleUser.full_name,
      role: 'ROLE_DISTRICT_AUTH',
      role_title: defaultRoleUser.role_title,
      department: defaultRoleUser.department,
      initials: defaultRoleUser.initials,
    };
    setCurrentUser(defaultUser);
    localStorage.removeItem('ner_user');
    setAuthToken(null);
    navigate('/');
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route 
          path="/" 
          element={<LandingRoute />} 
        />
        <Route 
          path="/login" 
          element={
            <LoginRoute 
              onLoginSuccess={handleLoginSuccess} 
            />
          } 
        />

        {/* AUTHENTICATED OPERATIONAL ROUTES */}
        <Route 
          path="/command/*" 
          element={
            <AuthenticatedRoute 
              currentUser={currentUser}
              currentRole={currentRole}
              onRoleChange={handleRoleChange}
              onLogout={handleLogout}
              isDark={isDark}
              onToggleTheme={handleToggleTheme}
            />
          } 
        />
        <Route 
          path="/map/*" 
          element={
            <AuthenticatedRoute 
              currentUser={currentUser}
              currentRole={currentRole}
              onRoleChange={handleRoleChange}
              onLogout={handleLogout}
              isDark={isDark}
              onToggleTheme={handleToggleTheme}
            />
          } 
        />
        <Route 
          path="/logistics/*" 
          element={
            <AuthenticatedRoute 
              currentUser={currentUser}
              currentRole={currentRole}
              onRoleChange={handleRoleChange}
              onLogout={handleLogout}
              isDark={isDark}
              onToggleTheme={handleToggleTheme}
            />
          } 
        />
        <Route 
          path="/replanning/*" 
          element={
            <AuthenticatedRoute 
              currentUser={currentUser}
              currentRole={currentRole}
              onRoleChange={handleRoleChange}
              onLogout={handleLogout}
              isDark={isDark}
              onToggleTheme={handleToggleTheme}
            />
          } 
        />
        <Route 
          path="/state/*" 
          element={
            <AuthenticatedRoute 
              currentUser={currentUser}
              currentRole={currentRole}
              onRoleChange={handleRoleChange}
              onLogout={handleLogout}
              isDark={isDark}
              onToggleTheme={handleToggleTheme}
            />
          } 
        />
        <Route 
          path="/field/*" 
          element={
            <AuthenticatedRoute 
              currentUser={currentUser}
              currentRole={currentRole}
              onRoleChange={handleRoleChange}
              onLogout={handleLogout}
              isDark={isDark}
              onToggleTheme={handleToggleTheme}
            />
          } 
        />
        <Route 
          path="/relocation/*" 
          element={
            <AuthenticatedRoute 
              currentUser={currentUser}
              currentRole={currentRole}
              onRoleChange={handleRoleChange}
              onLogout={handleLogout}
              isDark={isDark}
              onToggleTheme={handleToggleTheme}
            />
          } 
        />
        <Route 
          path="/transport/*" 
          element={
            <AuthenticatedRoute 
              currentUser={currentUser}
              currentRole={currentRole}
              onRoleChange={handleRoleChange}
              onLogout={handleLogout}
              isDark={isDark}
              onToggleTheme={handleToggleTheme}
            />
          } 
        />
        <Route 
          path="/response/*" 
          element={
            <AuthenticatedRoute 
              currentUser={currentUser}
              currentRole={currentRole}
              onRoleChange={handleRoleChange}
              onLogout={handleLogout}
              isDark={isDark}
              onToggleTheme={handleToggleTheme}
            />
          } 
        />
        <Route 
          path="/intelligence/*" 
          element={
            <AuthenticatedRoute 
              currentUser={currentUser}
              currentRole={currentRole}
              onRoleChange={handleRoleChange}
              onLogout={handleLogout}
              isDark={isDark}
              onToggleTheme={handleToggleTheme}
            />
          } 
        />
        <Route 
          path="/admin/*" 
          element={
            <AuthenticatedRoute 
              currentUser={currentUser}
              currentRole={currentRole}
              onRoleChange={setCurrentRole}
              onLogout={handleLogout}
              isDark={isDark}
              onToggleTheme={handleToggleTheme}
            />
          } 
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function LandingRoute() {
  const navigate = useNavigate();
  return (
    <LandingPage
      onNavigateLogin={() => navigate('/login')}
      onExplorePlatform={() => navigate('/command')}
    />
  );
}

function LoginRoute({ onLoginSuccess }: { onLoginSuccess: (user: any, navigate: (to: string) => void) => void }) {
  const navigate = useNavigate();
  return (
    <LoginPage
      onLoginSuccess={(user) => onLoginSuccess(user, navigate)}
      onNavigateHome={() => navigate('/')}
    />
  );
}

function AuthenticatedRoute({
  currentUser,
  currentRole,
  onRoleChange,
  onLogout,
  isDark,
  onToggleTheme,
}: {
  currentUser: any;
  currentRole: string;
  onRoleChange: (role: string) => void;
  onLogout: (navigate: (to: string) => void) => void;
  isDark: boolean;
  onToggleTheme: (e?: React.MouseEvent) => void;
}) {
  const navigate = useNavigate();
  return (
    <ProtectedLayout
      currentRole={currentRole}
      onRoleChange={onRoleChange}
      currentUser={currentUser}
      onLogout={() => onLogout(navigate)}
      isDark={isDark}
      onToggleTheme={onToggleTheme}
    />
  );
}

export default App;
