import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Shield, Camera, Mic, CheckCircle, AlertTriangle, Lock, X, Play, RefreshCw } from 'lucide-react';

function friendlyErr(err, type) {
  if (!err) return type + ' access failed.';
  const n = err.name || '';
  if (n === 'NotAllowedError' || n === 'PermissionDeniedError')
    return 'Permission blocked — see the browser unblock guide below.';
  if (n === 'NotFoundError' || n === 'DevicesNotFoundError')
    return 'No ' + type.toLowerCase() + ' hardware detected on this device.';
  if (n === 'NotReadableError' || n === 'TrackStartError')
    return type + ' is in use by another app (Zoom, Teams, etc.).';
  if (n === 'OverconstrainedError')
    return type + ' constraints are not supported by your device.';
  return (err.name || 'Error') + ': ' + (err.message || type + ' error.');
}

export const ProctorPreCheckModal = ({ isOpen, onClose, onStartExam, topicTitle }) => {
  const [camStatus,  setCamStatus]  = useState('idle');
  const [micStatus,  setMicStatus]  = useState('idle');
  const [camError,   setCamError]   = useState('');
  const [micError,   setMicError]   = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [agreed,     setAgreed]     = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [debugMsg,   setDebugMsg]   = useState('');

  const videoRef    = useRef(null);
  const streamRef   = useRef(null);
  const audioCtxRef = useRef(null);
  const rafRef      = useRef(null);

  const stopAll = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {}); audioCtxRef.current = null;
    }
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    if (videoRef.current) videoRef.current.srcObject = null;
    setAudioLevel(0);
  }, []);

  const startMeter = useCallback(async (stream) => {
    if (!stream || !stream.getAudioTracks().length) return;
    try {
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {}); audioCtxRef.current = null;
      }
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') await ctx.resume().catch(() => {});
      const src = ctx.createMediaStreamSource(stream);
      const an  = ctx.createAnalyser(); an.fftSize = 64; src.connect(an);
      const buf = new Uint8Array(an.frequencyBinCount);
      const tick = () => {
        an.getByteFrequencyData(buf);
        const avg = buf.reduce((a, b) => a + b, 0) / buf.length;
        setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (e) { console.warn('Audio meter:', e); }
  }, []);

  /*
   * KEY FIX: getUserMedia() is the VERY FIRST await in this function.
   * We removed the navigator.permissions.query() await that was previously
   * called before it. That await was breaking the browser's user-gesture
   * activation window, so the browser would silently reject getUserMedia
   * instead of showing the native camera/mic permission popup.
   */
  const runCheck = useCallback(async (fromUserClick) => {
    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
      const msg = 'WebRTC not available. Please use HTTPS and a modern browser.';
      setCamStatus('denied'); setMicStatus('denied');
      setCamError(msg); setMicError(msg);
      setDebugMsg('Error: navigator.mediaDevices is undefined');
      return;
    }
    setDebugMsg(fromUserClick ? 'Calling getUserMedia (user click)...' : 'Calling getUserMedia (auto)...');
    stopAll();
    setCamStatus('checking'); setMicStatus('checking');
    setCamError(''); setMicError('');

    try {
      // getUserMedia IS the first await - browser sees this as a direct user gesture call
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setDebugMsg('');
      streamRef.current = stream;
      const hasV = stream.getVideoTracks().length > 0;
      const hasA = stream.getAudioTracks().length > 0;
      if (hasV) {
        setCamStatus('ready');
        if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play().catch(() => {}); }
      } else { setCamStatus('denied'); setCamError('No video track returned.'); }
      if (hasA) { setMicStatus('ready'); await startMeter(stream); }
      else       { setMicStatus('denied'); setMicError('No audio track returned.'); }
    } catch (err) {
      const detail = (err.name || 'Error') + ': ' + err.message;
      setDebugMsg('Failed — ' + detail);
      console.error('[ProctorModal]', detail);
      setCamStatus('denied'); setMicStatus('denied');
      setCamError(friendlyErr(err, 'Camera'));
      setMicError(friendlyErr(err, 'Microphone'));
    }
  }, [stopAll, startMeter]);

  const handleRetry = useCallback(async () => {
    if (isRetrying) return;
    setIsRetrying(true);
    try { await runCheck(true); } finally { setIsRetrying(false); }
  }, [isRetrying, runCheck]);

  const handleAllowCam = useCallback(async () => {
    if (!navigator.mediaDevices) return;
    setCamStatus('checking'); setCamError('');
    if (streamRef.current) streamRef.current.getVideoTracks().forEach(t => { t.stop(); streamRef.current.removeTrack(t); });
    if (videoRef.current) videoRef.current.srcObject = null;
    try {
      const vs = await navigator.mediaDevices.getUserMedia({ video: true });
      if (!streamRef.current) streamRef.current = new MediaStream();
      vs.getVideoTracks().forEach(t => streamRef.current.addTrack(t));
      setCamStatus('ready');
      if (videoRef.current) { videoRef.current.srcObject = streamRef.current; videoRef.current.play().catch(() => {}); }
    } catch (err) { setCamStatus('denied'); setCamError(friendlyErr(err, 'Camera')); }
  }, []);

  const handleAllowMic = useCallback(async () => {
    if (!navigator.mediaDevices) return;
    setMicStatus('checking'); setMicError('');
    if (streamRef.current) streamRef.current.getAudioTracks().forEach(t => { t.stop(); streamRef.current.removeTrack(t); });
    try {
      const as = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!streamRef.current) streamRef.current = new MediaStream();
      as.getAudioTracks().forEach(t => streamRef.current.addTrack(t));
      setMicStatus('ready'); await startMeter(as);
    } catch (err) { setMicStatus('denied'); setMicError(friendlyErr(err, 'Microphone')); }
  }, [startMeter]);

  useEffect(() => {
    if (!isOpen) return;
    setAgreed(false); setDebugMsg('');
    setCamStatus('idle'); setMicStatus('idle'); setCamError(''); setMicError('');
    const t = setTimeout(() => { runCheck(false); }, 500);
    return () => { clearTimeout(t); stopAll(); };
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;
  const bothReady    = camStatus === 'ready' && micStatus === 'ready';
  const eitherDenied = camStatus === 'denied' || micStatus === 'denied';
  const canStart     = bothReady && agreed;

  const handleStart = () => {
    try { if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {}); } catch {}
    stopAll(); onStartExam();
  };

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(5,8,22,0.9)', backdropFilter: 'blur(20px)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{ width: '100%', maxWidth: '590px', borderRadius: '24px', backgroundColor: 'var(--card-bg, #0b0f19)', border: '1.5px solid rgba(168,85,247,0.4)', boxShadow: '0 25px 60px rgba(0,0,0,0.6)', padding: '28px', color: 'var(--text-primary)', maxHeight: '92vh', overflowY: 'auto' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'linear-gradient(135deg,rgba(168,85,247,0.2),rgba(99,102,241,0.2))', border: '1px solid rgba(168,85,247,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={22} color="#c084fc" />
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#c084fc', display: 'block' }}>AI PROCTORING PROTOCOL</span>
              <h3 style={{ fontSize: '19px', fontWeight: 900, margin: 0 }}>System Hardware Diagnostic</h3>
            </div>
          </div>
          <button onClick={onClose} style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)' }}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
          Assessment <strong>"{topicTitle || 'Selected Topic'}"</strong> requires mandatory live proctoring. Verify your camera and microphone below.
        </p>

        {debugMsg && (
          <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.35)', fontSize: '11px', color: '#fef08a', marginBottom: '14px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
            ⚙ {debugMsg}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div style={{ borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ width: '100%', height: '110px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', display: camStatus === 'ready' ? 'block' : 'none' }} />
              {camStatus !== 'ready' && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', gap: '8px' }}>
                  <Camera size={26} color={camStatus === 'checking' ? '#f59e0b' : '#ef4444'} />
                  {camStatus === 'checking' && <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 700 }}>⏳ Requesting camera…</span>}
                  {camStatus === 'denied'   && <button onClick={handleAllowCam} style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#a855f7,#6366f1)', color: '#fff', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>Allow Camera</button>}
                  {camStatus === 'idle'     && <span style={{ fontSize: '11px', color: '#94a3b8' }}>Waiting…</span>}
                </div>
              )}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: camStatus === 'ready' ? '#10b981' : camStatus === 'checking' ? '#f59e0b' : '#ef4444' }}>
                {camStatus === 'ready' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                <span>{camStatus === 'ready' ? 'Camera Active' : camStatus === 'checking' ? 'Checking…' : camStatus === 'idle' ? 'Pending' : 'Camera Blocked'}</span>
              </div>
              {camError && <p style={{ fontSize: '10.5px', color: '#fca5a5', margin: '4px 0 0', lineHeight: 1.3 }}>{camError}</p>}
            </div>
          </div>

          <div style={{ borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mic size={18} color="#06b6d4" /><span style={{ fontSize: '13px', fontWeight: 800 }}>Microphone Test</span></div>
            <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0 }}>Speak to test audio:</p>
            <div style={{ width: '100%', height: '12px', borderRadius: '99px', backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${audioLevel}%`, background: audioLevel > 60 ? 'linear-gradient(90deg,#10b981,#ef4444)' : 'linear-gradient(90deg,#10b981,#f59e0b)', borderRadius: '99px', transition: 'width 0.1s ease' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: micStatus === 'ready' ? '#10b981' : micStatus === 'checking' ? '#f59e0b' : '#ef4444' }}>
                {micStatus === 'ready' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                <span>{micStatus === 'ready' ? 'Audio Live' : micStatus === 'checking' ? 'Checking…' : micStatus === 'idle' ? 'Pending' : 'Mic Blocked'}</span>
              </div>
              {micStatus === 'denied' && <button onClick={handleAllowMic} style={{ padding: '5px 12px', borderRadius: '6px', border: 'none', background: 'linear-gradient(135deg,#06b6d4,#3b82f6)', color: '#fff', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>Allow Mic</button>}
            </div>
            {micError && <p style={{ fontSize: '10.5px', color: '#fca5a5', margin: 0, lineHeight: 1.3 }}>{micError}</p>}
          </div>
        </div>

        <div style={{ borderRadius: '16px', background: 'linear-gradient(135deg,rgba(239,68,68,0.08),rgba(245,158,11,0.05))', border: '1px solid rgba(239,68,68,0.25)', padding: '14px', marginBottom: '16px' }}>
          <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#f87171', display: 'block', marginBottom: '8px' }}>RULES & ANTI-CHEATING COMMITMENT</span>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px', fontWeight: 600 }}>
            <li>Camera and Microphone are <strong>strictly mandatory</strong> for the entire exam.</li>
            <li>No tab switching, window minimizing, or secondary monitor usage.</li>
            <li>4 security warnings result in instant automated exam submission.</li>
            <li>Fullscreen mode will be locked for the entire assessment duration.</li>
          </ul>
        </div>

        {!bothReady && (
          <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '14px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)' }}>
              <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#fca5a5', flex: 1 }}>Camera & Microphone are mandatory to start this assessment.</span>
              <button disabled={isRetrying} onClick={handleRetry} style={{ padding: '7px 16px', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.6)', background: isRetrying ? 'rgba(239,68,68,0.5)' : 'linear-gradient(135deg,#ef4444,#dc2626)', color: '#fff', fontSize: '11.5px', fontWeight: 900, cursor: isRetrying ? 'wait' : 'pointer', flexShrink: 0, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RefreshCw size={13} style={{ animation: isRetrying ? 'spin 1s linear infinite' : 'none' }} />
                <span>{isRetrying ? 'Re-checking…' : 'Retry Diagnostic'}</span>
              </button>
            </div>

            {eitherDenied && (
              <div style={{ padding: '14px', borderRadius: '14px', background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(168,85,247,0.35)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lock size={15} color="#c084fc" />
                  <span style={{ fontWeight: 900, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '11px' }}>Your browser has blocked camera & mic — here is how to fix it:</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#cbd5e1', lineHeight: 1.5 }}>
                  <div style={{ display: 'flex', gap: '8px' }}><span>&#x1F512;</span><span><strong>Step 1:</strong> Click the <strong>Lock icon</strong> in your browser address bar at the top of the screen.</span></div>
                  <div style={{ display: 'flex', gap: '8px' }}><span>&#x1F39B;&#xFE0F;</span><span><strong>Step 2:</strong> Open <strong>Site Settings</strong> → set <strong>Camera</strong> and <strong>Microphone</strong> to <strong>Allow</strong>.</span></div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span>&#x1F504;</span>
                    <button onClick={() => window.location.reload()} style={{ padding: '5px 14px', borderRadius: '6px', border: '1px solid rgba(192,132,252,0.5)', background: 'rgba(168,85,247,0.2)', color: '#c084fc', fontSize: '12px', fontWeight: 900, cursor: 'pointer' }}>
                      &#x1F504; Reload & Apply Permissions
                    </button>
                  </div>
                </div>
                <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', fontSize: '11px', color: '#fef08a', fontWeight: 600 }}>
                  &#x1F4A1; <strong>Chrome/Edge tip:</strong> Type <strong>chrome://settings/content/camera</strong> in the address bar and ensure this site is not in the Blocked list.
                </div>
              </div>
            )}
          </div>
        )}

        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', marginBottom: '22px', userSelect: 'none' }}>
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#a855f7', cursor: 'pointer' }} />
          <span>I accept all security rules and authorize proctored monitoring</span>
        </label>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
          <button disabled={!canStart} onClick={handleStart} style={{ flex: 2, padding: '12px 20px', borderRadius: '14px', border: 'none', background: canStart ? 'linear-gradient(135deg,#a855f7,#6366f1)' : 'rgba(255,255,255,0.1)', color: canStart ? '#ffffff' : 'rgba(255,255,255,0.35)', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: canStart ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}>
            <Play size={16} fill="currentColor" />
            <span>{!bothReady ? 'Cam & Mic Access Required' : !agreed ? 'Accept Rules to Begin' : 'Enter Proctored Exam'}</span>
          </button>
        </div>

        <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
      </motion.div>
    </div>,
    document.body
  );
};
