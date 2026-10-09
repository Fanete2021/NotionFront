import { useState } from 'react';
import styles from './CalendarFilters.module.css';
import { useGetProjectsByWorkspaceQuery } from '@entities/project';
import { FilterChip } from '@shared/ui/FilterChip';
import { useAppSelector } from '@shared/lib';

const PALETTE = ['primary', 'success', 'warning', 'danger', 'info', 'neutral'] as const;

export const CalendarFilters = () => {
  const workspaceId = useAppSelector((state) => state.currentWorkspace.id);
  const { data: projects = [] } = useGetProjectsByWorkspaceQuery(workspaceId!, {
    skip: !workspaceId,
  });
  const [activeId, setActiveId] = useState<string | null>(null);

  if (!projects.length) return null;

  return (
    <ul className={styles.filtersList}>
      <li>
        <FilterChip
          label="Все"
          color="neutral"
          active={activeId === null}
          onClick={() => setActiveId(null)}
        />
      </li>
      {projects.map((p, i) => (
        <li key={p.id}>
          <FilterChip
            label={p.name}
            color={PALETTE[i % PALETTE.length]}
            active={activeId === p.id}
            onClick={() => setActiveId(p.id)}
          />
        </li>
      ))}
    </ul>
  );
};
