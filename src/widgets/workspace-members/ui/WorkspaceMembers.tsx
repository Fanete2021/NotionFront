'use client';

import { WorkspaceInfo } from './workspace-info/WorkspaceInfo';
import { InviteLinks } from './invite-links/InviteLinks';
import { MemberList } from './member-list/MemberList';
import styles from './WorkspaceMembers.module.css';
import { WorkspaceMembersHeader } from '@/widgets/workspace-members/ui/workspace-members-header/WorkspaceMembersHeader';
import { mockMembers, useGetWorkspaceMembersQuery } from '@/entities/workspace-members';

interface WorkspaceMembersProps {
  workspaceId: string;
  workspaceName: string;
}

export const WorkspaceMembers = ({ workspaceId, workspaceName }: WorkspaceMembersProps) => {
  const { data, isLoading, error } = useGetWorkspaceMembersQuery(workspaceId);
  const members = mockMembers;

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.error}>Ошибка загрузки участников</div>;
  }

  return (
    <>
      <WorkspaceMembersHeader />
      <div className={styles.container}>
        <WorkspaceInfo workspaceName={workspaceName} memberCount={members?.length || 0} />
        <InviteLinks workspaceId={workspaceId} />
        <MemberList members={members || []} />
      </div>
    </>
  );
};
