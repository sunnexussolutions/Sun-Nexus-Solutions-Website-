import React from 'react';
import {
  BrainCircuit, Users, UserCircle, X, ChevronRight, LogOut,
  ShieldCheck, LifeBuoy, LayoutDashboard, BookOpen, Layers,
  FolderGit2, Code2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { id: 'dashboard',  label: 'Dashboard',           icon: LayoutDashboard },
  { id: 'learning',   label: 'My Learning',          icon: BookOpen },
  { id: 'domains',    label: 'Domains',              icon: Layers },
  { id: 'projects',   label: 'Projects',             icon: FolderGit2 },
  { id: 'coding',     label: 'Challenges',           icon: Code2 },
  { id: 'aptitude',   label: 'Aptitude',             icon: BrainCircuit },
  { id: 'council',    label: 'Council',              icon: Users },
  { id: 'profile',    label: 'Profile',              icon: UserCircle },
];

const adminItem = { id: 'admin', label: 'Admin Panel', icon: ShieldCheck };

const Sidebar = ({ isOpen, toggleSidebar, activePage, setActivePage }) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.isAdmin;

  const allItems = isAdmin ? [...navItems, adminItem] : navItems;

  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 lg-hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 40 }}
          onClick={toggleSidebar}
        />
      )}

      <aside
        className="fixed top-0 left-0 h-full w-280"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-subtle)',
          zIndex: 50,
          transition: 'transform var(--transition-base)',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center"
                style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}
              >
                <img 
                  src="https://res.cloudinary.com/dseg9nty3/image/upload/v1772331731/file_0000000032f07208a59ae376aacc1d36_fra0s4.png" 
                  alt="Sun Nexus Logo" 
                  className="w-full h-full object-contain"
                  style={{ filter: 'drop-shadow(0 0 8px var(--accent-primary))' }}
                />
              </div>
              <span className="text-xl font-bold" style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Sun Nexus
              </span>
            </div>
            <button className="lg-hidden" style={{ color: 'var(--text-secondary)' }} onClick={toggleSidebar}>
              <X size={24} />
            </button>
          </div>

          <div style={{ padding: '0 1.5rem 0.5rem' }}>
            <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', width: '100%' }} />
          </div>

          {/* Nav */}
          <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5" style={{ overflowY: 'auto' }}>
            {allItems.map((item) => {
              const isActive = activePage === item.id;
              const isAdminBtn = item.id === 'admin';
              return (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setActivePage(item.id); if (window.innerWidth < 1024) toggleSidebar(); }}
                  className={`sidebar-btn ${isActive ? 'active' : ''}`}
                  style={isAdminBtn && !isActive ? { borderTop: '1px solid var(--border-subtle)', marginTop: '8px', paddingTop: '16px', color: '#f59e0b' } : {}}
                >
                  <div className="flex items-center gap-4">
                    <div className="icon-bg" style={isAdminBtn && !isActive ? { color: '#f59e0b' } : {}}>
                      <item.icon size={18} />
                    </div>
                    <span className="text-sm font-semibold">{item.label}</span>
                    {isAdminBtn && !isActive && (
                      <span style={{ fontSize: '9px', fontWeight: 800, background: 'rgba(245,158,11,0.15)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Admin
                      </span>
                    )}
                  </div>
                  {isActive
                    ? <motion.div layoutId="activeIndicator" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}><ChevronRight size={16} style={{ opacity: 0.7 }} /></motion.div>
                    : <ChevronRight size={16} className="chevron" style={{ opacity: 0, transition: 'var(--transition-fast)' }} />
                  }
                </motion.button>
              );
            })}
          </nav>

          {/* User & Session Control */}
          <div className="p-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center gap-2">
              {/* Identity Badge */}
              <button 
                onClick={() => { setActivePage('profile'); if (window.innerWidth < 1024) toggleSidebar(); }}
                className="flex flex-1 items-center gap-3 p-2 rounded-xl transition-all hover:bg-white/5 group border border-transparent hover:border-white/10"
                style={{ backgroundColor: 'var(--bg-tertiary)', minWidth: 0 }}
              >
                <div className="relative flex-shrink-0">
                  <div className="flex items-center justify-center font-bold shadow-md transition-transform group-hover:scale-105" style={{ width: '36px', height: '36px', borderRadius: '10px', background: isAdmin ? 'linear-gradient(135deg,#f59e0b,#ef4444)' : 'var(--accent-gradient)', color: 'white', fontSize: '14px' }}>
                    {user?.avatar || (user?.name?.[0] || 'U')}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[var(--bg-tertiary)]" />
                </div>
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="text-[13px] font-bold truncate w-full text-left" style={{ color: 'var(--text-primary)' }}>{user?.name || 'Bhargav'}</span>
                  <span style={{ fontSize: '8px', color: isAdmin ? '#f59e0b' : 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user?.level || 'Pro Operator'}</span>
                </div>
              </button>

              {/* Nexus Pro Logout Action */}
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={logout}
                className="flex-shrink-0 flex items-center justify-center"
                style={{ 
                  width: '38px', height: '38px',
                  background: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
                  borderRadius: '12px',
                  border: '2px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 4px 12px rgba(58, 123, 213, 0.3)',
                  position: 'relative',
                  cursor: 'pointer'
                }}
                title="Logout"
              >
                <div style={{ position: 'absolute', top: '4px', left: '6px', width: '3px', height: '3px', background: 'rgba(255,255,255,0.4)', borderRadius: '50%' }} />
                <LogOut size={16} color="white" strokeWidth={3} />
              </motion.button>
            </div>
          </div>
        </div>
      </aside>

      <style>{`
        @media (min-width: 1024px) { aside { transform: translateX(0) !important; } }
        .sidebar-btn:hover .chevron { opacity: 0.5 !important; transform: translateX(2px); }
      `}</style>
    </>
  );
};

export default Sidebar;
