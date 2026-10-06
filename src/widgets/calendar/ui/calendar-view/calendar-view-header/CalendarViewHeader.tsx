import styles from './CalendarViewHeader.module.css';
import { CalendarFilters } from '@features/calendar-filters';
import { Typography } from '@shared/ui/Typography';

interface CalendarViewHeaderProps {
  month: Date;
}

export const CalendarViewHeader = ({ month }: CalendarViewHeaderProps) => {
  return (
    <div className={styles.header}>
      <Typography className={styles.title} variant="h3">
        {month.toLocaleDateString('ru-RU', {
          month: 'long',
          year: 'numeric',
        })}
      </Typography>
      <CalendarFilters />
    </div>
  );
};
