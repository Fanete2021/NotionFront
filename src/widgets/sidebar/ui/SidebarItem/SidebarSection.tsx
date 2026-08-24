'use client';

import { useCallback, useState } from 'react';
import { SidebarItem as SidebarItemType } from '../../model/types/sidebar';
import styles from './SidebarItem.module.css';
import { SidebarItem } from './SidebarItem';
import { openCreateProjectModal } from '@/features/manage-project';
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
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleCreateProject = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (workspaceId) {
        dispatch(openCreateProjectModal({ workspaceId }));
      }
    },
    [workspaceId, dispatch],
  );

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader} onClick={handleToggle}>
        <Typography className={styles.sectionTitle} variant="label">
          {item.title}
        </Typography>
        <Button variant="clear" className={styles.plusButton} onClick={handleCreateProject}>
          <PlusIcon className={styles.plusIcon} />
        </Button>
      </div>

      {isOpen &&
        item.children?.map((child) => (
          <SidebarItem key={child.id} item={child} level={level + 1} />
        ))}
    </div>
  );
}
