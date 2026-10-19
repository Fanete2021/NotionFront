'use client';

import { FC, useEffect, useCallback } from 'react';
import { Controller, type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './CreateWorkspaceModal.module.css';
import {
  createWorkspaceFormSchema,
  type CreateWorkspaceFormValues,
} from '../../utils/validationCreateWorkspaceFormConfig';
import {
  closeCreateWorkspaceModal,
  workspaceModalsReducer,
} from '../../slice/workspaceModalsSlice';
import { setCurrentWorkspace } from '@/entities/workspace';
import { useCreateWorkspaceMutation } from '@/entities/workspace';
import { Workspace, CreateWorkspaceDto } from '@/entities/workspace';
import { useAppSelector, useAppDispatch, useAppStore } from '@/shared/lib';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Typography } from '@shared/ui/typography';
import { useMutationWithError } from '@/shared/lib';
import { HTTP_STATUS } from '@/shared/const/httpStatus';
import { FormError } from '@/shared/ui/form-error';
import PlusIcon from '@/shared/assets/icons/plus.svg';

const FORM_ID = 'createWorkspaceForm';

export const CreateWorkspaceModal: FC = () => {
  const store = useAppStore();
  const dispatch = useAppDispatch();
  const { control, handleSubmit, reset } = useForm<CreateWorkspaceFormValues>({
    resolver: zodResolver(createWorkspaceFormSchema),
    defaultValues: { name: '' },
  });
  const name = useWatch({ control, name: 'name' });

  useEffect(() => {
    store.injectReducer('workspaceModals', workspaceModalsReducer);
  }, [store]);

  const isOpen = useAppSelector((state) => state.workspaceModals?.isCreateWorkspaceModalOpen);

  const {
    execute: createWorkspace,
    isLoading,
    error: mutationError,
    fieldErrors,
  } = useMutationWithError<Workspace, { body: CreateWorkspaceDto }>(useCreateWorkspaceMutation, {
    onSuccess: (newWorkspace) => {
      reset();
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
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit: SubmitHandler<CreateWorkspaceFormValues> = async () => {
    try {
      await createWorkspace({ body: { name: name.trim() } });
    } catch (error) {
      console.error('Ошибка при создании рабочего пространства:', error);
    }
  };

  const handleClose = useCallback(() => {
    reset();
    dispatch(closeCreateWorkspaceModal());
  }, [dispatch, reset]);

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
        type="submit"
        form={FORM_ID}
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
      <form id={FORM_ID} className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              id="workspaceName"
              type="text"
              label="Название"
              error={fieldState.error?.message ?? fieldErrors.name}
              placeholder="Название рабочего пространства..."
              autoFocus
              disabled={isLoading}
            />
          )}
        />
        <FormError message={mutationError} />
      </form>
    </Modal>
  );
};
