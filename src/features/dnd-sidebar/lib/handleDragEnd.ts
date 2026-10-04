import { flushSync } from 'react-dom';
import { DragEndEvent } from '@dnd-kit/core';
import { findDragTargets } from './findDragTargets';
import { getPageSiblings, getProjectSiblings, isSyncedById, moveItem } from './reorderUtils';
import { Project } from '@/entities/project';
import { Page } from '@/entities/page';

type ReorderProjectsTrigger = (args: {
  workspaceId: string;
  data: { parentProjectId: string | null; orderedIds: string[] };
}) => { unwrap: () => Promise<unknown> };

type ReorderPagesTrigger = (args: {
  workspaceId: string;
  data: { projectId: string; orderedIds: string[] };
}) => { unwrap: () => Promise<unknown> };

type UpdatePageTrigger = (args: {
  id: string;
  workspaceId: string;
  data: { projectId: string };
}) => { unwrap: () => Promise<unknown> };

interface HandleDragEndParams {
  event: DragEndEvent;
  currentWorkspaceId: string;
  localProjects: Project[];
  localPages: Page[];
  serverProjects: Project[];
  serverPages: Page[];
  setLocalProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  setLocalPages: React.Dispatch<React.SetStateAction<Page[]>>;
  reorderProjects: ReorderProjectsTrigger;
  reorderPages: ReorderPagesTrigger;
  updatePage: UpdatePageTrigger;
  scheduleActiveIdReset: (id: string) => void;
}

export async function handleDragEnd({
  event,
  currentWorkspaceId,
  localProjects,
  localPages,
  serverProjects,
  serverPages,
  setLocalProjects,
  setLocalPages,
  reorderProjects,
  reorderPages,
  updatePage,
  scheduleActiveIdReset,
}: HandleDragEndParams): Promise<void> {
  const { active, over } = event;
  const droppedId = String(active.id);

  if (!over || active.id === over.id || !currentWorkspaceId) {
    scheduleActiveIdReset(droppedId);
    return;
  }

  if (!isSyncedById(localProjects, serverProjects) || !isSyncedById(localPages, serverPages)) {
    console.warn('Локальный state рассинхронизирован с сервером, пропускаем reorder');
    scheduleActiveIdReset(droppedId);
    return;
  }

  const { activeProject, overProject, activePage, overPage, targetProject } = findDragTargets(
    event,
    localProjects,
    localPages,
  );

  if (activePage && targetProject) {
    if (activePage.projectId === targetProject.id) {
      scheduleActiveIdReset(droppedId);
      return;
    }

    const siblings = getPageSiblings(localPages, targetProject.id).filter(
      (p) => p.id !== activePage.id,
    );

    let insertIndex = siblings.length;
    if (overPage && overPage.projectId === targetProject.id) {
      const overIdx = siblings.findIndex((p) => p.id === overPage.id);
      if (overIdx !== -1) insertIndex = overIdx;
    }

    const newOrder = [...siblings];
    newOrder.splice(insertIndex, 0, activePage);

    flushSync(() => {
      setLocalPages((prev) =>
        prev.map((p) => {
          const idx = newOrder.findIndex((n) => n.id === p.id);
          if (idx === -1) return p;
          return { ...p, projectId: targetProject.id, position: idx };
        }),
      );
    });

    scheduleActiveIdReset(droppedId);

    try {
      await updatePage({
        id: activePage.id,
        workspaceId: currentWorkspaceId,
        data: { projectId: targetProject.id },
      }).unwrap();
    } catch (err) {
      console.error('Ошибка перемещения в группу (updatePage):', err);
      setLocalPages(serverPages);
      return;
    }

    try {
      await reorderPages({
        workspaceId: currentWorkspaceId,
        data: {
          projectId: targetProject.id,
          orderedIds: newOrder.map((p) => p.id),
        },
      }).unwrap();
    } catch (err) {
      console.error('Ошибка перемещения в группу (reorderPages):', err);
    }
    return;
  }

  if (activeProject && overProject) {
    if (activeProject.parentProjectId !== overProject.parentProjectId) {
      scheduleActiveIdReset(droppedId);
      return;
    }

    const siblings = getProjectSiblings(localProjects, activeProject.parentProjectId);
    const oldIndex = siblings.findIndex((p) => p.id === activeProject.id);
    const newIndex = siblings.findIndex((p) => p.id === overProject.id);

    if (oldIndex === -1 || newIndex === -1) {
      scheduleActiveIdReset(droppedId);
      return;
    }

    const reordered = moveItem(siblings, oldIndex, newIndex);

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
      console.error('Ошибка reorder проектов:', err);
      setLocalProjects(serverProjects);
    }
    return;
  }

  if (activePage && overPage) {
    if (activePage.projectId === overPage.projectId) {
      if (!activePage.projectId) {
        scheduleActiveIdReset(droppedId);
        return;
      }

      const siblings = getPageSiblings(localPages, activePage.projectId);
      const oldIndex = siblings.findIndex((p) => p.id === activePage.id);
      const newIndex = siblings.findIndex((p) => p.id === overPage.id);

      if (oldIndex === -1 || newIndex === -1) {
        scheduleActiveIdReset(droppedId);
        return;
      }

      const reordered = moveItem(siblings, oldIndex, newIndex);

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
        setLocalPages(serverPages);
      }
      return;
    }

    if (!activePage.projectId || !overPage.projectId) {
      scheduleActiveIdReset(droppedId);
      return;
    }

    const targetSiblings = getPageSiblings(localPages, overPage.projectId).filter(
      (p) => p.id !== activePage.id,
    );
    const overIndex = targetSiblings.findIndex((p) => p.id === overPage.id);
    const insertIndex = overIndex !== -1 ? overIndex : targetSiblings.length;

    const newOrder = [...targetSiblings];
    newOrder.splice(insertIndex, 0, activePage);

    flushSync(() => {
      setLocalPages((prev) =>
        prev.map((p) => {
          const idx = newOrder.findIndex((n) => n.id === p.id);
          if (idx === -1) return p;
          return { ...p, projectId: overPage.projectId, position: idx };
        }),
      );
    });

    scheduleActiveIdReset(droppedId);

    try {
      await updatePage({
        id: activePage.id,
        workspaceId: currentWorkspaceId,
        data: { projectId: overPage.projectId },
      }).unwrap();
    } catch (err) {
      console.error('Ошибка перемещения страницы (updatePage):', err);
      setLocalPages(serverPages);
      return;
    }

    try {
      await reorderPages({
        workspaceId: currentWorkspaceId,
        data: {
          projectId: overPage.projectId,
          orderedIds: newOrder.map((p) => p.id),
        },
      }).unwrap();
    } catch (err) {
      console.error('Ошибка перемещения страницы (reorderPages):', err);
    }
    return;
  }

  scheduleActiveIdReset(droppedId);
}
