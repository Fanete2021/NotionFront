import { useContext } from 'react';
import { CalendarContext } from '@widgets/calendar/context/calendar-context/calendarContext';

export const useCalendar = () => {
  const context = useContext(CalendarContext);

  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }

  return context;
};
