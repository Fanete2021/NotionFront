import { useCallback } from 'react';
import { dayTasks } from '../../model/mock-data/dayTasks';
import { DayTasksHeader } from './day-tasks-header/DayTasksHeader';
import styles from './DayTasksPanel.module.css';
import { AddTaskButton } from '@features/add-calendar-task';
import { openCreateEventModal } from '@features/create-calendar-event';
import { EditTelegramNotificationSettingsButton } from '@features/telegram-notification-settings';
import { DayTask } from '@entities/calendar';
import { useAppDispatch } from '@shared/lib';

interface DayTasksPanelProps {
  onManageNotifications: () => void;
}

export const DayTasksPanel = ({ onManageNotifications }: DayTasksPanelProps) => {
  const dispatch = useAppDispatch();

  const handleAddDayTask = useCallback(() => {
    dispatch(openCreateEventModal());
  }, [dispatch]);

  return (
    <div className={styles.panel}>
      <DayTasksHeader />
      {dayTasks.map((dayTask) => (
        <DayTask key={dayTask.label} dayTask={dayTask} />
      ))}
      <footer className={styles.footer}>
        <EditTelegramNotificationSettingsButton onClick={onManageNotifications} />
        <AddTaskButton onClick={handleAddDayTask} />
      </footer>
    </div>
  );
};
