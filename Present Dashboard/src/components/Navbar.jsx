import React, { useState, useRef, useEffect } from 'react';
import {
  Search, Bell, User, Menu, Moon, Sun, PauseCircle, Snowflake,
  LifeBuoy, MessageSquare, Compass, Zap, Layout, ChevronDown,
  LogOut, ShieldCheck, ZapIcon, CheckCheck, Info, AlertTriangle,
  CheckCircle, AlertCircle, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { getNotifications, markNotificationRead, addNotification } from '../store/dataStore';

const Navbar = ({ toggleSidebar, setActivePage }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  const refreshNotifs = () => setNotifications(getNotifications());

  useEffect(() => { refreshNotifs(); }, []);
  useEffect(() => { if (isNotifOpen) refreshNotifs(); }, [isNotifOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const mockSearchResults = [
    { title: 'Advanced React Architecture', category: 'Course', icon: Zap },
    { title: 'AI Portfolio Builder', category: 'Project', icon: Layout },
    { title: 'Quantum Neural Sync', category: 'Discussion', icon: MessageSquare },
    { title: 'Bhargav S.', category: 'Operator', icon: User },
  ].filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotifOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setIsSearchFocused(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkRead = (id) => { markNotificationRead(id); refreshNotifs(); };
  const handleMarkAllRead = () => { notifications.forEach(n => !n.read && markNotificationRead(n.id)); refreshNotifs(); };

  const notifColors = { info: '#06b6d4', success: '#22c55e', warning: '#f59e0b', alert: '#ef4444' };
  const notifIcons = { info: Info, success: CheckCircle, warning: AlertTriangle, alert: AlertCircle };

  const profileGroups = [
    {
      label: 'Account',
      items: [
        { label: 'Profile', desc: 'Personal info & settings', icon: User, color: '#6366f1', page: 'profile' },
        { label: 'Pause Learning', desc: 'Hold your course progress', icon: PauseCircle, color: '#f59e0b' },
      ]
    },
    {
      label: 'Learning Tools',
      items: [
        { label: 'Streak Freeze', desc: 'Save your daily momentum', icon: Snowflake, color: '#3b82f6' },
        { label: 'Course Speed', desc: 'Global playback controls', icon: Zap, color: '#eab308' },
      ]
    },
    {
      label: 'Support & Help',
      items: [
        { label: 'Mentor Support', desc: 'Chat with expert guides', icon: LifeBuoy, color: '#10b981' },
        { label: 'Council', desc: 'Sovereign community hub', icon: MessageSquare, color: '#06b6d4', page: 'council' },
        { label: 'Product Tour', desc: 'Explore new platform features', icon: Compass, color: '#a855f7' },
      ]
    }
  ];

  const handleMenuItemClick = (item) => {
    if (item.page) {
      setActivePage(item.page);
    } else {
      // Mock some secondary functionality with notifications
      if (item.label === 'Streak Freeze') {
        addNotification({ title: 'Streak Protected', message: 'Shield active. Your momentum is safe for 24h.', type: 'info' });
      } else if (item.label === 'Pause Learning') {
        addNotification({ title: 'System Paused', message: 'Your learning session has been suspended.', type: 'warning' });
      } else if (item.label === 'Mentor Support') {
        addNotification({ title: 'Support Ticket', message: 'Connecting you to a technical mentor...', type: 'info' });
      } else {
        alert(`${item.label} feature is being deployed to your sector.`);
      }
      refreshNotifs();
    }
    setIsProfileOpen(false);
  };

  return (
    <nav className="fixed top-0 right-0 nx-glass z-30 px-4 md:px-6 flex items-center justify-between h-20" style={{ left: '0', transition: 'var(--transition-base)' }}>
      {/* Search */}
      <div className="flex items-center gap-4 flex-1" style={{ maxWidth: '600px' }}>
        <button className="lg-hidden" style={{ color: 'var(--text-secondary)' }} onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="relative w-full lg-block hidden" ref={searchRef}>
          <Search className="absolute" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)', color: isSearchFocused ? 'var(--accent-primary)' : 'var(--text-muted)', transition: 'color 0.3s' }} size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search for courses, projects..."
            className="w-full"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              border: isSearchFocused ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              padding: '0.65rem 1rem 0.65rem 3rem',
              fontSize: '0.875rem',
              outline: 'none',
              color: 'var(--text-primary)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: isSearchFocused ? '0 0 20px rgba(99, 102, 241, 0.1)' : 'none'
            }}
          />
        </div>
        
        {/* Mobile Centered Toggle (Hidden on Medium/Large) */}
        <div className="flex md-hidden items-center justify-center flex-1">
          <button
            onClick={toggleTheme}
            className="group relative flex items-center p-1"
            style={{
              width: '60px',
              height: '30px',
              borderRadius: '999px',
              backgroundColor: theme === 'dark' ? '#050a18' : '#cbd5e1',
              border: '2px solid white',
              boxShadow: theme === 'dark' ? '0 0 15px rgba(0, 242, 254, 0.5)' : '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            <motion.div
              animate={{ x: theme === 'dark' ? 0 : 28 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="flex items-center justify-center shadow-lg"
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: theme === 'dark' ? '#00f2fe' : '#f59e0b',
              }}
            >
              {theme === 'dark' ? (
                <Moon size={12} fill="#f59e0b" stroke="none" />
              ) : (
                <Sun size={12} fill="white" stroke="none" />
              )}
            </motion.div>
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-6">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="hidden md-flex group relative items-center p-1"
            style={{
              width: '60px',
              height: '30px',
              borderRadius: '999px',
              backgroundColor: theme === 'dark' ? '#050a18' : '#cbd5e1',
              border: '2px solid white',
              boxShadow: theme === 'dark' ? '0 0 15px rgba(0, 242, 254, 0.5)' : '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            <motion.div
              animate={{ x: theme === 'dark' ? 0 : 28 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="flex items-center justify-center shadow-lg"
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: theme === 'dark' ? '#00f2fe' : '#f59e0b',
              }}
            >
              {theme === 'dark' ? (
                <Moon size={12} fill="#f59e0b" stroke="none" />
              ) : (
                <Sun size={12} fill="white" stroke="none" />
              )}
            </motion.div>
          </button>

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setIsNotifOpen(v => !v); setIsProfileOpen(false); }}
              className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:bg-black/5 dark:hover:bg-white/5 text-secondary group"
            >
              <Bell size={20} className="group-hover:rotate-12 transition-transform" />
              {unreadCount > 0 && (
                <span className="absolute flex items-center justify-center" style={{ top: '6px', right: '6px', minWidth: '16px', height: '16px', backgroundColor: '#ef4444', borderRadius: '999px', border: '2px solid var(--bg-primary)', fontSize: '9px', fontWeight: 900, color: 'white', padding: '0 3px' }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                  <span className="absolute inset-0 animate-ping bg-red-500 rounded-full opacity-60"></span>
                </span>
              )}
            </button>

            <AnimatePresence>
              {isNotifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.97 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                   className="absolute right-0 top-full mt-4 z-50 overflow-hidden notification-portal"
                   style={{
                     width: window.innerWidth < 768 ? '92vw' : '420px',
                     borderRadius: '1.5rem',
                     border: '1px solid var(--border-strong)',
                     backgroundColor: theme === 'light' ? 'rgba(255,255,255,0.97)' : 'rgba(15,15,20,0.97)',
                     backdropFilter: 'blur(20px)',
                     boxShadow: theme === 'light' ? '0 20px 50px rgba(0,0,0,0.12)' : '0 20px 50px rgba(0,0,0,0.5)'
                   }}
                >
                  {/* Header */}
                  <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-primary)' }}>Notifications</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 700, color: 'var(--accent-primary)', background: 'rgba(99,102,241,0.08)', border: 'none', borderRadius: '8px', padding: '5px 10px', cursor: 'pointer' }}>
                        <CheckCheck size={13} /> Mark all read
                      </button>
                    )}
                  </div>

                  {/* List */}
                  <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '8px' }} className="no-scrollbar">
                    {notifications.length === 0 ? (
                      <div style={{ padding: '40px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <Bell size={32} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
                        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>No notifications yet</p>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', opacity: 0.6 }}>Admin broadcasts will appear here</p>
                      </div>
                    ) : notifications.map(n => {
                      const color = notifColors[n.type] || '#6366f1';
                      const NIcon = notifIcons[n.type] || Info;
                      return (
                        <div
                          key={n.id}
                          onClick={() => handleMarkRead(n.id)}
                          style={{
                            display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', borderRadius: '12px',
                            background: n.read ? 'transparent' : `${color}08`,
                            border: n.read ? '1px solid transparent' : `1px solid ${color}20`,
                            marginBottom: '4px', cursor: 'pointer', transition: 'all 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                          onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : `${color}08`}
                        >
                          <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color }}>
                            <NIcon size={16} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                              <p style={{ fontSize: '13px', fontWeight: n.read ? 600 : 800, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.title}</p>
                              {!n.read && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: color, flexShrink: 0 }} />}
                            </div>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.4 }}>{n.message}</p>
                            <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', opacity: 0.6 }}>{new Date(n.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div style={{ height: '2rem', width: '1px', backgroundColor: 'var(--border-subtle)' }} />

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => { setIsProfileOpen(v => !v); setIsNotifOpen(false); }}
            className={`flex items-center gap-3 p-1.5 pr-4 rounded-2xl transition-all ${isProfileOpen ? 'bg-black/5 dark:bg-white/5' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
          >
            <div className="flex flex-col items-end hidden lg-block">
              <span className="text-sm font-bold leading-tight">{user?.name || 'Bhargav'}</span>
              <div className="flex items-center gap-1">
                <ShieldCheck size={10} className="text-accent-primary" />
                <span className="uppercase font-bold" style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>{user?.level || 'Pro Member'}</span>
              </div>
            </div>
            <div className="relative">
              <div className="flex items-center justify-center font-bold text-white shadow-lg overflow-hidden"
                style={{ width: '40px', height: '40px', borderRadius: '14px', background: 'var(--accent-gradient)' }}>
                {user?.avatar || <User size={20} />}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)', transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }} />
          </button>

          <AnimatePresence mode="wait">
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute right-0 top-full mt-4 w-80 rounded-3xl overflow-hidden z-50"
                style={{
                  border: '1px solid var(--border-strong)',
                  backgroundColor: theme === 'light' ? 'rgba(255,255,255,0.97)' : 'rgba(15,15,20,0.97)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: theme === 'light' ? '0 20px 50px rgba(0,0,0,0.12)' : '0 20px 50px rgba(0,0,0,0.5)'
                }}
              >
                {/* User Header */}
                <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(168,85,247,0.06) 100%)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ width: '52px', height: '52px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-gradient)', color: 'white', fontWeight: 900, fontSize: '22px', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }}>
                        {user?.avatar || (user?.name?.[0] || 'B')}
                      </div>
                      <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '14px', height: '14px', background: '#22c55e', borderRadius: '50%', border: '2px solid var(--bg-primary)' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.2 }}>{user?.name || 'Bhargav'}</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || 'bhargav@nexus.pro'}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '6px', background: 'rgba(99,102,241,0.12)', fontSize: '10px', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {user?.level || 'Expert'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', background: 'rgba(234,179,8,0.12)', color: '#eab308' }}>
                          <ZapIcon size={10} fill="currentColor" />
                          <span style={{ fontSize: '10px', fontWeight: 800 }}>128 XP</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* XP Progress Bar */}
                  <div style={{ marginTop: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Level Progress</span>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--accent-primary)' }}>128 / 200 XP</span>
                    </div>
                    <div style={{ height: '5px', borderRadius: '999px', background: 'rgba(99,102,241,0.12)', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '64%' }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                        style={{ height: '100%', borderRadius: '999px', background: 'var(--accent-gradient)' }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                      <span style={{ fontSize: '9px', color: 'var(--text-muted)', opacity: 0.6 }}>🔥 12 day streak</span>
                      <span style={{ fontSize: '9px', color: 'var(--text-muted)', opacity: 0.6 }}>72 XP to next level</span>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div style={{ padding: '8px', maxHeight: '320px', overflowY: 'auto' }} className="no-scrollbar">
                  {profileGroups.map((group, gIdx) => (
                    <div key={gIdx} style={{ marginBottom: '4px' }}>
                      <div style={{ padding: '8px 12px 4px' }}>
                        <span style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', opacity: 0.5 }}>{group.label}</span>
                      </div>
                      {group.items.map((item, iIdx) => (
                        <button
                          key={iIdx}
                          onClick={() => handleMenuItemClick(item)}
                          className="flex items-center gap-3 w-full text-left relative"
                          style={{ padding: '9px 12px', borderRadius: '12px', border: 'none', background: 'transparent', cursor: 'pointer', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = theme === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: `${item.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, flexShrink: 0, transition: 'transform 0.2s' }}>
                            <item.icon size={17} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>{item.label}</p>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Footer Actions */}
                <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)', background: 'rgba(99, 102, 241, 0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={logout}
                      style={{ 
                        width: '56px', height: '56px',
                        background: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
                        borderRadius: '50%',
                        border: '3px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 8px 24px rgba(58, 123, 213, 0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative', cursor: 'pointer'
                      }}
                    >
                      <div style={{ position: 'absolute', top: '6px', left: '10px', width: '5px', height: '5px', background: 'rgba(255,255,255,0.4)', borderRadius: '50%' }} />
                      <LogOut size={24} color="white" strokeWidth={3} />
                    </motion.button>
                    <p style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Logout</p>
                  </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) { nav { left: var(--sidebar-width) !important; } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </nav>
  );
};

export default Navbar;
