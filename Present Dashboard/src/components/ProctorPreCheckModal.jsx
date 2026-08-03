import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Shield, Camera, Mic, CheckCircle, AlertTriangle, Lock, X, Play, RefreshCw } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────────
   ProctorPreCheckModal — Mandatory camera & microphone hardware verification
   before entering a proctored aptitude assessment.

   Key design: all three buttons (Allow Camera, Allow Mic, Retry Diagnostic)
   call navigator.mediaDevices.getUserMedia() DIRECTLY in their onClick handler
   — no intermediate useCallback chains — so the browser always sees it as a
   user-gesture-initiated call and WILL show the native permission popup when
   the permission state is "prompt".
   ─────────────────────────────────────────────────────────────────────────── */

// Convert WebRTC DOMException → user-friendly string
function friendlyErr(err, type) {
  if (!err) return `${type} access failed.`;
  switch (err.name) {
    case 'NotAllowedError':
    case 'PermissionDeniedError':
      return 'Permission blocked. Open browser site settings to allow.';
    case 'NotFoundError':
    case 'DevicesNotFoundError':
      return `No ${type.toLowerCase()} hardware detected on this device.`;
    case 'NotReadableError':
    case 'TrackStartError':
      return `${type} is in use by another app (Zoom, Teams, etc.).`;
    case 'OverconstrainedError':
      return `${type} hardware constraints not supported.`;
    default:
      return err.message || `${type} access error.`;
  }
}

export const ProctorPreCheckModal = ({ isOpen, onClose, onStartExam, topicTitle }) => {
  const [camStatus,   setCamStatus]   = useState('idle');
  const [micStatus,   setMicStatus]   = useState('idle');
  const [camError,    setCamError]    = useState('');
  const [micError,    setMicError]    = useState('');
  const [audioLevel,  setAudioLevel]  = useState(0);
  const [agreed,      setAgreed]      = useState(false);
  const [isRetrying,  setIsRetrying]  = useState(false);

  const videoRef    = useRef(null);
  const streamRef   = useRef(null);
  const audioCtxRef = useRef(null);
  const rafRef      = useRef(null);

  /* ─── teardown all media ─────────────────────────────────────────────── */
  const stopAll = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setAudioLevel(0);
  }, []);

  /* ─── start live audio level meter ──────────────────────────────────── */
  const startMeter = useCallback(async (stream) => {
    if (!stream || !stream.getAudioTracks().length) return;
    try {
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') await ctx.resume().catch(() => {});
      const src      = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      src.connect(analyser);
      const buf = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(buf);
        const avg = buf.reduce((a, b) => a + b, 0) / buf.length;
        setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (e) { console.warn('Audio meter error:', e); }
  }, []);

  /* ─── attach stream to <video> ───────────────────────────────────────── */
  const attachVideo = useCallback((stream) => {
    if (!videoRef.current) return;
    videoRef.current.srcObject = stream;
    videoRef.current.play().catch(() => {});
  }, []);

  /* ──────────────────────────────────────────────────────────────────────
     requestBoth — called directly from button onClick so the browser
     preserves user-gesture context and shows the native permission popup.
     ────────────────────────────────────────────────────────────────────── */
  const requestBoth = async () => {
    stopAll();
    setCamStatus('checking');
    setMicStatus('checking');
    setCamError('');
    setMicError('');

    // Pre-check permission states (Permissions API)
    let camState = 'prompt';
    let micState = 'prompt';
    if (navigator.permissions) {
      try {
        const [c, m] = await Promise.all([
          navigator.permissions.query({ name: 'camera' }).catch(() => ({ state: 'prompt' })),
          navigator.permissions.query({ name: 'microphone' }).catch(() => ({ state: 'prompt' })),
        ]);
        camState = c.state;
        micState = m.state;
      } catch { /* API unavailable */ }
    }

    // Both permanently denied → skip getUserMedia (it won't show a popup anyway)
    if (camState === 'denied' && micState === 'denied') {
      setCamStatus('denied');
      setMicStatus('denied');
      setCamError('Blocked in browser settings. Follow the guide below to unblock.');
      setMicError('Blocked in browser settings. Follow the guide below to unblock.');
      return;
    }

    // Try combined camera + microphone — browser WILL show popup if state is "prompt"
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      const hasVideo = stream.getVideoTracks().length > 0;
      const hasAudio = stream.getAudioTracks().length > 0;
      if (hasVideo) { setCamStatus('ready'); attachVideo(stream); }
      else           { setCamStatus('denied'); setCamError('Camera not found in combined stream.'); }
      if (hasAudio) { setMicStatus('ready'); await startMeter(stream); }
      else           { setMicStatus('denied'); setMicError('Microphone not found in combined stream.'); }
      return;
    } catch (err) {
      console.warn('[ProctorModal] Combined getUserMedia failed:', err.name, err.message);
    }

    // Fallback: try camera and mic separately
    if (camState !== 'denied') {
      try {
        const vs = await navigator.mediaDevices.getUserMedia({ video: true });
        if (!streamRef.current) streamRef.current = new MediaStream();
        vs.getVideoTracks().forEach(t => streamRef.current.addTrack(t));
        setCamStatus('ready');
        attachVideo(streamRef.current);
      } catch (vErr) {
        console.warn('[ProctorModal] Camera-only failed:', vErr.name);
        setCamStatus('denied');
        setCamError(friendlyErr(vErr, 'Camera'));
      }
    } else {
      setCamStatus('denied');
      setCamError('Blocked in browser settings. Follow the guide below to unblock.');
    }

    if (micState !== 'denied') {
      try {
        const as = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!streamRef.current) streamRef.current = new MediaStream();
        as.getAudioTracks().forEach(t => streamRef.current.addTrack(t));
        setMicStatus('ready');
        await startMeter(as);
      } catch (aErr) {
        console.warn('[ProctorModal] Mic-only failed:', aErr.name);
        setMicStatus('denied');
        setMicError(friendlyErr(aErr, 'Microphone'));
      }
    } else {
      setMicStatus('denied');
      setMicError('Blocked in browser settings. Follow the guide below to unblock.');
    }
  };

  /* ─── Allow Camera button (standalone, direct getUserMedia) ──────────── */
  const requestCamOnly = async () => {
    setCamStatus('checking');
    setCamError('');
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(t => { t.stop(); streamRef.current?.removeTrack(t); });
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    try {
      const vs = await navigator.mediaDevices.getUserMedia({ video: true });
      if (!streamRef.current) streamRef.current = new MediaStream();
      vs.getVideoTracks().forEach(t => streamRef.current.addTrack(t));
      setCamStatus('ready');
      attachVideo(streamRef.current);
    } catch (err) {
      console.warn('[ProctorModal] Camera-only request failed:', err.name);
      setCamStatus('denied');
      setCamError(friendlyErr(err, 'Camera'));
    }
  };

  /* ─── Allow Mic button (standalone, direct getUserMedia) ─────────────── */
  const requestMicOnly = async () => {
    setMicStatus('checking');
    setMicError('');
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(t => { t.stop(); streamRef.current?.removeTrack(t); });
    }
    try {
      const as = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!streamRef.current) streamRef.current = new MediaStream();
      as.getAudioTracks().forEach(t => streamRef.current.addTrack(t));
      setMicStatus('ready');
      await startMeter(as);
    } catch (err) {
      console.warn('[ProctorModal] Mic-only request failed:', err.name);
      setMicStatus('denied');
      setMicError(friendlyErr(err, 'Microphone'));
    }
  };

  /* ─── Retry Diagnostic button ────────────────────────────────────────── */
  const handleRetry = async () => {
    if (isRetrying) return;
    setIsRetrying(true);
    try {
      await requestBoth();
    } finally {
      setIsRetrying(false);
    }
  };

  /* ─── Auto-run on modal open ─────────────────────────────────────────── */
  useEffect(() => {
    if (!isOpen) return;
    setAgreed(false);
    setCamStatus('idle');
    setMicStatus('idle');
    setCamError('');
    setMicError('');
    const t = setTimeout(() => { requestBoth(); }, 400);
    return () => { clearTimeout(t); stopAll(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const bothReady   = camStatus === 'ready' && micStatus === 'ready';
  const eitherDenied = camStatus === 'denied' || micStatus === 'denied';
  const canStart    = bothReady && agreed;

  const handleConfirmStart = () => {
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch { /* noop */ }
    stopAll();
    onStartExam();
  };

  /* ─── JSX ────────────────────────────────────────────────────────────── */
  return createPortal(
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
      backgroundColor: 'rgba(5,8,22,0.88)',
      backdropFilter: 'blur(20px)'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          width: '100%', maxWidth: '580px',
          borderRadius: '24px',
          backgroundColor: 'var(--card-bg, #0b0f19)',
          border: '1.5px solid rgba(168,85,247,0.4)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 30px rgba(168,85,247,0.2)',
          padding: '28px',
          color: 'var(--text-primary)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '14px',
              background: 'linear-gradient(135deg,rgba(168,85,247,0.2),rgba(99,102,241,0.2))',
              border: '1px solid rgba(168,85,247,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Shield size={22} color="#c084fc" />
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#c084fc', display: 'block' }}>
                AI PROCTORING PROTOCOL
              </span>
              <h3 style={{ fontSize: '19px', fontWeight: 900, margin: 0 }}>
                System Hardware Diagnostic
              </h3>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: '34px', height: '34px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-primary)', cursor: 'pointer'
          }}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
          This assessment for <strong>"{topicTitle || 'Selected Topic'}"</strong> requires mandatory live proctoring.
          Verify your camera and microphone below.
        </p>

        {/* Hardware Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>

          {/* Camera Card */}
          <div style={{ borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ width: '100%', height: '110px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', display: camStatus === 'ready' ? 'block' : 'none' }} />
              {camStatus !== 'ready' && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.85)', gap: '8px' }}>
                  <Camera size={26} color={camStatus === 'checking' ? '#f59e0b' : '#ef4444'} />
                  {camStatus === 'checking' && <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 700 }}>⏳ Requesting camera…</span>}
                  {camStatus === 'denied' && (
                    <button
                      onClick={requestCamOnly}
                      style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#a855f7,#6366f1)', color: '#fff', fontSize: '11px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 10px rgba(168,85,247,0.4)' }}
                    >
                      Allow Camera
                    </button>
                  )}
                  {camStatus === 'idle' && <span style={{ fontSize: '11px', color: '#94a3b8' }}>Waiting…</span>}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: camStatus === 'ready' ? '#10b981' : camStatus === 'checking' ? '#f59e0b' : '#ef4444' }}>
                {camStatus === 'ready' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                <span>{camStatus === 'ready' ? 'Camera Active' : camStatus === 'checking' ? 'Checking…' : camStatus === 'idle' ? 'Pending' : 'Camera Blocked'}</span>
              </div>
              {camError && <span style={{ fontSize: '10.5px', color: '#fca5a5', lineHeight: 1.3 }}>{camError}</span>}
            </div>
          </div>

          {/* Mic Card */}
          <div style={{ borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mic size={18} color="#06b6d4" />
              <span style={{ fontSize: '13px', fontWeight: 800 }}>Microphone Test</span>
            </div>
            <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0 }}>Speak to test audio:</p>
            <div style={{ width: '100%', height: '12px', borderRadius: '99px', backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${audioLevel}%`, background: audioLevel > 60 ? 'linear-gradient(90deg,#10b981,#ef4444)' : 'linear-gradient(90deg,#10b981,#f59e0b)', borderRadius: '99px', transition: 'width 0.1s ease' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: micStatus === 'ready' ? '#10b981' : micStatus === 'checking' ? '#f59e0b' : '#ef4444' }}>
                {micStatus === 'ready' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                <span>{micStatus === 'ready' ? 'Audio Live' : micStatus === 'checking' ? 'Checking…' : micStatus === 'idle' ? 'Pending' : 'Mic Blocked'}</span>
              </div>
              {micStatus === 'denied' && (
                <button
                  onClick={requestMicOnly}
                  style={{ padding: '5px 12px', borderRadius: '6px', border: 'none', background: 'linear-gradient(135deg,#06b6d4,#3b82f6)', color: '#fff', fontSize: '11px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 8px rgba(6,182,212,0.4)' }}
                >
                  Allow Mic
                </button>
              )}
            </div>
            {micError && <span style={{ fontSize: '10.5px', color: '#fca5a5', lineHeight: 1.3 }}>{micError}</span>}
          </div>

        </div>

        {/* Rules */}
        <div style={{ borderRadius: '16px', background: 'linear-gradient(135deg,rgba(239,68,68,0.08),rgba(245,158,11,0.05))', border: '1px solid rgba(239,68,68,0.25)', padding: '14px', marginBottom: '16px' }}>
          <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#f87171', display: 'block', marginBottom: '8px' }}>RULES &amp; ANTI-CHEATING COMMITMENT</span>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px', fontWeight: 600 }}>
            <li>Camera and Microphone are <strong>strictly mandatory</strong> for the entire exam.</li>
            <li>No tab switching, window minimizing, or secondary monitor usage.</li>
            <li>4 security warnings result in instant automated exam submission.</li>
            <li>Fullscreen mode will be locked for the entire assessment duration.</li>
          </ul>
        </div>

        {/* Retry + Unblock Guide */}
        {!bothReady && (
          <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '14px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)' }}>
              <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#fca5a5', flex: 1 }}>
                Camera &amp; Microphone access are mandatory to start this assessment.
              </span>
              <button
                disabled={isRetrying}
                onClick={handleRetry}
                style={{
                  padding: '7px 16px', borderRadius: '10px',
                  border: '1px solid rgba(239,68,68,0.6)',
                  background: isRetrying ? 'rgba(239,68,68,0.5)' : 'linear-gradient(135deg,#ef4444,#dc2626)',
                  color: '#fff', fontSize: '11.5px', fontWeight: 900,
                  cursor: isRetrying ? 'wait' : 'pointer',
                  flexShrink: 0, whiteSpace: 'nowrap',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  boxShadow: '0 2px 10px rgba(239,68,68,0.3)'
                }}
              >
                <RefreshCw size={13} style={{ animation: isRetrying ? 'spin 1s linear infinite' : 'none' }} />
                <span>{isRetrying ? 'Re-checking…' : 'Retry Diagnostic'}</span>
              </button>
            </div>

            {eitherDenied && (
              <div style={{ padding: '14px', borderRadius: '14px', background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(168,85,247,0.35)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lock size={15} color="#c084fc" />
                  <span style={{ fontWeight: 900, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '11px' }}>How to unblock camera &amp; mic in your browser:</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '12px', color: '#cbd5e1', lineHeight: 1.5 }}>
                  <div style={{ display: 'flex', gap: '8px' }}><span style={{ fontSize: '15px' }}>🔒</span><span><strong>Step 1:</strong> Click the <strong>Lock icon</strong> in your browser address bar at the top.</span></div>
                  <div style={{ display: 'flex', gap: '8px' }}><span style={{ fontSize: '15px' }}>🎛️</span><span><strong>Step 2:</strong> Open <strong>Site Settings</strong> → set <strong>Camera</strong> and <strong>Microphone</strong> to <strong>"Allow"</strong>.</span></div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '15px' }}>🔄</span>
                    <span><strong>Step 3:</strong></span>
                    <button onClick={() => window.location.reload()} style={{ padding: '4px 12px', borderRadius: '6px', border: '1px solid rgba(192,132,252,0.5)', background: 'rgba(168,85,247,0.2)', color: '#c084fc', fontSize: '11.5px', fontWeight: 900, cursor: 'pointer' }}>
                      🔄 Reload Permissions &amp; Page
                    </button>
                  </div>
                </div>
                <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', fontSize: '11px', color: '#fef08a', fontWeight: 600 }}>
                  💡 <strong>Chrome/Edge tip:</strong> Go to <strong>chrome://settings/content/camera</strong> and make sure this site is NOT in the Blocked list.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Agreement */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', marginBottom: '22px', userSelect: 'none' }}>
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#a855f7', cursor: 'pointer' }} />
          <span>I accept all security rules and authorize proctored monitoring</span>
        </label>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', fontWeight: 800, cursor: 'pointer' }}>
            Cancel
          </button>
          <button
            disabled={!canStart}
            onClick={handleConfirmStart}
            style={{
              flex: 2, padding: '12px 20px', borderRadius: '14px', border: 'none',
              background: canStart ? 'linear-gradient(135deg,#a855f7,#6366f1)' : 'rgba(255,255,255,0.1)',
              color: canStart ? '#ffffff' : 'rgba(255,255,255,0.35)',
              fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              cursor: canStart ? 'pointer' : 'not-allowed',
              boxShadow: canStart ? '0 6px 20px rgba(168,85,247,0.35)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <Play size={16} fill="currentColor" />
            <span>{!bothReady ? 'Cam & Mic Access Required' : !agreed ? 'Accept Rules to Begin' : 'Enter Proctored Exam'}</span>
          </button>
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </motion.div>
    </div>,
    document.body
  );
};
