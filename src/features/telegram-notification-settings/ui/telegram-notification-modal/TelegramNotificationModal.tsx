'use client';

import styles from './TelegramNotification.module.css';
import { TelegramNotificationForm } from '../telegram-notification-form/TelegramNotificationForm';
import { Modal } from '@shared/ui/modal';
import { Button } from '@shared/ui/Button';
import TelegramIcon from '@shared/assets/icons/telegram.svg';
import CheckIcon from '@shared/assets/icons/check.svg';

interface TelegramNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelegramNotificationModal = ({ isOpen, onClose }: TelegramNotificationModalProps) => {
  return (
    <Modal
      className={styles.modal}
      title="Настройки уведомлений"
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      closeButtonVariant="outline"
      headerDivider
      footerDivider
      header={
        <div className={styles.header}>
          <div className={styles.heading}>
            <span className={styles.telegramIcon} aria-hidden="true">
              <TelegramIcon />
            </span>
            <h2 className={styles.title}>Настройки уведомлений</h2>
          </div>
          <p className={styles.subtitle}>Управляйте напоминаниями о событиях через Telegram-бота</p>
        </div>
      }
      footer={
        <div className={styles.actions}>
          <Button className={styles.cancelButton} onClick={onClose}>
            Отмена
          </Button>
          <Button
            className={styles.saveButton}
            type="button"
            onClick={onClose}
            variant="filled"
            addonLeft={<CheckIcon aria-hidden="true" />}
          >
            Сохранить настройки
          </Button>
        </div>
      }
    >
      <TelegramNotificationForm />
    </Modal>
  );
};
