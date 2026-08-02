import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Shield, Camera, Mic, CheckCircle, AlertTriangle, Lock, ArrowRight, X, Play } from 'lucide-react';

export const ProctorPreCheckModal = ({ isOpen, onClose, onStartExam, topicTitle }) => {
  const [camStatus, setCamStatus] = useState('checking'); // 'checking' | 'ready' | 'denied'
  const [micStatus, setMicStatus] = useState('checking'); // 'checking' | 'ready' | 'denied'
  const [audioLevel, setAudioLevel] = useState(0);
  const [agreed, setAgreed] = useState(false);

  const videoPreviewRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);

  const [showPermissionGuide, setShowPermissionGuide] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const runDiagnostic = useCallback(async () => {
    setCamStatus('checking');
    setMicStatus('checking');

    // Clean up previous stream if any
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }

    let videoTrack = null;
    let audioTrack = null;

    // 1. Request Camera Stream (standard constraints to prevent OverconstrainedError)
    try {
      const vStream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoTrack = vStream.getVideoTracks()[0];
      setCamStatus('ready');
    } catch (vErr) {
      console.warn("Camera diagnostic error:", vErr);
      setCamStatus('denied');
    }

    // 2. Request Microphone Stream
    try {
      const aStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioTrack = aStream.getAudioTracks()[0];
      setMicStatus('ready');
    } catch (aErr) {
      console.warn("Microphone diagnostic error:", aErr);
      setMicStatus('denied');
    }

    // Combine active tracks into preview stream
    if (videoTrack || audioTrack) {
      const combinedStream = new MediaStream();
      if (videoTrack) combinedStream.addTrack(videoTrack);
      if (audioTrack) combinedStream.addTrack(audioTrack);

      streamRef.current = combinedStream;

      if (videoPreviewRef.current && videoTrack) {
        videoPreviewRef.current.srcObject = combinedStream;
      }

      // Web Audio decibel meter for pre-check
      if (audioTrack) {
        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) {
            const audioCtx = new AudioCtx();
            const source = audioCtx.createMediaStreamSource(combinedStream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 64;
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const checkVolume = () => {
              if (!analyser) return;
              analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
              const avg = sum / dataArray.length;
              setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
              animFrameRef.current = requestAnimationFrame(checkVolume);
            };
            checkVolume();
          }
        } catch (e) {
          console.warn("Audio meter setup issue:", e);
        }
      }
    }
  }, []);

  // Helper: wire an audio-only MediaStream into the decibel analyser
  const startAudioMeter = useCallback((audioOnlyStream) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const source = audioCtx.createMediaStreamSource(audioOnlyStream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        setAudioLevel(Math.min(100, Math.round((sum / dataArray.length / 128) * 100)));
        animFrameRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (e) {
      console.warn('Audio meter error:', e);
    }
  }, []);

  // Request camera individually (stops existing video tracks first to avoid addTrack duplicates)
  const requestCameraAccess = useCallback(async () => {
    setCamStatus('checking');
    try {
      // Stop any existing video tracks
      if (streamRef.current) {
        streamRef.current.getVideoTracks().forEach(t => t.stop());
        streamRef.current.getVideoTracks().forEach(t => streamRef.current.removeTrack(t));
      }

      const vStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      const videoTrack = vStream.getVideoTracks()[0];

      if (!videoTrack) throw new Error('No video track returned');

      if (!streamRef.current) streamRef.current = new MediaStream();
      streamRef.current.addTrack(videoTrack);

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = streamRef.current;
      }

      setCamStatus('ready');
    } catch (err) {
      console.warn('Camera request error:', err);
      setCamStatus('denied');
    }
  }, []);

  // Request microphone individually
  const requestMicAccess = useCallback(async () => {
    setMicStatus('checking');
    try {
      // Stop any existing audio tracks
      if (streamRef.current) {
        streamRef.current.getAudioTracks().forEach(t => t.stop());
        streamRef.current.getAudioTracks().forEach(t => streamRef.current.removeTrack(t));
      }

      const aStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const audioTrack = aStream.getAudioTracks()[0];

      if (!audioTrack) throw new Error('No audio track returned');

      if (!streamRef.current) streamRef.current = new MediaStream();
      streamRef.current.addTrack(audioTrack);

      // Wire analyser from the raw audio-only stream (not combined)
      startAudioMeter(aStream);

      setMicStatus('ready');
    } catch (err) {
      console.warn('Microphone request error:', err);
      setMicStatus('denied');
    }
  }, [startAudioMeter]);

  // Retry Diagnostic: requests BOTH in ONE getUserMedia call so browser gesture stays valid
  const handleRetryDiagnostic = useCallback(async () => {
    setIsRetrying(true);

    // Stop all existing tracks
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }

    setCamStatus('checking');
    setMicStatus('checking');

    let videoTrack = null;
    let audioTrackStream = null;

    // Request camera
    try {
      const vs = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      videoTrack = vs.getVideoTracks()[0] || null;
      setCamStatus(videoTrack ? 'ready' : 'denied');
    } catch {
      setCamStatus('denied');
    }

    // Request mic separately (still in same click, sequential awaits are fine)
    try {
      const as = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const audioTrack = as.getAudioTracks()[0] || null;
      if (audioTrack) {
        audioTrackStream = as;
        setMicStatus('ready');
        startAudioMeter(as);
      } else {
        setMicStatus('denied');
      }
    } catch {
      setMicStatus('denied');
    }

    // Combine into preview stream
    const combined = new MediaStream();
    if (videoTrack) combined.addTrack(videoTrack);
    if (audioTrackStream) audioTrackStream.getAudioTracks().forEach(t => combined.addTrack(t));
    streamRef.current = combined;

    if (videoPreviewRef.current && videoTrack) {
      videoPreviewRef.current.srcObject = combined;
    }

    setIsRetrying(false);
  }, [startAudioMeter]);

  useEffect(() => {
    if (!isOpen) return;

    runDiagnostic();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen, runDiagnostic]);

  if (!isOpen) return null;

  const handleConfirmStart = () => {
    // Attempt fullscreen lock
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch {}

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }

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
          maxWidth: '560px',
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
          This assessment for <strong>"{topicTitle || 'Selected Topic'}"</strong> is protected by automated AI proctoring security. Please verify your camera and microphone status below.
        </p>

        {/* Hardware Checks Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          {/* Camera Box */}
          <div style={{ borderRadius: '16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '100%', height: '110px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000', marginBottom: '10px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <video ref={videoPreviewRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {camStatus !== 'ready' && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.75)', padding: '8px', gap: '8px' }}>
                  <Camera size={24} color={camStatus === 'checking' ? '#f59e0b' : '#a855f7'} />
                  {camStatus === 'denied' && (
                    <button
                      onClick={requestCameraAccess}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(168, 85, 247, 0.4)'
                      }}
                    >
                      Allow Camera
                    </button>
                  )}
                  {camStatus === 'checking' && (
                    <span style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 700 }}>Requesting access…</span>
                  )}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: camStatus === 'ready' ? '#10b981' : '#f59e0b' }}>
              {camStatus === 'ready' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
              <span>{camStatus === 'ready' ? 'Camera Active' : camStatus === 'checking' ? 'Checking Cam...' : 'Camera Denied'}</span>
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

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: micStatus === 'ready' ? '#10b981' : '#f59e0b' }}>
                {micStatus === 'ready' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                <span>{micStatus === 'ready' ? 'Audio Stream Live' : micStatus === 'checking' ? 'Checking Mic...' : 'Mic Denied'}</span>
              </div>
              {micStatus === 'denied' && (
                <button
                  onClick={requestMicAccess}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                    color: '#ffffff',
                    fontSize: '10.5px',
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
                  Camera & Microphone permissions are mandatory to take this test.
                </span>
              </div>
              <button
                disabled={isRetrying}
                onClick={handleRetryDiagnostic}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(239, 68, 68, 0.6)',
                  background: isRetrying ? 'rgba(239, 68, 68, 0.5)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: '#ffffff',
                  fontSize: '11.5px',
                  fontWeight: 900,
                  cursor: isRetrying ? 'wait' : 'pointer',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 10px rgba(239, 68, 68, 0.3)',
                  transition: 'all 0.2s ease'
                }}
              >
                {isRetrying ? 'Prompting Permissions...' : 'Retry Diagnostic'}
              </button>
            </div>

            {/* Step-by-Step Browser Permission Unblock Guide */}
            <div style={{
              padding: '12px 14px',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(168, 85, 247, 0.25)',
              fontSize: '11.5px',
              color: '#cbd5e1',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <span style={{ fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '10px' }}>
                💡 If permissions are blocked in your browser:
              </span>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '2px' }}>
                <span>🔒 <strong>1. Click Padlock / Settings</strong> icon near address bar at top</span>
                <span>🎥 <strong>2. Set Camera & Mic</strong> to "Allow"</span>
                <span>🔄 <strong>3. Click "Retry Diagnostic"</strong></span>
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
