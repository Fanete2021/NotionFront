'use client';

import { useState } from 'react';
import styles from './CalendarHeader.module.css';
import { CalendarDaySlider } from './calendar-day-slider/CalendarDaySlider';
import { CalendarFormatSwitcher } from '../calendar-format-switcher/CalendarFormatSwitcher';
import { DisplayFormat } from '../../model/types/calendar-display-format';
import { useCalendar } from '../../context/calendar-context/useCalendar';
import { CreateCalendarActionButton, CreateEventModal } from '@features/create-calendar-event';
import { Typography } from '@shared/ui/Typography';

export const CalendarHeader = () => {
  const [selectedDisplayFormat, setSelectedDisplayFormat] = useState<DisplayFormat>('month');
  const { month } = useCalendar();

  return (
    <header className={styles.header}>
      <Typography className={styles.title} variant="h4">
        {month.toLocaleDateString('ru-RU', {
          month: 'long',
          year: 'numeric',
        })}
      </Typography>
      <CalendarFormatSwitcher
        selectedFormat={selectedDisplayFormat}
        onSelect={setSelectedDisplayFormat}
      />
      <div className={styles.actions}>
        <CalendarDaySlider />
        <CreateCalendarActionButton />
      </div>
      <CreateEventModal />
    </header>
  );
};
