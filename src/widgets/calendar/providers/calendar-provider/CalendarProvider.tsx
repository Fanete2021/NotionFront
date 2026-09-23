import { ReactNode, useState } from 'react';
import { CalendarContext } from '@widgets/calendar/context/calendar-context/calendarContext';

interface CalendarProviderProps {
  children: ReactNode;
}

export const CalendarProvider = ({ children }: CalendarProviderProps) => {
  const [month, setMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const changeMonth = (offset: number) => {
    setMonth((previous) => new Date(previous.getFullYear(), previous.getMonth() + offset, 1));
  };

  const goToToday = () => {
    setMonth(new Date());
  };

  const closeDayPanel = () => {
    setSelectedDate(null);
  };

  const selectDate = (date: string | null) => {
    setSelectedDate(date);
  };

  return (
    <CalendarContext.Provider
      value={{ month, changeMonth, goToToday, closeDayPanel, selectDate, selectedDate }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
