import { CalendarViewHeader } from './calendar-view-header/CalendarViewHeader';
import { WeekDays } from './week-days/WeekDays';
import styles from './CalendarView.module.css';
import { MonthGrid } from './month-grid/MonthGrid';
import { useCalendar } from '../../context/calendar-context/useCalendar';

export const CalendarView = () => {
  const { month } = useCalendar();

  return (
    <div className={styles.calendarView}>
      <CalendarViewHeader month={month} />
      <WeekDays />
      <MonthGrid month={month} />
    </div>
  );
};
