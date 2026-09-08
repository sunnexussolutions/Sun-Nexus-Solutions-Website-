import { useState, useEffect, useRef, useCallback } from 'react';
import { formatDurationMMSS } from '../utils/dateUtils';

/**
 * ── useAssessmentTimer ──────────────────────────────────────────────
 * Countdown timer hook with automatic submission trigger, pause/resume,
 * unmount cleanup, and warning threshold states.
 */
export const useAssessmentTimer = ({
  initialMinutes = 20,
  onTimeUp = null,
  autoStart = true
}) => {
  const initialSeconds = Math.max(1, (Number(initialMinutes) || 20) * 60);
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const onTimeUpRef = useRef(onTimeUp);
  const intervalRef = useRef(null);
  const hasTriggeredTimeUp = useRef(false);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          if (!hasTriggeredTimeUp.current && onTimeUpRef.current) {
            hasTriggeredTimeUp.current = true;
            onTimeUpRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const pause = useCallback(() => setIsRunning(false), []);
  const resume = useCallback(() => {
    if (timeLeft > 0) setIsRunning(true);
  }, [timeLeft]);

  const reset = useCallback((newMinutes = initialMinutes) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const secs = (Number(newMinutes) || 20) * 60;
    setTimeLeft(secs);
    hasTriggeredTimeUp.current = false;
    setIsRunning(true);
  }, [initialMinutes]);

  const isWarning = timeLeft <= 300 && timeLeft > 60; // 5 mins left
  const isCritical = timeLeft <= 60 && timeLeft > 0;  // 1 min left

  return {
    timeLeft,
    formattedTime: formatDurationMMSS(timeLeft),
    isRunning,
    isWarning,
    isCritical,
    pause,
    resume,
    reset
  };
};
