import { useCallback, useMemo } from 'react';
import { DayTasksHeader } from './day-tasks-header/DayTasksHeader';
import styles from './DayTasksPanel.module.css';
import { useCalendar } from '@widgets/calendar/model/calendar-context/useCalendar';
import { AddTaskButton } from '@features/add-calendar-task';
import { openCreateEventModal } from '@features/create-calendar-event';
import { EditTelegramNotificationSettingsButton } from '@features/telegram-notification-settings';
import { openEditEventModal } from '@/features/create-calendar-event';
import {
  DayTask,
  DayTaskData,
  eventToDayTask,
  selectDayPanelProjectIds,
  useGetCalendarEventsQuery,
} from '@entities/calendar';
import { useGetProjectsByWorkspaceQuery } from '@entities/project';
import { toDateKey, useAppDispatch, useAppSelector } from '@shared/lib';

interface DayTasksPanelProps {
  onManageNotifications: () => void;
}

export const DayTasksPanel = ({ onManageNotifications }: DayTasksPanelProps) => {
  const dispatch = useAppDispatch();
  const workspaceId = useAppSelector((state) => state.currentWorkspace.id);
  const selectedProjectIds = useAppSelector(selectDayPanelProjectIds);
  const { selectedDate } = useCalendar();

  const dayKey = selectedDate ?? toDateKey(new Date());
  const from = new Date(`${dayKey}T00:00:00`).toISOString();
  const to = new Date(`${dayKey}T23:59:59.999`).toISOString();

  const { data: events = [] } = useGetCalendarEventsQuery(
    {
      workspaceId: workspaceId!,
      from,
      to,
    },
    { skip: !workspaceId },
  );

  const { data: projects = [] } = useGetProjectsByWorkspaceQuery(workspaceId!, {
    skip: !workspaceId,
  });

  const projectsById = useMemo(
    () => Object.fromEntries(projects.map((p) => [p.id, p])),
    [projects],
  );

  const filteredEvents = useMemo(() => {
    if (selectedProjectIds.length === 0) return events;
    const set = new Set(selectedProjectIds);
    return events.filter((e) => e.projectId !== null && set.has(e.projectId));
  }, [events, selectedProjectIds]);

  const tasks = useMemo(
    () =>
      filteredEvents.map((e) => {
        const projectName = e.projectId
          ? (projectsById[e.projectId]?.name ?? 'Без проекта')
          : 'Без проекта';
        return eventToDayTask(e, projectName);
      }),
    [filteredEvents, projectsById],
  );

  const handleAddDayTask = useCallback(() => {
    dispatch(openCreateEventModal({ defaultDate: selectedDate ?? undefined }));
  }, [dispatch, selectedDate]);

  const handleEditDayTask = useCallback(
    (task: DayTaskData) => {
      const found = events.find((e) => e.id === task.id);
      if (!found) return;
      dispatch(openEditEventModal(found));
    },
    [dispatch, events],
  );

  return (
    <div className={styles.panel}>
      <DayTasksHeader />
      {tasks.map((t, i) => (
        <DayTask key={t.id ?? `${t.label}-${i}`} dayTask={t} onClick={handleEditDayTask} />
      ))}
      <footer className={styles.footer}>
        <EditTelegramNotificationSettingsButton onClick={onManageNotifications} />
        <AddTaskButton onClick={handleAddDayTask} />
      </footer>
    </div>
  );
};
