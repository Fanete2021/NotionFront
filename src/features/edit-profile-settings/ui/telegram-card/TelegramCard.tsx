import { Control, Controller, useWatch } from 'react-hook-form';
import common from '../common.module.css';
import styles from './TelegramCard.module.css';
import { ProfileSettings } from '../../model/mock.api';
import { Card } from '@shared/ui/card';
import { Typography } from '@shared/ui/typography';
import { Button } from '@shared/ui/button';
import { Input } from '@/shared/ui/input';
import TelegramIcon from '@/shared/assets/icons/telegram.svg';

interface TelegramCardProps {
  control: Control<ProfileSettings>;
}

export function TelegramCard({ control }: TelegramCardProps) {
  const [telegramToken] = useWatch({
    control,
    name: ['telegramToken'],
  });
  return (
    <Card className={common.card} radius="m">
      <div className={styles.telegramHeader}>
        <span className={styles.telegramIcon}>
          <TelegramIcon />
        </span>

        <div className={styles.telegramText}>
          <Typography variant="text-medium" className={common.cardTitle}>
            Telegram-бот
          </Typography>
          <Typography variant="caption" className={styles.telegramDescription}>
            Получайте уведомления прямо в Telegram
          </Typography>
        </div>

        <Button className={styles.telegramButton} variant="filled" size="sm">
          Подключить Telegram
        </Button>
      </div>

      <Controller
        name="telegramToken"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            label="Токен бота"
            size="m"
            placeholder="Введите токен вашего Telegram-бота..."
          />
        )}
      />
    </Card>
  );
}
