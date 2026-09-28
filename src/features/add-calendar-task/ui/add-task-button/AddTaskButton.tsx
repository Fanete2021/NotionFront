import styles from './AddTaskButton.module.css';
import { Button } from '@/shared/ui/Button';
import PlusIcon from '@shared/assets/icons/plus.svg';

interface AddTaskButtonProps {
  onClick: () => void;
}

export const AddTaskButton = ({ onClick }: AddTaskButtonProps) => {
  return (
    <Button
      className={styles.button}
      variant="outline"
      size="sm"
      fullWidth
      onClick={onClick}
      addonLeft={<PlusIcon aria-hidden="true" />}
    >
      Создать задачу
    </Button>
  );
};
