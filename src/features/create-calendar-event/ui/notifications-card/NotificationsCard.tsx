import classNames from 'classnames';
import { type Control, Controller } from 'react-hook-form';
import styles from './NotificationsCard.module.css';
import type {
  CreateCalendarEventFormInput,
  CreateCalendarEventFormOutput,
} from '../../utils/validation-create-calendar-event-config/validationCreateCalendarEventConfig';
import { Typography } from '@shared/ui/typography';
import { Card } from '@shared/ui/card';
import { Select } from '@shared/ui/select';
import { Toggle } from '@shared/ui/toggle';
import TelegramIcon from '@shared/assets/icons/telegram.svg';

interface NotificationsCardProps {
  control: Control<CreateCalendarEventFormInput, unknown, CreateCalendarEventFormOutput>;
  className?: string;
}

export const NotificationsCard = ({ control, className }: NotificationsCardProps) => {
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
        <Typography className={styles.reminderLabel} variant="text-medium">
          Напомнить
        </Typography>
        <Controller
          name="reminderMinutes"
          control={control}
          render={({ field }) => (
            <Select
              className={styles.reminderSelect}
              name={field.name}
              aria-label="За сколько минут напомнить"
              value={field.value ?? '15'}
              onChange={field.onChange}
              onBlur={field.onBlur}
              options={[
                { value: '5', label: 'За 5 мин' },
                { value: '15', label: 'За 15 мин' },
                { value: '30', label: 'За 30 мин' },
                { value: '60', label: 'За 1 час' },
              ]}
            />
          )}
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
        <Controller
          name="telegramReminder"
          control={control}
          render={({ field }) => (
            <Toggle
              className={styles.telegramToggle}
              checked={field.value ?? false}
              onToggle={() => field.onChange(!field.value)}
              onBlur={field.onBlur}
              aria-label="Отправить в Telegram"
            />
          )}
        />
      </div>
    </Card>
  );
};
