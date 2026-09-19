import styles from './CalendarDaySlider.module.css';
import { Typography } from '@shared/ui/Typography';
import ChevronLeft from '@shared/assets/icons/chevron-left.svg';
import ChevronRight from '@shared/assets/icons/chevron-right-2.svg';

export const CalendarDaySlider = () => {
  return (
    <div className={styles.slider}>
      <div className={styles.block}>
        <Typography className={styles.text} variant="text-medium">
          Сегодня
        </Typography>
      </div>
      <div className={styles.block}>
        <div className={styles.icon}>
          <ChevronLeft />
        </div>
      </div>
      <div className={styles.block}>
        <div className={styles.icon}>
          <ChevronRight />
        </div>
      </div>
    </div>
  );
};
