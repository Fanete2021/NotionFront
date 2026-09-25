import classNames from 'classnames';
import styles from './CreateEventForm.module.css';
import { Input } from '@shared/ui/Input';
import { Select } from '@shared/ui/select';
import Calendar from '@shared/assets/icons/calendar.svg';
import Clock from '@shared/assets/icons/clock.svg';
import { Typography } from '@shared/ui/Typography';
import { Checkbox } from '@shared/ui/Checkbox';
import { Card } from '@shared/ui/Card';
import { Toggle } from '@shared/ui/Toggle';
import TelegramIcon from '@shared/assets/icons/telegram.svg';

export const CreateEventForm = () => {
  return (
    <form className={styles.form}>
      <div className={classNames(styles.field, styles.full)}>
        <Input
          label="Название события"
          placeholder="Встреча с командой продукта"
          name="eventName"
        />
      </div>
      <div className={styles.field}>
        <Input label="Дата" placeholder="09.07.2025" name="date" addonLeft={<Calendar />} />
      </div>
      <div className={styles.field}>
        <Input
          className={styles.timeInput}
          type="time"
          size="m"
          label="Начало"
          aria-label="Начало события"
          defaultValue="14:00"
          name="start"
          addonLeft={<Clock />}
        />
      </div>
      <div className={styles.field}>
        <Input
          className={styles.timeInput}
          type="time"
          size="m"
          label="Конец"
          aria-label="Конец события"
          defaultValue="14:30"
          name="end"
          addonLeft={<Clock />}
        />
      </div>
      <div className={classNames(styles.field, styles.half)}>
        <Select label="Проект" name="project" options={[{ value: 'product', label: 'Продукт' }]} />
      </div>
      <div className={classNames(styles.field, styles.half)}>
        <Select
          label="Тип задачи"
          name="taskType"
          options={[{ value: 'meet', label: 'Встреча' }]}
        />
      </div>

      <div className={styles.full}>
        <Select
          label="Повторение"
          name="repeat"
          options={[{ value: 'no-repeat', label: 'Не повторять' }]}
        />
      </div>
      <Card
        className={classNames(styles.notificationSettings, styles.full)}
        radius="m"
        role="group"
        aria-label="Уведомления"
      >
        <Typography className={styles.notificationTitle} variant="text-medium">
          Уведомление
        </Typography>
        <div className={styles.notificationRow}>
          <Checkbox name="reminderEnabled" defaultChecked labelClassName={styles.reminderLabel}>
            Напомнить мне
          </Checkbox>
          <Select
            className={styles.reminderSelect}
            name="reminderMinutes"
            aria-label="За сколько минут напомнить"
            defaultValue="15"
            options={[{ value: '15', label: 'За 15 мин' }]}
          />
        </div>
        <div className={styles.notificationDivider} aria-hidden="true" />
        <div className={styles.notificationRow}>
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
    </form>
  );
};
