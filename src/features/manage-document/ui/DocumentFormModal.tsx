'use client';

import { FC, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import classNames from 'classnames';
import styles from './DocumentFormModal.module.css';
import {
  DocumentModalsState,
  closeCreateDocumentModal,
  closeEditDocumentModal,
  documentModalsReducer,
} from '../model/slices/documentModalsSlice';
import {
  DOCUMENT_TYPE,
  DocumentFormValues,
  DocumentType,
  documentFormSchema,
} from '../utils/validationDocumentFormConfig';
import {
  Page,
  PageType,
  PAGE_TYPE,
  CreatePageDto,
  useCreatePageMutation,
  useUpdatePageMutation,
} from '@/entities/page';
import { useGetWorkspacesQuery } from '@/entities/workspace';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { IconPicker, DOCUMENT_ICONS } from '@/shared/ui/icon-picker';
import { Select } from '@/shared/ui/select';
import { Typography } from '@/shared/ui/Typography';
import { useAppSelector, useAppDispatch, useAppStore, useMutationWithError } from '@/shared/lib';
import { HTTP_STATUS } from '@/shared/const/httpStatus';
import { ROUTES } from '@/shared/routes';
import { FormError } from '@/shared/ui/form-error';
import GlobusIcon from '@/shared/assets/icons/globus.svg';
import CheckIcon from '@/shared/assets/icons/check.svg';

const FORM_ID = 'documentForm';

const DOCUMENT_TO_PAGE_TYPE: Record<DocumentType, PageType> = {
  [DOCUMENT_TYPE.DOCUMENT]: PAGE_TYPE.DOC,
  [DOCUMENT_TYPE.SECTION]: PAGE_TYPE.ARTICLE,
};

const PAGE_TO_DOCUMENT_TYPE: Record<PageType, DocumentType> = {
  [PAGE_TYPE.DOC]: DOCUMENT_TYPE.DOCUMENT,
  [PAGE_TYPE.ARTICLE]: DOCUMENT_TYPE.SECTION,
};

const defaultDocumentModalsState: DocumentModalsState = {
  isCreateDocumentModalOpen: false,
  creatingDocumentProjectId: null,
  isEditDocumentModalOpen: false,
  editingDocumentId: null,
  editingDocumentTitle: '',
  editingDocumentIcon: null,
  editingDocumentType: PAGE_TYPE.DOC,
};

const emptyFormValues: DocumentFormValues = {
  title: '',
  type: DOCUMENT_TYPE.DOCUMENT,
  icon: null,
  workspaceId: '',
};

export const DocumentFormModal: FC = () => {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<DocumentFormValues>({
    defaultValues: emptyFormValues,
    resolver: zodResolver(documentFormSchema),
  });

  const titleValue = useWatch({ control, name: 'title' });

  useEffect(() => {
    store.injectReducer('documentModals', documentModalsReducer);
  }, [store]);

  const {
    isCreateDocumentModalOpen,
    isEditDocumentModalOpen,
    creatingDocumentProjectId: projectId,
    editingDocumentId: documentId,
    editingDocumentTitle: currentTitle,
    editingDocumentIcon: currentIcon,
    editingDocumentType: currentType,
  } = useAppSelector((state) => state.documentModals ?? defaultDocumentModalsState);

  const isCreate = isCreateDocumentModalOpen;
  const isOpen = isCreateDocumentModalOpen || isEditDocumentModalOpen;

  const { data: workspaces } = useGetWorkspacesQuery();
  const currentWorkspaceId = useAppSelector((state) => state.currentWorkspace.id);

  const workspaceOptions = (workspaces ?? []).map((workspace) => ({
    value: workspace.id,
    label: workspace.name,
  }));

  const {
    execute: createPage,
    isLoading: isCreating,
    error: createError,
    fieldErrors: createFieldErrors,
  } = useMutationWithError<Page, CreatePageDto>(useCreatePageMutation, {
    onSuccess: (createdPage) => {
      dispatch(closeCreateDocumentModal());
      router.push(`${ROUTES.documents}/${createdPage.id}`);
    },
    fieldMap: {
      [HTTP_STATUS.BAD_REQUEST]: {
        field: 'title',
        message: 'Название документа не может быть пустым',
      },
      [HTTP_STATUS.NOT_FOUND]: {
        field: 'title',
        message: 'Проект не найден',
      },
      [HTTP_STATUS.FORBIDDEN]: {
        field: 'title',
        message: 'Нет прав на создание документа в этом проекте',
      },
    },
  });

  const {
    execute: updatePage,
    isLoading: isUpdating,
    error: updateError,
    fieldErrors: updateFieldErrors,
  } = useMutationWithError(useUpdatePageMutation, {
    onSuccess: () => {
      dispatch(closeEditDocumentModal());
    },
    fieldMap: {
      [HTTP_STATUS.BAD_REQUEST]: {
        field: 'title',
        message: 'Название документа не может быть пустым',
      },
      [HTTP_STATUS.NOT_FOUND]: {
        field: 'title',
        message: 'Документ не найден',
      },
      [HTTP_STATUS.FORBIDDEN]: {
        field: 'title',
        message: 'Нет прав на изменение этого документа',
      },
    },
  });

  const isLoading = isCreate ? isCreating : isUpdating;
  const mutationError = isCreate ? createError : updateError;
  const fieldErrors = isCreate ? createFieldErrors : updateFieldErrors;

  useEffect(() => {
    if (!isOpen) return;

    reset({
      title: isCreate ? '' : currentTitle,
      type: isCreate ? DOCUMENT_TYPE.DOCUMENT : PAGE_TO_DOCUMENT_TYPE[currentType],
      icon: isCreate ? null : currentIcon,
      workspaceId: currentWorkspaceId ?? '',
    });
  }, [isOpen, isCreate, currentTitle, currentType, currentIcon, currentWorkspaceId, reset]);

  const onSubmit: SubmitHandler<DocumentFormValues> = async (values) => {
    try {
      if (isCreate) {
        if (!projectId) {
          setError('root', { message: 'Проект не найден' });
          return;
        }
        await createPage({
          title: values.title,
          workspaceId: values.workspaceId,
          projectId,
          icon: values.icon ?? undefined,
          type: DOCUMENT_TO_PAGE_TYPE[values.type],
        });
      } else {
        if (!documentId) {
          setError('root', { message: 'Документ не найден' });
          return;
        }
        await updatePage({
          id: documentId,
          workspaceId: values.workspaceId,
          data: {
            title: values.title,
            icon: values.icon,
            type: DOCUMENT_TO_PAGE_TYPE[values.type],
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    clearErrors();
    dispatch(isCreate ? closeCreateDocumentModal() : closeEditDocumentModal());
  };

  const header = (
    <div className={styles.heading}>
      <Typography variant="text-medium" className={styles.title}>
        {isCreate ? 'Создать документ' : 'Редактировать документ'}
      </Typography>
      <Typography variant="caption" className={styles.subtitle}>
        {isCreate
          ? 'Добавьте новый документ в рабочее пространство'
          : 'Измените параметры документа'}
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
        addonLeft={
          isCreate ? (
            <GlobusIcon className={styles.submitIcon} />
          ) : (
            <CheckIcon className={styles.submitIcon} />
          )
        }
        disabled={isLoading || !titleValue.trim()}
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
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.field}>
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                id={`${FORM_ID}Name`}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message ?? fieldErrors.title}
                type="text"
                label="Название"
                placeholder="Название документа..."
                autoFocus
                disabled={isLoading}
              />
            )}
          />
          <FormError message={errors.root?.message ?? mutationError} />
        </div>

        <div className={styles.field}>
          <Typography variant="caption" className={styles.label}>
            Тип
          </Typography>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <div className={styles.segmented} role="group" aria-label="Тип">
                <Button
                  variant="clear"
                  className={classNames(styles.segment, {
                    [styles.segmentActive]: field.value === DOCUMENT_TYPE.DOCUMENT,
                  })}
                  aria-pressed={field.value === DOCUMENT_TYPE.DOCUMENT}
                  onClick={() => field.onChange(DOCUMENT_TYPE.DOCUMENT)}
                  disabled={isLoading}
                >
                  Документ
                </Button>
                <Button
                  variant="clear"
                  className={classNames(styles.segment, {
                    [styles.segmentActive]: field.value === DOCUMENT_TYPE.SECTION,
                  })}
                  aria-pressed={field.value === DOCUMENT_TYPE.SECTION}
                  onClick={() => field.onChange(DOCUMENT_TYPE.SECTION)}
                  disabled={isLoading}
                >
                  Раздел
                </Button>
              </div>
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
              <IconPicker
                icons={DOCUMENT_ICONS}
                selectedIcon={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <div className={styles.field}>
          <Typography variant="label" htmlFor={`${FORM_ID}Location`} className={styles.label}>
            Расположение
          </Typography>
          <Controller
            name="workspaceId"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Select
                  id={`${FORM_ID}Location`}
                  value={field.value}
                  onChange={field.onChange}
                  options={workspaceOptions}
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
