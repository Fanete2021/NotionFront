import styles from './CalendarViewHeader.module.css';
import { CalendarFilters } from '@features/calendar-filters';
import { setActiveProjectId } from '@/features/create-calendar-event';
import { selectActiveProjectId } from '@/entities/calendar';
import { useGetProjectsByWorkspaceQuery } from '@/entities/project';
import { useAppDispatch, useAppSelector } from '@/shared/lib';
import { Typography } from '@shared/ui/Typography';

interface CalendarViewHeaderProps {
  month: Date;
}

export const CalendarViewHeader = ({ month }: CalendarViewHeaderProps) => {
  const dispatch = useAppDispatch();
  const workspaceId = useAppSelector((state) => state.currentWorkspace.id);
  const activeProjectId = useAppSelector(selectActiveProjectId);

  const { data: projects = [] } = useGetProjectsByWorkspaceQuery(workspaceId!, {
    skip: !workspaceId,
  });

  return (
    <div className={styles.header}>
      <Typography className={styles.title} variant="h3">
        {month.toLocaleDateString('ru-RU', {
          month: 'long',
          year: 'numeric',
        })}
      </Typography>
      <CalendarFilters
        projects={projects}
        activeProjectId={activeProjectId}
        onChange={(id) => dispatch(setActiveProjectId(id))}
      />
    </div>
  );
};
