import { toDateKey } from '@/shared/lib/date/toDateKey';

export { toDateKey };

export const pad = (n: number) => String(n).padStart(2, '0');

export const toTimeKey = (iso: string) => {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const toIsoRange = (date: Date, startTime: string, endTime: string) => {
  const dateKey = toDateKey(date);
  return {
    startAt: new Date(`${dateKey}T${startTime}:00`).toISOString(),
    endAt: new Date(`${dateKey}T${endTime}:00`).toISOString(),
  };
};
