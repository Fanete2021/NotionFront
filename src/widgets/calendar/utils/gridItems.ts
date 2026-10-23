import type { CalendarCellData } from '@entities/calendar';
import { toDateKey } from '@/shared/lib/date/toDateKey';

const DAYS_IN_WEEK = 7;

export const getMonthGridItems = (
  monthDate: Date = new Date(),
  today: Date = new Date(),
): CalendarCellData[] => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  // WeekDays отображает неделю с воскресенья, как и Date.getDay().
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cellCount = Math.ceil((firstWeekday + daysInMonth) / DAYS_IN_WEEK) * DAYS_IN_WEEK;
  const todayKey = toDateKey(today);

  return Array.from({ length: cellCount }, (_, index) => {
    // Конструктор Date сам учитывает границы месяцев, годов и переходы на летнее время.
    const date = new Date(year, month, index - firstWeekday + 1);
    const dateKey = toDateKey(date);
    const weekday = date.getDay();

    return {
      date: dateKey,
      day: date.getDate(),
      isCurrentMonth: date.getFullYear() === year && date.getMonth() === month,
      isToday: dateKey === todayKey,
      isWeekend: weekday === 0 || weekday === 6,
    };
  });
};
