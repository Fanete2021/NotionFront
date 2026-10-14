import { ReactNode, useEffect, useState } from 'react';
import { CalendarContext } from '@widgets/calendar/model/calendar-context/calendarContext';
import { calendarFiltersReducer, dayPanelFiltersReducer } from '@/features/create-calendar-event';
import { useAppStore } from '@/shared/lib';

interface CalendarProviderProps {
  children: ReactNode;
}

export const CalendarProvider = ({ children }: CalendarProviderProps) => {
  const store = useAppStore();
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

  useEffect(() => {
    store.injectReducer('calendarFilters', calendarFiltersReducer);
    store.injectReducer('dayPanelFilters', dayPanelFiltersReducer);
  }, [store]);

  return (
    <CalendarContext.Provider
      value={{
        month,
        changeMonth,
        goToToday,
        closeDayPanel,
        selectDate,
        selectedDate,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
