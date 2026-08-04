import styles from './PromoAdvantages.module.css';
import {Typography} from "@shared/ui/Typography";

interface PromoAdvantagesProps {
   advantages: readonly string[];
}

export const PromoAdvantages = ({advantages}: PromoAdvantagesProps) => {
  return (
    <ul className={styles.list}>
      {advantages.map((advantage) => (
        <li className={styles.item} key={advantage}>
          <Typography variant='text-regular'>
            {advantage}
          </Typography>
        </li>
      ))}
    </ul>
  );
};

