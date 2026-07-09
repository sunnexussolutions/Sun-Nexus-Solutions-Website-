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

  if (loading) return null;
  if (!isAuthenticated) return <Auth />;

  const knownPages = ['dashboard', 'learning', 'domains', 'aptitude', 'council', 'projects', 'profile', 'admin'];

  return (
    <div className="min-h-screen">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} activePage={activePage} setActivePage={setActivePage} />
      <div className="flex flex-col lg-ml-280 min-h-screen">
        <Navbar toggleSidebar={toggleSidebar} setActivePage={setActivePage} />
        <main className="flex-1 flex flex-col p-6 md:p-10 lg:p-12" style={{ marginTop: '5rem' }}>
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
