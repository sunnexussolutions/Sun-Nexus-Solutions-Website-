import React, { useState, useRef, useEffect } from "react";
import {
  Search, Bell, User, Menu, PauseCircle, Snowflake,
  LifeBuoy, MessageSquare, Compass, Zap, Layout, ChevronDown,
  LogOut, ZapIcon, CheckCheck, Info, AlertTriangle,
  CheckCircle, AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { getNotifications, markNotificationRead, addNotification } from "../store/dataStore";

const Navbar = ({ toggleSidebar, setActivePage }) => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);
  const isDark = theme === "dark";

  const refreshNotifs = async () => {
    if (!user?.id) return;
    try {
      const res = await getNotifications(user.id);
      setNotifications(Array.isArray(res) ? res : []);
    } catch { setNotifications([]); }
  };

  useEffect(() => { if (user?.id) refreshNotifs(); }, [user?.id]);
  useEffect(() => { if (isNotifOpen && user?.id) refreshNotifs(); }, [isNotifOpen, user?.id]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const mockSearchResults = [
    { title: "Advanced React Architecture", category: "Course", icon: Zap },
    { title: "AI Portfolio Builder", category: "Project", icon: Layout },
    { title: "Quantum Neural Sync", category: "Discussion", icon: MessageSquare },
    { title: "Bhargav S.", category: "Operator", icon: User },
  ].filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotifOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setIsSearchFocused(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMarkRead = (id) => { markNotificationRead(id); refreshNotifs(); };
  const handleMarkAllRead = () => { notifications.forEach(n => !n.read && markNotificationRead(n.id)); refreshNotifs(); };

  const notifColors = { info: "#06b6d4", success: "#22c55e", warning: "#f59e0b", alert: "#ef4444" };
  const notifIcons  = { info: Info, success: CheckCircle, warning: AlertTriangle, alert: AlertCircle };

  const profileGroups = [
    { label: "Account", items: [
      { label: "Profile",        desc: "Personal info & settings",  icon: User,        color: "#6366f1", page: "profile" },
      { label: "Pause Learning", desc: "Hold your course progress", icon: PauseCircle, color: "#f59e0b" },
    ]},
    { label: "Learning Tools", items: [
      { label: "Streak Freeze", desc: "Save your daily momentum", icon: Snowflake, color: "#3b82f6" },
      { label: "Course Speed",  desc: "Global playback controls", icon: Zap,       color: "#eab308" },
    ]},
    { label: "Support & Help", items: [
      { label: "Mentor Support", desc: "Chat with expert guides",       icon: LifeBuoy,    color: "#10b981" },
      { label: "Council",        desc: "Sovereign community hub",       icon: MessageSquare, color: "#06b6d4", page: "council" },
      { label: "Product Tour",   desc: "Explore new platform features", icon: Compass,     color: "#a855f7" },
    ]},
  ];

  const handleMenuItemClick = (item) => {
    if (item.page) { setActivePage(item.page); }
    else {
      if (item.label === "Streak Freeze") addNotification({ title: "Streak Protected", message: "Shield active. Your momentum is safe for 24h.", type: "info" });
      else if (item.label === "Pause Learning") addNotification({ title: "System Paused", message: "Your learning session has been suspended.", type: "warning" });
      else if (item.label === "Mentor Support") addNotification({ title: "Support Ticket", message: "Connecting you to a technical mentor...", type: "info" });
      else alert(item.label + " feature is being deployed to your sector.");
      refreshNotifs();
    }
    setIsProfileOpen(false);
  };

  const navBg        = isDark ? "#0d0f1a" : "#ffffff";
  const navBorder    = isDark ? "rgba(255,255,255,0.07)" : "#e2e8f0";
  const searchBg     = isDark ? "rgba(255,255,255,0.06)" : "#f8fafc";
  const searchBorder = isSearchFocused
    ? (isDark ? "rgba(123,92,255,0.6)" : "rgba(123,92,255,0.5)")
    : (isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0");
  const searchIcon   = isSearchFocused ? "#7b5cff" : (isDark ? "#64748b" : "#94a3b8");
  const bellColor    = isDark ? "#94a3b8" : "#475569";
  const nameColor    = isDark ? "#f1f5f9" : "#0f172a";
  const roleColor    = "#7b5cff";

  const AvatarCircle = ({ size, fontSize }) => (
    React.createElement("div", {
      style: { width: size, height: size, borderRadius: "50%", backgroundColor: "#7b5cff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize, color: "#fff", flexShrink: 0, overflow: "hidden" }
    }, user?.avatar?.length > 5
      ? React.createElement("img", { src: user.avatar, alt: "User", style: { width: "100%", height: "100%", objectFit: "cover" } })
      : (user?.firstName?.[0] || user?.username?.[0] || "N").toUpperCase()
    )
  );

  return (
    <nav className="nx-navbar" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40, height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.75rem', backgroundColor: navBg, borderBottom: 'none', boxShadow: 'none', transition: 'background-color 0.3s ease' }}>

      {/* LEFT: Hamburger + Pill search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, maxWidth: '520px' }}>
        <button className="lg-hidden" onClick={toggleSidebar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#94a3b8' : '#64748b', display: 'flex', padding: '4px' }}>
          <Menu size={22} />
        </button>
        <div className="hidden lg-block" ref={searchRef} style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: searchIcon, pointerEvents: 'none', transition: 'color 0.2s' }} />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onFocus={() => setIsSearchFocused(true)} placeholder="Search for courses, projects..."
            style={{ width: '100%', backgroundColor: searchBg, border: `1.5px solid ${searchBorder}`, borderRadius: '999px', padding: '9px 20px 9px 42px', fontSize: '13.5px', fontWeight: 400, color: isDark ? '#f1f5f9' : '#0f172a', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s, background-color 0.2s', boxShadow: isSearchFocused ? '0 0 0 3px rgba(123,92,255,0.12)' : 'none' }}
          />
          <AnimatePresence>
            {isSearchFocused && searchQuery && mockSearchResults.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.15 }}
                style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 100, backgroundColor: isDark ? 'rgba(13,15,26,0.98)' : '#fff', border: `1px solid ${navBorder}`, borderRadius: '16px', padding: '6px', boxShadow: isDark ? '0 16px 40px rgba(0,0,0,0.5)' : '0 16px 40px rgba(0,0,0,0.1)', backdropFilter: 'blur(20px)' }}>
                {mockSearchResults.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(123,92,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7b5cff' }}><r.icon size={14} /></div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: isDark ? '#f1f5f9' : '#0f172a' }}>{r.title}</p>
                      <p style={{ fontSize: '11px', color: '#94a3b8' }}>{r.category}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT: Bell + Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>

        {/* Bell — naked icon, no box, orange badge */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button onClick={() => { setIsNotifOpen(v => !v); setIsProfileOpen(false); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '6px', borderRadius: '8px', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}>
            <Bell size={20} strokeWidth={1.8} style={{ color: bellColor }} />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '2px', right: '2px', minWidth: '16px', height: '16px', backgroundColor: '#f97316', borderRadius: '999px', border: `2px solid ${navBg}`, fontSize: '9px', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px', lineHeight: 1 }}>
                {unreadCount > 9 ? '9+' : unreadCount}
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
                className="fixed top-[68px] right-3 left-3 sm:absolute sm:top-[calc(100%+12px)] sm:right-0 sm:left-auto sm:w-[360px]"
                style={{ borderRadius: '20px', zIndex: 100, overflow: 'hidden', border: `1px solid ${navBorder}`, backgroundColor: isDark ? 'rgba(13,15,26,0.98)' : 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)', boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.5)' : '0 20px 50px rgba(0,0,0,0.12)' }}
              >
                <div style={{ padding: '16px 20px 12px', borderBottom: `1px solid ${navBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: '15px', color: isDark ? '#f1f5f9' : '#0f172a' }}>Notifications</p>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}</p>
                  </div>
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAllRead} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 700, color: '#7b5cff', background: 'rgba(123,92,255,0.08)', border: 'none', borderRadius: '8px', padding: '5px 10px', cursor: 'pointer' }}>
                      <CheckCheck size={13} /> Mark all read
                    </button>
                  )}
                </div>
                <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '8px' }} className="no-scrollbar">
                  {notifications.length === 0 ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <Bell size={32} style={{ color: '#94a3b8', opacity: 0.3 }} />
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>No notifications yet</p>
                      <p style={{ fontSize: '11px', color: '#94a3b8', opacity: 0.6 }}>Admin broadcasts will appear here</p>
                    </div>
                  ) : notifications.map(n => {
                    const color = notifColors[n.type] || '#6366f1';
                    const NIcon = notifIcons[n.type] || Info;
                    return (
                      <div key={n.id} onClick={() => handleMarkRead(n.id)}
                        style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', borderRadius: '12px', background: n.read ? 'transparent' : `${color}08`, border: n.read ? '1px solid transparent' : `1px solid ${color}20`, marginBottom: '4px', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : `${color}08`}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color }}><NIcon size={16} /></div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                            <p style={{ fontSize: '13px', fontWeight: n.read ? 600 : 800, color: isDark ? '#f1f5f9' : '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.title}</p>
                            {!n.read && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: color, flexShrink: 0 }} />}
                          </div>
                          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px', lineHeight: 1.4 }}>{n.message}</p>
                          <p style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px', opacity: 0.6 }}>{new Date(n.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile: purple circle avatar + Name + PLATFORM ADMIN + Chevron */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button onClick={() => { setIsProfileOpen(v => !v); setIsNotifOpen(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 2px', borderRadius: '12px', transition: 'opacity 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            <AvatarCircle size={38} fontSize={15} />
            <div className="hidden lg-block" style={{ textAlign: 'left' }}>
              <span style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: nameColor, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user?.username || 'Nexus Admin')}
              </span>
              <span style={{ display: 'block', fontSize: '10px', fontWeight: 800, color: '#7b5cff', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '1px', whiteSpace: 'nowrap' }}>
                {user?.isAdmin ? 'Platform Admin' : 'Verified Member'}
              </span>
            </div>
            <ChevronDown size={15} strokeWidth={2.5} style={{ color: isDark ? '#64748b' : '#94a3b8', transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s cubic-bezier(0.16,1,0.3,1)', flexShrink: 0 }} />
          </button>
          <AnimatePresence mode="wait">
            {isProfileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.98 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                exit={{ opacity: 0, y: 10, scale: 0.98 }} 
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="fixed top-[68px] right-3 left-3 sm:absolute sm:top-[calc(100%+12px)] sm:right-0 sm:left-auto sm:w-[320px]"
                style={{ borderRadius: '24px', overflow: 'hidden', zIndex: 100, border: `1px solid ${navBorder}`, backgroundColor: isDark ? 'rgba(13,15,26,0.98)' : 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)', boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.5)' : '0 20px 50px rgba(0,0,0,0.12)' }}
              >
                {/* Header */}
                <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(123,92,255,0.08) 0%, rgba(167,139,250,0.05) 100%)', borderBottom: `1px solid ${navBorder}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ position: 'relative' }}>
                      <AvatarCircle size={52} fontSize={22} />
                      <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '14px', height: '14px', background: '#22c55e', borderRadius: '50%', border: `2px solid ${navBg}` }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 800, fontSize: '15px', color: isDark ? '#f1f5f9' : '#0f172a', lineHeight: 1.2 }}>{user?.firstName ? `${user.firstName} ${user.lastName || ''}` : (user?.username || 'Nexus Admin')}</p>
                      <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || 'member@nexus.pro'}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '6px', background: 'rgba(123,92,255,0.12)', fontSize: '10px', fontWeight: 800, color: '#7b5cff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user?.isAdmin ? 'ADMIN' : (user?.headline || 'PRO')}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', background: 'rgba(234,179,8,0.12)', color: '#eab308' }}>
                          <ZapIcon size={10} fill="currentColor" /><span style={{ fontSize: '10px', fontWeight: 800 }}>128 XP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Level Progress</span>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#7b5cff' }}>128 / 200 XP</span>
                    </div>
                    <div style={{ height: '5px', borderRadius: '999px', background: 'rgba(123,92,255,0.12)', overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: '64%' }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }} style={{ height: '100%', borderRadius: '999px', background: 'linear-gradient(135deg, #7b5cff 0%, #a78bfa 100%)' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                      <span style={{ fontSize: '9px', color: '#94a3b8', opacity: 0.6 }}>🔥 12 day streak</span>
                      <span style={{ fontSize: '9px', color: '#94a3b8', opacity: 0.6 }}>72 XP to next level</span>
                    </div>
                  </div>
                </div>
                {/* Menu */}
                <div style={{ padding: '8px', maxHeight: '320px', overflowY: 'auto' }} className="no-scrollbar">
                  {profileGroups.map((group, gIdx) => (
                    <div key={gIdx} style={{ marginBottom: '4px' }}>
                      <div style={{ padding: '8px 12px 4px' }}><span style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#94a3b8', opacity: 0.5 }}>{group.label}</span></div>
                      {group.items.map((item, iIdx) => (
                        <button key={iIdx} onClick={() => handleMenuItemClick(item)}
                          style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '9px 12px', borderRadius: '12px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: `${item.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, flexShrink: 0 }}><item.icon size={17} /></div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', lineHeight: 1.2 }}>{item.label}</p>
                            <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
                {/* Logout */}
                <div style={{ padding: '16px', borderTop: `1px solid ${navBorder}`, background: 'rgba(123,92,255,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <motion.button whileHover={{ scale: 1.08, rotate: 5 }} whileTap={{ scale: 0.92 }} onClick={logout}
                    style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #7b5cff 0%, #a78bfa 100%)', borderRadius: '50%', border: 'none', boxShadow: '0 8px 24px rgba(123,92,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <LogOut size={22} color="white" strokeWidth={2.5} />
                  </motion.button>
                  <p style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Logout</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .nx-navbar { left: 260px !important; width: calc(100% - 260px) !important; }
          .lg-block { display: block !important; }
          .hidden { display: none; }
          .lg-hidden { display: none !important; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </nav>
  );
};

export default Navbar;

