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

  const navBg        = isDark ? "#0B1F33" : "#FFFFFF";
  const navBorder    = isDark ? "rgba(203, 221, 233, 0.15)" : "#CBDDE9";
  const searchBg     = isDark ? "#0E2740" : "#F3F7FB";
  const searchBorder = isSearchFocused
    ? (isDark ? "#4A90C2" : "#2872A1")
    : (isDark ? "rgba(203, 221, 233, 0.18)" : "#CBDDE9");
  const searchIcon   = isSearchFocused ? "#2872A1" : (isDark ? "#8EA6BC" : "#64748B");
  const bellColor    = isDark ? "#CBDDE9" : "#0D1B2A";
  const nameColor    = isDark ? "#F3F7FB" : "#0D1B2A";
  const roleColor    = isDark ? "#4A90C2" : "#2872A1";

  const AvatarCircle = ({ size, fontSize }) => (
    React.createElement("div", {
      style: { width: size, height: size, borderRadius: "50%", backgroundColor: "#2872A1", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize, color: "#fff", flexShrink: 0, overflow: "hidden", boxShadow: "0 2px 6px rgba(40, 114, 161, 0.25)" }
    }, user?.avatar?.length > 5
      ? React.createElement("img", { src: user.avatar, alt: "User", style: { width: "100%", height: "100%", objectFit: "cover" } })
      : (user?.name || user?.fullName || user?.firstName || user?.username || "N").charAt(0).toUpperCase()
    )
  );

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
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
        borderBottom: `1px solid ${navBorder}`,
        boxShadow: isDark ? 'none' : '0 1px 3px rgba(13, 27, 42, 0.03)',
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease',
        boxSizing: 'border-box',
        fontFamily: "'Poppins', sans-serif"
      }}
    >

      {/* LEFT: Hamburger (Mobile/Tablet only) + Pill search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, maxWidth: '520px' }}>
        {!isDesktop && (
          <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#CBDDE9' : '#0D1B2A', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', transition: 'background 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? 'rgba(203, 221, 233, 0.1)' : '#F3F7FB'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            <Menu size={22} />
          </button>
        )}
        <div className="hidden lg-block" ref={searchRef} style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: searchIcon, pointerEvents: 'none', transition: 'color 0.2s' }} />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onFocus={() => setIsSearchFocused(true)} placeholder="Search for courses, projects..."
            style={{ width: '100%', backgroundColor: searchBg, border: `1px solid ${searchBorder}`, borderRadius: '8px', padding: '9px 16px 9px 42px', fontSize: '13.5px', fontWeight: 400, color: isDark ? '#F3F7FB' : '#0D1B2A', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s, background-color 0.2s', boxShadow: isSearchFocused ? '0 0 0 3px rgba(40, 114, 161, 0.15)' : 'none', fontFamily: "'Poppins', sans-serif" }}
          />
          <AnimatePresence>
            {isSearchFocused && searchQuery && mockSearchResults.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.15 }}
                style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 100, backgroundColor: isDark ? '#0E2740' : '#FFFFFF', border: `1px solid ${navBorder}`, borderRadius: '12px', padding: '6px', boxShadow: isDark ? '0 16px 40px rgba(0,0,0,0.5)' : '0 16px 40px rgba(13, 27, 42, 0.08)', backdropFilter: 'blur(20px)' }}>
                {mockSearchResults.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(203, 221, 233, 0.08)' : '#F3F7FB'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '6px', background: isDark ? 'rgba(40, 114, 161, 0.2)' : '#F3F7FB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2872A1' }}><r.icon size={14} /></div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: isDark ? '#F3F7FB' : '#0D1B2A' }}>{r.title}</p>
                      <p style={{ fontSize: '11px', color: '#8EA6BC' }}>{r.category}</p>
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

        {/* Bell */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button onClick={() => { setIsNotifOpen(v => !v); setIsProfileOpen(false); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '6px', borderRadius: '8px', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(203, 221, 233, 0.08)' : '#F3F7FB'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}>
            <Bell size={20} strokeWidth={1.8} style={{ color: bellColor }} />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '2px', right: '2px', minWidth: '16px', height: '16px', backgroundColor: '#f97316', borderRadius: '999px', border: `2px solid ${navBg}`, fontSize: '9px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px', lineHeight: 1 }}>
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
                style={{ borderRadius: '12px', zIndex: 100, overflow: 'hidden', border: `1px solid ${navBorder}`, backgroundColor: isDark ? '#0E2740' : '#FFFFFF', backdropFilter: 'blur(20px)', boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.5)' : '0 20px 50px rgba(13, 27, 42, 0.08)' }}
              >
                <div style={{ padding: '16px 20px 12px', borderBottom: `1px solid ${navBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '15px', color: isDark ? '#F3F7FB' : '#0D1B2A' }}>Notifications</p>
                    <p style={{ fontSize: '11px', color: '#8EA6BC', marginTop: '2px' }}>{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}</p>
                  </div>
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAllRead} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 600, color: '#2872A1', background: isDark ? 'rgba(40, 114, 161, 0.2)' : '#F3F7FB', border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer' }}>
                      <CheckCheck size={13} /> Mark all read
                    </button>
                  )}
                </div>
                <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '8px' }} className="no-scrollbar">
                  {notifications.length === 0 ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <Bell size={32} style={{ color: '#8EA6BC', opacity: 0.3 }} />
                      <p style={{ fontSize: '13px', fontWeight: 500, color: '#8EA6BC' }}>No notifications yet</p>
                      <p style={{ fontSize: '11px', color: '#8EA6BC', opacity: 0.6 }}>Admin broadcasts will appear here</p>
                    </div>
                  ) : notifications.map(n => {
                    const color = notifColors[n.type] || '#2872A1';
                    const NIcon = notifIcons[n.type] || Info;
                    return (
                      <div key={n.id} onClick={() => handleMarkRead(n.id)}
                        style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', borderRadius: '8px', background: n.read ? 'transparent' : `${color}08`, border: n.read ? '1px solid transparent' : `1px solid ${color}20`, marginBottom: '4px', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(203, 221, 233, 0.06)' : '#F3F7FB'}
                        onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : `${color}08`}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color }}><NIcon size={16} /></div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                            <p style={{ fontSize: '13px', fontWeight: n.read ? 500 : 700, color: isDark ? '#F3F7FB' : '#0D1B2A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.title}</p>
                            {!n.read && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: color, flexShrink: 0 }} />}
                          </div>
                          <p style={{ fontSize: '12px', color: isDark ? '#CBDDE9' : '#64748B', marginTop: '2px', lineHeight: 1.4 }}>{n.message}</p>
                          <p style={{ fontSize: '10px', color: '#8EA6BC', marginTop: '4px', opacity: 0.7 }}>{new Date(n.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button onClick={() => setActivePage('profile')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 2px', borderRadius: '8px', transition: 'opacity 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            <AvatarCircle size={36} fontSize={14} />
            <div className="hidden lg-block" style={{ textAlign: 'left' }}>
              <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: nameColor, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                {user?.name || user?.fullName || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user?.username || 'Nexus Admin'))}
              </span>
              <span style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: roleColor, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '1px', whiteSpace: 'nowrap' }}>
                {user?.isAdmin ? 'Platform Admin' : 'Verified Member'}
              </span>
            </div>
          </button>
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

