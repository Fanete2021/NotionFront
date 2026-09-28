import styles from './DayTasksHeader.module.css';
import { Typography } from '@shared/ui/Typography';
import { Button } from '@shared/ui/Button';
import FilterIcon from '@shared/assets/icons/filter.svg';
import PlusIcon from '@shared/assets/icons/plus.svg';

export const DayTasksHeader = () => {
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
          Среда
        </Typography>
        <Typography variant="caption" className={styles.date}>
          9 июля 2025
        </Typography>
      </div>
    </header>
  );
};
