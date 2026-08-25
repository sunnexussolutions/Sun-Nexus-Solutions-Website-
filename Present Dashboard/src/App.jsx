import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
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

const DESKTOP_BP = 1024;

function App() {
  const { isAuthenticated, loading, user } = useAuth();

  // Track whether we are on a desktop viewport
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= DESKTOP_BP);

  // Mobile-only: controls the slide-in drawer
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const [activePage, setActivePage] = useState('dashboard');

  // Keep isDesktop in sync with resize
  useEffect(() => {
    const onResize = () => {
      const desktop = window.innerWidth >= DESKTOP_BP;
      setIsDesktop(desktop);
      if (desktop) setMobileDrawerOpen(false); // always close drawer when going to desktop
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ESC key closes mobile drawer
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Navigate and close mobile drawer on route change
  const handleNavigate = (page) => {
    setActivePage(page);
    setMobileDrawerOpen(false);
  };

  // Hamburger toggle: on desktop it's a no-op (sidebar always visible), on mobile it opens/closes drawer
  const handleToggleSidebar = () => {
    if (!isDesktop) setMobileDrawerOpen(prev => !prev);
  };

  if (loading) return null;
  if (!isAuthenticated) return <Auth />;
  if (user?.status === 'pending') return <PendingApproval />;

  const knownPages = [
    'dashboard', 'learning', 'domains', 'dsa',
    'dsa-overview', 'dsa-progress', 'dsa-bookmarks',
    'aptitude', 'council', 'projects', 'profile', 'admin'
  ];
  const isDashboard = activePage === 'dashboard';

  return (
    /*
     * LAYOUT ARCHITECTURE
     * ─────────────────────────────────────────
     * Desktop (>=1024px):
     *   Sidebar → position:fixed, left:0, width:260px, z-index:50
     *   Main workspace → margin-left:260px (always reserved)
     *   Topbar → position:fixed, left:260px, right:0
     *   NO backdrop. NO overlay. NO blur on desktop.
     *
     * Mobile (<1024px):
     *   Sidebar → position:fixed, left:0, slides in/out via translateX
     *   Main workspace → margin-left:0 (full width)
     *   Topbar → position:fixed, left:0, right:0
     *   Backdrop shown when mobileDrawerOpen===true
     * ─────────────────────────────────────────
     */
    <div
      className="min-h-screen bg-slate-50 dark:bg-[#0d0f1a] text-slate-900 dark:text-slate-100"
      style={{ position: 'relative', overflowX: 'hidden' }}
    >
      {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
      <Sidebar
        isDesktop={isDesktop}
        mobileDrawerOpen={mobileDrawerOpen}
        closeMobileDrawer={() => setMobileDrawerOpen(false)}
        activePage={activePage}
        setActivePage={handleNavigate}
      />

      {/* ── MOBILE BACKDROP (ONLY on mobile when drawer is open) ────── */}
      {!isDesktop && mobileDrawerOpen && (
        <div
          onClick={() => setMobileDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 40,
          }}
        />
      )}

      {/* ── MAIN WORKSPACE ──────────────────────────────────────────── */}
      {/*
       * margin-left:260px on desktop so content starts AFTER the fixed sidebar.
       * margin-left:0 on mobile so content fills the full width.
       */}
      <div
        style={{
          marginLeft: isDesktop ? '260px' : '0px',
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          boxSizing: 'border-box',
        }}
      >
        {/* ── TOPBAR ────────────────────────────────────────────────── */}
        <Navbar
          toggleSidebar={handleToggleSidebar}
          setActivePage={handleNavigate}
          isDesktop={isDesktop}
        />

        {/* ── PAGE CONTENT ─────────────────────────────────────────── */}
        <main
          className={isDashboard ? '' : 'sidebar-theme-page'}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem',
            marginTop: isDesktop ? 'calc(54px + max(10px, env(safe-area-inset-top, 0px)))' : 'calc(64px + max(28px, env(safe-area-inset-top, 0px)))',
            paddingBottom: 'max(2.5rem, calc(2rem + env(safe-area-inset-bottom, 0px)))',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {activePage === 'dashboard' && <Dashboard />}
          {activePage === 'learning' && <Learning />}
          {activePage === 'domains' && <UnderProgress page="Domains" onReturn={() => handleNavigate('dashboard')} />}
          {(activePage === 'dsa' || activePage.startsWith('dsa-')) && <DSA activePage={activePage} setActivePage={handleNavigate} />}
          {activePage === 'aptitude' && <Aptitude />}
          {activePage === 'projects' && <Projects />}
          {activePage === 'council' && <UnderProgress page="Council" onReturn={() => handleNavigate('dashboard')} />}
          {activePage === 'profile' && <Profile />}
          {activePage === 'admin' && (user?.isAdmin ? <Admin /> : <UnderProgress page="Admin" onReturn={() => handleNavigate('dashboard')} />)}
          {!knownPages.includes(activePage) && (
            <UnderProgress
              page={activePage.charAt(0).toUpperCase() + activePage.slice(1)}
              onReturn={() => handleNavigate('dashboard')}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
