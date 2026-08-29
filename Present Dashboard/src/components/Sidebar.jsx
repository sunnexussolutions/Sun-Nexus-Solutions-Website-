import React from 'react';
import {
  LayoutGrid, Braces, Target, Users, FolderKanban,
  User, ShieldCheck, LogOut, Sun, Moon, X, ChevronDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'dsa', label: 'DSA', icon: Braces, },
  { id: 'aptitude', label: 'Aptitude', icon: Target,  },
  // { id: 'domains', label: 'Domains', icon: Users },
  { id: 'projects', label: 'Projects', icon: FolderKanban, badge: 'New' },
  { id: 'profile', label: 'Profile', icon: User, },
];

const ADMIN_ITEM = { id: 'admin', label: 'Admin Panel', icon: ShieldCheck };

const Sidebar = ({ isDesktop, mobileDrawerOpen, closeMobileDrawer, activePage, setActivePage }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const isAdmin = user?.isAdmin;

  const allItems = isAdmin ? [...NAV_ITEMS, ADMIN_ITEM] : NAV_ITEMS;

  /*
   * On desktop: sidebar is always shown, no translateX animation.
   * On mobile: sidebar slides in when mobileDrawerOpen=true, out when false.
   * Backdrop is handled in App.jsx — NOT here.
   */
  const sidebarTranslate = isDesktop
    ? 'translateX(0)'               // always visible on desktop
    : mobileDrawerOpen
      ? 'translateX(0)'             // open drawer on mobile
      : 'translateX(-100%)';        // closed drawer on mobile

  return (
    <aside
      style={{
        width: '260px',
        minWidth: '260px',
        maxWidth: '260px',
        height: '100vh',
        backgroundColor: isDark ? '#0B1F33' : '#ffffff',
        borderRight: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: isDesktop ? 'max(12px, calc(0.5rem + env(safe-area-inset-top, 0px)))' : 'max(24px, calc(1rem + env(safe-area-inset-top, 0px)))',
        paddingBottom: 'max(20px, calc(1rem + env(safe-area-inset-bottom, 0px)))',
        paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: sidebarTranslate,
        boxSizing: 'border-box',
        overflow: 'hidden',
        fontFamily: "'Poppins', sans-serif"
      }}
    >

      {/* Top Header & Navigation Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', flex: 1, minHeight: 0, boxSizing: 'border-box' }}>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                minWidth: '42px',
                minHeight: '42px',
                borderRadius: '10px',
                border: isDark ? '1px solid rgba(40, 114, 161, 0.45)' : '1px solid #CBDDE9',
                background: isDark
                  ? '#0E2740'
                  : '#ffffff',
                boxShadow: isDark ? '0 0 12px rgba(40, 114, 161, 0.25)' : '0 2px 6px rgba(13, 27, 42, 0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxSizing: 'border-box',
                padding: '4px',
                flexShrink: 0,
                transition: 'all 0.3s ease'
              }}
            >
              <img
                src="/logo_mark.png"
                alt="Sun Nexus Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '16.5px', fontWeight: 800, letterSpacing: '-0.02em', color: isDark ? '#F3F7FB' : '#0D1B2A', lineHeight: 1.1 }}>
                Sun Nexus
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: isDark ? '#4A90C2' : '#2872A1', textTransform: 'uppercase', marginTop: '2px' }}>
                Solutions
              </span>
            </div>
          </div>

          {/* Close Button — visible on mobile only (when drawer is open) */}
          {!isDesktop && (
            <button
              onClick={closeMobileDrawer}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isDark ? 'rgba(203, 221, 233, 0.1)' : '#F3F7FB',
                color: isDark ? '#CBDDE9' : '#0D1B2A',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Stack (Scrollable) */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minHeight: 0, overflowY: 'auto', width: '100%', alignSelf: 'stretch', boxSizing: 'border-box', paddingRight: '2px' }}>
          {allItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activePage === item.id || (item.subItems && item.subItems.some(sub => sub.id === activePage)) || (item.id === 'dsa' && activePage.startsWith('dsa'));
            const isDsaExpanded = activePage === 'dsa' || activePage.startsWith('dsa');

            return (
              <React.Fragment key={item.id}>
                <button
                  onClick={() => {
                    setActivePage(item.id);
                  }}
                  className={`sidebar-nav-item-row ${isActive ? 'active-item' : ''}`}
                  style={{
                    width: '100%',
                    minWidth: '100%',
                    maxWidth: '100%',
                    alignSelf: 'stretch',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '11px 14px',
                    minHeight: '46px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: isActive ? 600 : 500,
                    border: isActive
                      ? (isDark ? '1px solid rgba(74, 144, 194, 0.4)' : '1px solid #CBDDE9')
                      : '1px solid transparent',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    whiteSpace: 'nowrap',
                    background: isActive
                      ? (isDark ? 'rgba(40, 114, 161, 0.25)' : '#F3F7FB')
                      : 'transparent',
                    color: isActive
                      ? (isDark ? '#CBDDE9' : '#2872A1')
                      : (isDark ? '#8EA6BC' : '#0D1B2A'),
                    boxShadow: isActive && !isDark ? '0 1px 3px rgba(13, 27, 42, 0.04)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0, overflow: 'hidden' }}>
                    <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconComp
                        size={20}
                        strokeWidth={2}
                        style={{
                          color: isActive
                            ? (isDark ? '#4A90C2' : '#2872A1')
                            : (isDark ? '#8EA6BC' : '#0D1B2A'),
                          flexShrink: 0,
                          transition: 'color 0.2s ease',
                        }}
                      />
                    </div>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.01em' }}>
                      {item.label}
                    </span>
                  </div>

                  {item.subItems && (
                    <ChevronDown
                      size={14}
                      style={{
                        color: isActive ? (isDark ? '#CBDDE9' : '#2872A1') : (isDark ? '#8EA6BC' : '#64748B'),
                        transform: isDsaExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                      }}
                    />
                  )}

                  {item.badge && (
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        backgroundColor: isDark ? 'rgba(40, 114, 161, 0.25)' : '#FFFFFF',
                        color: isDark ? '#CBDDE9' : '#2872A1',
                        border: `1px solid ${isDark ? '#4A90C2' : '#CBDDE9'}`,
                        fontSize: '11px',
                        fontWeight: 600,
                        flexShrink: 0,
                        marginLeft: '8px',
                        letterSpacing: '0.02em',
                        lineHeight: '1.2'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>

                {item.subItems && isDsaExpanded && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '36px', marginTop: '2px', marginBottom: '4px' }}>
                    {item.subItems.map((sub) => {
                      const isSubActive = activePage === sub.id || (activePage === 'dsa' && sub.id === 'dsa-overview');
                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setActivePage(sub.id);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: isSubActive ? 600 : 400,
                            border: 'none',
                            cursor: 'pointer',
                            background: isSubActive ? (isDark ? 'rgba(40, 114, 161, 0.25)' : '#F3F7FB') : 'transparent',
                            color: isSubActive ? (isDark ? '#CBDDE9' : '#2872A1') : (isDark ? '#8EA6BC' : '#64748B'),
                            textAlign: 'left'
                          }}
                        >
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: isSubActive ? '#2872A1' : (isDark ? '#8EA6BC' : '#CBDDE9') }} />
                          <span>{sub.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Sidebar Bottom Footer Section */}
        <div style={{ paddingTop: '0.75rem', borderTop: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`, display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', alignSelf: 'stretch', boxSizing: 'border-box', flexShrink: 0, marginTop: 'auto' }}>
          {/* User Profile Badge Card */}
          <div
            onClick={() => {
              setActivePage('profile');
            }}
            style={{
              padding: '10px 12px',
              borderRadius: '10px',
              border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`,
              backgroundColor: isDark ? '#0E2740' : '#F3F7FB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(13, 27, 42, 0.04)',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: '#2872A1',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  overflow: 'hidden',
                  boxShadow: '0 2px 6px rgba(40, 114, 161, 0.25)',
                }}
              >
                {user?.avatar?.length > 5 ? (
                  <img src={user.avatar} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  (user?.name || user?.fullName || user?.firstName || user?.username || 'N').charAt(0).toUpperCase()
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', minWidth: 0, flex: 1 }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: isDark ? '#F3F7FB' : '#0D1B2A', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name || user?.fullName || (user?.firstName ? `${user.firstName} ${user.lastName || ''}` : (user?.username || 'Nexus Admin'))}
                </span>
                <span style={{ fontSize: '9.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: isDark ? '#4A90C2' : '#2872A1' }}>
                  {isAdmin ? 'PLATFORM ADMIN' : 'VERIFIED MEMBER'}
                </span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (logout) logout();
              }}
              title="Log Out"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2',
                color: '#ef4444',
                cursor: 'pointer',
                flexShrink: 0,
                marginLeft: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              <LogOut size={15} />
            </button>
          </div>

          {/* Light / Dark Segmented Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '3px', borderRadius: '8px', border: `1px solid ${isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9'}`, backgroundColor: isDark ? '#0B1F33' : '#FFFFFF', gap: '3px', width: '100%', boxSizing: 'border-box' }}>
            <button
              onClick={() => {
                if (isDark) toggleTheme();
              }}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 500,
                backgroundColor: !isDark ? '#F3F7FB' : 'transparent',
                color: !isDark ? '#2872A1' : '#8EA6BC',
                border: !isDark ? '1px solid #CBDDE9' : 'none',
                boxShadow: !isDark ? '0 1px 3px rgba(13, 27, 42, 0.04)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Sun size={14} style={{ color: !isDark ? '#2872A1' : '#8EA6BC' }} />
              <span>Light</span>
            </button>
            <button
              onClick={() => {
                if (!isDark) toggleTheme();
              }}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 500,
                backgroundColor: isDark ? '#0E2740' : 'transparent',
                color: isDark ? '#4A90C2' : '#64748B',
                border: isDark ? '1px solid rgba(203, 221, 233, 0.2)' : 'none',
                boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Moon size={14} style={{ color: isDark ? '#4A90C2' : '#64748B' }} />
              <span>Dark</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
