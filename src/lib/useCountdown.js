import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Counts down to zero, used for the OTP resend lock.
 * Returns `[secondsLeft, restart]`; `secondsLeft === 0` means resend is allowed.
 */
export default function useCountdown(initialSeconds = 0) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const timerRef = useRef(null);

  const clear = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (seconds <= 0) {
      clear();
      return undefined;
    }
    timerRef.current = setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          clear();
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return clear;
    // Re-arming on every tick would double-fire; only (re)start when crossing 0.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds > 0]);

  const restart = useCallback((next = initialSeconds) => {
    clear();
    setSeconds(next);
  }, [initialSeconds]);

  useEffect(() => clear, []);

  return [seconds, restart];
}
