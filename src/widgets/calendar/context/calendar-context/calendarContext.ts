'use client';

import { createContext } from 'react';

export interface CalendarContextProps {
  month: Date;
  changeMonth: (offset: number) => void;
  goToToday: () => void;
  selectedDate: string | null;
  selectDate: (date: string | null) => void;
  closeDayPanel: () => void;
}

export const CalendarContext = createContext<CalendarContextProps | null>(null);
