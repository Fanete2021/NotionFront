'use client';

import { FC, useCallback, useState, useEffect } from 'react';
import classNames from 'classnames';
import styles from './WorkspaceModal.module.css';
import { Workspace } from '@/entities/workspace';
import { Button } from '@/shared/ui/Button';
import CheckIcon from '@/shared/assets/icons/check.svg';
import RadioCheckIcon from '@/shared/assets/icons/checkbox-checked.svg';
import PlusIcon from '@/shared/assets/icons/plus.svg';
import { Modal } from '@/shared/ui/modal';
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

  useEffect(() => {
    if (isOpen) {
      //eslint-disable-next-line
      setSelectedId(currentWorkspaceId);
    }
  }, [isOpen, currentWorkspaceId]);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedId) {
      onSelect(selectedId);
    }
  }, [selectedId, onSelect]);

  const handleOpenCreateModal = useCallback(() => {
    onOpenCreateModal();
  }, [onOpenCreateModal]);

  const header = (
    <div className={styles.heading}>
      <Typography variant="text-medium" className={styles.title}>
        Рабочее пространство
      </Typography>
      <Typography variant="caption" className={styles.subtitle}>
        Выберите активное рабочее пространство
      </Typography>
    </div>
  );

  const footer = (
    <div className={styles.actions}>
      <Button variant="outline" onClick={onClose}>
        Отмена
      </Button>
      <Button
        variant="filled"
        onClick={handleConfirm}
        addonLeft={<CheckIcon />}
        disabled={!selectedId}
      >
        Выбрать
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      headerDivider
      footerDivider
      header={header}
      footer={footer}
    >
      <div className={styles.content}>
        <div className={styles.workspaceList}>
          {workspaces.length === 0 ? (
            <div className={styles.emptyState}>Нет рабочих пространств</div>
          ) : (
            workspaces.map((workspace) => {
              const isSelected = selectedId === workspace.id;

              return (
                <Button
                  key={workspace.id}
                  variant="clear"
                  className={classNames(styles.workspaceItem, {
                    [styles.selected]: isSelected,
                  })}
                  onClick={() => handleSelect(workspace.id)}
                  aria-pressed={isSelected}
                >
                  <span
                    className={styles.workspaceAvatar}
                    style={{ backgroundColor: workspace.color ?? undefined }}
                  >
                    {workspace.icon || workspace.name[0]?.toUpperCase() || 'W'}
                  </span>
                  <Typography variant="text-medium" className={styles.workspaceName}>
                    {workspace.name}
                  </Typography>
                  <span
                    className={classNames(styles.radio, { [styles.radioChecked]: isSelected })}
                    aria-hidden
                  >
                    {isSelected && <RadioCheckIcon className={styles.radioIcon} />}
                  </span>
                </Button>
              );
            })
          )}
        </div>

        <Button
          variant="clear"
          align="start"
          className={styles.createButton}
          fullWidth
          onClick={handleOpenCreateModal}
        >
          <span className={styles.createIcon} aria-hidden>
            <PlusIcon />
          </span>
          <Typography variant="text-medium" className={styles.createText}>
            Добавить рабочее пространство
          </Typography>
        </Button>
      </div>
    </Modal>
  );
};
