'use client';

import { useMemo, useEffect } from 'react';
import classNames from 'classnames';
import styles from './Sidebar.module.css';
import { UserProfile } from '../user-profile/UserProfile';
import { SidebarItem as SidebarItemType, staticSidebarItems } from '../../model';
import { SidebarSkeleton } from '@/widgets/sidebar/ui/sidebar-skeleton/SidebarSkeleton';
import { SidebarItem } from '@/widgets/sidebar';
import { WorkspaceSwitcher } from '@/features/switch-workspace';
import { CreateDocumentModal } from '@/features/create-document';
import { ProjectFormModal } from '@/features/manage-project';
import { useGetWorkspacesQuery } from '@/entities/workspace';
import { Project, useGetProjectsByWorkspaceQuery } from '@/entities/project';
import { Input } from '@/shared/ui/Input';
import SearchIcon from '@/shared/assets/icons/search.svg';
import { useAppSelector } from '@/shared/lib';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const currentWorkspaceId = useAppSelector((state) => state.currentWorkspace.id);

  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspacesQuery();

  const workspaceIsChoosed = workspaces?.length || 0 > 0;

  const { data: projects, refetch: refetchProjects } = useGetProjectsByWorkspaceQuery(
    currentWorkspaceId || '',
    { skip: !currentWorkspaceId, refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    if (currentWorkspaceId) {
      refetchProjects();
    }
  }, [currentWorkspaceId, refetchProjects]);

  const projectItems = useMemo(() => {
    return (projects || [])
      .filter((project: Project) => !project.parentProjectId)
      .map((project: Project) => ({
        id: project.id,
        title: project.name,
        type: 'group' as const,
        projectId: project.id,
        icon: project.icon || undefined,
        color: project.color || undefined,
        children: [] as SidebarItemType[],
      }));
  }, [projects]);

  const sidebarItems = useMemo(() => {
    const items = [...staticSidebarItems];
    const projectsSectionIndex = items.findIndex((item) => item.id === 'projects-section');
    if (projectsSectionIndex !== -1) {
      items[projectsSectionIndex] = {
        ...items[projectsSectionIndex],
        children: projectItems,
      };
    }
    return items;
  }, [projectItems]);

  const handleSearch = () => {};

  if (workspacesLoading) {
    return <SidebarSkeleton />;
  }
  return (
    <aside className={classNames(styles.sidebar, className)}>
      <WorkspaceSwitcher />
      <div className={styles.top}>
        <Input
          className={styles.searchInput}
          placeholder="Поиск страниц..."
          addonLeft={<SearchIcon className={styles.icon} />}
          disabled={!workspaceIsChoosed}
          onChange={handleSearch}
        />

        <nav className={styles.navigation}>
          {sidebarItems.map((item) => {
            let level = 0;
            if (item.type === 'section') {
              level = 0;
            } else if (item.type === 'group' && item.projectId) {
              level = 1;
            }

            return <SidebarItem key={item.id} item={item} level={level} />;
          })}
        </nav>

        <ProjectFormModal mode="create" />
        <ProjectFormModal mode="edit" />
        <CreateDocumentModal />
      </div>

      <UserProfile name="Alex Kim" email="alex@acme.io" />
    </aside>
  );
}
