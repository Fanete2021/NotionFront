import styles from './MonthGrid.module.css';
import { getMonthGridItems } from '../../../utils/gridItems';
import { CalendarCell } from '../../calendar-cell/CalendarCell';
import { badgeTasks } from '@widgets/calendar/model/mock-data/badgeTasks';

interface MonthGridProps {
  month?: Date;
}

export const MonthGrid = ({ month }: MonthGridProps) => {
  const gridItems = getMonthGridItems(month);
  return (
    <div className={styles.monthGrid}>
      {gridItems.map((cell) => {
        const dayTasks = badgeTasks.filter((task) => task.date === cell.date) || [];

        return <CalendarCell key={cell.date} cell={cell} tasks={dayTasks} />;
      })}
    </div>
  );
};
