'use client';

import { FC, useState } from 'react';
import styles from './CreateDocumentModal.module.css';
import { Modal } from '@/shared/ui/Modal/Modal';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useAppSelector, useAppDispatch, closeCreateDocumentModal } from '@/shared/lib';

export const CreateDocumentModal: FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.sidebar.isCreateDocumentModalOpen);
  const projectId = useAppSelector((state) => state.sidebar.creatingDocumentProjectId);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Название документа обязательно');
      return;
    }
    console.log('📄 Создать документ в проекте:', projectId, 'с именем:', name);
    // TODO: интеграция с бэкендом
    dispatch(closeCreateDocumentModal());
    setName('');
  };

  const handleClose = () => {
    setName('');
    setError(null);
    dispatch(closeCreateDocumentModal());
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Создать документ">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="documentName" className={styles.label}>
            Название документа
          </label>
          <Input
            id="documentName"
            type="text"
            value={name}
            onChange={(str) => setName(str)}
            placeholder="Введите название документа..."
            className={styles.input}
            autoFocus
          />
          {error && <span className={styles.error}>{error}</span>}
        </div>
        <div className={styles.actions}>
          <Button type="button" onClick={handleClose} className={styles.cancelButton}>
            Отмена
          </Button>
          <Button type="submit" className={styles.submitButton} disabled={!name.trim()}>
            Создать
          </Button>
        </div>
      </form>
    </Modal>
  );
};
