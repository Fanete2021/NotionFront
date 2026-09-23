import styles from './EditTelegramNotificationSettingsButton.module.css';
import { Button } from '@shared/ui/Button';

interface EditTelegramNotificationSettingsButtonProps {
  onClick: () => void;
}

export const EditTelegramNotificationSettingsButton = ({
  onClick,
}: EditTelegramNotificationSettingsButtonProps) => (
  <Button className={styles.button} size="sm" fullWidth onClick={onClick}>
    Управление уведомлениями
  </Button>
);
