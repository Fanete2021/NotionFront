'use client';

import { FC, useState, useEffect, useCallback } from 'react';
import styles from './ProjectFormModal.module.css';
import {
  closeCreateProjectModal,
  closeEditProjectModal,
  projectModalsReducer,
} from '../model/projectModalsSlice';
import { useCreateProjectMutation, useUpdateProjectMutation } from '@/entities/project';
import { Modal } from '@/shared/ui/Modal/Modal';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { ColorPicker } from '@/shared/ui/ColorPicker/ColorPicker';
import { Colors } from '@/shared/const/colors';
import { IconPicker } from '@/shared/ui/IconPicker/IconPicker';
import { useAppSelector, useAppDispatch, useAppStore } from '@/shared/lib';

interface ProjectFormModalProps {
  mode: 'create' | 'edit';
}

const DEFAULT_COLOR = Colors.WHITE;

const defaultProjectModalsState = {
  isCreateProjectModalOpen: false,
  isEditProjectModalOpen: false,
  creatingProjectWorkspaceId: null,
  editingProjectId: null,
  editingProjectName: '',
  editingProjectColor: null,
  editingProjectIcon: null,
} as const;

export const ProjectFormModal: FC<ProjectFormModalProps> = ({ mode }) => {
  const dispatch = useAppDispatch();
  const store = useAppStore();

  useEffect(() => {
    store.injectReducer('projectModals', projectModalsReducer);
  }, [store]);

  const {
    isCreateProjectModalOpen,
    isEditProjectModalOpen,
    creatingProjectWorkspaceId: workspaceId,
    editingProjectId: projectId = '',
    editingProjectName: currentName,
    editingProjectColor: currentColor,
    editingProjectIcon: currentIcon,
  } = useAppSelector((state) => state.projectModals ?? defaultProjectModalsState);

  const isOpen = mode === 'create' ? isCreateProjectModalOpen : isEditProjectModalOpen;

  const [name, setName] = useState(mode === 'create' ? '' : currentName);
  const [color, setColor] = useState<string | null>(
    mode === 'create' || currentColor === null ? DEFAULT_COLOR : currentColor,
  );
  const [icon, setIcon] = useState<string | null>(mode === 'create' ? null : (currentIcon ?? null));
  const [error, setError] = useState<string | null>(null);

  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

  const isLoading = mode === 'create' ? isCreating : isUpdating;

  useEffect(() => {
    if (isOpen) {
      if (mode === 'create') {
        //eslint-disable-next-line
        setName('');
        setColor(DEFAULT_COLOR);
        setIcon(null);
        setError(null);
      } else {
        setName(currentName);
        setColor(currentColor ?? DEFAULT_COLOR);
        setIcon(currentIcon ?? null);
        setError(null);
      }
    }
  }, [isOpen, mode, currentName, currentColor, currentIcon]);

  const handleClose = useCallback(() => {
    if (mode === 'create') {
      dispatch(closeCreateProjectModal());
    } else {
      dispatch(closeEditProjectModal());
    }
    setError(null);
  }, [mode, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Название проекта обязательно');
      return;
    }

    const isDefaultColor = color === DEFAULT_COLOR;
    const shouldSendColor = !(isDefaultColor && (mode === 'create' || currentColor === null));
    const colorToSend = shouldSendColor ? (color ?? undefined) : undefined;

    try {
      if (mode === 'create') {
        if (!workspaceId) {
          setError('Workspace не найден');
          return;
        }
        await createProject({
          workspaceId,
          data: {
            name: trimmed,
            color: colorToSend,
            icon: icon ?? undefined,
          },
        }).unwrap();
      } else {
        const hasChanges =
          trimmed !== currentName || color !== currentColor || icon !== currentIcon;
        if (!hasChanges) {
          handleClose();
          return;
        }
        await updateProject({
          id: projectId ?? '',
          data: {
            name: trimmed,
            color: colorToSend,
            icon: icon === null ? null : (icon ?? undefined),
          },
        }).unwrap();
      }
      handleClose();
    } catch (err: unknown) {
      const errorData = (err as { data?: { message?: string } })?.data;
      setError(errorData?.message || 'Ошибка при сохранении проекта');
    }
  };

  const title = mode === 'create' ? 'Создать проект' : 'Редактировать проект';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="projectName" className={styles.label}>
            Название проекта
          </label>
          <Input
            id="projectName"
            type="text"
            value={name}
            onChange={(str) => setName(str)}
            placeholder="Введите название..."
            className={styles.input}
            autoFocus
            disabled={isLoading}
          />
          {error && <span className={styles.error}>{error}</span>}
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Цвет</span>
          <ColorPicker selectedColor={color} onChange={setColor} />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Иконка</span>
          <IconPicker selectedIcon={icon} onChange={setIcon} />
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
            type="submit"
            className={styles.submitButton}
            disabled={isLoading || !name.trim()}
          >
            {isLoading ? 'Сохранение...' : mode === 'create' ? 'Создать' : 'Сохранить'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
