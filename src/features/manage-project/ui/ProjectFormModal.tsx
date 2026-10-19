'use client';

import { FC, useEffect, useCallback } from 'react';
import { Controller, type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './ProjectFormModal.module.css';
import { projectFormSchema, type ProjectFormValues } from '../utils/validationProjectFormConfig';
import {
  closeCreateProjectModal,
  closeEditProjectModal,
  projectModalsReducer,
} from '../slice/projectModalsSlice';
import { useCreateProjectMutation, useUpdateProjectMutation } from '@/entities/project';
import { useGetWorkspacesQuery } from '@/entities/workspace';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@shared/ui/button';
import { Input } from '@/shared/ui/input';
import { ColorPicker } from '@/shared/ui/color-picker';
import { Colors } from '@/shared/const/colors';
import { IconPicker } from '@/shared/ui/icon-picker';
import { Select } from '@/shared/ui/select';
import { Typography } from '@shared/ui/typography';
import { useAppSelector, useAppDispatch, useAppStore } from '@/shared/lib';
import { useMutationWithError } from '@/shared/lib';
import { HTTP_STATUS } from '@/shared/const/httpStatus';
import { FormError } from '@/shared/ui/form-error';
import PlusIcon from '@/shared/assets/icons/plus.svg';
import CheckIcon from '@/shared/assets/icons/check.svg';

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

  const workspaceOptions = (workspaces ?? []).map((workspace) => ({
    value: workspace.id,
    label: workspace.name,
  }));

  const { control, handleSubmit, reset, setError } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: '',
      color: DEFAULT_COLOR,
      icon: null,
      workspaceId: '',
    },
  });
  const [name, color] = useWatch({ control, name: ['name', 'color'] });

  const {
    execute: createProject,
    isLoading: isCreating,
    error: createError,
    fieldErrors: createFieldErrors,
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
    fieldErrors: updateFieldErrors,
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
  const fieldErrors = isCreate ? createFieldErrors : updateFieldErrors;

  useEffect(() => {
    if (!isOpen) return;

    reset({
      name: isCreate ? '' : currentName,
      color: isCreate ? DEFAULT_COLOR : (currentColor ?? DEFAULT_COLOR),
      icon: isCreate ? null : (currentIcon ?? null),
      workspaceId: (isCreate ? sourceWorkspaceId : currentWorkspaceId) ?? '',
    });
  }, [
    isOpen,
    isCreate,
    currentName,
    currentColor,
    currentIcon,
    sourceWorkspaceId,
    currentWorkspaceId,
    reset,
  ]);

  const handleClose = useCallback(() => {
    if (isCreate) {
      dispatch(closeCreateProjectModal());
    } else {
      dispatch(closeEditProjectModal());
    }
  }, [isCreate, dispatch]);

  const onSubmit: SubmitHandler<ProjectFormValues> = async (values) => {
    const isDefaultColor = values.color === DEFAULT_COLOR;
    const shouldSendColor = !(isDefaultColor && (isCreate || currentColor === null));
    const colorToSend = shouldSendColor ? (values.color ?? undefined) : undefined;

    if (isCreate) {
      if (!workspaceId) {
        setError('Workspace не найден');
        return;
      }
      await createProject({
        workspaceId,
        body: {
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
        body: {
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
      <form id={formId} onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.field}>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                id="projectName"
                type="text"
                label="Название"
                error={fieldState.error?.message ?? fieldErrors.name}
                placeholder="Название проекта..."
                autoFocus
                disabled={isLoading}
              />
            )}
          />
          <FormError message={mutationError} />
        </div>

        <div className={styles.field}>
          <Typography variant="caption" className={styles.label}>
            Цвет
          </Typography>
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <ColorPicker
                selectedColor={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
        </div>

        <div className={styles.field}>
          <Typography variant="caption" className={styles.label}>
            Иконка{' '}
            <Typography variant="caption" className={styles.labelHint}>
              (необязательно)
            </Typography>
          </Typography>
          <Controller
            name="icon"
            control={control}
            render={({ field }) => (
              <IconPicker selectedIcon={field.value} onChange={field.onChange} color={color} />
            )}
          />
        </div>

        <div className={styles.field}>
          <Typography variant="label" htmlFor={`${formId}Workspace`} className={styles.label}>
            Рабочее пространство
          </Typography>
          <Controller
            name="workspaceId"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Select
                  id={`${formId}Workspace`}
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  options={workspaceOptions}
                  placeholder="Выберите рабочее пространство"
                  placeholderDisabled
                  disabled={isLoading || !isCreate}
                />
                <FormError message={fieldState.error?.message ?? null} />
              </>
            )}
          />
        </div>
      </form>
    </Modal>
  );
};
