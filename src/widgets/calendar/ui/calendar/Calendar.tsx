'use client';
import { CalendarProvider } from '../../providers/calendar-provider/CalendarProvider';
import { CalendarContent } from '../calendar-content/CalendarContent';

export const Calendar = () => {
  return (
    <CalendarProvider>
      <CalendarContent />
    </CalendarProvider>
  );
};
