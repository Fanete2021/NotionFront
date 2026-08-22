'use client';

import { WorkspaceInfo } from './WorkspaceInfo/WorkspaceInfo';
import { InviteLinks } from './InviteLinks/InviteLinks';
import { MemberList } from './MemberList/MemberList';
import styles from './WorkspaceMembers.module.css';
import { useGetWorkspaceMembersQuery } from '@/entities/workspace-members';

interface WorkspaceMembersProps {
  workspaceId: string;
  workspaceName: string;
}

export const WorkspaceMembers = ({ workspaceId, workspaceName }: WorkspaceMembersProps) => {
  const { data: members, isLoading, error } = useGetWorkspaceMembersQuery(workspaceId);

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.error}>Ошибка загрузки участников</div>;
  }

  return (
    <div className={styles.container}>
      <WorkspaceInfo workspaceName={workspaceName} memberCount={members?.length || 0} />
      <InviteLinks workspaceId={workspaceId} />
      <MemberList members={members || []} />
    </div>
  );
};
