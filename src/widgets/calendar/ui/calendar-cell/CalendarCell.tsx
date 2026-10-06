import styles from './CalendarCell.module.css';
import { useCalendar } from '@widgets/calendar/model/calendar-context/useCalendar';
import { TaskBadge } from '@widgets/calendar/ui/calendar-cell/task-badge/TaskBadge';
import type { BadgeTask, CalendarCellData } from '@entities/calendar';
import { Button } from '@shared/ui/Button';
import { Typography } from '@shared/ui/Typography';

interface CalendarCellProps {
  cell: CalendarCellData;
  tasks?: BadgeTask[];
}

export const CalendarCell = ({ cell, tasks = [] }: CalendarCellProps) => {
  const { selectDate, selectedDate } = useCalendar();

  const visibleTasks = tasks?.slice(0, 2);
  const countHiddenTasks = tasks.length - visibleTasks.length;

  const handleClick = () => {
    return selectedDate === cell.date ? selectDate(null) : selectDate(cell.date);
  };

  return (
    <Button
      variant="clear"
      className={styles.calendarCell}
      data-selected={selectedDate === cell.date}
      data-current-month={cell.isCurrentMonth}
      data-weekend={cell.isWeekend}
      onClick={handleClick}
    >
      <time dateTime={cell.date} aria-current={cell.isToday ? 'date' : undefined}>
        {cell.day}
      </time>
      {visibleTasks.map((task) => {
        return <TaskBadge key={task.id} task={task} />;
      })}
      {countHiddenTasks !== 0 && (
        <Typography className={styles.hiddenTasks} variant="text-micro">
          +{countHiddenTasks} ещё
        </Typography>
      )}
    </Button>
  );
};
