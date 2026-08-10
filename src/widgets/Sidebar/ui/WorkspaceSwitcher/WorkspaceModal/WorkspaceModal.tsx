'use client';

import { FC, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './WorkspaceModal.module.css';
import { CreateWorkspaceModal } from '@/features/create-workspace';
import { Workspace } from '@/entities/workspace';
import { Button } from '@/shared/ui/Button';
import ActiveCircleIcon from '@/shared/assets/icons/active-circle.svg';
import CircleIcon from '@/shared/assets/icons/circle.svg';
import PlusIcon from '@/shared/assets/icons/plus.svg';
import { Typography } from '@/shared/ui/Typography';
import { useAppDispatch, openCreateWorkspaceModal } from '@/shared/lib';

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaces: Workspace[];
  currentWorkspaceId: string | null;
  onSelect: (workspaceId: string) => void;
  onWorkspaceCreated?: () => void;
}

export const WorkspaceModal: FC<WorkspaceModalProps> = ({
  isOpen,
  onClose,
  workspaces,
  currentWorkspaceId,
  onSelect,
  onWorkspaceCreated,
}) => {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(currentWorkspaceId);

  if (!isOpen) return null;

  const filteredWorkspaces = workspaces.filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleConfirm = () => {
    if (selectedId) {
      onSelect(selectedId);
    }
  };

  const handleOpenCreateModal = () => {
    dispatch(openCreateWorkspaceModal());
  };

  const modalContent = (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <Typography variant="text-modal" className={styles.title}>
            Выбор рабочего пространства
          </Typography>

          <div className={styles.workspaceList}>
            {filteredWorkspaces.length === 0 ? (
              <div className={styles.emptyState}>
                {searchQuery ? 'Ничего не найдено' : 'Нет рабочих пространств'}
              </div>
            ) : (
              filteredWorkspaces.map((workspace) => (
                <Button
                  key={workspace.id}
                  variant="clear"
                  className={`${styles.workspaceItem} ${
                    selectedId === workspace.id ? styles.selected : ''
                  }`}
                  onClick={() => handleSelect(workspace.id)}
                >
                  <div className={styles.workspaceItemLeft}>
                    <span className={styles.workspaceAvatar}>
                      {workspace.name[0]?.toUpperCase() || 'W'}
                    </span>
                    {selectedId === workspace.id ? (
                      <Typography variant="text-medium" className={styles.active}>
                        {workspace.name}
                      </Typography>
                    ) : (
                      <Typography variant="text-regular" className={styles.unActive}>
                        {workspace.name}
                      </Typography>
                    )}
                  </div>
                  {selectedId === workspace.id ? (
                    <ActiveCircleIcon className={styles.checkIcon} />
                  ) : (
                    <CircleIcon className={styles.checkIcon} />
                  )}
                </Button>
              ))
            )}
          </div>

          <Button variant="outline" className={styles.createButton} onClick={handleOpenCreateModal}>
            <PlusIcon className={styles.plusIcon} />
            <span className={styles.addWorkspaceText}>Добавить рабочее пространство</span>
          </Button>

          <div className={styles.actions}>
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button variant="filled" onClick={handleConfirm} disabled={!selectedId}>
              Выбрать
            </Button>
          </div>
        </div>
      </div>

      <CreateWorkspaceModal />
    </>
  );

  return createPortal(modalContent, document.body);
};
