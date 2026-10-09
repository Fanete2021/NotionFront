import { useMemo } from 'react';
import styles from './MonthGrid.module.css';
import { getMonthGridItems } from '../../../utils/gridItems';
import { CalendarCell } from '../../calendar-cell/CalendarCell';
import { eventToBadgeTask, useGetCalendarEventsQuery, type BadgeTask } from '@entities/calendar';
import { useGetProjectsByWorkspaceQuery } from '@entities/project';
import { useAppSelector } from '@shared/lib';

interface MonthGridProps {
  month?: Date;
}

export const MonthGrid = ({ month }: MonthGridProps) => {
  const workspaceId = useAppSelector((state) => state.currentWorkspace.id);
  const currentMonth = useMemo(() => month ?? new Date(), [month]);

  const from = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString();

  const to = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  ).toISOString();

  const { data: events = [] } = useGetCalendarEventsQuery(
    { workspaceId: workspaceId!, from, to },
    { skip: !workspaceId },
  );

  const { data: projects = [] } = useGetProjectsByWorkspaceQuery(workspaceId!, {
    skip: !workspaceId,
  });

  const projectsById = useMemo(
    () => Object.fromEntries(projects.map((p) => [p.id, p])),
    [projects],
  );

  const gridItems = useMemo(() => getMonthGridItems(currentMonth), [currentMonth]);

  const badgeTasks: BadgeTask[] = useMemo(
    () =>
      events.map((e, i) =>
        eventToBadgeTask(e, i, e.projectId ? projectsById[e.projectId]?.name : undefined),
      ),
    [events, projectsById],
  );

  return (
    <div className={styles.monthGrid}>
      {gridItems.map((cell) => (
        <CalendarCell
          key={cell.date}
          cell={cell}
          tasks={badgeTasks.filter((t) => t.date === cell.date)}
        />
      ))}
    </div>
  );
};
