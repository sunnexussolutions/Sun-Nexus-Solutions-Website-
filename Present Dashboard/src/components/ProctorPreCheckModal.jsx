import React, { useState, useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const runDiagnostic = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode: 'user' },
          audio: true
        });

        if (!isMounted) return;

        streamRef.current = stream;
        setCamStatus('ready');
        setMicStatus('ready');

        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = stream;
        }

        // Web Audio decibel meter for pre-check
        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) {
            const audioCtx = new AudioCtx();
            const source = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 64;
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const checkVolume = () => {
              if (!isMounted) return;
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
      } catch (err) {
        if (!isMounted) return;
        console.warn("Diagnostic error:", err);
        setCamStatus('denied');
        setMicStatus('denied');
      }
    };

    runDiagnostic();

    return () => {
      isMounted = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen]);

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
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
                  <Camera size={24} color="#a855f7" />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: camStatus === 'ready' ? '#10b981' : '#f59e0b' }}>
              {camStatus === 'ready' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
              <span>{camStatus === 'ready' ? 'Camera Active' : 'Camera Access Required'}</span>
            </div>
          </div>

          {/* Microphone Box */}
          <div style={{ borderRadius: '16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Mic size={18} color="#06b6d4" />
              <span style={{ fontSize: '13px', fontWeight: 800 }}>Microphone Test</span>
            </div>
            <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: '0 0 12px 0' }}>
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: micStatus === 'ready' ? '#10b981' : '#f59e0b' }}>
              {micStatus === 'ready' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
              <span>{micStatus === 'ready' ? 'Audio Stream Live' : 'Mic Check Pending'}</span>
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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            gap: '12px',
            padding: '12px 14px',
            borderRadius: '14px',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#fca5a5' }}>
                Camera & Microphone permissions are mandatory to take this test.
              </span>
            </div>
            <button
              onClick={runDiagnostic}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                background: '#ef4444',
                color: '#ffffff',
                fontSize: '11.5px',
                fontWeight: 800,
                cursor: 'pointer',
                flexShrink: 0,
                whiteSpace: 'nowrap'
              }}
            >
              Retry Diagnostic
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
