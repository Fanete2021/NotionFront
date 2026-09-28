import styles from './CreateCalendarActionButton.module.css';
import { openCreateEventModal } from '@features/create-calendar-event/model/slices/createEventModalSlice';
import { Button } from '@shared/ui/Button';
import PlusIcon from '@shared/assets/icons/plus.svg';
import { useAppDispatch } from '@shared/lib';

export const CreateCalendarActionButton = () => {
  const dispatch = useAppDispatch();

  const handleOpen = () => {
    dispatch(openCreateEventModal());
  };

  return (
    <Button
      className={styles.button}
      onClick={handleOpen}
      variant="filled"
      addonLeft={<PlusIcon />}
    >
      Событие
    </Button>
  );
};
