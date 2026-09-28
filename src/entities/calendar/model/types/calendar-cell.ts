export interface CalendarCell {
  /** Календарная дата в формате YYYY-MM-DD, без преобразования в UTC. */
  date: string;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
}
