'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import classNames from 'classnames';
import styles from './ProfileSettingsForm.module.css';
import { ProfileCard } from './profile-card';
import { NotificationCard } from './notification-card';
import { TelegramCard } from './telegram-card';
import { defaultProfileSettings, ProfileSettings } from '../model/mock.api';
import { profileSettingsSchema } from '../utils/validationProfileSettingsConfig';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';

interface ProfileSettingsFormProps {
  className?: string;
}

export function ProfileSettingsForm({ className }: ProfileSettingsFormProps) {
  const { handleSubmit, control } = useForm<ProfileSettings>({
    defaultValues: defaultProfileSettings,
    resolver: zodResolver(profileSettingsSchema),
  });

  const onSubmit: SubmitHandler<ProfileSettings> = async () => {
    //
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classNames(styles.form, className)}>
      <div className={styles.header}>
        <Typography variant="text-regular" className={styles.title}>
          Профиль
        </Typography>
        <Typography variant="text-regular" className={styles.description}>
          Управляйте личными данными и настройками рабочего пространства.
        </Typography>
      </div>
      <ProfileCard control={control} />
      <NotificationCard control={control} />
      <TelegramCard control={control} />
      <Button className={styles.saveButton} type="submit" variant="filled" align="start" fullWidth>
        Сохранить изменения
      </Button>
    </form>
  );
}
