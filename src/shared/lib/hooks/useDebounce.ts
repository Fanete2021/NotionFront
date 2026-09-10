import { useCallback, useEffect, useRef } from 'react';

/**
 * Откладывает вызов колбэка до паузы в delay мс — каждый новый вызов сбрасывает таймер.
 * Таймер хранится в ref, поэтому переживает перерисовки и чистится при размонтировании.
 */
export function useDebounce<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return useCallback(
    (...args: Args) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay],
  );
}
