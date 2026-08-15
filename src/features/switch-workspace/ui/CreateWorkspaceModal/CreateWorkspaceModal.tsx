'use client';

import { FC, useState, useEffect } from 'react';
import styles from './CreateWorkspaceModal.module.css';
import { useCreateWorkspaceMutation } from '@/entities/workspace';
import { Modal } from '@/shared/ui/Modal/Modal';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import {
  useAppSelector,
  useAppDispatch,
  closeCreateWorkspaceModal,
  setCurrentWorkspace,
} from '@/shared/lib';

export const CreateWorkspaceModal: FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.workspaceModals.isCreateWorkspaceModalOpen);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [createWorkspace, { isLoading }] = useCreateWorkspaceMutation();

  useEffect(() => {
    if (isOpen) {
      //eslint-disable-next-line
      setName('');
      setError(null);
    }
  }, [isOpen]);

  const handleCreate = async () => {
    console.log('🚀 handleCreate вызван');
    setError(null);
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Название обязательно');
      return;
    }
    try {
      const newWorkspace = await createWorkspace({ name: trimmed }).unwrap();
      console.log('✅ Workspace создан:', newWorkspace);
      setName('');
      dispatch(closeCreateWorkspaceModal());
      dispatch(setCurrentWorkspace(newWorkspace.id));
    } catch (err: unknown) {
      const errorData = (err as { data?: { message?: string } })?.data;
      setError(errorData?.message || 'Ошибка при создании workspace');
    }
  };

  const handleClose = () => {
    setName('');
    setError(null);
    dispatch(closeCreateWorkspaceModal());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && name.trim()) {
      handleCreate();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
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
