'use client';

import { useState } from 'react';
import styles from './CreateInviteLinkForm.module.css';
import { InviteLink } from '../invite-link/InviteLink';
import { getInviteRole } from '../../model/inviteUtils';
import { useCreateWorkspaceInviteMutation } from '@/entities/workspace-invite';
import type { InviteType } from '@/entities/workspace-invite';
import { WorkspaceRole } from '@/entities/workspace-members';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';
import { useMutationWithError } from '@/shared/lib/hooks';
import { FormError } from '@/shared/ui/form-error';
import { HTTP_STATUS } from '@/shared/const/httpStatus';

interface CreateInviteLinkFormProps {
  workspaceId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
  curRole?: WorkspaceRole;
}

export function CreateInviteLinkForm({
  workspaceId,
  onSuccess,
  onCancel,
  className,
  curRole,
}: CreateInviteLinkFormProps) {
  const [selectedType, setSelectedType] = useState<InviteType>('PERMANENT');

  const {
    execute: createInvite,
    isLoading,
    error,
  } = useMutationWithError(useCreateWorkspaceInviteMutation, {
    onSuccess: () => {
      onSuccess?.();
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

  const handleCreate = async () => {
    if (!workspaceId) return;
    try {
      await createInvite({
        workspaceId,
        data: {
          type: selectedType,
          role: getInviteRole(curRole),
        },
      });
    } catch (error) {
      console.error('Ошибка при создании ссылки:', error);
    }
  };

  return (
    <div className={`${styles.form} ${className || ''}`}>
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

      <FormError message={error} />

      <div className={styles.divider} />
      <div className={styles.actions}>
        {onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Отмена
          </Button>
        )}
        <Button
          className={styles.createButton}
          variant="filled"
          onClick={handleCreate}
          disabled={isLoading || !workspaceId}
        >
          {isLoading ? 'Создание...' : 'Создать ссылку'}
        </Button>
      </div>
    </div>
  );
}
