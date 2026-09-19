'use client';

import { useState } from 'react';
import styles from './CalendarHeader.module.css';
import { CalendarDaySlider } from './calendar-day-slider/CalendarDaySlider';
import { CalendarFormatSwitcher } from '../calendar-format-switcher/CalendarFormatSwitcher';
import { CreateCalendarActionButton, DisplayFormat } from '@features/calendar';
import { Typography } from '@shared/ui/Typography';

export const CalendarHeader = () => {
  const [selectedDisplayFormat, setSelectedDisplayFormat] = useState<DisplayFormat>('month');

  return (
    <header className={styles.header}>
      <Typography className={styles.title} variant="h4">
        Июль 2025
      </Typography>
      <CalendarFormatSwitcher
        selectedFormat={selectedDisplayFormat}
        onSelect={setSelectedDisplayFormat}
      />
      <div className={styles.actions}>
        <CalendarDaySlider />
        <CreateCalendarActionButton />
      </div>
    </header>
  );
};
