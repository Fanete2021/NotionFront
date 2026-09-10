'use client';

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

interface InviteLinksProps {
  workspaceId: string;
}

export const InviteLinks = ({ workspaceId }: InviteLinksProps) => {
  const dispatch = useAppDispatch();

  const {
    data: invites,
    isLoading,
    isError,
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

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (isError) {
    return <div className={styles.error}>Ошибка загрузки ссылок</div>;
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
          const url = buildInviteUrl(invite.id);
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
