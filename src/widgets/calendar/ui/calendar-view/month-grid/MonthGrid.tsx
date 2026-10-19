import { useMemo } from 'react';
import styles from './MonthGrid.module.css';
import { getMonthGridItems } from '../../../utils/gridItems';
import { CalendarCell } from '../../calendar-cell/CalendarCell';
import { getMonthGridRange } from './utils/getMonthRange';
import {
  eventToBadgeTask,
  selectActiveProjectId,
  useGetCalendarEventsQuery,
  type BadgeTask,
} from '@entities/calendar';
import { useGetProjectsByWorkspaceQuery } from '@entities/project';
import { useAppSelector } from '@shared/lib';

interface MonthGridProps {
  month?: Date;
}

const EMPTY_TASKS: BadgeTask[] = [];

export const MonthGrid = ({ month }: MonthGridProps) => {
  const workspaceId = useAppSelector((state) => state.currentWorkspace.id);
  const activeProjectId = useAppSelector(selectActiveProjectId);
  const currentMonth = useMemo(() => month ?? new Date(), [month]);

  const { from, to } = useMemo(() => getMonthGridRange(currentMonth), [currentMonth]);

  const { data: events = [] } = useGetCalendarEventsQuery(
    {
      workspaceId: workspaceId!,
      from,
      to,
      ...(activeProjectId ? { projectId: activeProjectId } : {}),
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

  const gridItems = useMemo(() => getMonthGridItems(currentMonth), [currentMonth]);

  const tasksByDate = useMemo(() => {
    const grouped = new Map<string, BadgeTask[]>();

    events.forEach((event, index) => {
      const task = eventToBadgeTask(
        event,
        index,
        event.projectId ? projectsById[event.projectId]?.name : undefined,
      );
      const tasks = grouped.get(task.date);
      if (tasks) {
        tasks.push(task);
      } else {
        grouped.set(task.date, [task]);
      }
    });

    return grouped;
  }, [events, projectsById]);

  return (
    <div className={styles.monthGrid}>
      {gridItems.map((cell) => (
        <CalendarCell
          key={cell.date}
          cell={cell}
          tasks={tasksByDate.get(cell.date) ?? EMPTY_TASKS}
        />
      ))}
    </div>
  );
};
