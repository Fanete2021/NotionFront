import classNames from 'classnames';
import styles from './NotificationsCard.module.css';
import { Typography } from '@shared/ui/typography';
import { Checkbox } from '@shared/ui/checkbox';
import { Card } from '@shared/ui/card';
import { Select } from '@shared/ui/select';
import { Toggle } from '@shared/ui/toggle';
import TelegramIcon from '@shared/assets/icons/telegram.svg';

interface NotificationsCardProps {
  className?: string;
}

export const NotificationsCard = ({ className }: NotificationsCardProps) => {
  return (
    <Card
      className={classNames(styles.card, className)}
      radius="m"
      role="group"
      aria-label="Уведомления"
    >
      <Typography className={styles.title} variant="text-medium">
        Уведомление
      </Typography>

      <div className={styles.row}>
        <Checkbox name="reminderEnabled" defaultChecked labelClassName={styles.reminderLabel}>
          Напомнить мне
        </Checkbox>
        <Select
          className={styles.reminderSelect}
          name="reminderMinutes"
          aria-label="За сколько минут напомнить"
          value="15"
          onChange={() => {}}
          options={[{ value: '15', label: 'За 15 мин' }]}
        />
      </div>

      <div className={styles.divider} aria-hidden="true" />

      <div className={styles.row}>
        <div className={styles.telegramLabel}>
          <span className={styles.telegramIcon} aria-hidden="true">
            <TelegramIcon width={32} height={32} className={styles.icon} />
          </span>
          <Typography className={styles.telegramSend} variant="text-medium">
            Отправить в Telegram
          </Typography>
        </div>
        <Toggle className={styles.telegramToggle} checked aria-label="Отправить в Telegram" />
      </div>
    </Card>
  );
};
