import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const DESKTOP_BP = 1024;

/**
 * ── AppLayout ───────────────────────────────────────────────────────
 * Handles viewport breakpoint tracking, mobile slide-in navigation drawer,
 * topbar synchronization, and page workspace margins.
 */
export default function AppLayout({
  activePage,
  onNavigate,
  children
}) {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= DESKTOP_BP : true
  );
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Sync viewport width on window resize
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= DESKTOP_BP;
      setIsDesktop(desktop);
      if (desktop) setMobileDrawerOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileDrawerOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleSidebar = () => {
    if (!isDesktop) setMobileDrawerOpen(prev => !prev);
  };

  const handleSelectPage = (page) => {
    onNavigate(page);
    setMobileDrawerOpen(false);
  };

  return (
    <div
      className="min-h-screen bg-[#F3F7FB] dark:bg-[#0B1F33] text-[#0D1B2A] dark:text-[#F3F7FB]"
      style={{ position: 'relative', overflowX: 'hidden' }}
    >
      {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
      <Sidebar
        isDesktop={isDesktop}
        mobileDrawerOpen={mobileDrawerOpen}
        closeMobileDrawer={() => setMobileDrawerOpen(false)}
        activePage={activePage}
        setActivePage={handleSelectPage}
      />

      {/* ── MOBILE BACKDROP ─────────────────────────────────────────── */}
      {!isDesktop && mobileDrawerOpen && (
        <div
          onClick={() => setMobileDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(11, 31, 51, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 40,
          }}
        />
      )}

      {/* ── MAIN WORKSPACE ──────────────────────────────────────────── */}
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
          setActivePage={handleSelectPage}
          isDesktop={isDesktop}
        />

        {/* ── PAGE CONTENT ─────────────────────────────────────────── */}
        <main
          className="sidebar-theme-page"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem',
            marginTop: isDesktop
              ? 'calc(54px + max(10px, env(safe-area-inset-top, 0px)))'
              : 'calc(64px + max(28px, env(safe-area-inset-top, 0px)))',
            paddingBottom: 'max(2.5rem, calc(2rem + env(safe-area-inset-bottom, 0px)))',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
