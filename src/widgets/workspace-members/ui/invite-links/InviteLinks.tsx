'use client';

import { error } from 'next/dist/build/output/log';
import { useEffect, useRef } from 'react';
import styles from './InviteLinks.module.css';
import { InviteLink } from '@/widgets/workspace-members/ui/invite-link/InviteLink';
import { buildInviteUrl } from '../../utils/url';
import { openInviteLinkModal } from '@/features/create-invite-link';
import {
  useGetWorkspaceInvitesQuery,
  useRevokeWorkspaceInviteMutation,
} from '@/entities/workspace-invite';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';
import GlobusIcon from '@/shared/assets/icons/globus.svg';
import { useAppDispatch } from '@/shared/lib';
import { useMutationWithError } from '@/shared/lib/hooks';
import { FormError } from '@/shared/ui/form-error';
import { HTTP_STATUS } from '@/shared/const/httpStatus';
import { isFetchBaseQueryError } from '@shared/utils/error-utils';
import { toast } from '@shared/ui/toast';

interface InviteLinksProps {
  workspaceId: string;
}

export const InviteLinks = ({ workspaceId }: InviteLinksProps) => {
  const dispatch = useAppDispatch();
  const notifiedWorkspaceRef = useRef<string | null>(null);

  const {
    data: invites,
    isLoading,
    isError,
    error: getInviteError,
  } = useGetWorkspaceInvitesQuery(workspaceId, {
    skip: !workspaceId,
  });

  const {
    execute: revokeInvite,
    isLoading: isRevoking,
    error: revokeError,
  } = useMutationWithError(useRevokeWorkspaceInviteMutation, {
    onSuccess: () => {},
    fieldMap: {
      [HTTP_STATUS.FORBIDDEN]: {
        field: 'type',
        message: 'У вас нет прав для удаления ссылок',
      },
      [HTTP_STATUS.NOT_FOUND]: {
        field: 'id',
        message: 'Ссылка не найдена',
      },
    },
  });

  const handleDeleteAction = async (inviteId: string) => {
    try {
      await revokeInvite({ workspaceId, inviteId });
    } catch (error) {
      console.error('Ошибка при удалении ссылки:', error);
    }
  };

  const handleCreateLink = () => {
    dispatch(openInviteLinkModal({ workspaceId }));
  };

  const links = invites ?? [];

  const isForbidden =
    isFetchBaseQueryError(getInviteError) && getInviteError.status === HTTP_STATUS.FORBIDDEN;
  const permissionMessage =
    'У вас недостаточно прав для просмотра и создания ссылок для приглашения в рабочее пространство';

  useEffect(() => {
    if (!isForbidden) {
      notifiedWorkspaceRef.current = null;
      return;
    }

    if (notifiedWorkspaceRef.current === workspaceId) return;
    notifiedWorkspaceRef.current = workspaceId;

    toast.add({
      type: 'info',
      title: 'Приглашения',
      description: permissionMessage,
    });
  }, [isForbidden, workspaceId]);

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (isError) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleBlock}>
        <Typography variant="label" className={styles.sectionTitle}>
          🔒 Ссылки для вступления
        </Typography>
        <div className={styles.info}>Только для администраторов</div>
      </div>

      <div className={styles.links}>
        {links.map((invite) => {
          const url = buildInviteUrl(invite.token);
          return (
            <InviteLink
              key={invite.id}
              icon={<GlobusIcon className={styles.icon} />}
              label={invite.type === 'PERMANENT' ? 'Постоянная' : 'Временная'}
              url={url}
              onDelete={() => handleDeleteAction(invite.id)}
              disabled={isRevoking}
            />
          );
        })}
      </div>

      <FormError message={revokeError} />

      <Button
        variant="outline"
        className={styles.addNewLinkButton}
        onClick={handleCreateLink}
        disabled={isRevoking}
      >
        + Создать новую ссылку
      </Button>
    </div>
  );
};
