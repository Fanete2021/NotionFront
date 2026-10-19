import { useEffect, useState } from 'react';

export const useRelativeTimeTick = (intervalMs = 30_000): number => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((prev) => prev + 1);
    }, intervalMs);

    return () => clearInterval(id);
  }, [intervalMs]);

  return tick;
};
