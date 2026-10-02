'use client';

import { useCallback, useMemo } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SidebarItem as SidebarItemType } from '../../../../model';
import styles from './SidebarSection.module.css';
import { SidebarItem } from '../../SidebarItem';
import { openCreateProjectModal } from '@/features/manage-project';
import { useGetWorkspacesQuery } from '@/entities/workspace';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';
import PlusIcon from '@/shared/assets/icons/plus.svg';
import { useAppDispatch, useAppSelector } from '@/shared/lib';

interface SidebarSectionProps {
  item: SidebarItemType;
  level: number;
}

export function SidebarSection({ item, level }: SidebarSectionProps) {
  const dispatch = useAppDispatch();
  const workspaceId = useAppSelector((state) => state.currentWorkspace.id);
  const { data: workspaces } = useGetWorkspacesQuery();
  const workspaceIsChoosed = (workspaces?.length ?? 0) > 0;

  const handleCreateProject = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (workspaceId) {
        dispatch(openCreateProjectModal({ workspaceId }));
      }
    },
    [workspaceId, dispatch],
  );

  const sortableIds = useMemo(
    () => (item.children ?? []).map((child) => child.id),
    [item.children],
  );

  const childItems = useMemo(
    () =>
      (item.children ?? []).map((child) => (
        <SidebarItem key={child.id} item={child} level={level + 1} />
      )),
    [item.children, level],
  );

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <Typography className={styles.sectionTitle} variant="label">
          {item.title}
        </Typography>
        <Button
          variant="clear"
          className={styles.plusButton}
          onClick={handleCreateProject}
          disabled={!workspaceIsChoosed}
        >
          <PlusIcon className={styles.plusIcon} />
        </Button>
      </div>

      <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
        {childItems}
      </SortableContext>
    </div>
  );
}
