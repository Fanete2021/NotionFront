import styles from './AppReviews.module.css';
import Star from '@shared/assets/icons/star.svg';
import {Typography} from "@shared/ui/Typography";

export const AppReviews = () => {
  return (
    <div className={styles.reviews}>
      <div className={styles.stars}>
        <Star/>
        <Star/>
        <Star/>
        <Star/>
        <Star/>
      </div>
      <Typography className={styles.reviewGrade} variant='label'>
        4.9 из более чем 2 400 отзывов
      </Typography>
    </div>
  );
};
