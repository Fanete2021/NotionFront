import styles from './WeekDays.module.css';
import { Typography } from '@shared/ui/Typography';

const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

export const WeekDays = () => {
  return (
    <ul className={styles.list}>
      {weekDays.map((weekDay) => (
        <li key={weekDay} className={styles.item}>
          <Typography className={styles.weekDay}>{weekDay}</Typography>
        </li>
      ))}
    </ul>
  );
};
