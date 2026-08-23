import common from '../styles/common.module.css';
import styles from './NotificationsCard.module.css';
import { ProfileSettings } from '../../model/mock.api';
import { Card } from '@/shared/ui/Card';
import { Typography } from '@/shared/ui/Typography';
import { Toggle } from '@/shared/ui/Toggle';

interface NotificationsCardProps {
  emailNotifications: boolean;
  mentionNotifications: boolean;
  onChange: (patch: Partial<ProfileSettings>) => void;
}

export function NotificationsCard({
  emailNotifications,
  mentionNotifications,
  onChange,
}: NotificationsCardProps) {
  return (
    <Card className={common.card}>
      <Typography variant="text-medium" className={common.cardTitle}>
        Уведомления
      </Typography>

      <div className={styles.toggleRow}>
        <div className={styles.toggleText}>
          <Typography variant="text-medium" className={styles.toggleTitle}>
            Email-уведомления
          </Typography>
          <Typography variant="caption" className={styles.toggleDescription}>
            Получать обновления на email о комментариях и изменениях
          </Typography>
        </div>

        <Toggle
          checked={emailNotifications}
          onToggle={() => onChange({ emailNotifications: !emailNotifications })}
          aria-label="Email-уведомления"
        />
      </div>

      <div className={styles.toggleRow}>
        <div className={styles.toggleText}>
          <Typography variant="text-medium" className={styles.toggleTitle}>
            Упоминания
          </Typography>
          <Typography variant="caption" className={styles.toggleDescription}>
            Уведомлять, когда кто-то упоминает меня в комментарии
          </Typography>
        </div>

        <Toggle
          checked={mentionNotifications}
          onToggle={() => onChange({ mentionNotifications: !mentionNotifications })}
          aria-label="Упоминания"
        />
      </div>
    </Card>
  );
}
