import { Control, Controller } from 'react-hook-form';
import common from '../common.module.css';
import styles from './NotificationCard.module.css';
import type { ProfileSettings } from '../../utils/validationProfileSettingsConfig';
import { Card } from '@shared/ui/card';
import { Typography } from '@shared/ui/typography';
import { Toggle } from '@shared/ui/toggle';

interface NotificationCardProps {
  control: Control<ProfileSettings>;
}

const notificationFields = [
  {
    name: 'emailNotifications',
    title: 'Email-уведомления',
    description: 'Получать обновления на email о комментариях и изменениях',
  },
  {
    name: 'mentionNotifications',
    title: 'Упоминания',
    description: 'Уведомлять, когда кто-то упоминает меня в комментарии',
  },
] as const;

export function NotificationCard({ control }: NotificationCardProps) {
  return (
    <Card className={common.card} radius="m">
      <Typography variant="text-medium" className={common.cardTitle}>
        Уведомления
      </Typography>
      {notificationFields.map(({ name, title, description }) => (
        <div key={name} className={styles.toggleRow}>
          <div className={styles.toggleText}>
            <Typography variant="text-medium" className={styles.toggleTitle}>
              {title}
            </Typography>
            <Typography variant="caption" className={styles.toggleDescription}>
              {description}
            </Typography>
          </div>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Toggle
                checked={field.value}
                onToggle={() => field.onChange(!field.value)}
                aria-label={title}
              />
            )}
          />
        </div>
      ))}
    </Card>
  );
}
