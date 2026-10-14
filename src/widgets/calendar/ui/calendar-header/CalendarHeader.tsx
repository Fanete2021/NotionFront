'use client';

import styles from './CalendarHeader.module.css';
import { CalendarDaySlider } from './calendar-day-slider/CalendarDaySlider';
import { useCalendar } from '@widgets/calendar/model/calendar-context/useCalendar';
import { CreateCalendarActionButton, CreateEventModal } from '@features/create-calendar-event';
import { Typography } from '@shared/ui/typography';

export const CalendarHeader = () => {
  const { month } = useCalendar();

  return (
    <header className={styles.header}>
      <Typography className={styles.title} variant="h4">
        {month.toLocaleDateString('ru-RU', {
          month: 'long',
          year: 'numeric',
        })}
      </Typography>
      <div className={styles.actions}>
        <CalendarDaySlider />
        <CreateCalendarActionButton />
      </div>
      <CreateEventModal />
    </header>
  );
};
