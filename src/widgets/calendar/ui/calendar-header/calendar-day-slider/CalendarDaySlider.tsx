import classNames from 'classnames';
import styles from './CalendarDaySlider.module.css';
import { useCalendar } from '@widgets/calendar';
import ChevronLeft from '@shared/assets/icons/chevron-left.svg';
import ChevronRight from '@shared/assets/icons/chevron-right-2.svg';
import { Button } from '@shared/ui/Button';

export const CalendarDaySlider = () => {
  const { changeMonth, goToToday } = useCalendar();

  return (
    <div className={styles.slider} role="group" aria-label="Навигация по календарю">
      <Button className={styles.button} onClick={goToToday} variant="clear">
        Сегодня
      </Button>
      <Button
        className={classNames(styles.button, styles.navigationButton)}
        onClick={() => changeMonth(-1)}
        variant="clear"
        aria-label="Предыдущий месяц"
      >
        <ChevronLeft className={styles.icon} aria-hidden="true" />
      </Button>
      <Button
        className={classNames(styles.button, styles.navigationButton)}
        onClick={() => changeMonth(1)}
        variant="clear"
        aria-label="Следующий месяц"
      >
        <ChevronRight className={styles.icon} aria-hidden="true" />
      </Button>
    </div>
  );
};
