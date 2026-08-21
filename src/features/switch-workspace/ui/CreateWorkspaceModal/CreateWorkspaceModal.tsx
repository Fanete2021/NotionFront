'use client';

import { FC, useState, useEffect, useCallback } from 'react';
import styles from './CreateWorkspaceModal.module.css';
import {
  closeCreateWorkspaceModal,
  workspaceModalsReducer,
} from '../../model/workspaceModalsSlice';
import { setCurrentWorkspace, useCreateWorkspaceMutation } from '@/entities/workspace';
import { useAppSelector, useAppDispatch, useAppStore } from '@/shared/lib';
import { Modal } from '@/shared/ui/Modal/Modal';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

export const CreateWorkspaceModal: FC = () => {
  const store = useAppStore();
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [createWorkspace, { isLoading }] = useCreateWorkspaceMutation();

  useEffect(() => {
    store.injectReducer('workspaceModals', workspaceModalsReducer);
  }, [store]);

  const isOpen = useAppSelector((state) => state.workspaceModals?.isCreateWorkspaceModalOpen);

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
    try {
      const newWorkspace = await createWorkspace({ name: trimmed }).unwrap();
      setName('');
      dispatch(closeCreateWorkspaceModal());
      dispatch(setCurrentWorkspace(newWorkspace.id));
    } catch (err: unknown) {
      const errorData = (err as { data?: { message?: string } })?.data;
      setError(errorData?.message || 'Ошибка при создании workspace');
    }
  }, [name, createWorkspace, dispatch]);

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

  return (
    <Modal
      isOpen={isOpen ?? false}
      onClose={handleClose}
      title="Добавить рабочее пространство"
      className={styles.modal}
    >
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.field}>
          <Input
            id="workspaceName"
            type="text"
            value={name}
            label={'Название'}
            onChange={(str) => setName(str)}
            placeholder="My workspace"
            className={styles.input}
            autoFocus
            disabled={isLoading}
            onKeyDown={handleKeyDown}
          />
          {error && <span className={styles.error}>{error}</span>}
        </div>
        <div className={styles.actions}>
          <Button
            type="button"
            onClick={handleClose}
            className={styles.cancelButton}
            disabled={isLoading}
          >
            Отмена
          </Button>
          <Button
            variant="filled"
            type="button"
            onClick={handleCreate}
            className={styles.submitButton}
            disabled={isLoading || !name.trim()}
          >
            {isLoading ? 'Создание...' : 'Создать'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
