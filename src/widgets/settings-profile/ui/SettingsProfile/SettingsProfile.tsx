'use client';

import { useState } from 'react';
import classNames from 'classnames';
import styles from './SettingsProfile.module.css';
import { ProfileCard } from '../ProfileCard/ProfileCard';
import { NotificationsCard } from '../NotificationsCard/NotificationsCard';
import { TelegramCard } from '../TelegramCard/TelegramCard';
import { defaultProfileSettings, ProfileSettings } from '../../model/mock.api';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';

interface SettingsProfileProps {
  className?: string;
}

export function SettingsProfile({ className }: SettingsProfileProps) {
  const [settings, setSettings] = useState<ProfileSettings>(defaultProfileSettings);

  const handleChange = (patch: Partial<ProfileSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  };

  return (
    <section className={classNames(styles.profile, className)}>
      <div className={styles.header}>
        <Typography variant="text-regular" className={styles.title}>
          Профиль
        </Typography>
        <Typography variant="text-regular" className={styles.description}>
          Управляйте личными данными и настройками рабочего пространства.
        </Typography>
      </div>

      <ProfileCard
        firstName={settings.firstName}
        lastName={settings.lastName}
        email={settings.email}
        onChange={handleChange}
      />

      <NotificationsCard
        emailNotifications={settings.emailNotifications}
        mentionNotifications={settings.mentionNotifications}
        onChange={handleChange}
      />

      <TelegramCard telegramToken={settings.telegramToken} onChange={handleChange} />

      <Button className={styles.saveButton} variant="filled" fullWidth>
        Сохранить изменения
      </Button>
    </section>
  );
}
