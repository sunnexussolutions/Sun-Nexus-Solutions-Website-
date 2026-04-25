import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Calendar, ArrowRight, BrainCircuit, Zap, Users, ShieldCheck, Orbit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const FEATURES = [
  { icon: BrainCircuit, label: 'Aptitude Hub',    desc: 'Advanced Cognitive Assessments', color: '#6366f1' },
  { icon: Zap,          label: 'Mastery Tracks',  desc: 'Curated Learning Architecture',  color: '#06b6d4' },
  { icon: Users,        label: 'Elite Network',   desc: 'Collaborative Community Hub',    color: '#f59e0b' },
  { icon: ShieldCheck,  label: 'Admin Command',   desc: 'Strategic Platform Control',      color: '#22c55e' },
];

const brandingStyles = {
  logo: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    background: 'var(--accent-gradient)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 40px rgba(99,102,241,0.4)',
    color: 'white',
    fontSize: '22px',
    fontWeight: 900
  },
  title: {
    fontSize: '1.6rem',
    fontWeight: 900,
    letterSpacing: '0.1em',
    color: '#fff',
    textTransform: 'uppercase'
  }
};

const glassCard = {
  background: 'rgba(15, 15, 20, 0.7)',
  backdropFilter: 'blur(30px)',
  border: '1px solid var(--border-strong)',
  borderRadius: '2rem',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  padding: '2.5rem'
};

const inputStyle = (err) => ({
  width: '100%',
  background: 'rgba(255,255,255,0.03)',
  border: `1px solid ${err ? '#ef4444' : 'var(--border-subtle)'}`,
  borderRadius: '14px',
  padding: '14px 14px 14px 44px',
  color: '#fff',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  boxSizing: 'border-box',
});

export default function Auth() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, register, loading } = useAuth();
  
  // Forms
  const [lUser, setLUser] = useState('');
  const [lPass, setLPass] = useState('');

  const [signupData, setSignupData] = useState({
    first: '', last: '', dob: '', user: '', email: '', pass: '', conf: ''
  });

  useEffect(() => {
    // Ensuring scroll is enabled for all devices
    document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!lUser || !lPass) return setError('Mandatory credentials missing.');
    const res = login(lUser.trim(), lPass);
    if (!res.success) setError(res.error);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const d = signupData;
    if (!d.first || !d.last || !d.dob || !d.user || !d.email || !d.pass) 
      return setError('Strategy requires all parameters.');
    if (d.pass !== d.conf) return setError('Security handshake failed: Passwords mismatch.');
    
    const res = register({ 
      firstName: d.first, lastName: d.last, dob: d.dob, 
      username: d.user, email: d.email, password: d.pass 
    });
    if (res.success) {
      if (res.pending) {
        setSuccess('Strategy Initiated. Account created successfully and awaiting administrator approval.');
        setSignupData({ first: '', last: '', dob: '', user: '', email: '', pass: '', conf: '' });
      }
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="auth-viewport">
      
      {/* Cinematic Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <div className="auth-bg-static" style={{ 
          position: 'fixed', inset: 0, 
          backgroundImage: 'url(/src/assets/auth-bg.png)', 
          backgroundSize: 'cover', backgroundPosition: 'center', 
          opacity: 0.4, filter: 'grayscale(0.5)' 
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, #050507 80%)' }} />
        
        {/* Animated Mesh Blobs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(99,102,241,0.15)', filter: 'blur(100px)', top: '-10%', left: '-5%' }} 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, 50, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(6,182,212,0.12)', filter: 'blur(100px)', bottom: '-10%', right: '-5%' }} 
        />
      </div>

      {/* Main Content Split */}
      <div className="auth-container">
        
        {/* LEFT: Branding & Vision */}
        <div className="auth-branding-panel" style={{ flex: 1.2, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '5vw' }}>
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '5rem' }}
          >
            <img 
              src="https://res.cloudinary.com/dseg9nty3/image/upload/v1772331731/file_0000000032f07208a59ae376aacc1d36_fra0s4" 
              alt="Sun Nexus Logo"
              style={{ 
                width: '64px', height: '64px', 
                objectFit: 'contain', 
                filter: 'drop-shadow(0 0 15px rgba(99,102,241,0.5))' 
              }} 
            />
            <h1 style={brandingStyles.title}>Sun Nexus Solutions</h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.04em', marginBottom: '2rem' }}>
              Think.<br />
              <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Innovate.</span><br />
              Master.
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '32rem', lineHeight: 1.6, marginBottom: '4rem' }}>
              The definitive ecosystem for future-ready engineers. Elevate your cognitive potential with the Sun Nexus flagship platform.
            </p>
          </motion.div>

          <div className="auth-features-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: '35rem' }}>
            {FEATURES.map((f, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '1.5rem', backdropFilter: 'blur(10px)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ padding: '8px', borderRadius: '10px', background: `${f.color}15`, color: f.color }}>
                    <f.icon size={18} />
                  </div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800 }}>{f.label}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>

        {/* RIGHT: High-End Auth Portal */}
        <div className="auth-portal-panel" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{ width: '100%', maxWidth: '480px' }}
          >
            <div style={glassCard}>
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '6px', marginBottom: '2.5rem' }}>
                {['login', 'signup'].map(m => (
                  <button key={m} onClick={() => { setMode(m); setError(''); }}
                    style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 800, transition: 'all 0.3s', 
                      background: mode === m ? 'var(--accent-gradient)' : 'transparent',
                      color: mode === m ? '#fff' : 'rgba(255,255,255,0.4)',
                      boxShadow: mode === m ? '0 10px 20px rgba(99,102,241,0.2)' : 'none'
                    }}
                  >
                    {m === 'login' ? 'Login' : 'Sign Up'}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={mode} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  {mode === 'login' ? (
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>Executive Portal</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Authorize your session to continue.</p>
                      </div>

                      <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)' }} />
                        <input value={lUser} onChange={e => setLUser(e.target.value)} placeholder="Username" style={inputStyle(error && !lUser)} />
                      </div>

                      <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)' }} />
                        <input type="password" value={lPass} onChange={e => setLPass(e.target.value)} placeholder="Password" style={inputStyle(error && !lPass)} />
                      </div>

                      {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 700, padding: '12px', background: 'rgba(239,68,68,0.1)', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}
                      {success && <div style={{ color: '#22c55e', fontSize: '0.85rem', fontWeight: 700, padding: '12px', background: 'rgba(34,197,94,0.1)', borderRadius: '12px', border: '1px solid rgba(34,197,94,0.2)' }}>{success}</div>}

                      <button type="submit" disabled={loading} style={{ 
                        width: '100%', padding: '16px', borderRadius: '16px', border: 'none', background: 'var(--accent-gradient)', 
                        color: 'white', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 30px rgba(99,102,241,0.3)',
                        opacity: loading ? 0.7 : 1
                      }}>
                        {loading ? <Orbit className="animate-spin" /> : <>Login<ArrowRight size={18} /></>}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>Join the Nexus</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Create your operator identity.</p>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input value={signupData.first} onChange={e => setSignupData({...signupData, first: e.target.value})} placeholder="First" style={inputStyle()} />
                        <input value={signupData.last} onChange={e => setSignupData({...signupData, last: e.target.value})} placeholder="Last" style={inputStyle()} />
                      </div>
                      <input type="date" value={signupData.dob} onChange={e => setSignupData({...signupData, dob: e.target.value})} style={inputStyle()} />
                      <input value={signupData.user} onChange={e => setSignupData({...signupData, user: e.target.value})} placeholder="Username" style={inputStyle()} />
                      <input type="email" value={signupData.email} onChange={e => setSignupData({...signupData, email: e.target.value})} placeholder="Email Address" style={inputStyle()} />
                      <input type="password" value={signupData.pass} onChange={e => setSignupData({...signupData, pass: e.target.value})} placeholder="Master Password" style={inputStyle()} />
                      <input type="password" value={signupData.conf} onChange={e => setSignupData({...signupData, conf: e.target.value})} placeholder="Confirm Password" style={inputStyle()} />
                      
                      {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 700, padding: '12px', background: 'rgba(239,68,68,0.1)', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}
                      {success && <div style={{ color: '#22c55e', fontSize: '0.85rem', fontWeight: 700, padding: '12px', background: 'rgba(34,197,94,0.1)', borderRadius: '12px', border: '1px solid rgba(34,197,94,0.2)' }}>{success}</div>}

                      <button type="submit" disabled={loading} style={{ 
                        width: '100%', padding: '16px', borderRadius: '16px', border: 'none', background: 'var(--accent-gradient)', 
                        color: 'white', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 30px rgba(99,102,241,0.3)',
                        opacity: loading ? 0.7 : 1
                      }}>
                        {loading ? <Orbit className="animate-spin" /> : <>Create Account<ArrowRight size={18} /></>}
                      </button>
                    </form>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        html, body {
          background-color: #050507 !important;
          scroll-behavior: smooth !important;
          -webkit-overflow-scrolling: touch;
          margin: 0;
          padding: 0;
        }

        .auth-viewport {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          background: #050507;
          color: #fff;
          font-family: 'Outfit', sans-serif;
          z-index: 9999;
          overflow: hidden;
        }

        .auth-container {
          display: flex;
          width: 100%;
          height: 100%;
          position: relative;
          z-index: 1;
        }
        
        @media (max-width: 1024px) { 
          .auth-viewport {
            position: relative !important;
            display: block !important;
            height: auto !important;
            min-height: 100vh !important;
            overflow: visible !important;
          }
          .auth-bg-static { position: absolute !important; }
          .auth-container { 
            display: block !important;
            padding-bottom: 0 !important;
          }
          .auth-branding-panel { 
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-start !important;
            align-items: center !important;
            width: 100% !important;
            height: auto !important;
            padding: 12vh 10vw 0 !important; 
            text-align: center;
          }
          .auth-branding-panel > div { display: flex; flex-direction: column; align-items: center; }
          .auth-branding-panel h2 { font-size: 3rem !important; margin-top: 1.5rem !important; }
          .auth-branding-panel p { margin-bottom: 0 !important; }
          .auth-features-grid { display: none !important; }
          .auth-portal-panel { 
            display: block !important;
            padding: 2vh 1.5rem 0 !important; 
          }
        }
        
        input::-webkit-calendar-picker-indicator { filter: invert(1); }
      `}</style>
    </div>
  );
}
