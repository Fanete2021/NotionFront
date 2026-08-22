'use client';

import { useParams } from 'next/navigation';
import { WorkspaceMembers } from '@/widgets/workspace-members';
import { useGetWorkspaceByIdQuery } from '@/entities/workspace';

export function WorkspaceMainPage() {
  const params = useParams<{ id: string }>();
  const workspaceId = params?.id ?? '';

  const {
    data: workspace,
    isLoading,
    error,
  } = useGetWorkspaceByIdQuery(workspaceId, {
    skip: !workspaceId,
  });

  if (!workspaceId) return <div>Неверный ID рабочего пространства</div>;
  if (isLoading) return <div>Загрузка...</div>;
  if (error || !workspace) return <div>Ошибка загрузки рабочего пространства</div>;

  return <WorkspaceMembers workspaceId={workspaceId} workspaceName={workspace.name} />;

  return <div>MainPage</div>;
}
