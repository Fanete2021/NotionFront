import { useState } from 'react';
import { useCalendar } from '../../context/calendar-context/useCalendar';
import { CalendarHeader } from '../calendar-header/CalendarHeader';
import { CalendarView } from '../calendar-view/CalendarView';
import { DayTasksPanel } from '../day-tasks-panel/DayTasksPanel';
import styles from './CalendarContent.module.css';
import { TelegramNotificationModal } from '@features/telegram-notification-settings';
import { selectIsCreateEventModalOpen } from '@entities/calendar';
import { useAppSelector, useDismissibleLayer } from '@shared/lib';

export const CalendarContent = () => {
  const { selectedDate, closeDayPanel } = useCalendar();
  const [isTelegramSettingsOpen, setIsTelegramSettingsOpen] = useState(false);
  const isModalOpen = useAppSelector(selectIsCreateEventModalOpen);
  const isPanelOpen = selectedDate !== null;
  const calendarRef = useDismissibleLayer<HTMLDivElement>({
    enabled: isPanelOpen && !isModalOpen && !isTelegramSettingsOpen,
    onDismiss: closeDayPanel,
  });

  return (
    <div ref={calendarRef} className={styles.layout} data-panel-open={isPanelOpen}>
      <aside className={styles.dayPanel} aria-hidden={!isPanelOpen} aria-label="Задачи на день">
        <div className={styles.dayPanelContent}>
          <DayTasksPanel onManageNotifications={() => setIsTelegramSettingsOpen(true)} />
        </div>
      </aside>
      <div className={styles.calendar}>
        <CalendarHeader />
        <CalendarView />
      </div>
      <TelegramNotificationModal
        isOpen={isTelegramSettingsOpen}
        onClose={() => setIsTelegramSettingsOpen(false)}
      />
    </div>
  );
};
