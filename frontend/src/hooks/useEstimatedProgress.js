import { useState, useRef, useCallback } from "react";

// Estimates progress based on expected total time, caps at 95% until stopped
export function useEstimatedProgress() {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  const start = useCallback((estimatedSeconds) => {
    setProgress(0);
    const totalTicks = estimatedSeconds * 10; // update every 100ms
    let tick = 0;

    intervalRef.current = setInterval(() => {
      tick += 1;
      const pct = Math.min(95, Math.round((tick / totalTicks) * 100));
      setProgress(pct);
    }, 100);
  }, []);

  const finish = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(100);
    setTimeout(() => setProgress(0), 500);
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(0);
  }, []);

  return { progress, start, finish, stop };
}