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

  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);

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

  // Universal WebRTC getUserMedia helper
  const safeGetUserMedia = async (constraints) => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      return await navigator.mediaDevices.getUserMedia(constraints);
    }

    const legacyGetUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    if (legacyGetUserMedia) {
      return new Promise((resolve, reject) => {
        legacyGetUserMedia.call(navigator, constraints, resolve, reject);
      });
    }

    throw new Error('WebRTC mediaDevices is not supported in this environment.');
  };

  // Stop & package video/audio recording into a Data URL
  const stopAndGetRecording = useCallback(() => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        resolve(null);
        return;
      }

      recorder.onstop = () => {
        try {
          const blob = new Blob(recordedChunksRef.current, {
            type: recorder.mimeType || 'video/webm'
          });
          if (!blob || blob.size === 0) {
            resolve(null);
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(blob);
        } catch (err) {
          console.error('Error generating proctor recording Data URL:', err);
          resolve(null);
        }
      };

      try {
        recorder.stop();
        setIsRecording(false);
      } catch (err) {
        console.warn('Error stopping MediaRecorder:', err);
        resolve(null);
      }
    });
  }, []);

  // Initialize Camera & Microphone WebRTC streams and MediaRecorder
  const initMedia = useCallback(async () => {
    let combinedStream = null;
    let videoTrack = null;
    let audioTrack = null;

    try {
      combinedStream = await safeGetUserMedia({
        video: { width: { ideal: 320 }, height: { ideal: 240 }, facingMode: 'user' },
        audio: true
      });
      setHasCamera(true);
      setHasMic(true);
    } catch (err) {
      console.warn('Combined media request failed, attempting separate requests:', err.message);

      // Attempt Video separately
      try {
        const vStream = await safeGetUserMedia({
          video: { width: { ideal: 320 }, height: { ideal: 240 }, facingMode: 'user' }
        });
        videoTrack = vStream.getVideoTracks()[0];
        setHasCamera(true);
      } catch (vErr) {
        console.warn('Camera access denied:', vErr.message);
        setHasCamera(false);
      }

      // Attempt Audio separately
      try {
        const aStream = await safeGetUserMedia({ audio: true });
        audioTrack = aStream.getAudioTracks()[0];
        setHasMic(true);
      } catch (aErr) {
        console.warn('Microphone access denied:', aErr.message);
        setHasMic(false);
      }

      if (videoTrack || audioTrack) {
        combinedStream = new MediaStream();
        if (videoTrack) combinedStream.addTrack(videoTrack);
        if (audioTrack) combinedStream.addTrack(audioTrack);
      }
    }

    if (combinedStream) {
      setStream(combinedStream);

      // Attach stream to video element and trigger play
      if (videoRef.current) {
        videoRef.current.srcObject = combinedStream;
        videoRef.current.play().catch(e => console.warn('Video element play error:', e));
      }

      // Start MediaRecorder for live proctoring audio & video session
      if (typeof MediaRecorder !== 'undefined') {
        try {
          let mimeType = 'video/webm;codecs=vp8,opus';
          if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm';
          if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/mp4';
          if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = '';

          const opts = mimeType ? { mimeType, videoBitsPerSecond: 300000 } : {};
          const recorder = new MediaRecorder(combinedStream, opts);
          recordedChunksRef.current = [];

          recorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
              recordedChunksRef.current.push(event.data);
            }
          };

          recorder.start(1000);
          mediaRecorderRef.current = recorder;
          setIsRecording(true);
          console.log('📹 Live proctoring MediaRecorder started successfully.');
        } catch (recErr) {
          console.warn('MediaRecorder failed to initialize:', recErr);
        }
      }

      // Initialize Web Audio API Decibel Meter if audio is active
      if (combinedStream.getAudioTracks().length > 0) {
        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) {
            const audioCtx = new AudioCtx();
            audioContextRef.current = audioCtx;
            const source = audioCtx.createMediaStreamSource(combinedStream);
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
      }
    }
  }, []);

  // Cleanup WebRTC & Audio Context & MediaRecorder on unmount or exam end
  const stopMedia = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch {}
      mediaRecorderRef.current = null;
    }
    setIsRecording(false);
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

  const attachVideoRef = useCallback((node) => {
    videoRef.current = node;
    if (node && stream) {
      if (node.srcObject !== stream) {
        node.srcObject = stream;
      }
      node.play().catch(e => console.warn('Video element play error on mount:', e));
    }
  }, [stream]);

  // Reactive stream attachment whenever stream or hasCamera changes
  useEffect(() => {
    if (stream && videoRef.current) {
      if (videoRef.current.srcObject !== stream) {
        videoRef.current.srcObject = stream;
      }
      videoRef.current.play().catch(e => console.warn('Video element play error on update:', e));
    }
  }, [stream, hasCamera]);

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
    attachVideoRef,
    stream,
    retryMedia: initMedia,
    isRecording,
    stopAndGetRecording,
  };
};
