'use client';

import { useMemo, useEffect, useCallback, useState, useRef } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  pointerWithin,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
  type CollisionDetection,
} from '@dnd-kit/core';
import styles from './Sidebar.module.css';
import { UserProfile } from '../user-profile/UserProfile';
import { staticSidebarItems } from '../../model';
import { buildProjectTree } from '../../lib';
import { SidebarSkeleton } from '../sidebar-skeleton/SidebarSkeleton';
import { SidebarItem } from '../sidebar-item/SidebarItem';
import { DragPreview, flattenProjects } from '@/features/dnd-sidebar';
import { WorkspaceSwitcher } from '@/features/switch-workspace';
import { DocumentFormModal } from '@/features/manage-document';
import { ProjectFormModal } from '@/features/manage-project';
import {
  handleDragEnd as handleDragEndFeature,
  SidebarDndProvider,
  type DndItemType,
} from '@/features/dnd-sidebar';
import {
  useGetProjectsByWorkspaceQuery,
  useReorderProjectsMutation,
  useUpdateProjectMutation,
} from '@/entities/project';
import { useGetWorkspacesQuery } from '@/entities/workspace';
import {
  useGetPagesByWorkspaceQuery,
  useReorderPagesMutation,
  useUpdatePageMutation,
} from '@/entities/page';
import { useGetMeQuery } from '@/entities/user';
import type { Project } from '@/entities/project';
import type { Page } from '@/shared/const/pageType';
import SearchIcon from '@/shared/assets/icons/search.svg';
import { useAppSelector } from '@/shared/lib';
import { ROUTES } from '@shared/routes';

interface SidebarProps {
  className?: string;
}

interface GroupDroppableData {
  type: 'group';
  projectId: string;
  level: number;
  isOpen: boolean;
}

const DROP_ANIMATION_DURATION = 300;
const GROUP_PREFIX = 'group-';

export function Sidebar({ className }: SidebarProps) {
  const currentWorkspaceId = useAppSelector((state) => state.currentWorkspace.id);
  const [updateProject] = useUpdateProjectMutation();

  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspacesQuery();
  const workspaceIsChoosed = (workspaces?.length ?? 0) > 0;

  const [localProjects, setLocalProjects] = useState<Project[]>([]);

  const [localPages, setLocalPages] = useState<Page[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeProject = useMemo(() => {
    if (!activeId) return null;
    return flattenProjects(localProjects).find((p) => p.id === activeId) ?? null;
  }, [activeId, localProjects]);

  const activeProjectParentId = useMemo(
    () => (activeProject ? (activeProject.parentProjectId ?? null) : undefined),
    [activeProject],
  );

  const activePage = useMemo(() => {
    if (!activeId) return null;
    return localPages.find((p) => p.id === activeId) ?? null;
  }, [activeId, localPages]);

  const activePageProjectId = activePage ? (activePage.projectId ?? null) : undefined;

  const [overId, setOverId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<DndItemType | null>(null);

  const activeIdRef = useRef<string | null>(null);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  const isDragging = activeId !== null;

  const { data: projects, refetch: refetchProjects } = useGetProjectsByWorkspaceQuery(
    currentWorkspaceId || '',
    {
      skip: !currentWorkspaceId,
      refetchOnMountOrArgChange: true,
      pollingInterval: isDragging ? 0 : 20000,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    },
  );

  const { data: pages } = useGetPagesByWorkspaceQuery(
    { workspaceId: currentWorkspaceId || '' },
    {
      skip: !currentWorkspaceId,
      pollingInterval: isDragging ? 0 : 20000,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    },
  );

  const { data: authData } = useGetMeQuery();

  const [reorderProjects] = useReorderProjectsMutation();
  const [reorderPages] = useReorderPagesMutation();
  const [updatePage] = useUpdatePageMutation();

  useEffect(() => {
    if (currentWorkspaceId) {
      refetchProjects();
    }
  }, [currentWorkspaceId, refetchProjects]);

  useEffect(() => {
    // eslint-disable-next-line
    if (projects && !isDragging) setLocalProjects(projects);
  }, [projects, isDragging]);

  useEffect(() => {
    // eslint-disable-next-line
    if (pages && !isDragging) setLocalPages(pages);
  }, [pages, isDragging]);

  const projectItems = useMemo(
    () => buildProjectTree(localProjects, localPages),
    [localProjects, localPages],
  );

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const collisionDetection: CollisionDetection = useCallback((args) => {
    const pointerCollisions = pointerWithin(args);

    const outdentCollision = pointerCollisions.find((collision) =>
      String(collision.id).startsWith('outdent-'),
    );

    if (outdentCollision) return [outdentCollision];

    const nestCollision = pointerCollisions.find((collision) =>
      String(collision.id).startsWith('nest-'),
    );

    if (nestCollision) return [nestCollision];

    const itemCollision = pointerCollisions.find(
      (collision) => !String(collision.id).startsWith(GROUP_PREFIX),
    );

    if (itemCollision) return [itemCollision];

    const groupCollisions = pointerCollisions.filter((collision) =>
      String(collision.id).startsWith(GROUP_PREFIX),
    );

    if (groupCollisions.length > 0) {
      const deepest = groupCollisions.reduce((best, current) => {
        const bestLevel = (best.data?.current as GroupDroppableData)?.level ?? 0;
        const currentLevel = (current.data?.current as GroupDroppableData)?.level ?? 0;

        return currentLevel > bestLevel ? current : best;
      });

      return [deepest];
    }

    const rootCollision = pointerCollisions.find(
      (collision) => String(collision.id) === 'projects-root',
    );

    if (rootCollision) return [rootCollision];

    return closestCenter(args);
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
    setActiveType((event.active.data.current?.type as DndItemType) ?? null);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    setOverId(event.over ? String(event.over.id) : null);
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setOverId(null);
    setActiveType(null);
  }, []);

  const scheduleActiveIdReset = useCallback((droppedId: string) => {
    setOverId(null);
    setTimeout(() => {
      if (activeIdRef.current === droppedId) {
        setActiveId(null);
      }
      setActiveType(null);
    }, DROP_ANIMATION_DURATION);
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    if (!currentWorkspaceId) {
      setActiveId(null);
      setOverId(null);
      setActiveType(null);
      return;
    }

    await handleDragEndFeature({
      event,
      currentWorkspaceId,
      localProjects,
      localPages,
      serverProjects: projects ?? [],
      serverPages: pages ?? [],
      setLocalProjects,
      setLocalPages,
      reorderProjects,
      reorderPages,
      updatePage,
      scheduleActiveIdReset,
      updateProject,
    });
  };

  if (workspacesLoading) {
    return <SidebarSkeleton />;
  }

  const searchLinkContent = (
    <>
      <SearchIcon className={styles.icon} aria-hidden="true" />
      <span className={styles.searchLabel}>Поиск страниц...</span>
    </>
  );

  return (
    <SidebarDndProvider
      value={{ activeId, overId, activeType, activeProjectParentId, activePageProjectId }}
    >
      <aside className={classNames(styles.sidebar, className)}>
        <WorkspaceSwitcher />
        <div className={styles.top}>
          {workspaceIsChoosed ? (
            <Link href={ROUTES.pageSearch} className={styles.searchLink}>
              {searchLinkContent}
            </Link>
          ) : (
            <span className={styles.searchLink} role="link" aria-disabled="true">
              {searchLinkContent}
            </span>
          )}

          <DndContext
            sensors={sensors}
            collisionDetection={collisionDetection}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <nav className={styles.navigation}>
              {sidebarItems.map((item) => (
                <SidebarItem key={item.id} item={item} level={0} />
              ))}
            </nav>

            <DragOverlay dropAnimation={null}>
              {activeId ? (
                <DragPreview id={activeId} projects={localProjects} pages={localPages} />
              ) : null}
            </DragOverlay>
          </DndContext>

          <ProjectFormModal mode="create" />
          <ProjectFormModal mode="edit" />
          <DocumentFormModal />
        </div>

        {authData && (
          <UserProfile name={authData.name} email={authData.email} avatarUrl={authData.avatarUrl} />
        )}
      </aside>
    </SidebarDndProvider>
  );
}
