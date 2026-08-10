'use client';

import { FC, useState } from 'react';
import styles from './CreateWorkspaceModal.module.css';
import { useCreateWorkspaceMutation } from '@/entities/workspace';
import { Modal } from '@/shared/ui/Modal/Modal';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useAppSelector, useAppDispatch, closeCreateWorkspaceModal } from '@/shared/lib';

export const CreateWorkspaceModal: FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.sidebar.isCreateWorkspaceModalOpen);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [createWorkspace, { isLoading }] = useCreateWorkspaceMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Название обязательно');
      return;
    }
    try {
      await createWorkspace({ name: trimmed }).unwrap();
      setName('');
      dispatch(closeCreateWorkspaceModal());
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Добавить рабочее пространство"
      className={styles.modal}
    >
      <form onSubmit={handleSubmit} className={styles.form} onClick={(e) => e.stopPropagation()}>
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
            type="submit"
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
