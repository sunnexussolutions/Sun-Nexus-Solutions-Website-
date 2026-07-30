import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Clock, LogOut, MessageCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PendingApproval = () => {
  const { user, logout, checkApprovalStatus } = useAuth();
  const [approved, setApproved] = useState(false);
  const [checking, setChecking] = useState(false);

  const check = async () => {
    setChecking(true);
    const isApproved = await checkApprovalStatus();
    if (isApproved) setApproved(true);
    setChecking(false);
  };

  // Poll every 10 seconds
  useEffect(() => {
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);

  const page = {
    minHeight: '100vh',
    width: '100%',
    background: '#f8fafc',
    backgroundImage: `
      radial-gradient(at 0% 0%, rgba(99,91,255,0.07) 0px, transparent 50%),
      radial-gradient(at 100% 100%, rgba(99,91,255,0.05) 0px, transparent 50%)
    `,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  };

  const card = {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    maxWidth: '460px',
    background: '#ffffff',
    borderRadius: '28px',
    padding: '3rem 2.5rem',
    boxShadow: '0 20px 50px rgba(99,91,255,0.08), 0 4px 16px rgba(0,0,0,0.04)',
    border: '1px solid rgba(226,232,240,0.8)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  };

  const iconWrap = (color, bg) => ({
    width: '72px', height: '72px',
    borderRadius: '50%',
    background: bg,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '1.5rem',
    boxShadow: `0 8px 24px ${color}20`,
  });

  const infoRow = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 16px',
    borderRadius: '14px',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    marginBottom: '10px',
    textAlign: 'left',
  };

  const iconCircle = (color, bg) => ({
    width: '40px', height: '40px', flexShrink: 0,
    borderRadius: '10px',
    background: bg,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: color,
  });

  return (
    <div style={page}>
      {/* Wave background */}
      <svg
        style={{ position: 'fixed', bottom: '-5%', left: 0, width: '100%', height: '35%', opacity: 0.35, pointerEvents: 'none', zIndex: 0 }}
        viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,181.3C672,181,768,203,864,213.3C960,224,1056,224,1152,208C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" fill="url(#wg)" />
        <defs>
          <linearGradient id="wg" x1="0" y1="0" x2="1440" y2="320" gradientUnits="userSpaceOnUse">
            <stop stopColor="#635bff" stopOpacity="0.1" />
            <stop offset="1" stopColor="#a78bfa" stopOpacity="0.04" />
          </linearGradient>
        </defs>
      </svg>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '460px' }}
      >
        <AnimatePresence mode="wait">
          {approved ? (
            /* ── APPROVED STATE ── */
            <motion.div
              key="approved"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div style={{ ...card, border: '1px solid #bbf7d0', boxShadow: '0 20px 50px rgba(34,197,94,0.1), 0 4px 16px rgba(0,0,0,0.04)' }}>
                <div style={iconWrap('#16a34a', '#f0fdf4')}>
                  <CheckCircle2 size={36} color="#16a34a" />
                </div>
                <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#0f172a', marginBottom: '10px', letterSpacing: '-0.03em' }}>
                  Access Granted!
                </h1>
                <p style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.6, marginBottom: '6px' }}>
                  Admin approved member.{' '}
                  <span style={{ color: '#16a34a', fontWeight: 700 }}>Welcome to Nexus Hub!</span>
                </p>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
                  Redirecting you to the dashboard...
                </p>
              </div>
            </motion.div>
          ) : (
            /* ── PENDING STATE ── */
            <motion.div key="pending">
              <div style={card}>

                {/* Icon */}
                <div style={iconWrap('#d97706', '#fffbeb')}>
                  <ShieldAlert size={36} color="#d97706" />
                </div>

                {/* Title */}
                <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                  Access Pending
                </h1>

                {/* Welcome */}
                <p style={{ fontSize: '14.5px', color: '#64748b', marginBottom: '4px' }}>
                  Welcome, <span style={{ color: '#0f172a', fontWeight: 800 }}>{user?.firstName || user?.first_name || user?.name || 'Nexus Member'}</span>!
                </p>

                {/* Pending message */}
                <p style={{ fontSize: '13.5px', fontWeight: 700, color: '#d97706', marginBottom: '1.75rem', lineHeight: 1.5 }}>
                  You are registered and waiting for Admin approval...
                </p>

                {/* Divider */}
                <div style={{ width: '100%', height: '1px', background: '#f1f5f9', marginBottom: '1.25rem' }} />

                {/* Info rows */}
                <div style={{ width: '100%', marginBottom: '1.5rem' }}>
                  <div style={infoRow}>
                    <div style={iconCircle('#635bff', '#f0eeff')}>
                      <Clock size={18} />
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Verification Status</p>
                      <p style={{ fontSize: '11px', fontWeight: 800, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '3px 0 0' }}>
                        Pending Admin Review
                      </p>
                    </div>
                  </div>

                  <div style={infoRow}>
                    <div style={iconCircle('#0284c7', '#e0f2fe')}>
                      <MessageCircle size={18} />
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Help Desk</p>
                      <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, margin: '3px 0 0' }}>
                        support@nexuscareers.com
                      </p>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div style={{ width: '100%', display: 'flex', gap: '10px' }}>
                  <button
                    onClick={check}
                    disabled={checking}
                    style={{
                      flex: 1,
                      padding: '13px',
                      borderRadius: '12px',
                      background: '#f0eeff',
                      border: '1.5px solid #c4b5fd',
                      color: '#635bff',
                      fontWeight: 700,
                      fontSize: '13.5px',
                      cursor: checking ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '7px',
                      transition: 'all 0.2s',
                      fontFamily: 'inherit',
                      opacity: checking ? 0.7 : 1,
                    }}
                    onMouseEnter={e => { if (!checking) e.currentTarget.style.background = '#e0d9ff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#f0eeff'; }}
                  >
                    <RefreshCw size={15} style={{ animation: checking ? 'spin 1s linear infinite' : 'none' }} />
                    {checking ? 'Checking...' : 'Check Status'}
                  </button>

                  <button
                    onClick={logout}
                    style={{
                      flex: 1,
                      padding: '13px',
                      borderRadius: '12px',
                      background: '#fff1f2',
                      border: '1.5px solid #fecdd3',
                      color: '#e11d48',
                      fontWeight: 700,
                      fontSize: '13.5px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '7px',
                      transition: 'all 0.2s',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#ffe4e6'; e.currentTarget.style.borderColor = '#fda4af'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff1f2'; e.currentTarget.style.borderColor = '#fecdd3'; }}
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <p style={{ marginTop: '1.75rem', textAlign: 'center', color: '#cbd5e1', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em' }}>
          Powered by Nexus Careers Security Protocol
        </p>
      </motion.div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default PendingApproval;
