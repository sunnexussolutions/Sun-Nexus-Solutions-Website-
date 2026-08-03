import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Shield, Camera, Mic, CheckCircle, AlertTriangle, Lock, ArrowRight, X, Play, RefreshCw } from 'lucide-react';

export const ProctorPreCheckModal = ({ isOpen, onClose, onStartExam, topicTitle }) => {
  const [camStatus, setCamStatus] = useState('checking'); // 'checking' | 'ready' | 'denied'
  const [micStatus, setMicStatus] = useState('checking'); // 'checking' | 'ready' | 'denied'
  const [camError, setCamError] = useState('');
  const [micError, setMicError] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [agreed, setAgreed] = useState(false);

  const videoPreviewRef = useRef(null);
  const streamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const animFrameRef = useRef(null);

  const [showPermissionGuide, setShowPermissionGuide] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Helper: Format friendly error messages based on WebRTC error name
  const parseMediaError = (err, type) => {
    if (!err) return `${type} access failed.`;
    const name = err.name || '';
    if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
      return 'Permission blocked by browser settings.';
    }
    if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
      return `No ${type.toLowerCase()} device detected.`;
    }
    if (name === 'NotReadableError' || name === 'TrackStartError') {
      return `${type} is in use by another application (Zoom, Teams, etc.).`;
    }
    if (name === 'OverconstrainedError') {
      return `${type} hardware constraints not supported.`;
    }
    return err.message || `${type} access error.`;
  };

  // Clean up all active media tracks, audio contexts, and animations
  const stopAllMedia = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    if (streamRef.current) {
      const tracks = [...streamRef.current.getTracks()];
      tracks.forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
    }
    setAudioLevel(0);
  }, []);

  // Helper: Start Audio Decibel Meter with AudioContext resume handling
  const startAudioMeter = useCallback(async (audioStream) => {
    if (!audioStream || audioStream.getAudioTracks().length === 0) return;

    try {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      audioCtxRef.current = audioCtx;

      if (audioCtx.state === 'suspended') {
        await audioCtx.resume().catch(() => {});
      }

      const source = audioCtx.createMediaStreamSource(audioStream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        if (!analyser) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        const avg = sum / dataArray.length;
        setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
        animFrameRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (e) {
      console.warn('Audio meter setup warning:', e);
    }
  }, []);

  // Safely clear tracks of specific kind from streamRef
  const clearTracksOfKind = useCallback((kind) => {
    if (!streamRef.current) return;
    const tracks = kind === 'video'
      ? [...streamRef.current.getVideoTracks()]
      : [...streamRef.current.getAudioTracks()];
    tracks.forEach(t => {
      t.stop();
      streamRef.current?.removeTrack(t);
    });
  }, []);

  // 1. Request Camera Access
  const requestCameraAccess = useCallback(async () => {
    setCamStatus('checking');
    setCamError('');
    try {
      clearTracksOfKind('video');
      let vStream = null;
      try {
        vStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
        });
      } catch {
        vStream = await navigator.mediaDevices.getUserMedia({ video: true });
      }

      const videoTrack = vStream.getVideoTracks()[0];
      if (!videoTrack) throw new Error('No video track returned.');

      if (!streamRef.current) streamRef.current = new MediaStream();
      streamRef.current.addTrack(videoTrack);

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = streamRef.current;
        videoPreviewRef.current.play().catch(e => console.warn('Video element play error:', e));
      }

      setCamStatus('ready');
      setCamError('');
    } catch (err) {
      console.warn('Camera request error:', err);
      const errMsg = parseMediaError(err, 'Camera');
      setCamStatus('denied');
      setCamError(errMsg);
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        setShowPermissionGuide(true);
      }
    }
  }, [clearTracksOfKind]);

  // 2. Request Microphone Access
  const requestMicAccess = useCallback(async () => {
    setMicStatus('checking');
    setMicError('');
    try {
      clearTracksOfKind('audio');
      const aStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioTrack = aStream.getAudioTracks()[0];
      if (!audioTrack) throw new Error('No audio track returned.');

      if (!streamRef.current) streamRef.current = new MediaStream();
      streamRef.current.addTrack(audioTrack);

      await startAudioMeter(aStream);

      setMicStatus('ready');
      setMicError('');
    } catch (err) {
      console.warn('Microphone request error:', err);
      const errMsg = parseMediaError(err, 'Microphone');
      setMicStatus('denied');
      setMicError(errMsg);
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        setShowPermissionGuide(true);
      }
    }
  }, [clearTracksOfKind, startAudioMeter]);

  // Combined Media Diagnostic (Tries combined getUserMedia first, falls back to separate calls)
  const runDiagnostic = useCallback(async () => {
    stopAllMedia();
    setCamStatus('checking');
    setMicStatus('checking');
    setCamError('');
    setMicError('');

    let videoAcquired = false;
    let audioAcquired = false;

    // Step A: Attempt combined video + audio getUserMedia
    try {
      const combinedStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: true
      });

      streamRef.current = combinedStream;

      if (combinedStream.getVideoTracks().length > 0) {
        setCamStatus('ready');
        videoAcquired = true;
      }
      if (combinedStream.getAudioTracks().length > 0) {
        setMicStatus('ready');
        audioAcquired = true;
        await startAudioMeter(combinedStream);
      }

      if (videoPreviewRef.current && videoAcquired) {
        videoPreviewRef.current.srcObject = combinedStream;
        videoPreviewRef.current.play().catch(e => console.warn('Video preview play catch:', e));
      }
    } catch (combinedErr) {
      console.warn('Combined getUserMedia failed, trying individual device requests:', combinedErr);
    }

    // Step B: If combined call didn't get video, acquire video separately
    if (!videoAcquired) {
      await requestCameraAccess();
    }

    // Step C: If combined call didn't get audio, acquire mic separately
    if (!audioAcquired) {
      await requestMicAccess();
    }
  }, [stopAllMedia, startAudioMeter, requestCameraAccess, requestMicAccess]);

  // Handler for Retry Diagnostic button (triggered by direct user gesture)
  const handleRetryDiagnostic = useCallback(async () => {
    setIsRetrying(true);
    try {
      await runDiagnostic();
    } finally {
      setIsRetrying(false);
    }
  }, [runDiagnostic]);

  // Check browser Permissions API on load to detect pre-blocked state
  useEffect(() => {
    if (!isOpen) return;

    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'camera' }).then(res => {
        if (res.state === 'denied') setShowPermissionGuide(true);
      }).catch(() => {});

      navigator.permissions.query({ name: 'microphone' }).then(res => {
        if (res.state === 'denied') setShowPermissionGuide(true);
      }).catch(() => {});
    }

    runDiagnostic();

    return () => {
      stopAllMedia();
    };
  }, [isOpen, runDiagnostic, stopAllMedia]);

  if (!isOpen) return null;

  const handleConfirmStart = () => {
    // Attempt fullscreen lock
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch {}

    stopAllMedia();
    onStartExam();
  };

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(5, 8, 22, 0.85)', backdropFilter: 'blur(20px)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          width: '100%',
          maxWidth: '580px',
          borderRadius: '24px',
          backgroundColor: 'var(--card-bg, #0b0f19)',
          border: '1.5px solid rgba(168, 85, 247, 0.4)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(168, 85, 247, 0.2)',
          padding: '28px',
          color: 'var(--text-primary)',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)', border: '1px solid rgba(168, 85, 247, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={22} color="#c084fc" />
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#c084fc', display: 'block' }}>
                AI PROCTORING PROTOCOL
              </span>
              <h3 style={{ fontSize: '19px', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>
                System Hardware Diagnostic
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
          This assessment for <strong>"{topicTitle || 'Selected Topic'}"</strong> requires mandatory live proctoring. Verify your camera and microphone status below.
        </p>

        {/* Hardware Checks Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          {/* Camera Box */}
          <div style={{ borderRadius: '16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '100%', height: '110px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000', marginBottom: '10px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <video ref={videoPreviewRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {camStatus !== 'ready' && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.85)', padding: '10px', gap: '8px' }}>
                  <Camera size={24} color={camStatus === 'checking' ? '#f59e0b' : '#ef4444'} />
                  {camStatus === 'denied' && (
                    <button
                      onClick={requestCameraAccess}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: '0 2px 10px rgba(168, 85, 247, 0.4)'
                      }}
                    >
                      Allow Camera
                    </button>
                  )}
                  {camStatus === 'checking' && (
                    <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 700 }}>Requesting Camera…</span>
                  )}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: camStatus === 'ready' ? '#10b981' : camStatus === 'checking' ? '#f59e0b' : '#ef4444' }}>
                {camStatus === 'ready' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                <span>{camStatus === 'ready' ? 'Camera Active' : camStatus === 'checking' ? 'Checking Cam...' : 'Camera Access Blocked'}</span>
              </div>
              {camError && (
                <span style={{ fontSize: '10.5px', color: '#fca5a5', lineHeight: 1.2, display: 'block' }}>
                  {camError}
                </span>
              )}
            </div>
          </div>

          {/* Microphone Box */}
          <div style={{ borderRadius: '16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mic size={18} color="#06b6d4" />
                  <span style={{ fontSize: '13px', fontWeight: 800 }}>Microphone Test</span>
                </div>
              </div>
              <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: '0 0 10px 0' }}>
                Speak to test audio responsiveness:
              </p>

              {/* Audio Decibel Bar */}
              <div style={{ width: '100%', height: '12px', borderRadius: '99px', backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden', position: 'relative', marginBottom: '12px' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${audioLevel}%`,
                    background: audioLevel > 60 ? 'linear-gradient(90deg, #10b981, #ef4444)' : 'linear-gradient(90deg, #10b981, #f59e0b)',
                    borderRadius: '99px',
                    transition: 'width 0.1s ease'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: micStatus === 'ready' ? '#10b981' : micStatus === 'checking' ? '#f59e0b' : '#ef4444' }}>
                  {micStatus === 'ready' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                  <span>{micStatus === 'ready' ? 'Audio Stream Live' : micStatus === 'checking' ? 'Checking Mic...' : 'Mic Access Blocked'}</span>
                </div>
                {micStatus === 'denied' && (
                  <button
                    onClick={requestMicAccess}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(6, 182, 212, 0.4)'
                    }}
                  >
                    Allow Mic
                  </button>
                )}
                {micStatus === 'checking' && (
                  <span style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 700 }}>Requesting…</span>
                )}
              </div>
              {micError && (
                <span style={{ fontSize: '10.5px', color: '#fca5a5', lineHeight: 1.2, display: 'block' }}>
                  {micError}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Security Rules Checklist */}
        <div style={{ borderRadius: '16px', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(245, 158, 11, 0.05) 100%)', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '14px', marginBottom: '16px' }}>
          <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#f87171', display: 'block', marginBottom: '8px' }}>
            RULES & ANTI-CHEATING COMMITMENT
          </span>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '6px', fontWeight: 600 }}>
            <li>Camera and Microphone access are <strong>strictly mandatory</strong> for the entire exam.</li>
            <li>No tab switching, window minimizing, or secondary monitor usage allowed.</li>
            <li>4 security warnings will result in instant automated exam submission.</li>
            <li>Fullscreen mode will be locked for the entire assessment duration.</li>
          </ul>
        </div>

        {/* Media Denied Warning & Retry Banner */}
        {(camStatus !== 'ready' || micStatus !== 'ready') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '14px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#fca5a5' }}>
                  Camera & Microphone permissions are mandatory to start this assessment.
                </span>
              </div>
              <button
                disabled={isRetrying}
                onClick={handleRetryDiagnostic}
                style={{
                  padding: '7px 16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(239, 68, 68, 0.6)',
                  background: isRetrying ? 'rgba(239, 68, 68, 0.5)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: '#ffffff',
                  fontSize: '11.5px',
                  fontWeight: 900,
                  cursor: isRetrying ? 'wait' : 'pointer',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 10px rgba(239, 68, 68, 0.3)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RefreshCw size={13} style={{ animation: isRetrying ? 'spin 1s linear infinite' : 'none' }} />
                <span>{isRetrying ? 'Re-checking…' : 'Retry Diagnostic'}</span>
              </button>
            </div>

            {/* Step-by-Step Browser Permission Unblock Guide */}
            <div style={{
              padding: '14px',
              borderRadius: '14px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              fontSize: '12px',
              color: '#cbd5e1',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={15} color="#c084fc" />
                <span style={{ fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '11px' }}>
                  How to unblock permissions in your browser:
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px', marginTop: '2px', fontSize: '11.5px', lineHeight: 1.4 }}>
                <span>🔒 <strong>Step 1:</strong> Click the <strong>Lock / Site Settings</strong> icon near the address bar at the top of your browser.</span>
                <span>🎥 <strong>Step 2:</strong> Change <strong>Camera</strong> and <strong>Microphone</strong> permissions to <strong>"Allow"</strong>.</span>
                <span>🔄 <strong>Step 3:</strong> Click the red <strong>"Retry Diagnostic"</strong> button above.</span>
              </div>
            </div>
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
        {(() => {
          const canStart = agreed && camStatus === 'ready' && micStatus === 'ready';
          return (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={onClose}
                style={{ flex: 1, padding: '12px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-primary)', fontWeight: 800, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                disabled={!canStart}
                onClick={handleConfirmStart}
                style={{
                  flex: 2,
                  padding: '12px 20px',
                  borderRadius: '14px',
                  border: 'none',
                  background: canStart
                    ? 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  color: canStart ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: canStart ? 'pointer' : 'not-allowed',
                  boxShadow: canStart ? '0 6px 20px rgba(168, 85, 247, 0.35)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <Play size={16} fill="currentColor" />
                <span>
                  {camStatus !== 'ready' || micStatus !== 'ready'
                    ? 'Cam & Mic Access Required'
                    : !agreed
                      ? 'Accept Rules to Begin'
                      : 'Enter Proctored Exam'}
                </span>
              </button>
            </div>
          );
        })()}
      </motion.div>
    </div>,
    document.body
  );
};
