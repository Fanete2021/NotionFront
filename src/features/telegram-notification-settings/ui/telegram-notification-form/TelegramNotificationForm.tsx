'use client';

import { useId } from 'react';
import { Controller, type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './TelegramNotificationForm.module.css';
import { notificationTypes, reminderOptions } from '../../model/notificationSettings';
import {
  changeTelegramNotificationSettingsFormSchema,
  type TelegramNotificationSettingsFormInput,
  type TelegramNotificationSettingsFormValues,
} from '../../utils/validationTelegramNotificationSettingsConfig';
import { TelegramConnection } from '../telegram-connection/TelegramConnection';
import type { NotificationSettings } from '@entities/telegram';
import { Input } from '@shared/ui/input';
import { Select } from '@shared/ui/select';
import { Toggle } from '@shared/ui/toggle';

interface TelegramNotificationFormProps {
  id: string;
  settings: NotificationSettings;
  onSubmit: SubmitHandler<TelegramNotificationSettingsFormValues>;
}

export const TelegramNotificationForm = ({
  id: formId,
  settings,
  onSubmit,
}: TelegramNotificationFormProps) => {
  const id = useId();
  const { control, handleSubmit } = useForm<
    TelegramNotificationSettingsFormInput,
    unknown,
    TelegramNotificationSettingsFormValues
  >({
    resolver: zodResolver(changeTelegramNotificationSettingsFormSchema),
    defaultValues: {
      ...settings,
      reminderMinutes: String(
        settings.reminderMinutes,
      ) as TelegramNotificationSettingsFormInput['reminderMinutes'],
      quietHoursStart: settings.quietHoursStart ?? '23:00',
      quietHoursEnd: settings.quietHoursEnd ?? '08:00',
    },
  });
  const [quietHoursEnabled, quietHoursEnd] = useWatch({
    control,
    name: ['quietHoursEnabled', 'quietHoursEnd'],
  });

  return (
    <form id={formId} className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <section className={styles.connectionSection} aria-labelledby={`${id}-connection`}>
        <h3 id={`${id}-connection`} className={styles.sectionTitle}>
          Подключение
        </h3>
        <TelegramConnection />
      </section>

      <fieldset className={styles.notificationSection}>
        <legend className={styles.sectionTitle}>Типы уведомлений</legend>
        <div className={styles.notificationList}>
          {notificationTypes.map(({ key, title, description }) => (
            <div key={key} className={styles.settingRow}>
              <div className={styles.settingText}>
                <span id={`${id}-${key}`} className={styles.settingTitle}>
                  {title}
                </span>
                <span id={`${id}-${key}-description`} className={styles.description}>
                  {description}
                </span>
              </div>
              <Controller
                name={key}
                control={control}
                render={({ field }) => (
                  <Toggle
                    className={styles.toggle}
                    checked={field.value ?? false}
                    onToggle={() => field.onChange(!field.value)}
                    onBlur={field.onBlur}
                    aria-labelledby={`${id}-${key}`}
                    aria-describedby={`${id}-${key}-description`}
                  />
                )}
              />
            </div>
          ))}
        </div>
      </fieldset>

      <div className={styles.reminderField}>
        <label htmlFor={`${id}-reminder`} className={styles.sectionTitle}>
          Время напоминания
        </label>
        <Controller
          name="reminderMinutes"
          control={control}
          render={({ field }) => (
            <Select
              id={`${id}-reminder`}
              name={field.name}
              className={styles.reminderSelect}
              options={reminderOptions}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      </div>

      <section className={styles.quietHoursSection} aria-labelledby={`${id}-quiet-hours`}>
        <div className={styles.settingRow}>
          <div className={styles.settingText}>
            <h3 id={`${id}-quiet-hours`} className={styles.settingTitle}>
              Режим тишины
            </h3>
            <p id={`${id}-quiet-description`} className={styles.description}>
              Не отправлять уведомления в ночное время
            </p>
          </div>
          <Controller
            name="quietHoursEnabled"
            control={control}
            render={({ field }) => (
              <Toggle
                className={styles.toggle}
                checked={field.value ?? false}
                onToggle={() => field.onChange(!field.value)}
                onBlur={field.onBlur}
                aria-labelledby={`${id}-quiet-hours`}
                aria-describedby={`${id}-quiet-description`}
              />
            )}
          />
        </div>
        <div className={styles.quietHoursSchedule}>
          <Controller
            name="quietHoursStart"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                className={styles.timeInput}
                type="time"
                size="m"
                aria-label="Начало режима тишины"
                disabled={!quietHoursEnabled}
                required={quietHoursEnabled}
                error={fieldState.error?.message}
              />
            )}
          />
          <span className={styles.timeSeparator} aria-hidden="true">
            —
          </span>
          <Controller
            name="quietHoursEnd"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                className={styles.timeInput}
                type="time"
                size="m"
                aria-label="Конец режима тишины"
                disabled={!quietHoursEnabled}
                required={quietHoursEnabled}
                error={fieldState.error?.message}
              />
            )}
          />
          <p className={styles.scheduleHint}>
            {quietHoursEnabled
              ? `Уведомления будут отложены до ${quietHoursEnd}`
              : 'Режим тишины выключен'}
          </p>
        </div>
      </section>
    </form>
  );
};
