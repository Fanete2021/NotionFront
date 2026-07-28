import styles from './AuthAdvantages.module.css';
import {Typography} from "@shared/ui/Typography";

const AUTH_ADVANTAGES = [
  'Блочный редактор с богатым контентом',
  'Realtime совместное редактирование',
  'Встроенный ИИ-ассистент',
] as const;

export const AuthAdvantages = () => {
  return (
    <ul className={styles.list}>
      {AUTH_ADVANTAGES.map((advantage) => (
        <li className={styles.item} key={advantage}>
          <Typography variant='text-regular'>
            {advantage}
          </Typography>
        </li>
      ))}
    </ul>
  );
};

