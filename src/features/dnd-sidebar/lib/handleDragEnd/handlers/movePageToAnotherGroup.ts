import { getPageSiblings } from '../../reorderUtils/reorderUtils';
import { applyLocalPages } from '../utils/applyLocal';
import { revertPages } from '../utils/revert';
import type { HandleDragEndHandler } from '../types';

export const movePageToAnotherGroup: HandleDragEndHandler = async (ctx) => {
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

  const { activePage, overPage } = targets;

  if (!activePage || !overPage) return false;
  if (activePage.projectId === overPage.projectId) return false;

  if (!activePage.projectId || !overPage.projectId) {
    scheduleActiveIdReset(droppedId);
    return true;
  }

  const targetSiblings = getPageSiblings(localPages, overPage.projectId).filter(
    (p) => p.id !== activePage.id,
  );
  const overIndex = targetSiblings.findIndex((p) => p.id === overPage.id);
  const insertIndex = overIndex !== -1 ? overIndex : targetSiblings.length;

  const newOrder = [...targetSiblings];
  newOrder.splice(insertIndex, 0, activePage);

  applyLocalPages(setLocalPages, (prev) =>
    prev.map((p) => {
      const idx = newOrder.findIndex((n) => n.id === p.id);
      if (idx === -1) return p;
      return { ...p, projectId: overPage.projectId, position: idx };
    }),
  );

  scheduleActiveIdReset(droppedId);

  try {
    await updatePage({
      id: activePage.id,
      workspaceId: currentWorkspaceId,
      body: { projectId: overPage.projectId },
    }).unwrap();
  } catch (err) {
    console.error('Ошибка перемещения страницы (updatePage):', err);
    revertPages(setLocalPages, serverPages);
    return true;
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

  return true;
};
