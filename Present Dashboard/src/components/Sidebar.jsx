import React from 'react';
import {
  LayoutGrid, GraduationCap, Layers, Folder,
  Target, Users, User, ShieldCheck, LogOut,
  Sun, Moon, X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  // { id: 'learning', label: 'My Learning', icon: GraduationCap },
  // { id: 'domains', label: 'Domains', icon: Layers },
  // { id: 'projects', label: 'Projects', icon: Folder },
  { id: 'aptitude', label: 'Aptitude', icon: Target },
  // { id: 'council', label: 'Council', icon: Users },
  { id: 'profile', label: 'Profile', icon: User },
];

const ADMIN_ITEM = { id: 'admin', label: 'Admin Panel', icon: ShieldCheck };

const Sidebar = ({ isOpen, toggleSidebar, activePage, setActivePage }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const isAdmin = user?.isAdmin;

  const allItems = isAdmin ? [...NAV_ITEMS, ADMIN_ITEM] : NAV_ITEMS;

  return (
    <aside
      className="sidebar-aside"
      style={{
        width: '260px',
        minWidth: '260px',
        maxWidth: '260px',
        height: '100vh',
        backgroundColor: isDark ? '#0d0f1a' : '#ffffff',
        borderRight: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`,
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.25rem 1rem',
        boxSizing: 'border-box',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease, border-color 0.3s ease',
        transform: isOpen
          ? 'translateX(0)'
          : typeof window !== 'undefined' && window.innerWidth >= 1024
          ? 'translateX(0)'
          : 'translateX(-100%)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflowY: 'auto', alignItems: 'stretch' }}>
        {/* Brand Logo Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', padding: '0 4px', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                minWidth: '42px',
                minHeight: '42px',
                borderRadius: '12px',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(123, 92, 255, 0.25)',
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(248, 250, 252, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxSizing: 'border-box',
                padding: '0px',
                flexShrink: 0
              }}
            >
              <img
                src="https://res.cloudinary.com/dseg9nty3/image/upload/v1784890597/7975077779d60f44fd5ccc4a43a38b32c8a7693eb2b3aeb58b2e475a8cf2279b_d1te0e.png"
                alt="Sun Nexus Logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain', maxWidth: '100%', maxHeight: '100%', transform: 'scale(2.35)' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '17px', fontWeight: 900, letterSpacing: '-0.02em', color: isDark ? '#f8fafc' : '#0f172a', lineHeight: 1.1 }}>
                Sun Nexus
              </span>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#7b5cff', letterSpacing: '0.01em', lineHeight: 1.1 }}>
                Solutions
              </span>
            </div>
          </div>

          <button
            className="lg-hidden"
            style={{ background: 'none', border: 'none', color: isDark ? '#94a3b8' : '#64748b', cursor: 'pointer', padding: '4px' }}
            onClick={toggleSidebar}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Stack */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, width: '100%', alignSelf: 'stretch', boxSizing: 'border-box' }}>
          {allItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  if (typeof window !== 'undefined' && window.innerWidth < 1024) toggleSidebar();
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
                  padding: '11px 16px',
                  minHeight: '48px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: isActive ? 700 : 500,
                  border: 'none',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  background: isActive
                    ? 'linear-gradient(135deg, #7b5cff 0%, #a78bfa 100%)'
                    : 'transparent',
                  color: isActive
                    ? '#ffffff'
                    : (isDark ? '#cbd5e1' : '#1e293b'),
                  boxShadow: isActive
                    ? '0 4px 16px rgba(123, 92, 255, 0.35)'
                    : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0, overflow: 'hidden' }}>
                  <div style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <IconComp
                      size={20}
                      style={{
                        color: isActive
                          ? '#ffffff'
                          : (isDark ? '#94a3b8' : '#475569'),
                        flexShrink: 0,
                        transition: 'color 0.2s ease',
                      }}
                    />
                  </div>
                  <span
                    className="nav-label"
                    style={{ fontSize: '14px', fontWeight: isActive ? 700 : 500, color: isActive ? '#ffffff' : (isDark ? '#f8fafc' : '#0f172a'), whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}
                  >
                    {item.label}
                  </span>
                </div>

                {item.badge && (
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      backgroundColor: '#f59e0b',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 800,
                      flexShrink: 0,
                      marginLeft: '8px'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Bottom Footer Section */}
        <div style={{ paddingTop: '1rem', borderTop: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`, display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', alignSelf: 'stretch', boxSizing: 'border-box' }}>
          {/* User Profile Badge Card */}
          <div
            onClick={() => {
              setActivePage('profile');
              if (typeof window !== 'undefined' && window.innerWidth < 1024) toggleSidebar();
            }}
            style={{
              padding: '10px 12px',
              borderRadius: '14px',
              border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`,
              backgroundColor: isDark ? '#121625' : '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#7b5cff',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(123, 92, 255, 0.3)',
                }}
              >
                {user?.firstName?.[0] || user?.username?.[0] || 'N'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', minWidth: 0, flex: 1 }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : (user?.username || 'Nexus Admin')}
                </span>
                <span style={{ fontSize: '9.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: isDark ? '#a78bfa' : '#7b5cff' }}>
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
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2',
                color: '#ef4444',
                cursor: 'pointer',
                flexShrink: 0,
                marginLeft: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              <LogOut size={16} />
            </button>
          </div>

          {/* Light / Dark Segmented Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '3px', borderRadius: '12px', border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : '#e2e8f0'}`, backgroundColor: isDark ? '#0d0f1a' : '#f8fafc', gap: '3px', width: '100%', boxSizing: 'border-box' }}>
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
                borderRadius: '9px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: !isDark ? '#ffffff' : 'transparent',
                color: !isDark ? '#7b5cff' : '#64748b',
                border: !isDark ? '1px solid #e2e8f0' : 'none',
                boxShadow: !isDark ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Sun size={14} style={{ color: !isDark ? '#7b5cff' : '#64748b' }} />
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
                borderRadius: '9px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: isDark ? '#1e293b' : 'transparent',
                color: isDark ? '#a78bfa' : '#64748b',
                border: isDark ? '1px solid #334155' : 'none',
                boxShadow: isDark ? '0 1px 4px rgba(0,0,0,0.2)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Moon size={14} style={{ color: isDark ? '#a78bfa' : '#64748b' }} />
              <span>Dark</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
