import React, { useState } from 'react';
import AppLayout from './app/AppLayout';
import Dashboard from './pages/Dashboard';
import Aptitude from './pages/Aptitude';
import DSA from './pages/DSA';
import Projects from './pages/Projects';
import Profile from './pages/Profile';
import Learning from './pages/Learning';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import PendingApproval from './pages/PendingApproval';
import UnderProgress from './components/UnderProgress';
import { useAuth } from './contexts/AuthContext';

const KNOWN_PAGES = [
  'dashboard', 'learning', 'domains', 'dsa',
  'dsa-overview', 'dsa-progress', 'dsa-bookmarks',
  'aptitude', 'council', 'projects', 'profile', 'admin'
];

function App() {
  const { isAuthenticated, loading, user } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');

  if (loading) return null;
  if (!isAuthenticated) return <Auth />;
  if (user?.status === 'pending') return <PendingApproval />;

  const handleNavigate = (page) => {
    setActivePage(page);
  };

  return (
    <AppLayout activePage={activePage} onNavigate={handleNavigate}>
      {activePage === 'dashboard' && <Dashboard />}
      {activePage === 'learning' && <Learning />}
      {activePage === 'domains' && (
        <UnderProgress page="Domains" onReturn={() => handleNavigate('dashboard')} />
      )}
      {(activePage === 'dsa' || activePage.startsWith('dsa-')) && (
        <DSA activePage={activePage} setActivePage={handleNavigate} />
      )}
      {activePage === 'aptitude' && <Aptitude />}
      {activePage === 'projects' && <Projects />}
      {activePage === 'council' && (
        <UnderProgress page="Council" onReturn={() => handleNavigate('dashboard')} />
      )}
      {activePage === 'profile' && <Profile />}
      {activePage === 'admin' && (
        user?.isAdmin ? <Admin /> : <UnderProgress page="Admin" onReturn={() => handleNavigate('dashboard')} />
      )}
      {!KNOWN_PAGES.includes(activePage) && (
        <UnderProgress
          page={activePage.charAt(0).toUpperCase() + activePage.slice(1)}
          onReturn={() => handleNavigate('dashboard')}
        />
      )}
    </AppLayout>
  );
}

export default App;
