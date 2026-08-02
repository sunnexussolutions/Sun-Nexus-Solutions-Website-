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

const Navbar = ({ toggleSidebar, setActivePage, isDesktop }) => {
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
    { title: "Distributed Systems Design", category: "Project", icon: Compass },
    { title: "Algorithmic Complexity", category: "Topic", icon: Layout },
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
      // { label: "Pause Learning", desc: "Hold your course progress", icon: PauseCircle, color: "#f59e0b" },
    ]},
    // { label: "Learning Tools", items: [
    //   { label: "Streak Freeze", desc: "Save your daily momentum", icon: Snowflake, color: "#3b82f6" },
    //   { label: "Course Speed",  desc: "Global playback controls", icon: Zap,       color: "#eab308" },
    // ]},
    // { label: "Support & Help", items: [
    //   { label: "Mentor Support", desc: "Chat with expert guides",       icon: LifeBuoy,    color: "#10b981" },
    //   // { label: "Council",        desc: "Sovereign community hub",       icon: MessageSquare, color: "#06b6d4", page: "council" },
    //   { label: "Product Tour",   desc: "Explore new platform features", icon: Compass,     color: "#a855f7" },
    // ]},
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
    <nav
      style={{
        position: 'fixed',
        top: 0,
        /*
         * Navbar positioning strategy:
         * • On DESKTOP: the main workspace wrapper already has margin-left:260px,
         *   so the nav just spans the full width of that wrapper.
         *   left = 260px so it doesn’t overlap the sidebar.
         * • On MOBILE: left = 0, full width.
         */
        left: isDesktop ? '260px' : '0px',
        right: 0,
        zIndex: 30,
        height: isDesktop ? 'calc(54px + max(10px, env(safe-area-inset-top, 0px)))' : 'calc(64px + max(28px, env(safe-area-inset-top, 0px)))',
        paddingTop: isDesktop ? 'max(10px, env(safe-area-inset-top, 0px))' : 'max(28px, env(safe-area-inset-top, 0px))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 'max(1.25rem, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(1.25rem, env(safe-area-inset-right, 0px))',
        backgroundColor: navBg,
        borderBottom: 'none',
        boxShadow: 'none',
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease',
        boxSizing: 'border-box',
      }}
    >

      {/* LEFT: Hamburger (Mobile/Tablet only) + Pill search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, maxWidth: '520px' }}>
        {!isDesktop && (
          <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#94a3b8' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '10px', transition: 'background 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            <Menu size={22} />
          </button>
        )}
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
                className="nx-notif-modal"
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
        </div>        {/* Profile: purple circle avatar + Name + PLATFORM ADMIN */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button onClick={() => setActivePage('profile')}
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
          </button>

          {/* Profile Dropdown Popup (Temporarily Disabled) */}
        </div>
      </div>

      <style>{`
        @media (max-width: 639px) {
          .nx-notif-modal {
            position: fixed !important;
            top: calc(64px + max(28px, env(safe-area-inset-top, 0px))) !important;
            left: 12px !important;
            right: 12px !important;
            width: auto !important;
            max-width: 420px !important;
            margin: 0 auto !important;
            max-height: calc(75vh - env(safe-area-inset-top, 0px)) !important;
          }
        }
        @media (min-width: 640px) {
          .nx-notif-modal {
            position: absolute !important;
            top: calc(100% + 12px) !important;
            right: 0 !important;
            left: auto !important;
            width: 360px !important;
            margin: 0 !important;
            max-height: none !important;
          }
        }
        .lg-block { display: block !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </nav>
  );
};

export default Navbar;

