import { DisplayFormat } from '../types/calendar-display-format';

export interface CalendarSwitcherItems {
  id: DisplayFormat;
  format: string;
}

export const calendarSwitcherItems: CalendarSwitcherItems[] = [
  {
    id: 'month',
    format: 'Месяц',
  },
  {
    id: 'week',
    format: 'Неделя',
  },
  {
    id: 'day',
    format: 'День',
  },
];
