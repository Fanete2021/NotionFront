import type { CalendarCellData } from '@entities/calendar';

const DAYS_IN_WEEK = 7;

const getDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

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
  const todayKey = getDateKey(today);

  return Array.from({ length: cellCount }, (_, index) => {
    // Конструктор Date сам учитывает границы месяцев, годов и переходы на летнее время.
    const date = new Date(year, month, index - firstWeekday + 1);
    const dateKey = getDateKey(date);
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
