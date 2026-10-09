import styles from './DayTasksHeader.module.css';
import { useCalendar } from '@widgets/calendar/model/calendar-context/useCalendar';
import { Typography } from '@shared/ui/Typography';
import { Button } from '@shared/ui/Button';
import FilterIcon from '@shared/assets/icons/filter.svg';
import PlusIcon from '@shared/assets/icons/plus.svg';

export const DayTasksHeader = () => {
  const { selectedDate } = useCalendar();

  const date = selectedDate ? new Date(`${selectedDate}T00:00:00`) : new Date();

  const weekdayRaw = date.toLocaleDateString('ru-RU', { weekday: 'long' });
  const weekday = weekdayRaw[0].toUpperCase() + weekdayRaw.slice(1);

  const pretty = date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className={styles.header}>
      <div className={styles.headingRow}>
        <Typography className={styles.title} variant="h4">
          Задачи на день
        </Typography>
        <div className={styles.actions}>
          <Button variant="clear">
            <FilterIcon color="#6B7280" className={styles.icon} />
          </Button>
          <Button variant="clear">
            <PlusIcon color="#6366F1" className={styles.icon} />
          </Button>
        </div>
      </div>
      <div className={styles.dateCard}>
        <Typography variant="caption" className={styles.weekday}>
          {weekday}
        </Typography>
        <Typography variant="caption" className={styles.date}>
          {pretty}
        </Typography>
      </div>
    </header>
  );
};
