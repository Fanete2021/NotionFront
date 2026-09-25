'use client';
import { CalendarProvider } from '@widgets/calendar/model/calendar-provider/CalendarProvider';
import { CalendarContent } from '../calendar-content/CalendarContent';

export const Calendar = () => {
  return (
    <CalendarProvider>
      <CalendarContent />
    </CalendarProvider>
  );
};
