import styles from './CreateCalendarActionButton.module.css';
import { Button } from '@shared/ui/Button';
import PlusIcon from '@shared/assets/icons/plus.svg';

export const CreateCalendarActionButton = () => {
  return (
    <Button className={styles.button} variant="filled" addonLeft={<PlusIcon />}>
      Событие
    </Button>
  );
};
