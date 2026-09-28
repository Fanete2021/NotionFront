'use client';

import { useMemo, useEffect, useCallback, useState, useRef } from 'react';
import { flushSync } from 'react-dom';
import classNames from 'classnames';
import Link from 'next/link';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  pointerWithin,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  type CollisionDetection,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import styles from './Sidebar.module.css';
import { UserProfile } from '../user-profile/UserProfile';
import { staticSidebarItems } from '../../model';
import { buildProjectTree } from '../../lib';
import { SidebarSkeleton } from '@/widgets/sidebar/ui/sidebar-skeleton/SidebarSkeleton';
import { SidebarItem } from '@/widgets/sidebar';
import { DragPreview } from '@/widgets/sidebar/ui/drag-preview/DragPreview';
import { WorkspaceSwitcher } from '@/features/switch-workspace';
import { DocumentFormModal } from '@/features/manage-document';
import { ProjectFormModal } from '@/features/manage-project';
import {
  Project,
  useGetProjectsByWorkspaceQuery,
  useReorderProjectsMutation,
} from '@/entities/project';
import { useGetWorkspacesQuery } from '@/entities/workspace';
import {
  Page,
  useGetPagesByWorkspaceQuery,
  useReorderPagesMutation,
  useUpdatePageMutation,
} from '@/entities/page';
import { useGetMeQuery } from '@/entities/user';
import SearchIcon from '@/shared/assets/icons/search.svg';
import { useAppSelector } from '@/shared/lib';
import { ROUTES } from '@shared/routes';

interface SidebarProps {
  className?: string;
}

const DROP_ANIMATION_DURATION = 300;

export function Sidebar({ className }: SidebarProps) {
  const currentWorkspaceId = useAppSelector((state) => state.currentWorkspace.id);

  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspacesQuery();
  const workspaceIsChoosed = (workspaces?.length ?? 0) > 0;

  const [localProjects, setLocalProjects] = useState<Project[]>([]);
  const [localPages, setLocalPages] = useState<Page[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeIdRef = useRef<string | null>(null);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  const { data: projects, refetch: refetchProjects } = useGetProjectsByWorkspaceQuery(
    currentWorkspaceId || '',
    { skip: !currentWorkspaceId, refetchOnMountOrArgChange: true },
  );

  const { data: pages } = useGetPagesByWorkspaceQuery(
    { workspaceId: currentWorkspaceId || '' },
    { skip: !currentWorkspaceId },
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

  const isDragging = activeId !== null;

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

    const itemCollision = pointerCollisions.find((c) => !String(c.id).startsWith('group-'));
    if (itemCollision) return [itemCollision];

    const groupCollision = pointerCollisions.find((c) => String(c.id).startsWith('group-'));
    if (groupCollision) return [groupCollision];

    return closestCenter(args);
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const scheduleActiveIdReset = useCallback((droppedId: string) => {
    setTimeout(() => {
      if (activeIdRef.current === droppedId) {
        setActiveId(null);
      }
    }, DROP_ANIMATION_DURATION);
  }, []);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      const droppedId = String(active.id);

      if (!over || active.id === over.id || !currentWorkspaceId) {
        setActiveId(null);
        return;
      }

      const allProjects = projects ?? [];
      const allPages = pages ?? [];

      const activeProject = allProjects.find((p) => p.id === active.id);
      const overProject = allProjects.find((p) => p.id === over.id);
      const activePage = allPages.find((p) => p.id === active.id);
      const overPage = allPages.find((p) => p.id === over.id);

      const overIdStr = String(over.id);
      const isOverGroup = overIdStr.startsWith('group-');
      const targetProjectId = isOverGroup ? overIdStr.replace('group-', '') : null;

      const targetProject = targetProjectId
        ? allProjects.find((p) => p.id === targetProjectId)
        : overProject;

      if (activePage && targetProject) {
        if (activePage.projectId === targetProject.id) {
          scheduleActiveIdReset(droppedId);
          return;
        }

        flushSync(() => {
          setLocalPages((prev) =>
            prev.map((p) => (p.id === activePage.id ? { ...p, projectId: targetProject.id } : p)),
          );
        });

        scheduleActiveIdReset(droppedId);

        try {
          await updatePage({
            id: activePage.id,
            workspaceId: currentWorkspaceId,
            data: { projectId: targetProject.id },
          }).unwrap();

          const targetSiblings = allPages
            .filter((p) => p.projectId === targetProject.id && p.id !== activePage.id)
            .sort((a, b) => a.position - b.position);

          await reorderPages({
            workspaceId: currentWorkspaceId,
            data: {
              projectId: targetProject.id,
              orderedIds: [...targetSiblings.map((p) => p.id), activePage.id],
            },
          }).unwrap();
        } catch (err) {
          console.error('Ошибка перемещения в группу:', err);
          setLocalPages(pages ?? []);
        }
        return;
      }

      if (activeProject && overProject) {
        if (activeProject.parentProjectId !== overProject.parentProjectId) {
          scheduleActiveIdReset(droppedId);
          return;
        }

        const siblings = allProjects
          .filter((p) => p.parentProjectId === activeProject.parentProjectId)
          .sort((a, b) => a.order - b.order);

        const oldIndex = siblings.findIndex((p) => p.id === active.id);
        const newIndex = siblings.findIndex((p) => p.id === over.id);
        if (oldIndex === -1 || newIndex === -1) {
          scheduleActiveIdReset(droppedId);
          return;
        }

        const reordered = arrayMove(siblings, oldIndex, newIndex);

        flushSync(() => {
          setLocalProjects((prev) =>
            prev.map((p) => {
              const idx = reordered.findIndex((r) => r.id === p.id);
              return idx !== -1 ? { ...p, order: idx } : p;
            }),
          );
        });

        scheduleActiveIdReset(droppedId);

        try {
          await reorderProjects({
            workspaceId: currentWorkspaceId,
            data: {
              parentProjectId: activeProject.parentProjectId ?? null,
              orderedIds: reordered.map((p) => p.id),
            },
          }).unwrap();
        } catch (err) {
          console.error('Ошибка reorder проектов', err);
          setLocalProjects(projects ?? []);
        }
        return;
      }

      if (activePage && overPage) {
        if (activePage.projectId === overPage.projectId) {
          if (!activePage.projectId) {
            scheduleActiveIdReset(droppedId);
            return;
          }

          const siblings = allPages
            .filter((p) => p.projectId === activePage.projectId)
            .sort((a, b) => a.position - b.position);

          const oldIndex = siblings.findIndex((p) => p.id === active.id);
          const newIndex = siblings.findIndex((p) => p.id === over.id);
          if (oldIndex === -1 || newIndex === -1) {
            scheduleActiveIdReset(droppedId);
            return;
          }

          const reordered = arrayMove(siblings, oldIndex, newIndex);

          flushSync(() => {
            setLocalPages((prev) =>
              prev.map((p) => {
                const idx = reordered.findIndex((r) => r.id === p.id);
                return idx !== -1 ? { ...p, position: idx } : p;
              }),
            );
          });

          scheduleActiveIdReset(droppedId);

          try {
            await reorderPages({
              workspaceId: currentWorkspaceId,
              data: {
                projectId: activePage.projectId,
                orderedIds: reordered.map((p) => p.id),
              },
            }).unwrap();
          } catch (err) {
            console.error('Ошибка reorder страниц:', err);
            setLocalPages(pages ?? []);
          }
          return;
        }

        if (!activePage.projectId || !overPage.projectId) {
          scheduleActiveIdReset(droppedId);
          return;
        }

        flushSync(() => {
          setLocalPages((prev) =>
            prev.map((p) => (p.id === activePage.id ? { ...p, projectId: overPage.projectId } : p)),
          );
        });

        scheduleActiveIdReset(droppedId);

        try {
          await updatePage({
            id: activePage.id,
            workspaceId: currentWorkspaceId,
            data: { projectId: overPage.projectId },
          }).unwrap();

          const targetSiblings = allPages
            .filter((p) => p.projectId === overPage.projectId)
            .sort((a, b) => a.position - b.position);

          const overIndex = targetSiblings.findIndex((p) => p.id === overPage.id);
          const newOrder = [...targetSiblings];
          newOrder.splice(overIndex, 0, activePage);

          await reorderPages({
            workspaceId: currentWorkspaceId,
            data: {
              projectId: overPage.projectId,
              orderedIds: newOrder.map((p) => p.id),
            },
          }).unwrap();
        } catch (err) {
          console.error('Ошибка перемещения страницы:', err);
          setLocalPages(pages ?? []);
        }
        return;
      }

      scheduleActiveIdReset(droppedId);
    },
    [
      projects,
      pages,
      currentWorkspaceId,
      reorderProjects,
      reorderPages,
      updatePage,
      scheduleActiveIdReset,
    ],
  );

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
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
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

          <DragOverlay
            dropAnimation={{
              duration: DROP_ANIMATION_DURATION,
              easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
            }}
          >
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
  );
}
