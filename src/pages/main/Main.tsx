'use client';

import { useEffect, useState } from 'react';
import { NotFoundWorkspace } from './not-found-workspace/NotFoundWorkspace';
import { MainSkeleton } from './main-skeleton/MainSkeleton';
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

  if (!mounted || isLoading) {
    return <MainSkeleton />;
  }

  if (!workspaceId || !workspace) return <NotFoundWorkspace />;

  return <WorkspaceMembers workspaceId={workspaceId} workspaceName={workspace.name} />;
}
