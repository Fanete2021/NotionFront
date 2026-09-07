'use client';

import { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';
import styles from './DocumentFormModal.module.css';
import {
  closeCreateDocumentModal,
  closeEditDocumentModal,
  documentModalsReducer,
} from '../model/documentModalsSlice';
import {
  Page,
  PageType,
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

type DocumentType = 'document' | 'section';

const toPageType = (type: DocumentType): PageType => (type === 'section' ? 'ARTICLE' : 'DOC');
const toDocumentType = (type: PageType): DocumentType =>
  type === 'ARTICLE' ? 'section' : 'document';

const defaultDocumentModalsState = {
  isCreateDocumentModalOpen: false,
  creatingDocumentProjectId: null,
  isEditDocumentModalOpen: false,
  editingDocumentId: null,
  editingDocumentTitle: '',
  editingDocumentIcon: null,
  editingDocumentType: 'DOC',
} as const;

interface DocumentFormModalProps {
  mode: 'create' | 'edit';
}

export const DocumentFormModal: FC<DocumentFormModalProps> = ({ mode }) => {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const router = useRouter();
  const [name, setName] = useState('');
  const [type, setType] = useState<DocumentType>('document');
  const [icon, setIcon] = useState<string | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const isCreate = mode === 'create';
  const isOpen = isCreate ? isCreateDocumentModalOpen : isEditDocumentModalOpen;
  const formId = isCreate ? 'createDocumentForm' : 'editDocumentForm';

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
    if (isOpen) {
      //eslint-disable-next-line
      setName(isCreate ? '' : currentTitle);
      setType(isCreate ? 'document' : toDocumentType(currentType));
      setIcon(isCreate ? null : currentIcon);
      setWorkspaceId(currentWorkspaceId);
      setError(null);
    }
  }, [isOpen, isCreate, currentTitle, currentType, currentIcon, currentWorkspaceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = name.trim();
    if (!trimmed) {
      setError('Название документа обязательно');
      return;
    }
    if (!workspaceId) {
      setError('Рабочее пространство не выбрано');
      return;
    }

    try {
      if (isCreate) {
        if (!projectId) {
          setError('Проект не найден');
          return;
        }
        await createPage({
          title: trimmed,
          workspaceId,
          projectId,
          icon: icon ?? undefined,
          type: toPageType(type),
        });
      } else {
        if (!documentId) {
          setError('Документ не найден');
          return;
        }
        await updatePage({
          id: documentId,
          workspaceId,
          data: {
            title: trimmed,
            icon: icon ?? undefined,
            type: toPageType(type),
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    setError(null);
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
        form={formId}
        className={styles.submitButton}
        addonLeft={
          isCreate ? (
            <GlobusIcon className={styles.submitIcon} />
          ) : (
            <CheckIcon className={styles.submitIcon} />
          )
        }
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
            id={`${formId}Name`}
            type="text"
            label="Название"
            value={name}
            onChange={(str) => setName(str)}
            placeholder="Название документа..."
            autoFocus
            disabled={isLoading}
          />
          <FormError message={error ?? fieldErrors.title ?? mutationError} />
        </div>

        <div className={styles.field}>
          <Typography variant="caption" className={styles.label}>
            Тип
          </Typography>
          <div className={styles.segmented} role="group" aria-label="Тип">
            <Button
              variant="clear"
              className={classNames(styles.segment, {
                [styles.segmentActive]: type === 'document',
              })}
              aria-pressed={type === 'document'}
              onClick={() => setType('document')}
              disabled={isLoading}
            >
              Документ
            </Button>
            <Button
              variant="clear"
              className={classNames(styles.segment, {
                [styles.segmentActive]: type === 'section',
              })}
              aria-pressed={type === 'section'}
              onClick={() => setType('section')}
              disabled={isLoading}
            >
              Раздел
            </Button>
          </div>
        </div>

        <div className={styles.field}>
          <Typography variant="caption" className={styles.label}>
            Иконка{' '}
            <Typography variant="caption" className={styles.labelHint}>
              (необязательно)
            </Typography>
          </Typography>
          <IconPicker icons={DOCUMENT_ICONS} selectedIcon={icon} onChange={setIcon} />
        </div>

        <div className={styles.field}>
          <Typography variant="label" htmlFor={`${formId}Location`} className={styles.label}>
            Расположение
          </Typography>
          <Select
            id={`${formId}Location`}
            value={workspaceId ?? ''}
            onChange={setWorkspaceId}
            options={workspaceOptions}
            disabled={isLoading || !isCreate}
          />
        </div>
      </form>
    </Modal>
  );
};
