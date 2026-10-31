'use client';

import { WorkspaceInfo } from './workspace-info/WorkspaceInfo';
import { InviteLinks } from './invite-links/InviteLinks';
import { MemberList } from './member-list/MemberList';
import styles from './WorkspaceMembers.module.css';
import { WorkspaceMembersHeader } from '../ui/workspace-members-header/WorkspaceMembersHeader';
import { WorkspaceMembersSkeleton } from './workspace-members-skeleton/WorkspaceMembersSkeleton';
import { CreateInviteLinkModal } from '@/features/create-invite-link';
import { useGetWorkspaceMembersQuery } from '@/entities/workspace-members';
import { useGetMeQuery } from '@/entities/user';
import { isFetchBaseQueryError } from '@/shared/utils/error-utils';
import { HTTP_STATUS } from '@/shared/const/httpStatus';

interface WorkspaceMembersProps {
  workspaceId: string;
  workspaceName: string;
}

export const WorkspaceMembers = ({ workspaceId, workspaceName }: WorkspaceMembersProps) => {
  const {
    data: members,
    isLoading,
    error,
  } = useGetWorkspaceMembersQuery(workspaceId, {
    skip: !workspaceId,
  });

  const { data: currentUser } = useGetMeQuery();

  const currentRole = members?.find((m) => m.userInfo.id === currentUser?.id)?.role;
  const canManageMembers = currentRole === 'OWNER' || currentRole === 'ADMIN';

  if (isLoading) {
    return <WorkspaceMembersSkeleton />;
  }

  if (error) {
    const isForbidden = isFetchBaseQueryError(error) && error.status === HTTP_STATUS.FORBIDDEN;

    return (
      <div className={styles.error}>
        {isForbidden ? 'У вас нет прав для просмотра участников' : 'Ошибка загрузки участников'}
      </div>
    );
  }

  return (
    <>
      <WorkspaceMembersHeader />
      <div className={styles.container}>
        <WorkspaceInfo workspaceName={workspaceName} memberCount={members?.length ?? 0} />
        <InviteLinks workspaceId={workspaceId} />
        <MemberList members={members ?? []} canManageMembers={canManageMembers} />
      </div>

      <CreateInviteLinkModal />
    </>
  );
};
