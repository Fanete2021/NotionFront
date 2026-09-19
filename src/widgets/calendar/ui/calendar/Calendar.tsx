import { CalendarHeader } from '../calendar-header/CalendarHeader';
import styles from './Calendar.module.css';

export const Calendar = () => {
  return (
    <div className={styles.calendar}>
      <CalendarHeader />
    </div>
  );
};
