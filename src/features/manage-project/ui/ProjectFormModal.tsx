'use client';

import { FC, useState, useEffect, useCallback } from 'react';
import styles from './ProjectFormModal.module.css';
import {
  closeCreateProjectModal,
  closeEditProjectModal,
  projectModalsReducer,
} from '../model/projectModalsSlice';
import { useCreateProjectMutation, useUpdateProjectMutation } from '@/entities/project';
import { useGetWorkspacesQuery } from '@/entities/workspace';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { ColorPicker } from '@/shared/ui/ColorPicker';
import { Colors } from '@/shared/const/colors';
import { IconPicker } from '@/shared/ui/IconPicker';
import { Typography } from '@/shared/ui/Typography';
import { useAppSelector, useAppDispatch, useAppStore } from '@/shared/lib';
import { useMutationWithError } from '@/shared/lib';
import { HTTP_STATUS } from '@/shared/const/httpStatus';
import { FormError } from '@/shared/ui/form-error';
import PlusIcon from '@/shared/assets/icons/plus.svg';
import CheckIcon from '@/shared/assets/icons/check.svg';
import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg';

interface ProjectFormModalProps {
  mode: 'create' | 'edit';
}

const DEFAULT_COLOR = Colors.INDIGO;

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
    creatingProjectWorkspaceId: sourceWorkspaceId,
    editingProjectId: projectId = '',
    editingProjectName: currentName,
    editingProjectColor: currentColor,
    editingProjectIcon: currentIcon,
  } = useAppSelector((state) => state.projectModals ?? defaultProjectModalsState);

  const isCreate = mode === 'create';
  const isOpen = isCreate ? isCreateProjectModalOpen : isEditProjectModalOpen;
  const formId = isCreate ? 'createProjectForm' : 'editProjectForm';

  const { data: workspaces } = useGetWorkspacesQuery();
  const currentWorkspaceId = useAppSelector((state) => state.currentWorkspace.id);

  const [name, setName] = useState(isCreate ? '' : currentName);
  const [color, setColor] = useState<string | null>(
    isCreate || currentColor === null ? DEFAULT_COLOR : currentColor,
  );
  const [icon, setIcon] = useState<string | null>(isCreate ? null : (currentIcon ?? null));
  const [workspaceId, setWorkspaceId] = useState<string | null>(
    isCreate ? sourceWorkspaceId : currentWorkspaceId,
  );
  const [error, setError] = useState<string | null>(null);

  const {
    execute: createProject,
    isLoading: isCreating,
    error: createError,
  } = useMutationWithError(useCreateProjectMutation, {
    onSuccess: () => {
      handleClose();
    },
    fieldMap: {
      [HTTP_STATUS.BAD_REQUEST]: {
        field: 'name',
        message: 'Название проекта не может быть пустым',
      },
      [HTTP_STATUS.CONFLICT]: {
        field: 'name',
        message: 'Проект с таким названием уже существует',
      },
    },
  });

  const {
    execute: updateProject,
    isLoading: isUpdating,
    error: updateError,
  } = useMutationWithError(useUpdateProjectMutation, {
    onSuccess: () => {
      handleClose();
    },
    fieldMap: {
      [HTTP_STATUS.BAD_REQUEST]: {
        field: 'name',
        message: 'Название проекта не может быть пустым',
      },
      [HTTP_STATUS.CONFLICT]: {
        field: 'name',
        message: 'Проект с таким названием уже существует',
      },
    },
  });

  const isLoading = isCreate ? isCreating : isUpdating;
  const mutationError = isCreate ? createError : updateError;

  useEffect(() => {
    if (isOpen) {
      if (isCreate) {
        //eslint-disable-next-line
        setName('');
        setColor(DEFAULT_COLOR);
        setIcon(null);
      } else {
        setName(currentName);
        setColor(currentColor ?? DEFAULT_COLOR);
        setIcon(currentIcon ?? null);
      }
      setWorkspaceId(isCreate ? sourceWorkspaceId : currentWorkspaceId);
      setError(null);
    }
  }, [
    isOpen,
    isCreate,
    currentName,
    currentColor,
    currentIcon,
    sourceWorkspaceId,
    currentWorkspaceId,
  ]);

  const handleClose = useCallback(() => {
    if (isCreate) {
      dispatch(closeCreateProjectModal());
    } else {
      dispatch(closeEditProjectModal());
    }
    setError(null);
  }, [isCreate, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Название проекта обязательно');
      return;
    }

    const isDefaultColor = color === DEFAULT_COLOR;
    const shouldSendColor = !(isDefaultColor && (isCreate || currentColor === null));
    const colorToSend = shouldSendColor ? (color ?? undefined) : undefined;

    if (isCreate) {
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
      });
    } else {
      const hasChanges = trimmed !== currentName || color !== currentColor || icon !== currentIcon;
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
      });
    }
  };

  const header = (
    <div className={styles.heading}>
      <Typography variant="text-medium" className={styles.title}>
        {isCreate ? 'Создать проект' : 'Редактировать проект'}
      </Typography>
      <Typography variant="caption" className={styles.subtitle}>
        {isCreate ? 'Добавьте новый проект в рабочее пространство' : 'Измените параметры проекта'}
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
        type="submit"
        form={formId}
        className={styles.submitButton}
        addonLeft={isCreate ? <PlusIcon /> : <CheckIcon />}
        disabled={isLoading || !name.trim()}
      >
        {isLoading ? 'Сохранение...' : isCreate ? 'Создать' : 'Сохранить'}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      headerDivider
      footerDivider
      header={header}
      footer={footer}
    >
      <form id={formId} onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <Input
            id="projectName"
            type="text"
            label="Название"
            value={name}
            onChange={(str) => setName(str)}
            placeholder="Название проекта..."
            autoFocus
            disabled={isLoading}
          />
          <FormError message={error || mutationError} />
        </div>

        <div className={styles.field}>
          <Typography variant="caption" className={styles.label}>
            Цвет
          </Typography>
          <ColorPicker selectedColor={color} onChange={setColor} />
        </div>

        <div className={styles.field}>
          <Typography variant="caption" className={styles.label}>
            Иконка{' '}
            <Typography variant="caption" className={styles.labelHint}>
              (необязательно)
            </Typography>
          </Typography>
          <IconPicker selectedIcon={icon} onChange={setIcon} />
        </div>

        <div className={styles.field}>
          <Typography variant="label" htmlFor={`${formId}Workspace`} className={styles.label}>
            Рабочее пространство
          </Typography>
          <div className={styles.select}>
            <select
              id={`${formId}Workspace`}
              className={styles.selectControl}
              value={workspaceId ?? ''}
              onChange={(e) => setWorkspaceId(e.target.value)}
              disabled={isLoading || !isCreate}
            >
              {workspaces?.map((workspace) => (
                <option key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </option>
              ))}
            </select>
            <ChevronDownIcon className={styles.selectIcon} />
          </div>
        </div>
      </form>
    </Modal>
  );
};
