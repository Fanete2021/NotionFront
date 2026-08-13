'use client';

import { FC, useMemo, useEffect } from 'react';
import classNames from 'classnames';
import { SidebarItem } from '../SidebarItem/SidebarItem';
import styles from './Sidebar.module.css';
import { UserProfile } from '@/widgets/Sidebar/ui/UserProfile/UserProfile';
import { staticSidebarItems } from '@/widgets/Sidebar/ui/Sidebar/staticItems';
import { SidebarItem as SidebarItemType } from '../../model/types/sidebar';
import { WorkspaceSwitcher } from '@/features/switch-workspace';
import { CreateWorkspaceModal } from '@/features/switch-workspace';
import { CreateDocumentModal } from '@/features/create-document';
import { ProjectFormModal } from '@/features/manage-project';

import { useGetWorkspacesQuery } from '@/entities/workspace';
import { Project, useGetProjectsByWorkspaceQuery } from '@/entities/project';
import { Input } from '@/shared/ui/Input';
import SearchIcon from '@/shared/assets/icons/search.svg';
import { useAppSelector, useAppDispatch, setCurrentWorkspace } from '@/shared/lib';

interface SidebarProps {
  className?: string;
}

export const Sidebar: FC<SidebarProps> = ({ className }) => {
  const dispatch = useAppDispatch();
  const currentWorkspaceId = useAppSelector((state) => state.sidebar.currentWorkspaceId);

  const {
    data: workspaces,
    isLoading: workspacesLoading,
    refetch: refetchWorkspaces,
  } = useGetWorkspacesQuery();

  useEffect(() => {
    if (workspaces && workspaces.length > 0 && !currentWorkspaceId) {
      dispatch(setCurrentWorkspace(workspaces[0].id));
    }
  }, [workspaces, currentWorkspaceId, dispatch]);

  const { data: projects, refetch: refetchProjects } = useGetProjectsByWorkspaceQuery(
    currentWorkspaceId || '',
    { skip: !currentWorkspaceId },
  );

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
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <aside className={classNames(styles.sidebar, className)}>
      <div className={styles.top}>
        <WorkspaceSwitcher />

        <Input
          className={styles.searchInput}
          placeholder="Поиск страниц..."
          addonLeft={<SearchIcon className={styles.icon} />}
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
};
