import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Flame, Target, Zap, TrendingUp, Activity,
  ArrowUpRight, Award, Clock, Calendar, Star, BrainCircuit,
  BarChart3, MessageSquare, ChevronDown, ArrowRight, CheckCircle, ShieldAlert, Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getResults } from '../store/dataStore';
import { UserPerformanceGraph } from '../components/AnalyticsCharts';
import { prepareUserChartData, calculateUserStats } from '../utils/analytics';

const StatCard = ({ icon: Icon, label, value, color, glowColor, delay, showDivider }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{
      y: -5,
      boxShadow: `0 18px 42px ${glowColor || color}38, 0 0 28px ${glowColor || color}25`,
      borderColor: `${glowColor || color}77`
    }}
    transition={{ duration: 0.25 }}
    className="relative overflow-hidden flex items-center"
    style={{
      padding: '1.45rem 1.65rem',
      gap: '1.25rem',
      borderRadius: '20px',
      background: 'var(--card-bg, #070a14)',
      border: '1px solid var(--card-border, rgba(255, 255, 255, 0.08))',
      boxShadow: 'var(--card-shadow, 0 10px 30px rgba(0, 0, 0, 0.4))'
    }}
  >
    {/* Glowing bottom accent line matching reference image */}
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: '12%',
        right: '12%',
        height: '2px',
        background: `linear-gradient(90deg, transparent, ${glowColor || color}, transparent)`,
        boxShadow: `0 0 14px ${glowColor || color}`
      }}
    />
    <div
      className="flex items-center justify-center flex-shrink-0"
      style={{
        width: '52px',
        height: '52px',
        borderRadius: '16px',
        backgroundColor: `${color}14`,
        border: `1px solid ${color}35`,
        boxShadow: `0 0 15px ${color}15`
      }}
    >
      <Icon size={24} color={color} strokeWidth={2.2} />
    </div>
    {showDivider && (
      <div
        style={{
          width: '1px',
          height: '42px',
          background: 'rgba(255, 255, 255, 0.15)',
          margin: '0 6px'
        }}
      />
    )}
    <div className="min-w-0 flex flex-col justify-center">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted mb-1 truncate">
        {label}
      </p>
      <p className="text-2xl font-black tracking-tight leading-none" style={{ color: 'var(--text-primary)' }}>
        {value}
      </p>
    </div>
  </motion.div>
);

const clampNumber = (min, max) => `clamp(${min}px, 2vw + ${min}px, ${max}px)`;

const Dashboard = () => {
  const { user } = useAuth();
  const [results, setResults] = React.useState([]);

  // Dynamically resolve user's true first name across all profile variants
  const dynamicFirstName = useMemo(() => {
    if (!user) return 'Member';
    
    // Explicit firstName property
    const fn = user.firstName || user.first_name;
    if (fn && typeof fn === 'string' && fn.trim()) {
      return fn.trim().split(' ')[0];
    }
    
    // Combined full name property (e.g. "Bhargava Srinivas" -> "Bhargava")
    if (user.name && typeof user.name === 'string' && user.name.trim()) {
      return user.name.trim().split(' ')[0];
    }

    // Username property fallback
    if (user.username && typeof user.username === 'string' && user.username.trim()) {
      const u = user.username.trim().split('@')[0];
      return u.charAt(0).toUpperCase() + u.slice(1);
    }

    // Email property fallback
    if (user.email && typeof user.email === 'string' && user.email.trim()) {
      const e = user.email.trim().split('@')[0];
      return e.charAt(0).toUpperCase() + e.slice(1);
    }

    return 'Nexus';
  }, [user]);

  const [userStatus, setUserStatus] = React.useState(() => {
    // Read fresh status from localStorage to pick up admin changes immediately
    try {
      const s = JSON.parse(localStorage.getItem('nexus_user') || '{}');
      return s.status || user?.status || 'active';
    } catch { return user?.status || 'active'; }
  });

  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [lastSyncTime, setLastSyncTime] = React.useState(new Date());
  const [timeRange, setTimeRange] = React.useState('Week');
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = React.useState(false);
  const timeDropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(e.target)) {
        setIsTimeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const refreshData = React.useCallback(async () => {
    if (!user) return;
    const all = await getResults();
    setResults(all.filter(r => r.userId === user.id));
    setLastSyncTime(new Date());
    // Re-read fresh status on every update (e.g. admin just approved)
    try {
      const s = JSON.parse(localStorage.getItem('nexus_user') || '{}');
      if (s.status) setUserStatus(s.status);
    } catch {}
  }, [user]);

  React.useEffect(() => {
    refreshData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    window.addEventListener('nexus-data-updated', refreshData);
    return () => {
      clearInterval(timer);
      window.removeEventListener('nexus-data-updated', refreshData);
    };
  }, [refreshData]);

  const filteredResults = useMemo(() => {
    if (!results || results.length === 0) return [];
    const now = new Date();
    return results.filter(r => {
      if (!r.submitted_at) return true;
      const subDate = new Date(r.submitted_at);
      const diffDays = (now - subDate) / (1000 * 60 * 60 * 24);
      if (timeRange === 'Week') return diffDays <= 7;
      if (timeRange === 'Month') return diffDays <= 30;
      if (timeRange === 'Year') return diffDays <= 365;
      return true;
    });
  }, [results, timeRange]);

  const chartData = useMemo(() => prepareUserChartData(filteredResults), [filteredResults]);
  const stats = useMemo(() => calculateUserStats(filteredResults), [filteredResults]);

  const recentAssms = [...results]
    .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
    .slice(0, 4);

  return (
    <div
      className="flex flex-col gap-8 animate-slide-up"
      style={{
        padding: 'clamp(1.5rem, 3vw, 2.75rem) clamp(1.5rem, 4vw, 3.5rem) 4rem clamp(1.5rem, 4vw, 3.5rem)'
      }}
    >
      {/* STATUS CARDS: PENDING APPROVAL OR APPROVED WELCOME TO TEAM NEXUS */}
      {userStatus === 'pending' ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '1.25rem 1.75rem',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.14) 0%, rgba(217, 119, 6, 0.06) 100%)',
            border: '1.5px solid rgba(245, 158, 11, 0.45)',
            boxShadow: '0 8px 30px rgba(245, 158, 11, 0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldAlert size={22} color="#f59e0b" strokeWidth={2.5} />
          </div>
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 900, color: '#f59e0b', margin: 0 }}>Registration Status: Pending Approval</h4>
            <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '2px' }}>
              You are registered successfully and waiting for admin approval
            </p>
          </div>
        </motion.div>
      ) : (!user?.isAdmin) && userStatus === 'active' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '1.25rem 1.75rem',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.14) 0%, rgba(16, 185, 129, 0.06) 100%)',
            border: '1.5px solid rgba(34, 197, 94, 0.45)',
            boxShadow: '0 8px 30px rgba(34, 197, 94, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'rgba(34, 197, 94, 0.2)', border: '1px solid rgba(34, 197, 94, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CheckCircle size={22} color="#22c55e" strokeWidth={2.5} />
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#22c55e', display: 'block' }}>ACCOUNT APPROVED</span>
              <h4 style={{ fontSize: '18px', fontWeight: 900, color: '#22c55e', margin: '2px 0 0 0' }}>
                Admin approved member. Welcome to Nexus hub
              </h4>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#22c55e', fontSize: '12px', fontWeight: 800 }}>
            <Sparkles size={14} />
            <span>Official Operator Access</span>
          </div>
        </motion.div>
      )}

      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-2"
        >
          {/* Operator Status Pill Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.12) 100%)', border: '1.5px solid rgba(168, 85, 247, 0.35)', width: 'fit-content', boxShadow: '0 4px 14px rgba(168, 85, 247, 0.12)' }}>
            <Sparkles size={14} style={{ color: '#c084fc' }} />
            <span style={{ fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#c084fc' }}>
              OPERATOR DASHBOARD HUB
            </span>
          </div>

          {/* Welcome Title */}
          <h1 className="text-3xl md:text-5xl font-black tracking-tight" style={{ color: 'var(--text-primary)', margin: 0, lineHeight: 1.15 }}>
            Welcome back,{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 45%, #7b5cff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 900
              }}
            >
              {dynamicFirstName}
            </span>
            {' '}
            <motion.span
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 2.2, duration: 1.4 }}
              style={{
                display: 'inline-block',
                transformOrigin: '70% 70%',
                fontSize: '0.9em'
              }}
            >
              👋
            </motion.span>
          </h1>

          {/* Subtitle with Pulse Dot Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 10px #10b981' }} />
            <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-secondary)', margin: 0 }}>
              Here is your live performance pulse for this week.
            </p>
          </div>
        </motion.div>
        
        <div className="flex items-center gap-4 flex-wrap">
          {(() => {
            const timeStr = currentTime.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const parts = timeStr.split(' ');
            const timeDigits = parts[0] || timeStr;
            const timePeriod = (parts[1] || 'pm').toLowerCase();
            const dateFormatted = currentTime.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

            return (
              <>
                {/* SYSTEM TIME CARD (Purple Cyber Glass) */}
                <motion.div
                  whileHover={{
                    y: -5,
                    boxShadow: '0 18px 42px rgba(168, 85, 247, 0.38), 0 0 28px rgba(168, 85, 247, 0.28)',
                    borderColor: 'rgba(168, 85, 247, 0.75)'
                  }}
                  transition={{ duration: 0.25 }}
                  style={{
                    borderRadius: '24px',
                    background: 'var(--time-card-bg)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1.5px solid var(--time-card-border, rgba(168, 85, 247, 0.45))',
                    boxShadow: 'var(--time-card-shadow, 0 8px 32px rgba(168, 85, 247, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08))',
                    padding: '1.4rem 1.6rem',
                    minWidth: '240px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div 
                      style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '13px', 
                        backgroundColor: 'rgba(168, 85, 247, 0.12)', 
                        border: '1px solid rgba(168, 85, 247, 0.28)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}
                    >
                      <Clock size={19} color="#a855f7" strokeWidth={2.5} />
                    </div>
                    <span 
                      style={{ 
                        fontSize: '0.78rem', 
                        fontWeight: 800, 
                        letterSpacing: '0.14em', 
                        textTransform: 'uppercase', 
                        color: '#a855f7' 
                      }}
                    >
                      SYSTEM TIME
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span 
                      style={{ 
                        fontSize: 'clamp(1.9rem, 2.5vw, 2.4rem)', 
                        fontWeight: 800, 
                        letterSpacing: '-0.02em', 
                        lineHeight: 1, 
                        color: 'var(--text-primary)' 
                      }}
                    >
                      {timeDigits}
                    </span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#a855f7', lineHeight: 1 }}>
                      {timePeriod}
                    </span>
                  </div>

                  <div 
                    style={{ 
                      position: 'relative', 
                      width: '85%', 
                      height: '3px', 
                      borderRadius: '99px', 
                      backgroundColor: 'rgba(168, 85, 247, 0.18)', 
                      display: 'flex', 
                      alignItems: 'center' 
                    }}
                  >
                    <div style={{ width: '30%', height: '100%', borderRadius: '99px', background: 'linear-gradient(90deg, #a855f7 0%, #c084fc 100%)' }} />
                    <div style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#c084fc', boxShadow: '0 0 10px #c084fc', marginLeft: '-4px' }} />
                  </div>
                </motion.div>

                {/* DATE CARD (Cyan Cyber Glass) */}
                <motion.div
                  whileHover={{
                    y: -5,
                    boxShadow: '0 18px 42px rgba(6, 182, 212, 0.38), 0 0 28px rgba(6, 182, 212, 0.28)',
                    borderColor: 'rgba(6, 182, 212, 0.75)'
                  }}
                  transition={{ duration: 0.25 }}
                  style={{
                    borderRadius: '24px',
                    background: 'var(--date-card-bg)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1.5px solid var(--date-card-border, rgba(6, 182, 212, 0.45))',
                    boxShadow: 'var(--date-card-shadow, 0 8px 32px rgba(6, 182, 212, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08))',
                    padding: '1.4rem 1.6rem',
                    minWidth: '240px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div 
                      style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '13px', 
                        backgroundColor: 'rgba(6, 182, 212, 0.12)', 
                        border: '1px solid rgba(6, 182, 212, 0.28)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}
                    >
                      <Calendar size={19} color="#06b6d4" strokeWidth={2.5} />
                    </div>
                    <span 
                      style={{ 
                        fontSize: '0.78rem', 
                        fontWeight: 800, 
                        letterSpacing: '0.14em', 
                        textTransform: 'uppercase', 
                        color: '#06b6d4' 
                      }}
                    >
                      DATE
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <span 
                      style={{ 
                        fontSize: 'clamp(1.9rem, 2.5vw, 2.4rem)', 
                        fontWeight: 800, 
                        letterSpacing: '-0.02em', 
                        lineHeight: 1, 
                        color: 'var(--text-primary)' 
                      }}
                    >
                      {dateFormatted}
                    </span>
                  </div>

                  <div 
                    style={{ 
                      position: 'relative', 
                      width: '85%', 
                      height: '3px', 
                      borderRadius: '99px', 
                      backgroundColor: 'rgba(6, 182, 212, 0.18)', 
                      display: 'flex', 
                      alignItems: 'center' 
                    }}
                  >
                    <div style={{ width: '32%', height: '100%', borderRadius: '99px', background: 'linear-gradient(90deg, #06b6d4 0%, #22d3ee 100%)' }} />
                  </div>
                </motion.div>

                {/* STREAK CARD (Orange/Amber Cyber Glass) placed directly after DATE CARD */}
                <motion.div
                  whileHover={{
                    y: -5,
                    boxShadow: '0 18px 42px rgba(249, 115, 22, 0.38), 0 0 28px rgba(249, 115, 22, 0.28)',
                    borderColor: 'rgba(249, 115, 22, 0.75)'
                  }}
                  transition={{ duration: 0.25 }}
                  style={{
                    borderRadius: '24px',
                    background: 'var(--streak-card-bg)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1.5px solid var(--streak-card-border, rgba(249, 115, 22, 0.45))',
                    boxShadow: 'var(--streak-card-shadow, 0 8px 32px rgba(249, 115, 22, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08))',
                    padding: '1.4rem 1.6rem',
                    minWidth: '240px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div 
                      style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '13px', 
                        backgroundColor: 'rgba(249, 115, 22, 0.12)', 
                        border: '1px solid rgba(249, 115, 22, 0.28)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}
                    >
                      <Flame size={19} color="#f97316" strokeWidth={2.5} />
                    </div>
                    <span 
                      style={{ 
                        fontSize: '0.78rem', 
                        fontWeight: 800, 
                        letterSpacing: '0.14em', 
                        textTransform: 'uppercase', 
                        color: '#f97316' 
                      }}
                    >
                      STREAK
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span 
                      style={{ 
                        fontSize: 'clamp(1.9rem, 2.5vw, 2.4rem)', 
                        fontWeight: 800, 
                        letterSpacing: '-0.02em', 
                        lineHeight: 1, 
                        color: 'var(--text-primary)' 
                      }}
                    >
                      {user?.streak || 0}
                    </span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f97316', lineHeight: 1 }}>
                      {(user?.streak || 0) === 1 ? 'Week' : 'Weeks'}
                    </span>
                  </div>

                  {(() => {
                    const currentStreak = user?.streak || 0;
                    const weekCycle = (currentStreak % 4) || (currentStreak > 0 ? 4 : 0);
                    const streakProgressPct = Math.min(100, Math.max(14, Math.round((weekCycle / 4) * 100)));
                    return (
                      <div 
                        style={{ 
                          position: 'relative', 
                          width: '100%', 
                          height: '4px', 
                          borderRadius: '99px', 
                          backgroundColor: 'rgba(249, 115, 22, 0.18)', 
                          display: 'flex', 
                          alignItems: 'center' 
                        }}
                      >
                        <div style={{ width: `${streakProgressPct}%`, height: '100%', borderRadius: '99px', background: 'linear-gradient(90deg, #f97316 0%, #fb923c 100%)', transition: 'width 0.5s ease' }} />
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#fb923c', boxShadow: '0 0 10px #fb923c', marginLeft: '-5px' }} />
                      </div>
                    );
                  })()}
                </motion.div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Quick Stats Grid matching reference image */}
      <div className="flex flex-col gap-6">
        <div className="dashboard-stats-grid">
          <StatCard icon={Star} label="Total XP" value={user?.xp || 0} color="#a855f7" glowColor="#a855f7" delay={0.1} />
          <StatCard icon={TrendingUp} label="Avg Accuracy" value={`${stats.avg}%`} color="#10b981" glowColor="#10b981" delay={0.2} />
          <StatCard icon={Target} label="Assessments" value={stats.count} color="#3b82f6" glowColor="#3b82f6" delay={0.3} />
          <StatCard icon={Award} label="Best Score" value={`${stats.best}%`} color="#f97316" glowColor="#f97316" delay={0.4} />
        </div>
      </div>

      <div className="dashboard-main-grid">
        {/* Main Performance Pulse Card matching reference image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{
            y: -5,
            boxShadow: '0 24px 55px rgba(6, 182, 212, 0.35), 0 0 35px rgba(79, 70, 229, 0.25)',
            borderColor: 'rgba(6, 182, 212, 0.65)'
          }}
          transition={{ duration: 0.3 }}
          className="flex flex-col justify-between"
          style={{
            padding: 'clamp(1.75rem, 2.5vw, 2.35rem)',
            borderRadius: '24px',
            background: 'var(--card-bg, #070a14)',
            border: '1px solid var(--card-border, rgba(255, 255, 255, 0.08))',
            boxShadow: 'var(--card-shadow, 0 15px 35px rgba(0, 0, 0, 0.4))'
          }}
        >
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(168, 85, 247, 0.12)',
                    border: '1.5px solid rgba(168, 85, 247, 0.32)',
                    boxShadow: '0 0 16px rgba(168, 85, 247, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Activity size={22} color="#a855f7" strokeWidth={2.5} />
                </div>
                <div>
                  <h3
                    className="text-xl sm:text-2xl font-black tracking-tight"
                    style={{
                      margin: 0,
                      background: 'linear-gradient(135deg, var(--text-primary) 0%, #c084fc 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 2px 8px rgba(168, 85, 247, 0.2))'
                    }}
                  >
                    Performance Pulse
                  </h3>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                      color: '#a855f7',
                      display: 'block',
                      marginTop: '2px'
                    }}
                  >
                    ⚡ EFFICIENCY OVER TIME
                  </span>
                </div>
              </div>
              <div ref={timeDropdownRef} className="self-start sm:self-center" style={{ position: 'relative', display: 'inline-block' }}>
                <button
                  onClick={() => setIsTimeDropdownOpen(v => !v)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 18px',
                    borderRadius: '14px',
                    background: isTimeDropdownOpen
                      ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.22) 0%, rgba(99, 102, 241, 0.22) 100%)'
                      : 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(99, 102, 241, 0.06) 100%)',
                    border: isTimeDropdownOpen
                      ? '1.5px solid rgba(168, 85, 247, 0.65)'
                      : '1.5px solid rgba(168, 85, 247, 0.32)',
                    boxShadow: isTimeDropdownOpen
                      ? '0 6px 20px rgba(168, 85, 247, 0.25), 0 0 15px rgba(168, 85, 247, 0.15)'
                      : '0 4px 14px rgba(168, 85, 247, 0.08)',
                    color: '#a855f7',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    backdropFilter: 'blur(12px)',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <Calendar size={14} style={{ color: '#a855f7' }} />
                  <span>{timeRange}</span>
                  <ChevronDown
                    size={14}
                    style={{
                      color: '#a855f7',
                      transform: isTimeDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease'
                    }}
                  />
                </button>

                {isTimeDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 'calc(100% + 8px)',
                      zIndex: 50,
                      minWidth: '165px',
                      padding: '6px',
                      borderRadius: '18px',
                      backgroundColor: 'var(--card-bg, #0b0f19)',
                      border: '1.5px solid rgba(168, 85, 247, 0.35)',
                      boxShadow: '0 16px 45px rgba(0, 0, 0, 0.45), 0 0 20px rgba(168, 85, 247, 0.15)',
                      backdropFilter: 'blur(20px)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    {[
                      { label: 'Week', desc: 'Last 7 Days' },
                      { label: 'Month', desc: 'Last 30 Days' },
                      { label: 'Year', desc: 'Last 365 Days' },
                      { label: 'All', desc: 'All Time' }
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => {
                          setTimeRange(opt.label);
                          setIsTimeDropdownOpen(false);
                        }}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '12px',
                          border: 'none',
                          backgroundColor: timeRange === opt.label ? 'rgba(168, 85, 247, 0.18)' : 'transparent',
                          color: timeRange === opt.label ? '#a855f7' : 'var(--text-primary)',
                          fontSize: '12.5px',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        <span>{opt.label}</span>
                        <span style={{ fontSize: '10.5px', opacity: 0.65, fontWeight: 600 }}>{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <Clock size={13} className="text-muted" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                SYNC: {lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          <div className="mt-2">
            {chartData && chartData.length > 0 ? (
              <div className="overflow-hidden">
                <UserPerformanceGraph data={chartData} />
              </div>
            ) : (
              <div
                className="relative overflow-hidden flex flex-col items-center justify-center p-12 text-center"
                style={{
                  height: '280px',
                  borderRadius: '20px',
                  border: '1px dashed var(--dashed-box-border, rgba(255, 255, 255, 0.1))',
                  backgroundColor: 'var(--dashed-box-bg, rgba(255, 255, 255, 0.01))'
                }}
              >
                {/* Decorative layered cyber waves at the bottom matching reference image */}
                <div
                  className="absolute bottom-0 left-0 right-0 pointer-events-none opacity-40"
                  style={{
                    height: '110px',
                    background: 'radial-gradient(ellipse at 30% 120%, rgba(139, 92, 246, 0.35) 0%, transparent 70%), radial-gradient(ellipse at 80% 120%, rgba(59, 130, 246, 0.3) 0%, transparent 70%)'
                  }}
                />

                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      backgroundColor: 'rgba(168, 85, 247, 0.12)',
                      border: '1px solid rgba(168, 85, 247, 0.28)'
                    }}
                  >
                    <BarChart3 size={24} color="#a855f7" strokeWidth={2.2} />
                  </div>
                  <p className="text-sm font-semibold text-muted">
                    Insufficient assessment data.
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Sessions Card matching reference image */}
        <div className="flex flex-col">
          <motion.div
            whileHover={{
              y: -5,
              boxShadow: '0 24px 55px rgba(168, 85, 247, 0.35), 0 0 35px rgba(6, 182, 212, 0.25)',
              borderColor: 'rgba(168, 85, 247, 0.65)'
            }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col justify-between"
            style={{
              padding: 'clamp(1.75rem, 2.5vw, 2.35rem)',
              borderRadius: '24px',
              background: 'var(--card-bg, #070a14)',
              border: '1px solid var(--card-border, rgba(255, 255, 255, 0.08))',
              boxShadow: 'var(--card-shadow, 0 15px 35px rgba(0, 0, 0, 0.4))'
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(6, 182, 212, 0.12)',
                      border: '1.5px solid rgba(6, 182, 212, 0.32)',
                      boxShadow: '0 0 16px rgba(6, 182, 212, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Clock size={22} color="#06b6d4" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3
                      className="text-xl font-black tracking-tight"
                      style={{
                        margin: 0,
                        background: 'linear-gradient(135deg, var(--text-primary) 0%, #22d3ee 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 2px 8px rgba(6, 182, 212, 0.2))'
                      }}
                    >
                      Recent Sessions
                    </h3>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.14em',
                        color: '#06b6d4',
                        display: 'block',
                        marginTop: '2px'
                      }}
                    >
                      🌐 ACTIVITY LOG
                    </span>
                  </div>
                </div>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 18px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.08) 100%)',
                    border: '1.5px solid rgba(6, 182, 212, 0.32)',
                    boxShadow: '0 4px 14px rgba(6, 182, 212, 0.1)',
                    color: '#06b6d4',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    backdropFilter: 'blur(12px)',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(6, 182, 212, 0.22) 0%, rgba(59, 130, 246, 0.2) 100%)';
                    e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.65)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(6, 182, 212, 0.25)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.08) 100%)';
                    e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.32)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(6, 182, 212, 0.1)';
                  }}
                >
                  <span>View All</span>
                  <ArrowRight size={14} style={{ color: '#06b6d4' }} />
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center py-10">
              {recentAssms.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center gap-4">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '18px',
                      backgroundColor: 'rgba(6, 182, 212, 0.08)',
                      border: '1px solid rgba(6, 182, 212, 0.22)'
                    }}
                  >
                    <Calendar size={26} color="#06b6d4" strokeWidth={2} />
                  </div>
                  <p className="text-sm font-semibold text-muted">
                    No recent activity detected.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {recentAssms.map((res, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-subtle transition-colors group" style={{ backgroundColor: 'var(--item-row-bg, rgba(255, 255, 255, 0.02))' }}>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-bold truncate max-w-[150px]">{res.topic}</p>
                        <p className="text-[10px] font-medium text-muted uppercase tracking-widest">
                          {new Date(res.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-black ${res.percentage >= 80 ? 'text-green-500' : res.percentage >= 60 ? 'text-orange-500' : 'text-red-500'}`}>
                          {res.percentage}%
                        </span>
                        <ArrowUpRight size={14} className="text-muted group-hover:text-accent-primary transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            </motion.div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
