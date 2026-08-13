'use client';

import { FC, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './WorkspaceModal.module.css';
import { Workspace } from '@/entities/workspace';
import { Button } from '@/shared/ui/Button';
import ActiveCircleIcon from '@/shared/assets/icons/active-circle.svg';
import CircleIcon from '@/shared/assets/icons/circle.svg';
import PlusIcon from '@/shared/assets/icons/plus.svg';
import CloseIcon from '@/shared/assets/icons/x-close.svg';
import { Typography } from '@/shared/ui/Typography';

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaces: Workspace[];
  currentWorkspaceId: string | null;
  onSelect: (workspaceId: string) => void;
  onOpenCreateModal: () => void;
}

export const WorkspaceModal: FC<WorkspaceModalProps> = ({
  isOpen,
  onClose,
  workspaces,
  currentWorkspaceId,
  onSelect,
  onOpenCreateModal,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(currentWorkspaceId);

  if (!isOpen) return null;

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleConfirm = () => {
    if (selectedId) {
      onSelect(selectedId);
    }
  };

  const handleOpenCreateModal = () => {
    onOpenCreateModal();
  };

  const modalContent = (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <Typography variant="text-modal" className={styles.title}>
              Выбор рабочего пространства
            </Typography>
            <Button variant="clear" className={styles.closeButton} onClick={onClose}>
              <CloseIcon className={styles.icon} />
            </Button>
          </div>

          <div className={styles.workspaceList}>
            {workspaces.length === 0 ? (
              <div className={styles.emptyState}>Нет рабочих пространств</div>
            ) : (
              workspaces.map((workspace) => (
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
    </>
  );

  return createPortal(modalContent, document.body);
};
