'use client';

import { FC, useState, useEffect, useCallback } from 'react';
import styles from './CreateWorkspaceModal.module.css';
import {
  closeCreateWorkspaceModal,
  workspaceModalsReducer,
} from '../../model/workspaceModalsSlice';
import { setCurrentWorkspace } from '@/entities/workspace';
import { useCreateWorkspaceMutation } from '@/entities/workspace';
import { Workspace } from '@/entities/workspace';
import { useAppSelector, useAppDispatch, useAppStore } from '@/shared/lib';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Typography } from '@/shared/ui/Typography';
import { useMutationWithError } from '@/shared/lib';
import { HTTP_STATUS } from '@/shared/const/httpStatus';
import { FormError } from '@/shared/ui/form-error';
import PlusIcon from '@/shared/assets/icons/plus.svg';

export const CreateWorkspaceModal: FC = () => {
  const store = useAppStore();
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    store.injectReducer('workspaceModals', workspaceModalsReducer);
  }, [store]);

  const isOpen = useAppSelector((state) => state.workspaceModals?.isCreateWorkspaceModalOpen);

  const {
    execute: createWorkspace,
    isLoading,
    error: mutationError,
  } = useMutationWithError<Workspace, { name: string }>(useCreateWorkspaceMutation, {
    onSuccess: (newWorkspace) => {
      setName('');
      dispatch(closeCreateWorkspaceModal());
      dispatch(setCurrentWorkspace(newWorkspace.id));
    },
    fieldMap: {
      [HTTP_STATUS.BAD_REQUEST]: {
        field: 'name',
        message: 'Название рабочего пространства не может быть пустым',
      },
      [HTTP_STATUS.CONFLICT]: {
        field: 'name',
        message: 'Рабочее пространство с таким названием уже существует',
      },
    },
  });

  useEffect(() => {
    if (isOpen) {
      //eslint-disable-next-line
      setName('');
      setError(null);
    }
  }, [isOpen]);

  const handleCreate = useCallback(async () => {
    setError(null);
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Название обязательно');
      return;
    }
    await createWorkspace({ name: trimmed });
  }, [name, createWorkspace]);

  const handleClose = useCallback(() => {
    setName('');
    setError(null);
    dispatch(closeCreateWorkspaceModal());
  }, [dispatch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !isLoading && name.trim()) {
        handleCreate();
      }
    },
    [isLoading, name, handleCreate],
  );

  const header = (
    <div className={styles.heading}>
      <Typography variant="text-medium" className={styles.title}>
        Новое рабочее пространство
      </Typography>
      <Typography variant="caption" className={styles.subtitle}>
        Дайте название вашему новому пространству
      </Typography>
    </div>
  );

  const footer = (
    <div className={styles.actions}>
      <Button type="button" onClick={handleClose} disabled={isLoading}>
        Отмена
      </Button>
      <Button
        variant="filled"
        type="button"
        onClick={handleCreate}
        className={styles.submitButton}
        addonLeft={<PlusIcon className={styles.submitIcon} />}
        disabled={isLoading || !name.trim()}
      >
        {isLoading ? 'Создание...' : 'Создать'}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen ?? false}
      onClose={handleClose}
      headerDivider
      footerDivider
      header={header}
      footer={footer}
    >
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <Input
          id="workspaceName"
          type="text"
          value={name}
          label="Название"
          onChange={(str) => setName(str)}
          placeholder="Название рабочего пространства..."
          autoFocus
          disabled={isLoading}
          onKeyDown={handleKeyDown}
        />
        <FormError message={error || mutationError} />
      </form>
    </Modal>
  );
};
