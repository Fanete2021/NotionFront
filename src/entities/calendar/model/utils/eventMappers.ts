import type { CalendarEvent } from '../types/calendar.types';
import type { BadgeTask } from '../types/badge-task';
import type { DayTask } from '../types/day-task';

const toDateKey = (iso: string) => {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const PALETTE: BadgeTask['color'][] = ['indigo', 'green', 'yellow', 'red'];

export const eventToBadgeTask = (e: CalendarEvent, index = 0, projectName?: string): BadgeTask => ({
  id: e.id,
  date: toDateKey(e.startAt),
  name: e.title,
  color: PALETTE[index % PALETTE.length],
  projectName,
});

export const eventToDayTask = (e: CalendarEvent, projectName = 'Без проекта'): DayTask => {
  const start = new Date(e.startAt);
  const end = new Date(e.endAt);
  const fmt = (d: Date) =>
    `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

  return {
    id: e.id,
    label: e.title,
    time: `${fmt(start)} – ${fmt(end)}`,
    projectName,
    isCompleted: false,
    viewed: false,
  };
};
