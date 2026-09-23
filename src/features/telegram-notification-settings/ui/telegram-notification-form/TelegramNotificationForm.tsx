'use client';

import { type KeyboardEvent, useId, useState } from 'react';
import styles from './TelegramNotificationForm.module.css';
import {
  type NotificationSettings,
  initialNotificationSettings,
  notificationTypes,
  reminderOptions,
} from '../../model/notificationSettings';
import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';
import { Select } from '@shared/ui/select';
import { Toggle } from '@shared/ui/Toggle';
import TelegramIcon from '@shared/assets/icons/telegram.svg';

const handleToggleKeyDown = (event: KeyboardEvent<HTMLDivElement>, onToggle: () => void) => {
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault();
    onToggle();
  }
};

export const TelegramNotificationForm = () => {
  const id = useId();
  const [settings, setSettings] = useState(initialNotificationSettings);

  const updateSetting = <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K],
  ) => {
    setSettings((previous) => ({ ...previous, [key]: value }));
  };

  const toggleQuietHours = () => updateSetting('quietHours', !settings.quietHours);

  return (
    <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
      <section className={styles.connectionSection} aria-labelledby={`${id}-connection`}>
        <h3 id={`${id}-connection`} className={styles.sectionTitle}>
          Подключение
        </h3>
        <div className={styles.connectionCard}>
          <span className={styles.telegramIcon} aria-hidden="true">
            <TelegramIcon />
          </span>
          <div className={styles.account}>
            <span className={styles.accountName}>@alex_kim</span>
            <span className={styles.connectionStatus} data-connected={settings.isConnected}>
              {settings.isConnected ? 'Подключён' : 'Не подключён'}
            </span>
          </div>
          <Button
            className={styles.connectionButton}
            variant="outline"
            color={settings.isConnected ? 'danger' : 'normal'}
            size="sm"
            onClick={() => updateSetting('isConnected', !settings.isConnected)}
          >
            {settings.isConnected ? 'Отключить' : 'Подключить'}
          </Button>
        </div>
      </section>

      <fieldset className={styles.notificationSection}>
        <legend className={styles.sectionTitle}>Типы уведомлений</legend>
        <div className={styles.notificationList}>
          {notificationTypes.map(({ key, title, description }) => {
            const toggle = () => updateSetting(key, !settings[key]);

            return (
              <div key={key} className={styles.settingRow}>
                <div className={styles.settingText}>
                  <span id={`${id}-${key}`} className={styles.settingTitle}>
                    {title}
                  </span>
                  <span id={`${id}-${key}-description`} className={styles.description}>
                    {description}
                  </span>
                </div>
                <Toggle
                  className={styles.toggle}
                  checked={settings[key]}
                  onToggle={toggle}
                  onKeyDown={(event) => handleToggleKeyDown(event, toggle)}
                  aria-labelledby={`${id}-${key}`}
                  aria-describedby={`${id}-${key}-description`}
                />
              </div>
            );
          })}
        </div>
      </fieldset>

      <div className={styles.reminderField}>
        <label htmlFor={`${id}-reminder`} className={styles.sectionTitle}>
          Время напоминания
        </label>
        <Select
          id={`${id}-reminder`}
          name="reminderMinutes"
          className={styles.reminderSelect}
          options={reminderOptions}
          value={settings.reminderMinutes}
          onChange={(value) => updateSetting('reminderMinutes', value)}
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
          <Toggle
            className={styles.toggle}
            checked={settings.quietHours}
            onToggle={toggleQuietHours}
            onKeyDown={(event) => handleToggleKeyDown(event, toggleQuietHours)}
            aria-labelledby={`${id}-quiet-hours`}
            aria-describedby={`${id}-quiet-description`}
          />
        </div>
        <div className={styles.quietHoursSchedule}>
          <Input
            className={styles.timeInput}
            type="time"
            name="quietHoursStart"
            size="m"
            aria-label="Начало режима тишины"
            value={settings.quietHoursStart}
            disabled={!settings.quietHours}
            required={settings.quietHours}
            onChange={(value) => updateSetting('quietHoursStart', value)}
          />
          <span className={styles.timeSeparator} aria-hidden="true">
            —
          </span>
          <Input
            className={styles.timeInput}
            type="time"
            name="quietHoursEnd"
            size="m"
            aria-label="Конец режима тишины"
            value={settings.quietHoursEnd}
            disabled={!settings.quietHours}
            required={settings.quietHours}
            onChange={(value) => updateSetting('quietHoursEnd', value)}
          />
          <p className={styles.scheduleHint}>
            {settings.quietHours
              ? `Уведомления будут отложены до ${settings.quietHoursEnd}`
              : 'Режим тишины выключен'}
          </p>
        </div>
      </section>
    </form>
  );
};
