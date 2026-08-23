'use client';

import { useEffect, useState } from 'react';
import { WorkspaceMembers } from '@/widgets/workspace-members';
import { useGetWorkspaceByIdQuery } from '@/entities/workspace';
import { useAppSelector } from '@/shared/lib';

export function WorkspaceMainPage() {
  const workspaceId = useAppSelector((state) => state.currentWorkspace.id);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    //eslint-disable-next-line
    setMounted(true);
  }, []);

  const { data: workspace, isLoading } = useGetWorkspaceByIdQuery(workspaceId || '', {
    skip: !workspaceId || !mounted,
  });

  if (!mounted) {
    return <div>Загрузка...</div>;
  }

  if (!workspaceId) return <div>Неверный ID рабочего пространства</div>;
  if (isLoading) return <div>Загрузка...</div>;
  if (!workspace) return <div>Ошибка загрузки рабочего пространства</div>;

  return <WorkspaceMembers workspaceId={workspaceId} workspaceName={workspace.name} />;
}
