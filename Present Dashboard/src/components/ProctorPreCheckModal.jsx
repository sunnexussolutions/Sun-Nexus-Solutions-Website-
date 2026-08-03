import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Shield, Camera, Mic, CheckCircle, AlertTriangle, X, Play, RefreshCw, Settings } from 'lucide-react';

/**
 * ProctorPreCheckModal
 * - Requests camera + mic in ONE getUserMedia call → single browser popup
 * - Explicit video.play() after setting srcObject
 * - Dead-simple status machine: idle | requesting | cam_ok | mic_ok | both_ok | cam_denied | mic_denied | both_denied
 * - Retry button is always re-enabled via try-finally
 */
export const ProctorPreCheckModal = ({ isOpen, onClose, onStartExam, topicTitle }) => {
  // 'idle' | 'requesting' | 'both_ok' | 'cam_denied' | 'mic_denied' | 'both_denied'
  const [status, setStatus]     = useState('idle');
  const [audioLevel, setAudioLevel] = useState(0);
  const [agreed, setAgreed]     = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const videoRef    = useRef(null);
  const streamRef   = useRef(null);
  const animRef     = useRef(null);
  const audioCtxRef = useRef(null);

  /* ─── Cleanup ─────────────────────────────────────────────── */
  const cleanup = useCallback(() => {
    if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null; }
    if (audioCtxRef.current) { try { audioCtxRef.current.close(); } catch (_) {} audioCtxRef.current = null; }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setAudioLevel(0);
  }, []);

  /* ─── Audio meter ──────────────────────────────────────────── */
  const startAudioMeter = useCallback((stream) => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx      = new Ctx();
      audioCtxRef.current = ctx;
      const source   = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const buf = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(buf);
        const avg = buf.reduce((a, b) => a + b, 0) / buf.length;
        setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
        animRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (e) {
      console.warn('Audio meter error:', e);
    }
  }, []);

  /* ─── Core permission request ─────────────────────────────── */
  const requestPermissions = useCallback(async () => {
    cleanup();
    setStatus('requesting');

    try {
      // Single getUserMedia call → single browser permission popup for both
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;

      // Wire camera preview
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try { await videoRef.current.play(); } catch (_) { /* autoplay policy */ }
      }

      // Wire audio meter (use audio-only stream subset for clean analyser)
      const audioStream = new MediaStream(stream.getAudioTracks());
      startAudioMeter(audioStream);

      setStatus('both_ok');
    } catch (err) {
      console.warn('getUserMedia error:', err.name, err.message);

      // Try to detect which permission(s) were denied
      let camDenied = false;
      let micDenied = false;

      try {
        const cp = await navigator.permissions.query({ name: 'camera' });
        const mp = await navigator.permissions.query({ name: 'microphone' });
        camDenied = cp.state === 'denied';
        micDenied = mp.state === 'denied';
      } catch (_) {
        // Permissions API not available (Firefox partial support) - assume both denied
        camDenied = true;
        micDenied = true;
      }

      // Fallback: try camera-only
      if (!camDenied) {
        try {
          const vs = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          streamRef.current = vs;
          if (videoRef.current) {
            videoRef.current.srcObject = vs;
            try { await videoRef.current.play(); } catch (_) {}
          }
          camDenied = false;
        } catch (_) { camDenied = true; }
      }

      // Fallback: try mic-only
      if (!micDenied) {
        try {
          const as = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
          startAudioMeter(as);
          micDenied = false;
        } catch (_) { micDenied = true; }
      }

      if (camDenied && micDenied) setStatus('both_denied');
      else if (camDenied)         setStatus('cam_denied');
      else if (micDenied)         setStatus('mic_denied');
      else                        setStatus('both_ok');
    }
  }, [cleanup, startAudioMeter]);

  /* ─── Retry button handler ────────────────────────────────── */
  const handleRetry = useCallback(async () => {
    setIsRetrying(true);
    try {
      await requestPermissions();
    } finally {
      setIsRetrying(false); // ALWAYS resets — button never stays stuck
    }
  }, [requestPermissions]);

  /* ─── Run on open ─────────────────────────────────────────── */
  useEffect(() => {
    if (!isOpen) {
      cleanup();
      setStatus('idle');
      setAgreed(false);
      return;
    }
    requestPermissions();
    return cleanup;
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  /* ─── Derived state ───────────────────────────────────────── */
  const camOk     = status === 'both_ok' || status === 'mic_denied';
  const micOk     = status === 'both_ok' || status === 'cam_denied';
  const bothReady = status === 'both_ok';
  const anyDenied = status === 'cam_denied' || status === 'mic_denied' || status === 'both_denied';
  const canStart  = bothReady && agreed;

  const handleConfirmStart = () => {
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch (_) {}
    // Keep stream alive for proctoring hook — don't stop tracks here
    onStartExam();
  };

  /* ─── Styles ──────────────────────────────────────────────── */
  const S = {
    overlay: {
      position: 'fixed', inset: 0, zIndex: 99999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px', backgroundColor: 'rgba(5, 8, 22, 0.88)',
      backdropFilter: 'blur(20px)',
    },
    card: {
      width: '100%', maxWidth: '560px', borderRadius: '24px',
      backgroundColor: 'var(--card-bg, #0b0f19)',
      border: '1.5px solid rgba(168, 85, 247, 0.4)',
      boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 30px rgba(168,85,247,0.2)',
      padding: '28px', color: 'var(--text-primary)', position: 'relative',
    },
    statusRow: (ok) => ({
      display: 'flex', alignItems: 'center', gap: '6px',
      fontSize: '12px', fontWeight: 800,
      color: ok ? '#10b981' : status === 'requesting' ? '#f59e0b' : '#f87171',
    }),
  };

  return createPortal(
    <div style={S.overlay}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={S.card}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(99,102,241,0.2))', border: '1px solid rgba(168,85,247,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          <button onClick={onClose} style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
          This assessment for <strong>"{topicTitle || 'Selected Topic'}"</strong> is protected by AI proctoring. Camera and microphone access are <strong>mandatory</strong>.
        </p>

        {/* Hardware Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>

          {/* Camera Box */}
          <div style={{ borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${camOk ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`, padding: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '100%', height: '110px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000', marginBottom: '10px', position: 'relative' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: camOk ? 'block' : 'none' }}
              />
              {!camOk && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <Camera size={28} color={status === 'requesting' ? '#f59e0b' : '#ef4444'} />
                  <span style={{ fontSize: '10px', fontWeight: 700, color: status === 'requesting' ? '#f59e0b' : '#fca5a5' }}>
                    {status === 'requesting' ? 'Requesting…' : 'Camera Blocked'}
                  </span>
                </div>
              )}
            </div>
            <div style={S.statusRow(camOk)}>
              {camOk ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
              <span>{camOk ? 'Camera Active' : status === 'requesting' ? 'Checking…' : 'Camera Denied'}</span>
            </div>
          </div>

          {/* Microphone Box */}
          <div style={{ borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${micOk ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`, padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Mic size={18} color={micOk ? '#10b981' : '#06b6d4'} />
                <span style={{ fontSize: '13px', fontWeight: 800 }}>Microphone Test</span>
              </div>
              <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: '0 0 10px 0' }}>
                {micOk ? 'Speak to test audio:' : status === 'requesting' ? 'Requesting mic access…' : 'Microphone access blocked'}
              </p>

              {/* Decibel bar */}
              <div style={{ width: '100%', height: '12px', borderRadius: '99px', backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden', marginBottom: '12px' }}>
                <div style={{
                  height: '100%',
                  width: `${audioLevel}%`,
                  background: audioLevel > 60 ? 'linear-gradient(90deg,#10b981,#ef4444)' : 'linear-gradient(90deg,#10b981,#f59e0b)',
                  borderRadius: '99px',
                  transition: 'width 0.1s ease',
                }} />
              </div>
            </div>

            <div style={S.statusRow(micOk)}>
              {micOk ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
              <span>{micOk ? 'Audio Stream Live' : status === 'requesting' ? 'Checking…' : 'Mic Denied'}</span>
            </div>
          </div>
        </div>

        {/* Rules */}
        <div style={{ borderRadius: '16px', background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(245,158,11,0.05))', border: '1px solid rgba(239,68,68,0.25)', padding: '14px', marginBottom: '16px' }}>
          <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#f87171', display: 'block', marginBottom: '8px' }}>
            RULES &amp; ANTI-CHEATING COMMITMENT
          </span>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '6px', fontWeight: 600 }}>
            <li>Camera and Microphone access are <strong>strictly mandatory</strong> for the entire exam.</li>
            <li>No tab switching, window minimizing, or secondary monitor usage allowed.</li>
            <li>4 security warnings will result in instant automated exam submission.</li>
            <li>Fullscreen mode will be locked for the entire assessment duration.</li>
          </ul>
        </div>

        {/* Permission denied banner + Retry */}
        {anyDenied && (
          <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '12px 14px', borderRadius: '14px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#fca5a5' }}>
                  {status === 'both_denied' && 'Camera & Microphone blocked.'}
                  {status === 'cam_denied'  && 'Camera blocked — mic is active.'}
                  {status === 'mic_denied'  && 'Microphone blocked — camera is active.'}
                  {' '}Grant access to continue.
                </span>
              </div>
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 14px', borderRadius: '8px',
                  border: 'none',
                  background: isRetrying ? 'rgba(239,68,68,0.4)' : 'linear-gradient(135deg,#ef4444,#dc2626)',
                  color: '#fff', fontSize: '11.5px', fontWeight: 900,
                  cursor: isRetrying ? 'wait' : 'pointer', flexShrink: 0,
                  whiteSpace: 'nowrap', boxShadow: '0 2px 10px rgba(239,68,68,0.3)',
                  transition: 'all 0.2s',
                }}
              >
                <RefreshCw size={13} className={isRetrying ? 'animate-spin' : ''} />
                {isRetrying ? 'Requesting…' : 'Retry Diagnostic'}
              </button>
            </div>

            {/* Browser unlock guide */}
            <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(168,85,247,0.25)', fontSize: '11.5px', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Settings size={13} color="#c084fc" />
                <span style={{ fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '10px' }}>
                  If still blocked — unblock in browser:
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span>🔒 <strong>1.</strong> Click the <strong>padlock / info icon</strong> in your browser's address bar</span>
                <span>🎥 <strong>2.</strong> Set <strong>Camera</strong> and <strong>Microphone</strong> to <em>Allow</em></span>
                <span>🔄 <strong>3.</strong> Click <strong>"Retry Diagnostic"</strong> above</span>
              </div>
            </div>
          </div>
        )}

        {/* Requesting spinner banner */}
        {status === 'requesting' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '14px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', marginBottom: '16px' }}>
            <AlertTriangle size={16} color="#f59e0b" />
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#fcd34d' }}>
              Waiting for browser permission — please click <strong>Allow</strong> in the popup…
            </span>
          </div>
        )}

        {/* Retry button when idle/requesting initially fails (but not denied) */}
        {(status === 'idle') && (
          <div style={{ marginBottom: '16px' }}>
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              style={{
                width: '100%', padding: '10px', borderRadius: '10px',
                border: '1px solid rgba(168,85,247,0.4)',
                background: 'rgba(168,85,247,0.1)', color: '#c084fc',
                fontSize: '13px', fontWeight: 800, cursor: 'pointer',
              }}
            >
              Request Camera &amp; Mic Access
            </button>
          </div>
        )}

        {/* Agreement Checkbox */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', marginBottom: '22px', userSelect: 'none' }}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: '#a855f7', cursor: 'pointer' }}
          />
          <span>I accept all security rules and authorize proctored monitoring</span>
        </label>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: '12px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', fontWeight: 800, cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            disabled={!canStart}
            onClick={handleConfirmStart}
            style={{
              flex: 2, padding: '12px 20px', borderRadius: '14px', border: 'none',
              background: canStart ? 'linear-gradient(135deg,#a855f7,#6366f1)' : 'rgba(255,255,255,0.1)',
              color: canStart ? '#fff' : 'rgba(255,255,255,0.4)',
              fontWeight: 900,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              cursor: canStart ? 'pointer' : 'not-allowed',
              boxShadow: canStart ? '0 6px 20px rgba(168,85,247,0.35)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            <Play size={16} fill="currentColor" />
            <span>
              {!bothReady
                ? (anyDenied ? 'Grant Camera & Mic First' : 'Checking Devices…')
                : !agreed
                  ? 'Accept Rules to Begin'
                  : 'Enter Proctored Exam'}
            </span>
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};
