import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for managing proctored exam security:
 * - Webcam live video stream
 * - Microphone decibel audio analyzer
 * - Tab switch & window blur detection (max 4 warnings before auto-submit)
 * - Fullscreen mode enforcement
 * - Violation cooldown guard to prevent double-counting simultaneous events
 */
export const useProctoring = ({ isExamActive, onAutoSubmit }) => {
  const [warningCount, setWarningCount] = useState(0);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [lastViolationReason, setLastViolationReason] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [hasCamera, setHasCamera] = useState(false);
  const [hasMic, setHasMic] = useState(false);
  const [stream, setStream] = useState(null);
  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false); // true when final submit is firing

  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const countdownTimerRef = useRef(null);
  // Cooldown ref: timestamp of last violation — prevents double-counting
  // when window.blur + visibilitychange both fire for the same tab switch
  const lastViolationTimeRef = useRef(0);
  const VIOLATION_COOLDOWN_MS = 2000; // minimum ms between violations

  // Stable ref for onAutoSubmit to avoid stale closures
  const onAutoSubmitRef = useRef(onAutoSubmit);
  useEffect(() => {
    onAutoSubmitRef.current = onAutoSubmit;
  }, [onAutoSubmit]);

  // Stable ref for warningCount to read latest value inside event handlers
  const warningCountRef = useRef(0);
  useEffect(() => {
    warningCountRef.current = warningCount;
  }, [warningCount]);

  // Initialize Camera & Microphone WebRTC streams
  const initMedia = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 320 }, height: { ideal: 240 }, facingMode: 'user' },
        audio: true
      });

      setStream(mediaStream);
      setHasCamera(true);
      setHasMic(true);

      // Attach stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Initialize Web Audio API Decibel Meter
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(mediaStream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateAudioLevel = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const average = sum / dataArray.length;
            const level = Math.min(100, Math.round((average / 128) * 100));
            setAudioLevel(level);
            animFrameRef.current = requestAnimationFrame(updateAudioLevel);
          };
          updateAudioLevel();
        }
      } catch (audioErr) {
        console.warn('Audio Context setup warning:', audioErr);
      }
    } catch (err) {
      console.warn('Media devices access denied or unavailable:', err.message);
      setHasCamera(false);
      setHasMic(false);
    }
  }, []);

  // Cleanup WebRTC & Audio Context on unmount or exam end
  const stopMedia = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Immediately fire auto-submit on 4th violation
  const startImmediateAutoSubmit = useCallback(() => {
    if (countdownTimerRef.current) return; // already running
    setIsAutoSubmitting(true);
    // Small delay so the UI can flash the "Submitting..." state before unmounting
    countdownTimerRef.current = setTimeout(() => {
      countdownTimerRef.current = null;
      if (onAutoSubmitRef.current) {
        onAutoSubmitRef.current();
      }
    }, 800);
  }, []);

  // Handle a detected security violation — uses ref to read latest warningCount
  const triggerViolation = useCallback((reason) => {
    if (!isExamActive) return;

    // Prevent stacking violations during an active countdown
    if (countdownTimerRef.current) return;

    // Cooldown guard: ignore if another violation fired within VIOLATION_COOLDOWN_MS
    const now = Date.now();
    if (now - lastViolationTimeRef.current < VIOLATION_COOLDOWN_MS) return;
    lastViolationTimeRef.current = now;

    setWarningCount(prev => {
      const nextCount = prev + 1;
      warningCountRef.current = nextCount;
      setLastViolationReason(reason);
      setIsWarningModalOpen(true);

      if (nextCount >= 4) {
        // Submit immediately on 4th violation
        startImmediateAutoSubmit();
      }

      return nextCount;
    });
  }, [isExamActive, startImmediateAutoSubmit]);

  // Tab switch & window blur security event listeners
  useEffect(() => {
    if (!isExamActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation('Tab switch or window minimization detected!');
      }
    };

    const handleWindowBlur = () => {
      triggerViolation('Focus loss detected! Do not click outside the exam window.');
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        triggerViolation('Full-screen mode exited!');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, [isExamActive, triggerViolation]);

  // Start media when exam starts; stop on cleanup
  useEffect(() => {
    if (isExamActive) {
      initMedia();
    } else {
      stopMedia();
      // Clear any active submit timer if exam ends externally
      if (countdownTimerRef.current) {
        clearTimeout(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
      setIsAutoSubmitting(false);
    }
    return () => {
      stopMedia();
      if (countdownTimerRef.current) {
        clearTimeout(countdownTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExamActive]);

  // Only allow dismissing warnings 1, 2 & 3 — not the final violation
  const dismissWarning = useCallback(() => {
    if (warningCountRef.current < 4) {
      setIsWarningModalOpen(false);
    }
    // On 4th violation, modal stays open until countdown fires
  }, []);

  return {
    warningCount,
    isWarningModalOpen,
    lastViolationReason,
    isAutoSubmitting,
    dismissWarning,
    audioLevel,
    hasCamera,
    hasMic,
    videoRef,
  };
};
