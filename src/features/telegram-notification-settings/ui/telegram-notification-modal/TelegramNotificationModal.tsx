'use client';

import { useId } from 'react';
import styles from './TelegramNotification.module.css';
import { TelegramNotificationForm } from '../telegram-notification-form/TelegramNotificationForm';
import type { TelegramNotificationSettingsFormValues } from '../../utils/validationTelegramNotificationSettingsConfig';
import {
  type NotificationSettings,
  type UpdateNotificationSettingsDto,
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} from '@entities/telegram';
import { Modal } from '@shared/ui/modal';
import { Button } from '@shared/ui/button';
import { FormError } from '@shared/ui/form-error';
import { useMutationWithError } from '@shared/lib';
import TelegramIcon from '@shared/assets/icons/telegram.svg';
import CheckIcon from '@shared/assets/icons/check.svg';

interface TelegramNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelegramNotificationModal = ({ isOpen, onClose }: TelegramNotificationModalProps) => {
  const formId = useId();
  const { data: settings } = useGetNotificationSettingsQuery(undefined, { skip: !isOpen });
  const {
    execute: updateSettings,
    isLoading: isSaving,
    error,
    resetError,
  } = useMutationWithError<NotificationSettings, UpdateNotificationSettingsDto>(
    useUpdateNotificationSettingsMutation,
  );

  const handleClose = () => {
    resetError();
    onClose();
  };

  const handleSubmit = async (values: TelegramNotificationSettingsFormValues) => {
    try {
      await updateSettings(values);
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      className={styles.modal}
      title="Настройки уведомлений"
      isOpen={isOpen}
      onClose={handleClose}
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
          <Button className={styles.cancelButton} onClick={handleClose}>
            Отмена
          </Button>
          <Button
            className={styles.saveButton}
            type="submit"
            form={formId}
            variant="filled"
            addonLeft={<CheckIcon aria-hidden="true" />}
            disabled={!settings || isSaving}
          >
            {isSaving ? 'Сохранение...' : 'Сохранить настройки'}
          </Button>
        </div>
      }
    >
      {settings && (
        <TelegramNotificationForm id={formId} settings={settings} onSubmit={handleSubmit} />
      )}
      <FormError message={error} />
    </Modal>
  );
};
