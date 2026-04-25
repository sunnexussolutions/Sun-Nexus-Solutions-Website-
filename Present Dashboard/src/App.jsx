import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AIChatbot from './components/AIChatbot';
import Aptitude from './pages/Aptitude';
import Projects from './pages/Projects';
import Community from './pages/Community';
import Profile from './pages/Profile';
import Learning from './pages/Learning';
import Domains from './pages/Domains';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import UnderProgress from './components/UnderProgress';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { isAuthenticated, loading, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('aptitude');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="flex flex-col items-center gap-8">
          <div style={{ width: '80px', height: '80px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, border: '3px solid rgba(99,102,241,0.15)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', inset: 0, border: '3px solid transparent', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <span style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--accent-primary)' }}>SN</span>
          </div>
          <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--text-muted)' }}>Loading...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) return <Auth />;

  const knownPages = ['dashboard', 'learning', 'domains', 'aptitude', 'council', 'projects', 'profile', 'admin'];

  return (
    <div className="min-h-screen">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} activePage={activePage} setActivePage={setActivePage} />
      <div className="flex flex-col lg-ml-280 min-h-screen">
        <Navbar toggleSidebar={toggleSidebar} setActivePage={setActivePage} />
        <main className="flex-1 flex flex-col p-6 md:p-8" style={{ marginTop: '5rem' }}>
          {activePage === 'dashboard'  && <Dashboard />}
          {activePage === 'learning'   && <Learning />}
          {activePage === 'domains'    && <Domains />}
          {activePage === 'aptitude'   && <Aptitude />}
          {activePage === 'projects'   && <Projects />}
          {activePage === 'council'    && <UnderProgress page="Council" />}
          {activePage === 'profile'    && <Profile />}
          {activePage === 'admin'      && (user?.isAdmin ? <Admin /> : <UnderProgress page="Admin" />)}
          {!knownPages.includes(activePage) && <UnderProgress page={activePage.charAt(0).toUpperCase() + activePage.slice(1)} />}
        </main>
      </div>
      <AIChatbot />
    </div>
  );
}

export default App;
