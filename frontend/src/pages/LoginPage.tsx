import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, ShieldCheck, AlertCircle, MapPin, Package, Radio } from 'lucide-react';
import { disasterApi, setAuthToken } from '../services/api';

interface LoginPageProps {
  onLoginSuccess: (user: any) => void;
  onNavigateHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [demoRole, setDemoRole] = useState('dist_officer');
  const testPersonas = [
    { username: 'dist_officer', label: 'District Authority', role: 'ROLE_DISTRICT_AUTH', route: '/command', clearance: 'Level-3', state: 'Assam / Darrang' },
    { username: 'state_officer', label: 'State Authority (SDMA)', role: 'ROLE_STATE_AUTH', route: '/state', clearance: 'Level-2', state: 'Regional Apex' },
    { username: 'logistics_lead', label: 'Logistics Coordinator', role: 'ROLE_LOGISTICS_COORD', route: '/logistics', clearance: 'Level-3', state: 'Guwahati Hub' },
    { username: 'field_officer', label: 'Field Tactical Officer', role: 'ROLE_FIELD_OFFICER', route: '/field', clearance: 'Level-4', state: 'Barpeta Field' },
    { username: 'shelter_coord', label: 'Shelter & Relief Lead', role: 'ROLE_SHELTER_COORD', route: '/relocation', clearance: 'Level-3', state: 'Silchar Center' },
    { username: 'transport_op', label: 'Fleet & Air Operator', role: 'ROLE_TRANSPORT_OP', route: '/transport', clearance: 'Level-3', state: 'Tezpur Airbase' },
    { username: 'response_agency', label: 'NDRF 1st Bn Agency', role: 'ROLE_RESPONSE_AGENCY', route: '/response', clearance: 'Level-2', state: 'Patgaon Base' },
    { username: 'admin', label: 'Root Systems Admin', role: 'ROLE_SYS_ADMIN', route: '/admin', clearance: 'Level-1', state: 'Central Gateway' },
  ];


  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading) return;
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const res = await disasterApi.login(username.trim(), password);
      if (!res.data?.access_token || !res.data?.user) throw new Error('Sign-in failed. Check your officer ID and password.');
      setAuthToken(res.data.access_token);
      onLoginSuccess(res.data.user);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Unable to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openDemo = () => {
    const persona = testPersonas.find(p => p.username === demoRole)!;
    setAuthToken(null);
    onLoginSuccess({ username: persona.username, full_name: persona.label, role: persona.role, department: 'NER demonstration workspace', is_demo: true });
  };

  return (
    <div className="auth-page auth-atmospheric">
      <div className="auth-scenery" aria-hidden="true" />
      <header className="auth-header">
        <button className="auth-back" onClick={onNavigateHome}><ArrowLeft size={16} /> Back to platform</button>
        <div className="auth-brand"><ShieldCheck size={20} /><span>NER <strong>COMMAND</strong></span></div>
      </header>
      <main className="auth-layout">
        <section className="auth-intro" aria-labelledby="mission-title">
          <p className="auth-eyebrow">NORTH EASTERN REGION / OPERATIONS</p>
          <h1 id="mission-title">Decisions when<br /><span>every hour matters.</span></h1>
          <p className="auth-description">Bring incidents, supplies, and response teams into one shared workspace. Sign in to coordinate your next action.</p>
          <div className="auth-capabilities">
            <div><MapPin size={20} /><span><strong>Understand the situation</strong><small>Regional incidents and geospatial context</small></span></div>
            <div><Package size={20} /><span><strong>Move resources where they matter</strong><small>Supplies, transport, and shelter coordination</small></span></div>
            <div><Radio size={20} /><span><strong>Keep the response connected</strong><small>Planning and updates across operational roles</small></span></div>
          </div>
          <p className="auth-region">Arunachal Pradesh · Assam · Manipur · Meghalaya<br />Mizoram · Nagaland · Sikkim · Tripura</p>
        </section>
        <section className="auth-card" aria-labelledby="signin-title">
          <div className="auth-card-icon"><ShieldCheck size={24} /></div>
          <p className="auth-eyebrow">OFFICER ACCESS</p>
          <h2 id="signin-title">Welcome back</h2>
          <p className="auth-card-description">Sign in with your assigned officer credentials.</p>
          <form onSubmit={handleLogin} aria-busy={isLoading}>
            <fieldset disabled={isLoading} className="auth-fields">
              <div><label htmlFor="officer-id">Officer ID</label><input id="officer-id" name="username" autoComplete="username" autoCapitalize="none" spellCheck={false} value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter your officer ID" required aria-describedby={errorMsg ? 'auth-error' : undefined} /></div>
              <div><label htmlFor="officer-password">Password</label><div className="auth-password"><input id="officer-password" name="password" autoComplete="current-password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required aria-describedby={errorMsg ? 'auth-error' : undefined} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
              {errorMsg && <p id="auth-error" className="auth-error" role="alert"><AlertCircle size={18} /><span>{errorMsg}</span></p>}
              <button className="auth-submit" type="submit">{isLoading ? 'Signing in…' : 'Sign in to workspace'}<ArrowRight size={18} /></button>
            </fieldset>
          </form>
          <p className="auth-help">Need access? Contact your system administrator.</p>
          <details className="auth-demo"><summary>Explore a demo workspace</summary><p>Preview the interface with a sample operational role. Demo access does not verify your identity.</p><label htmlFor="demo-role">Operational role</label><select id="demo-role" value={demoRole} onChange={e => setDemoRole(e.target.value)}>{testPersonas.map(p => <option key={p.username} value={p.username}>{p.label}</option>)}</select><button type="button" className="auth-demo-button" disabled={isLoading} onClick={openDemo}>Open demo <ArrowRight size={16} /></button></details>
        </section>
      </main>
      <footer className="auth-footer"><span>NER Disaster Logistics Intelligence</span><span>Preparedness. Coordination. Response.</span></footer>
    </div>
  );
};
