import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Cpu, Zap, Users, ShieldCheck, ShieldAlert, ArrowRight, Loader2, CheckCircle2, Clock } from 'lucide-react';
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

  // ── FORGOT PASSWORD & OTP FLOW STATE ──
  const [forgotStep, setForgotStep] = useState('email'); // 'email' | 'otp' | 'newPassword' | 'success'
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpArray, setOtpArray] = useState(['', '', '', '', '', '']);
  const [resetToken, setResetToken] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confPass, setConfPass] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);
  const [otpTimer, setOtpTimer] = useState(600); // 10 minutes (600s)
  const [resendCooldown, setResendCooldown] = useState(0); // 60s cooldown
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState('');

  const getApiBaseUrl = () => {
    return (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:3000' : '';
  };

  // OTP 10-Minute Countdown Timer
  useEffect(() => {
    let timer;
    if (mode === 'forgot' && forgotStep === 'otp' && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, forgotStep, otpTimer]);

  // Resend Cooldown Timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const maskEmail = (emailStr) => {
    if (!emailStr || !emailStr.includes('@')) return emailStr;
    const [name, domain] = emailStr.split('@');
    if (name.length <= 2) return `${name}***@${domain}`;
    return `${name[0]}${'*'.repeat(name.length - 1)}@${domain}`;
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // OTP Input Auto-focus & Key handlers
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newArr = [...otpArray];
    newArr[index] = value.slice(-1);
    setOtpArray(newArr);
    setForgotError('');

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-box-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpArray[index] && index > 0) {
      const prevInput = document.getElementById(`otp-box-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      const digits = pasted.split('');
      setOtpArray(digits);
      setForgotError('');
      const lastInput = document.getElementById('otp-box-5');
      if (lastInput) lastInput.focus();
    }
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccessMsg('');
    if (!forgotEmail.trim()) {
      return setForgotError('Please enter a valid email address.');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail.trim())) {
      return setForgotError('Please enter a valid email address (e.g., name@gmail.com).');
    }

    setForgotLoading(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim() })
      });
      const data = await res.json();
      setForgotLoading(false);

      if (res.ok && data.success) {
        setForgotStep('otp');
        setOtpTimer(600);
        setResendCooldown(60);
        setOtpArray(['', '', '', '', '', '']);
        setForgotSuccessMsg(`Verification code sent to ${maskEmail(forgotEmail.trim())}`);
      } else {
        setForgotError(data.message || 'Failed to send verification code. Please try again.');
      }
    } catch (err) {
      setForgotLoading(false);
      setForgotError('Network connection error. Please verify your backend API is running.');
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setForgotError('');
    setForgotSuccessMsg('');
    setForgotLoading(true);

    try {
      const res = await fetch(`${getApiBaseUrl()}/api/auth/resend-reset-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim() })
      });
      const data = await res.json();
      setForgotLoading(false);

      if (res.ok && data.success) {
        setResendCooldown(60);
        setOtpTimer(600);
        setOtpArray(['', '', '', '', '', '']);
        setForgotSuccessMsg(`A new verification code was sent to ${maskEmail(forgotEmail.trim())}`);
      } else {
        setForgotError(data.message || 'Resend request failed.');
      }
    } catch (err) {
      setForgotLoading(false);
      setForgotError('Network connection error.');
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccessMsg('');

    const fullOtp = otpArray.join('');
    if (fullOtp.length < 6) {
      return setForgotError('Please enter the complete 6-digit verification code.');
    }

    if (otpTimer === 0) {
      return setForgotError('Verification code has expired. Please click "Resend Code".');
    }

    setForgotLoading(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/auth/verify-reset-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim(), otp: fullOtp })
      });
      const data = await res.json();
      setForgotLoading(false);

      if (res.ok && data.success && data.resetToken) {
        setResetToken(data.resetToken);
        setForgotStep('newPassword');
        setForgotSuccessMsg('Code verified! Please set your new password.');
      } else {
        setForgotError(data.message || 'Invalid verification code.');
      }
    } catch (err) {
      setForgotLoading(false);
      setForgotError('Network connection error. Please try again.');
    }
  };

  // Step 3: Reset Password
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccessMsg('');

    if (!newPass || !confPass) {
      return setForgotError('Please fill in both password fields.');
    }
    if (newPass !== confPass) {
      return setForgotError('Passwords do not match.');
    }
    if (newPass.length < 8) {
      return setForgotError('Password must be at least 8 characters long.');
    }

    const hasUpper = /[A-Z]/.test(newPass);
    const hasLower = /[a-z]/.test(newPass);
    const hasNum = /[0-9]/.test(newPass);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPass);

    if (!hasUpper || !hasLower || !hasNum || !hasSpecial) {
      return setForgotError('Password must contain uppercase, lowercase, number, and special character.');
    }

    setForgotLoading(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resetToken,
          newPassword: newPass,
          confirmPassword: confPass
        })
      });
      const data = await res.json();
      setForgotLoading(false);

      if (res.ok && data.success) {
        setForgotStep('success');
      } else {
        setForgotError(data.message || 'Password reset failed. Please restart the reset process.');
      }
    } catch (err) {
      setForgotLoading(false);
      setForgotError('Network connection error. Please try again.');
    }
  };

  // Password Strength Calculator
  const getPasswordRequirements = (pass) => {
    return {
      length: pass.length >= 8,
      upper: /[A-Z]/.test(pass),
      lower: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[^A-Za-z0-9]/.test(pass)
    };
  };

  const reqs = getPasswordRequirements(newPass);
  const metCount = Object.values(reqs).filter(Boolean).length;
  const strengthPercent = (metCount / 5) * 100;
  const strengthColor = metCount <= 2 ? '#ef4444' : (metCount <= 4 ? '#f59e0b' : '#10b981');
  const strengthLabel = metCount <= 2 ? 'Weak' : (metCount <= 4 ? 'Medium' : 'Strong');

  // ── LOGIN LOCKOUT & ATTEMPT COUNTER STATE ──
  const [isLoginLocked, setIsLoginLocked] = useState(false);
  const [lockoutRemainingSec, setLockoutRemainingSec] = useState(0);
  const [attemptsRemaining, setAttemptsRemaining] = useState(null);

  // Live countdown timer for login lockout
  useEffect(() => {
    let timer;
    if (isLoginLocked && lockoutRemainingSec > 0) {
      timer = setInterval(() => {
        setLockoutRemainingSec(prev => {
          if (prev <= 1) {
            setIsLoginLocked(false);
            setAttemptsRemaining(3);
            setError('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLoginLocked, lockoutRemainingSec]);

  // Check lockout on email input blur / change
  const handleCheckEmailLockout = async (emailVal) => {
    if (!emailVal || !emailVal.trim()) return;
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/auth/check-lockout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailVal.trim() })
      });
      const data = await res.json();
      if (data.isLocked) {
        setIsLoginLocked(true);
        setLockoutRemainingSec(data.remainingSeconds || 300);
        setError('Too many incorrect attempts. Login temporarily locked.');
      } else {
        setIsLoginLocked(false);
        if (typeof data.attemptsRemaining === 'number') {
          setAttemptsRemaining(data.attemptsRemaining);
          if (data.attemptsRemaining < 3) {
            setError(`Incorrect email or password. ${data.attemptsRemaining} attempt${data.attemptsRemaining === 1 ? '' : 's'} remaining.`);
          }
        }
      }
    } catch (e) {}
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsPendingApproval(false);
    if (!lUser || !lPass) return setError('Please fill in all fields.');

    if (isLoginLocked) {
      return setError(`Too many incorrect attempts. Login temporarily locked.`);
    }

    const res = await login(lUser.trim(), lPass);
    if (!res.success && !res.pending) {
      if (res.isLocked) {
        setIsLoginLocked(true);
        setLockoutRemainingSec(res.remainingSeconds || 300);
        setAttemptsRemaining(0);
        setError('Too many incorrect attempts. Login temporarily locked.');
      } else {
        if (typeof res.attemptsRemaining === 'number') {
          setAttemptsRemaining(res.attemptsRemaining);
        }
        setError(res.error || 'Incorrect email or password.');
      }
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

      {/* Main Layout Container */}
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
              onClick={() => { setMode('login'); setError(''); setSuccess(''); setIsPendingApproval(false); setForgotStep('email'); }}
            >
              Login
            </button>
            <button 
              type="button" 
              className={`tab-btn ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => { setMode('signup'); setError(''); setSuccess(''); setIsPendingApproval(false); setForgotStep('email'); }}
            >
              Sign Up
            </button>
          </div>

          {/* 1. LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="form-panel-active">
              <div className="input-group">
                <Mail className="input-icon" size={18} />
                <input 
                  type="text" 
                  value={lUser} 
                  onChange={e => setLUser(e.target.value)}
                  onBlur={() => handleCheckEmailLockout(lUser)} 
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
                <span onClick={() => { 
                  setMode('forgot'); 
                  setForgotStep('email'); 
                  setError(''); 
                  setSuccess(''); 
                  setForgotError('');
                  setForgotSuccessMsg('');
                }}>
                  Forgot Password?
                </span>
              </div>

              {error && <div className="form-message error">{error}</div>}

              {!isLoginLocked && attemptsRemaining !== null && attemptsRemaining < 3 && attemptsRemaining > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  marginBottom: '14px',
                  color: '#d97706',
                  fontSize: '13px',
                  fontWeight: 600
                }}>
                  <ShieldAlert size={16} />
                  <span>Security Warning: <strong>{attemptsRemaining}</strong> attempt{attemptsRemaining === 1 ? '' : 's'} remaining before 5-min account lockout.</span>
                </div>
              )}

              {isLoginLocked && lockoutRemainingSec > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  marginBottom: '14px',
                  color: '#ef4444',
                  fontSize: '13px',
                  fontWeight: 700
                }}>
                  <Clock size={16} />
                  <span>Try again in: <strong>{formatTimer(lockoutRemainingSec)}</strong></span>
                </div>
              )}

              <button type="submit" className="btn-login" disabled={loading || isLoginLocked}>
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : isLoginLocked ? (
                  <>🔒 Login Temporarily Locked</>
                ) : (
                  <>Login <ArrowRight size={18} /></>
                )}
              </button>
            </form>
          )}

          {/* 2. SIGNUP FORM */}
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

          {/* 3. FORGOT PASSWORD / OTP WORKFLOW */}
          {mode === 'forgot' && (
            <div className="form-panel-active">
              
              {/* STEP A: Email Input */}
              {forgotStep === 'email' && (
                <form onSubmit={handleSendOtp}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '8px' }}>
                    Forgot Password?
                  </h3>
                  <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.5, marginBottom: '20px' }}>
                    Enter your registered email address and we'll send you a 6-digit verification code.
                  </p>

                  <div className="input-group">
                    <Mail className="input-icon" size={18} />
                    <input 
                      type="email" 
                      value={forgotEmail} 
                      onChange={e => { setForgotEmail(e.target.value); setForgotError(''); }} 
                      placeholder="Email Address" 
                      required
                    />
                  </div>

                  {forgotError && <div className="form-message error" style={{ marginBottom: '16px' }}>{forgotError}</div>}

                  <button type="submit" className="btn-login" disabled={forgotLoading}>
                    {forgotLoading ? <Loader2 className="animate-spin" size={18} /> : <>Send Verification Code <Mail size={18} /></>}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <span 
                      onClick={() => { setMode('login'); setForgotError(''); }} 
                      style={{ fontSize: '0.85rem', fontWeight: 700, color: '#635bff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      ← Back to Login
                    </span>
                  </div>
                </form>
              )}

              {/* STEP B: 6-Box OTP Verification */}
              {forgotStep === 'otp' && (
                <form onSubmit={handleVerifyOtp} style={{ textAlign: 'center' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '6px' }}>
                    Verify Your Email
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, marginBottom: '16px' }}>
                    Enter the 6-digit verification code sent to:<br />
                    <strong style={{ color: 'var(--text-dark)' }}>{maskEmail(forgotEmail)}</strong>
                  </p>

                  {/* Timer Badge */}
                  <div className="timer-badge">
                    <Clock size={14} />
                    <span>Code expires in <strong>{formatTimer(otpTimer)}</strong></span>
                  </div>

                  {/* 6 OTP Input Boxes */}
                  <div className="otp-container" onPaste={handleOtpPaste}>
                    {otpArray.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-box-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(idx, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(idx, e)}
                        className="otp-box-input"
                        autoFocus={idx === 0}
                        required
                      />
                    ))}
                  </div>

                  {forgotSuccessMsg && (
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#10b981', marginBottom: '14px' }}>
                      {forgotSuccessMsg}
                    </div>
                  )}

                  {forgotError && (
                    <div className="form-message error" style={{ marginBottom: '16px' }}>
                      {forgotError}
                    </div>
                  )}

                  <button type="submit" className="btn-login" disabled={forgotLoading}>
                    {forgotLoading ? <Loader2 className="animate-spin" size={18} /> : <>Verify Code <ShieldCheck size={18} /></>}
                  </button>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '13px' }}>
                    <button
                      type="button"
                      onClick={() => { setForgotStep('email'); setForgotError(''); }}
                      style={{ background: 'none', border: 'none', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}
                    >
                      ← Back
                    </button>

                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendCooldown > 0 || forgotLoading}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: resendCooldown > 0 ? '#94a3b8' : '#635bff', 
                        fontWeight: 700, 
                        cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer' 
                      }}
                    >
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP C: Create New Password */}
              {forgotStep === 'newPassword' && (
                <form onSubmit={handleResetPasswordSubmit}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '6px' }}>
                    Create New Password
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, marginBottom: '20px' }}>
                    Set a strong password for your Nexus Hub account.
                  </p>

                  <div className="input-group">
                    <Lock className="input-icon" size={18} />
                    <input 
                      type={showNewPass ? "text" : "password"} 
                      value={newPass} 
                      onChange={e => { setNewPass(e.target.value); setForgotError(''); }} 
                      placeholder="New Password" 
                      required
                    />
                    <button type="button" className="toggle-pw" onClick={() => setShowNewPass(!showNewPass)} tabIndex="-1">
                      {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <div className="input-group">
                    <Lock className="input-icon" size={18} />
                    <input 
                      type={showConfPass ? "text" : "password"} 
                      value={confPass} 
                      onChange={e => { setConfPass(e.target.value); setForgotError(''); }} 
                      placeholder="Confirm New Password" 
                      required
                    />
                    <button type="button" className="toggle-pw" onClick={() => setShowConfPass(!showConfPass)} tabIndex="-1">
                      {showConfPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {newPass && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: strengthColor }}>
                        <span>Password Strength</span>
                        <span>{strengthLabel}</span>
                      </div>
                      <div className="pw-strength-bar">
                        <div className="pw-strength-fill" style={{ width: `${strengthPercent}%`, backgroundColor: strengthColor }}></div>
                      </div>

                      <div className="pw-req-list">
                        <div className={`pw-req-item ${reqs.length ? 'met' : ''}`}>
                          <CheckCircle2 size={13} /> Min 8 characters
                        </div>
                        <div className={`pw-req-item ${reqs.upper ? 'met' : ''}`}>
                          <CheckCircle2 size={13} /> Uppercase letter
                        </div>
                        <div className={`pw-req-item ${reqs.lower ? 'met' : ''}`}>
                          <CheckCircle2 size={13} /> Lowercase letter
                        </div>
                        <div className={`pw-req-item ${reqs.number ? 'met' : ''}`}>
                          <CheckCircle2 size={13} /> Number
                        </div>
                        <div className={`pw-req-item ${reqs.special ? 'met' : ''}`}>
                          <CheckCircle2 size={13} /> Special character
                        </div>
                      </div>
                    </div>
                  )}

                  {forgotError && <div className="form-message error" style={{ marginBottom: '16px' }}>{forgotError}</div>}

                  <button type="submit" className="btn-login" disabled={forgotLoading}>
                    {forgotLoading ? <Loader2 className="animate-spin" size={18} /> : <>Reset Password <Lock size={18} /></>}
                  </button>
                </form>
              )}

              {/* STEP D: Success Screen */}
              {forgotStep === 'success' && (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(2, 132, 199, 0.15) 100%)', 
                    border: '2px solid #10b981', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 20px' 
                  }}>
                    <CheckCircle2 size={36} style={{ color: '#10b981' }} />
                  </div>

                  <h3 style={{ color: 'var(--text-dark)', fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>
                    Password Reset Successful
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
                    Your Nexus Hub password has been updated successfully. You can now log in with your new credentials.
                  </p>

                  <button 
                    type="button" 
                    onClick={() => {
                      setMode('login');
                      setForgotStep('email');
                      setForgotEmail('');
                      setOtpArray(['', '', '', '', '', '']);
                      setNewPass('');
                      setConfPass('');
                      setForgotError('');
                      setForgotSuccessMsg('');
                    }} 
                    className="btn-login"
                  >
                    Back to Login <ArrowRight size={18} />
                  </button>
                </div>
              )}

            </div>
          )}

        </div>
      </div>

    </div>
  );
}
