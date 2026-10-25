import { flushSync } from 'react-dom';
import { DragEndEvent } from '@dnd-kit/core';
import { findDragTargets } from '../findDragTargets/findDragTargets';
import {
  getPageSiblings,
  getProjectSiblings,
  isProjectDescendant,
  isProjectsSynced,
  isSyncedById,
  moveItem,
  moveProjectInTree,
  moveProjectToRoot,
} from '../reorderUtils/reorderUtils';
import { Project } from '@/entities/project';
import { Page } from '@/shared/const/pageType';

type ReorderProjectsTrigger = (args: {
  workspaceId: string;
  body: { parentProjectId: string | null; orderedIds: string[] };
}) => { unwrap: () => Promise<unknown> };

type ReorderPagesTrigger = (args: {
  workspaceId: string;
  body: { projectId: string; orderedIds: string[] };
}) => { unwrap: () => Promise<unknown> };

type UpdatePageTrigger = (args: {
  id: string;
  workspaceId: string;
  body: { projectId: string };
}) => { unwrap: () => Promise<unknown> };

type UpdateProjectTrigger = (args: { id: string; body: { parentProjectId: string | null } }) => {
  unwrap: () => Promise<unknown>;
};

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
  updateProject: UpdateProjectTrigger;
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
  updateProject,
  scheduleActiveIdReset,
}: HandleDragEndParams): Promise<void> {
  const { active, over } = event;
  const droppedId = String(active.id);

  if (!over || active.id === over.id || !currentWorkspaceId) {
    scheduleActiveIdReset(droppedId);
    return;
  }

  if (!isProjectsSynced(localProjects, serverProjects) || !isSyncedById(localPages, serverPages)) {
    console.warn('Локальный state рассинхронизирован с сервером, пропускаем reorder');
    scheduleActiveIdReset(droppedId);
    return;
  }

  const { activeProject, overProject, activePage, overPage, targetProject } = findDragTargets(
    event,
    localProjects,
    localPages,
  );

  if (activeProject && targetProject && activeProject.id !== targetProject.id) {
    if (activeProject.parentProjectId === targetProject.id) {
      scheduleActiveIdReset(droppedId);
      return;
    }

    if (isProjectDescendant(localProjects, activeProject.id, targetProject.id)) {
      scheduleActiveIdReset(droppedId);
      return;
    }

    flushSync(() => {
      setLocalProjects((prev) => moveProjectInTree(prev, activeProject.id, targetProject.id));
    });

    scheduleActiveIdReset(droppedId);

    try {
      await updateProject({
        id: activeProject.id,
        body: { parentProjectId: targetProject.id },
      }).unwrap();
    } catch (err) {
      console.error('Ошибка вложения проекта (updateProject):', err);
      setLocalProjects(serverProjects);
      return;
    }

    return;
  }

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
        body: { projectId: targetProject.id },
      }).unwrap();
    } catch (err) {
      console.error('Ошибка перемещения в группу (updatePage):', err);
      setLocalPages(serverPages);
      return;
    }

    try {
      await reorderPages({
        workspaceId: currentWorkspaceId,
        body: {
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
      if (activeProject.parentProjectId === overProject.id) {
        const siblings = getProjectSiblings(localProjects, overProject.id);
        const oldIndex = siblings.findIndex((p) => p.id === activeProject.id);

        if (oldIndex === -1 || oldIndex === 0) {
          scheduleActiveIdReset(droppedId);
          return;
        }

        const reordered = moveItem(siblings, oldIndex, 0);

        flushSync(() => {
          setLocalProjects((prev) =>
            prev.map((p) => {
              const idx = reordered.findIndex((r) => r.id === p.id);
              return idx !== -1 ? { ...p, position: idx } : p;
            }),
          );
        });

        scheduleActiveIdReset(droppedId);

        try {
          await reorderProjects({
            workspaceId: currentWorkspaceId,
            body: {
              parentProjectId: overProject.id,
              orderedIds: reordered.map((p) => p.id),
            },
          }).unwrap();
        } catch (err) {
          console.error('Ошибка reorder (в начало родителя):', err);
          setLocalProjects(serverProjects);
        }
        return;
      }

      const newParentId = overProject.parentProjectId ?? null;

      if (
        newParentId === activeProject.id ||
        (newParentId && isProjectDescendant(localProjects, activeProject.id, newParentId))
      ) {
        scheduleActiveIdReset(droppedId);
        return;
      }

      flushSync(() => {
        setLocalProjects((prev) =>
          newParentId
            ? moveProjectInTree(prev, activeProject.id, newParentId)
            : moveProjectToRoot(prev, activeProject.id),
        );
      });

      scheduleActiveIdReset(droppedId);

      try {
        await updateProject({
          id: activeProject.id,
          body: { parentProjectId: newParentId },
        }).unwrap();
      } catch (err) {
        console.error('Ошибка перемещения проекта:', err);
        setLocalProjects(serverProjects);
        return;
      }

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
          return idx !== -1 ? { ...p, position: idx } : p;
        }),
      );
    });

    scheduleActiveIdReset(droppedId);

    try {
      await reorderProjects({
        workspaceId: currentWorkspaceId,
        body: {
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
          body: {
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
        body: { projectId: overPage.projectId },
      }).unwrap();
    } catch (err) {
      console.error('Ошибка перемещения страницы (updatePage):', err);
      setLocalPages(serverPages);
      return;
    }

    try {
      await reorderPages({
        workspaceId: currentWorkspaceId,
        body: {
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
