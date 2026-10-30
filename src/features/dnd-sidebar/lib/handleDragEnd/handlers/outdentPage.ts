import { getPageSiblings } from '../../reorderUtils/reorderUtils';
import { applyLocalPages } from '../utils/applyLocal';
import { revertPages } from '../utils/revert';
import type { HandleDragEndHandler } from '../types';

export const outdentPage: HandleDragEndHandler = async (ctx) => {
  const {
    targets,
    currentWorkspaceId,
    localPages,
    serverPages,
    setLocalPages,
    updatePage,
    reorderPages,
    scheduleActiveIdReset,
    droppedId,
  } = ctx;

  const { activePage, outdentProject, isOverOutdent } = targets;

  if (!isOverOutdent || !outdentProject || !activePage) return false;

  if (activePage.projectId !== outdentProject.id) {
    scheduleActiveIdReset(droppedId);
    return true;
  }

  const newParentId = outdentProject.parentProjectId ?? null;

  if (!newParentId) {
    console.warn('Нельзя вынести документ в корень: API требует projectId типа string.');
    scheduleActiveIdReset(droppedId);
    return true;
  }

  const oldSiblings = getPageSiblings(localPages, outdentProject.id).filter(
    (page) => page.id !== activePage.id,
  );

  const newSiblings = getPageSiblings(localPages, newParentId).filter(
    (page) => page.id !== activePage.id,
  );

  const newOrder = [...newSiblings, activePage];

  applyLocalPages(setLocalPages, (prev) =>
    prev.map((page) => {
      if (page.id === activePage.id) {
        return { ...page, projectId: newParentId, position: newOrder.length - 1 };
      }

      if (page.projectId === outdentProject.id) {
        const index = oldSiblings.findIndex((sibling) => sibling.id === page.id);
        return index === -1 ? page : { ...page, position: index };
      }

      if (page.projectId === newParentId) {
        const index = newOrder.findIndex((sibling) => sibling.id === page.id);
        return index === -1 ? page : { ...page, position: index };
      }

      return page;
    }),
  );

  scheduleActiveIdReset(droppedId);

  try {
    await updatePage({
      id: activePage.id,
      workspaceId: currentWorkspaceId,
      body: { projectId: newParentId },
    }).unwrap();

    if (oldSiblings.length > 0) {
      await reorderPages({
        workspaceId: currentWorkspaceId,
        body: {
          projectId: outdentProject.id,
          orderedIds: oldSiblings.map((page) => page.id),
        },
      }).unwrap();
    }

    await reorderPages({
      workspaceId: currentWorkspaceId,
      body: {
        projectId: newParentId,
        orderedIds: newOrder.map((page) => page.id),
      },
    }).unwrap();
  } catch (err) {
    console.error('Ошибка выноса документа на уровень выше:', err);
    revertPages(setLocalPages, serverPages);
  }

  return true;
};
