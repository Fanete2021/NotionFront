'use client';

import { FC, useState, useEffect } from 'react';
import classNames from 'classnames';
import styles from './CreateDocumentModal.module.css';
import { DOCUMENT_ICONS } from './documentIcons';
import { closeCreateDocumentModal, documentModalsReducer } from '../model/documentModalsSlice';
import { useGetWorkspacesQuery } from '@/entities/workspace';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { IconPicker } from '@/shared/ui/IconPicker';
import { Typography } from '@/shared/ui/Typography';
import { useAppSelector, useAppDispatch, useAppStore } from '@/shared/lib';
import { FormError } from '@/shared/ui/form-error';
import GlobusIcon from '@/shared/assets/icons/globus.svg';
import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg';

type DocumentType = 'document' | 'section';

const FORM_ID = 'createDocumentForm';

const defaultDocumentModalsState = {
  isCreateDocumentModalOpen: false,
  creatingDocumentProjectId: null,
} as const;

export const CreateDocumentModal: FC = () => {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const [name, setName] = useState('');
  const [type, setType] = useState<DocumentType>('document');
  const [icon, setIcon] = useState<string | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    store.injectReducer('documentModals', documentModalsReducer);
  }, [store]);

  const { isCreateDocumentModalOpen: isOpen } = useAppSelector(
    (state) => state.documentModals ?? defaultDocumentModalsState,
  );

  const { data: workspaces } = useGetWorkspacesQuery();
  const currentWorkspaceId = useAppSelector((state) => state.currentWorkspace.id);

  useEffect(() => {
    if (isOpen) {
      //eslint-disable-next-line
      setName('');
      setType('document');
      setIcon(null);
      setWorkspaceId(currentWorkspaceId);
      setError(null);
    }
  }, [isOpen, currentWorkspaceId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Название документа обязательно');
      return;
    }
    // TODO: интеграция с бэкендом
    dispatch(closeCreateDocumentModal());
    setName('');
  };

  const handleClose = () => {
    setName('');
    setError(null);
    dispatch(closeCreateDocumentModal());
  };

  const header = (
    <div className={styles.heading}>
      <Typography variant="text-medium" className={styles.title}>
        Создать документ
      </Typography>
      <Typography variant="caption" className={styles.subtitle}>
        Добавьте новый документ в рабочее пространство
      </Typography>
    </div>
  );

  const footer = (
    <div className={styles.actions}>
      <Button type="button" onClick={handleClose}>
        Отмена
      </Button>
      <Button
        variant="filled"
        type="submit"
        form={FORM_ID}
        className={styles.submitButton}
        addonLeft={<GlobusIcon className={styles.submitIcon} />}
        disabled={!name.trim()}
      >
        Создать
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
      <form id={FORM_ID} onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <Input
            id="documentName"
            type="text"
            label="Название"
            value={name}
            onChange={(str) => setName(str)}
            placeholder="Название документа..."
            autoFocus
          />
          <FormError message={error} />
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
          <Typography variant="label" htmlFor="documentLocation" className={styles.label}>
            Расположение
          </Typography>
          <div className={styles.select}>
            <select
              id="documentLocation"
              className={styles.selectControl}
              value={workspaceId ?? ''}
              onChange={(e) => setWorkspaceId(e.target.value)}
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
