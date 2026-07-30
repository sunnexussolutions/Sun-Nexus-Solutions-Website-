import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Cpu, Zap, Users, ShieldCheck, ShieldAlert, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

export default function Auth() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPendingApproval, setIsPendingApproval] = useState(false);
  const { login, register, loading } = useAuth();
  
  // Login form state
  const [lUser, setLUser] = useState('');
  const [lPass, setLPass] = useState('');
  const [showLPass, setShowLPass] = useState(false);

  // Signup form state
  const [signupData, setSignupData] = useState({
    first: '', last: '', dob: '', user: '', email: '', pass: '', conf: ''
  });
  const [showSPass, setShowSPass] = useState(false);
  const [showCPass, setShowCPass] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

  useEffect(() => {
    document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsPendingApproval(false);
    if (!lUser || !lPass) return setError('Please fill in all fields.');
    const res = await login(lUser.trim(), lPass);
    if (!res.success && !res.pending) {
      setError(res.error || 'Access Denied: Invalid credentials.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const d = signupData;
    if (!d.first.trim() || !d.last.trim() || !d.email.trim() || !d.pass) {
      return setError('Please fill in all required fields.');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(d.email.trim())) {
      return setError('Please enter a valid email address (e.g., name@gmail.com).');
    }
    if (d.pass.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    if (d.pass !== d.conf) {
      return setError('Passwords do not match.');
    }
    
    const username = d.user?.trim() || d.email.trim().split('@')[0] || `${d.first}${d.last}`.toLowerCase().replace(/\s+/g, '');

    const res = await register({ 
      firstName: d.first.trim(), 
      lastName: d.last.trim(), 
      dob: d.dob || '', 
      username, 
      email: d.email.trim(), 
      password: d.pass 
    });
    if (res.success) {
      setSuccess('You are registered and waiting for Admin approval...');
      setSignupData({ first: '', last: '', dob: '', user: '', email: '', pass: '', conf: '' });
    } else {
      setError(res.error || 'Registration failed.');
    }
  };



  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return setForgotStatus('error');
    setForgotStatus('loading');
    setTimeout(() => {
      setForgotStatus('success');
    }, 1200);
  };

  return (
    <div className="executive-auth-wrapper">
      {/* Background SVG Wave */}
      <div className="bg-wave-container">
        <svg className="bg-wave-svg" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,181.3C672,181,768,203,864,213.3C960,224,1056,224,1152,208C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" fill="url(#waveGradient)"></path>
          <defs>
            <linearGradient id="waveGradient" x1="0" y1="0" x2="1440" y2="320" gradientUnits="userSpaceOnUse">
              <stop stopColor="#635bff" stopOpacity="0.12"/>
              <stop offset="1" stopColor="#a78bfa" stopOpacity="0.05"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brain Watermark */}
      <img 
        src="https://res.cloudinary.com/dseg9nty3/image/upload/v1785127189/ChatGPT_Image_Jul_25_2026_11_14_51_AM_ll6zi0.png" 
        alt="Brain Watermark" 
        className="brain-watermark" 
      />

      {/* Top Brand Bar */}
      <div className="topbar">
        <div className="brand-group">
          <div className="brand-icon-box">
            <img 
              src="/logo_mark.png" 
              alt="Sun Nexus Logo" 
            />
          </div>
          <div className="brand-text">
            <div className="brand-name">SUN NEXUS</div>
            <div className="brand-sub">SOLUTIONS</div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="main-layout">

        {/* LEFT PANEL */}
        <div className="left-panel">
          <h1 className="hero-heading">
            Think.<br />
            <span className="accent">Innovate.</span><br />
            Master.
          </h1>
          <div className="hero-divider"></div>
          <p className="hero-desc">
            The definitive ecosystem for future-ready engineers. Elevate your cognitive potential with the Sun Nexus flagship platform.
          </p>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon fi-purple"><Cpu size={20} /></div>
              <div className="feature-text">
                <div className="f-title">Aptitude Hub</div>
                <div className="f-desc">Advanced Cognitive Assessments</div>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon fi-blue"><Zap size={20} /></div>
              <div className="feature-text">
                <div className="f-title">Mastery Tracks</div>
                <div className="f-desc">Curated Learning Architecture</div>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon fi-orange"><Users size={20} /></div>
              <div className="feature-text">
                <div className="f-title">Elite Network</div>
                <div className="f-desc">Collaborative Community Hub</div>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon fi-green"><ShieldCheck size={20} /></div>
              <div className="feature-text">
                <div className="f-title">Admin Command</div>
                <div className="f-desc">Strategic Platform Control</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — Card */}
        <div className="login-card">
          <div className="card-icon-wrap">
            <Lock size={24} color="#635bff" />
          </div>
          <div className="card-title">Executive Portal</div>
          <div className="card-sub">Authorize your session to continue.</div>

          {/* Tab Switcher */}
          <div className="tab-row">
            <button 
              type="button" 
              className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setError(''); setSuccess(''); setIsPendingApproval(false); }}
            >
              Login
            </button>
            <button 
              type="button" 
              className={`tab-btn ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => { setMode('signup'); setError(''); setSuccess(''); setIsPendingApproval(false); }}
            >
              Sign Up
            </button>
          </div>

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="form-panel-active">
              <div className="input-group">
                <Mail className="input-icon" size={18} />
                <input 
                  type="text" 
                  value={lUser} 
                  onChange={e => setLUser(e.target.value)} 
                  placeholder="Email Address" 
                  autoComplete="username" 
                  required
                />
              </div>

              <div className="input-group">
                <Lock className="input-icon" size={18} />
                <input 
                  type={showLPass ? "text" : "password"} 
                  value={lPass} 
                  onChange={e => setLPass(e.target.value)} 
                  placeholder="Password" 
                  autoComplete="current-password" 
                  required
                />
                <button 
                  type="button" 
                  className="toggle-pw" 
                  onClick={() => setShowLPass(!showLPass)}
                  tabIndex="-1"
                >
                  {showLPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="forgot-link">
                <span onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }}>Forgot Password?</span>
              </div>

              {error && <div className="form-message error">{error}</div>}

              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={18} /> : <>Login <ArrowRight size={18} /></>}
              </button>


            </form>
          )}

          {/* SIGNUP FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="form-panel-active">
              <div className="grid-2-cols">
                <input 
                  type="text" 
                  value={signupData.first} 
                  onChange={e => setSignupData({...signupData, first: e.target.value})} 
                  placeholder="First Name" 
                  className="simple-input" 
                  required
                />
                <input 
                  type="text" 
                  value={signupData.last} 
                  onChange={e => setSignupData({...signupData, last: e.target.value})} 
                  placeholder="Last Name" 
                  className="simple-input" 
                  required
                />
              </div>

              <div className="input-group">
                <Mail className="input-icon" size={18} />
                <input 
                  type="email" 
                  value={signupData.email} 
                  onChange={e => setSignupData({...signupData, email: e.target.value})} 
                  placeholder="Email Address" 
                  required
                />
              </div>

              <div className="input-group">
                <Lock className="input-icon" size={18} />
                <input 
                  type={showSPass ? "text" : "password"} 
                  value={signupData.pass} 
                  onChange={e => setSignupData({...signupData, pass: e.target.value})} 
                  placeholder="Master Password" 
                  required
                />
                <button type="button" className="toggle-pw" onClick={() => setShowSPass(!showSPass)} tabIndex="-1">
                  {showSPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="input-group">
                <Lock className="input-icon" size={18} />
                <input 
                  type={showCPass ? "text" : "password"} 
                  value={signupData.conf} 
                  onChange={e => setSignupData({...signupData, conf: e.target.value})} 
                  placeholder="Confirm Password" 
                  required
                />
                <button type="button" className="toggle-pw" onClick={() => setShowCPass(!showCPass)} tabIndex="-1">
                  {showCPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {error && <div className="form-message error">{error}</div>}

              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={18} /> : <>Sign Up <ArrowRight size={18} /></>}
              </button>

              {success && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(245,158,11,0.08)',
                  border: '1px solid rgba(245,158,11,0.35)',
                  marginTop: '12px',
                  textAlign: 'left'
                }}>
                  <ShieldAlert size={18} style={{ color: '#f59e0b', flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#f59e0b', lineHeight: 1.4 }}>
                    You are registered and waiting for Admin approval...
                  </span>
                </div>
              )}

            </form>
          )}

          {/* FORGOT FORM */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="form-panel-active">
              {forgotStatus === 'success' ? (
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <CheckCircle2 size={48} style={{ color: '#635bff', margin: '0 auto 1.5rem' }} />
                  <h3 style={{ color: '#0f172a', fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Resync Dispatched</h3>
                  <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.5 }}>
                    Secure instructions sent to <strong>{forgotEmail}</strong>.
                  </p>
                  <button 
                    type="button" 
                    onClick={() => { setMode('login'); setForgotStatus('idle'); }} 
                    style={{ background: 'transparent', border: 'none', color: '#635bff', fontSize: '0.9rem', fontWeight: 700, marginTop: '1.5rem', cursor: 'pointer' }}
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <>
                  <div className="input-group">
                    <Mail className="input-icon" size={18} />
                    <input 
                      type="email" 
                      value={forgotEmail} 
                      onChange={e => { setForgotEmail(e.target.value); setForgotStatus('idle'); }} 
                      placeholder="Email Address" 
                      required
                    />
                  </div>

                  {forgotStatus === 'error' && <div className="form-message error">Please enter a valid email address.</div>}

                  <button type="submit" className="btn-login" disabled={forgotStatus === 'loading'}>
                    {forgotStatus === 'loading' ? <Loader2 className="animate-spin" size={18} /> : <>Reset Password <Mail size={18} /></>}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '12px' }}>
                    <span onClick={() => setMode('login')} style={{ fontSize: '0.85rem', fontWeight: 700, color: '#635bff', cursor: 'pointer' }}>
                      Return to Login
                    </span>
                  </div>
                </>
              )}
            </form>
          )}

        </div>
      </div>

    </div>
  );
}
