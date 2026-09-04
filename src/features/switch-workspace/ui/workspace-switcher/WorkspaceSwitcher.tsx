'use client';

import { useCallback, useState } from 'react';
import styles from './WorkspaceSwitcher.module.css';
import { openCreateWorkspaceModal, WorkspaceModal } from '../../index';
import { CreateWorkspaceModal } from '../create-workspace-modal/CreateWorkspaceModal';
import { setCurrentWorkspace, useGetWorkspacesQuery } from '@/entities/workspace';
import { Typography } from '@/shared/ui/Typography';
import { useAppSelector, useAppDispatch } from '@/shared/lib';
import { Button } from '@/shared/ui/Button';

export const WorkspaceSwitcher = () => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: workspaces, isLoading } = useGetWorkspacesQuery();
  const currentWorkspaceId = useAppSelector((state) => state.currentWorkspace.id);

  const currentWorkspace = workspaces?.find((w) => w.id === currentWorkspaceId);

  const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

  const handleSelectWorkspace = useCallback(
    (workspaceId: string) => {
      dispatch(setCurrentWorkspace(workspaceId));
      setIsModalOpen(false);
    },
    [dispatch],
  );

  const handleOpenCreateModal = useCallback(() => {
    setIsModalOpen(false);
    dispatch(openCreateWorkspaceModal());
  }, [dispatch]);

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <>
      <Button className={styles.trigger} variant="clear" onClick={handleOpenModal}>
        <div className={styles.triggerContent}>
          <span
            className={styles.workspaceIcon}
            style={{
              backgroundColor: currentWorkspace?.color || 'var(--color-sidebar-logo-bg)',
            }}
          >
            {currentWorkspace?.icon || currentWorkspace?.name?.[0]?.toUpperCase() || 'N'}
          </span>
          <Typography variant="text-medium" className={styles.workspaceName}>
            {currentWorkspace?.name || 'Выберите workspace'}
          </Typography>
        </div>
      </Button>

      <WorkspaceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        workspaces={workspaces || []}
        currentWorkspaceId={currentWorkspaceId}
        onSelect={handleSelectWorkspace}
        onOpenCreateModal={handleOpenCreateModal}
      />

      <CreateWorkspaceModal />
    </>
  );
};
