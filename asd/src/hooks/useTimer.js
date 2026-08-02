import { useCallback, useEffect, useRef, useState } from 'react';

const formatTime = (totalSeconds) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Countdown timer hook for timed activities.
 *
 * @param {object} options
 * @param {number|null} options.duration - Total seconds, or null for untimed.
 * @param {() => void} [options.onTimeUp] - Called once when the timer reaches zero.
 * @param {boolean} [options.autoStart=true] - Whether the countdown begins immediately.
 * @returns {object} { timeLeft, isRunning, formattedTime, start, pause, reset }
 */
export const useTimer = ({ duration, onTimeUp, autoStart = true }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const onTimeUpRef = useRef(onTimeUp);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isRunning || timeLeft === null || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev === null ? prev : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      onTimeUpRef.current?.();
    }
  }, [timeLeft, isRunning]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setTimeLeft(duration);
    setIsRunning(autoStart);
  }, [duration, autoStart]);

  return {
    timeLeft,
    isRunning,
    formattedTime: timeLeft === null ? null : formatTime(timeLeft),
    start,
    pause,
    reset,
  };
};
