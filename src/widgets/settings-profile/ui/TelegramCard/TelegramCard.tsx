import common from '../styles/common.module.css';
import styles from './TelegramCard.module.css';
import { ProfileSettings } from '../../model/mock.api';
import { Card } from '@/shared/ui/Card';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import TelegramIcon from '@/shared/assets/icons/telegramWithNoBg.svg';

interface TelegramCardProps {
  telegramToken: string;
  onChange: (patch: Partial<ProfileSettings>) => void;
}

export function TelegramCard({ telegramToken, onChange }: TelegramCardProps) {
  return (
    <Card className={common.card}>
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

      <Input
        label="Токен бота"
        size="m"
        value={telegramToken}
        placeholder="Введите токен вашего Telegram-бота..."
        onChange={(value) => onChange({ telegramToken: value })}
      />
    </Card>
  );
}
