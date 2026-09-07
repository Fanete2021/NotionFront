'use client';

import { useEffect, useState } from 'react';
import styles from './CreateInviteLinkModal.module.css';
import { InviteLink } from '../ui/InviteLink/InviteLink';
import { closeInviteLinkModal, inviteLinkModalReducer } from '../model/inviteLinkModalSlice';
import { useCreateWorkspaceInviteMutation } from '@/entities/workspace-invite';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/Button';
import { Typography } from '@/shared/ui/Typography';
import { useAppSelector, useAppDispatch, useAppStore } from '@/shared/lib';
import { useMutationWithError } from '@/shared/lib/hooks';
import { FormError } from '@/shared/ui/form-error';
import { HTTP_STATUS } from '@/shared/const/httpStatus';

export function CreateInviteLinkModal() {
  const dispatch = useAppDispatch();
  const store = useAppStore();

  useEffect(() => {
    store.injectReducer('inviteLinkModal', inviteLinkModalReducer);
  }, [store]);

  const isOpen = useAppSelector((state) => state.inviteLinkModal?.isInviteLinkModalOpen ?? false);
  const workspaceId = useAppSelector(
    (state) => state.inviteLinkModal?.createInviteLinkWorkspaceId ?? null,
  );
  const [selectedType, setSelectedType] = useState<'TEMPORARY' | 'PERMANENT'>('PERMANENT');

  const {
    execute: createInvite,
    isLoading,
    error,
  } = useMutationWithError(useCreateWorkspaceInviteMutation, {
    onSuccess: (data) => {
      handleClose();
    },
    fieldMap: {
      [HTTP_STATUS.FORBIDDEN]: {
        field: 'type',
        message: 'У вас нет прав для создания ссылок',
      },
      [HTTP_STATUS.NOT_FOUND]: {
        field: 'workspaceId',
        message: 'Рабочее пространство не найдено',
      },
    },
  });

  const handleClose = () => {
    dispatch(closeInviteLinkModal());
  };

  const handleCreate = async () => {
    if (!workspaceId) return;
    await createInvite({
      workspaceId,
      data: {
        type: selectedType,
        role: 'OWNER',
      },
    });
  };

  const footer = (
    <div className={styles.actions}>
      <Button variant="outline" onClick={handleClose} disabled={isLoading}>
        Отмена
      </Button>
      <Button
        className={styles.createButton}
        variant="filled"
        onClick={handleCreate}
        disabled={isLoading || !workspaceId}
      >
        {isLoading ? 'Создание...' : 'Создать ссылку'}
      </Button>
    </div>
  );

  return (
    <Modal
      className={styles.modal}
      isOpen={isOpen}
      onClose={handleClose}
      title="Создать ссылку для вступления"
      footer={footer}
      headerDivider
      footerDivider
    >
      <div className={styles.content}>
        <Typography variant="text-micro" className={styles.title}>
          ТИП
        </Typography>
        <div className={styles.linksContainer}>
          <div
            className={`${styles.inviteOption} ${selectedType === 'PERMANENT' ? styles.active : ''}`}
            onClick={() => setSelectedType('PERMANENT')}
          >
            <InviteLink title="🔗 Постоянная" subtitle="Действует бессрочно" />
          </div>

          <div
            className={`${styles.inviteOption} ${selectedType === 'TEMPORARY' ? styles.active : ''}`}
            onClick={() => setSelectedType('TEMPORARY')}
          >
            <InviteLink title="⏱ Временная" subtitle="Действует 1 день" />
          </div>
        </div>
      </div>
      <FormError message={error} />
    </Modal>
  );
}
