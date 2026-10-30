import { getPageSiblings } from '../../reorderUtils/reorderUtils';
import { applyLocalPages } from '../utils/applyLocal';
import { revertPages } from '../utils/revert';
import type { HandleDragEndHandler } from '../types';

export const movePageToGroup: HandleDragEndHandler = async (ctx) => {
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

  const { activePage, targetProject, overPage } = targets;

  if (!activePage || !targetProject) return false;

  if (activePage.projectId === targetProject.id) {
    scheduleActiveIdReset(droppedId);
    return true;
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

  applyLocalPages(setLocalPages, (prev) =>
    prev.map((p) => {
      const idx = newOrder.findIndex((n) => n.id === p.id);
      if (idx === -1) return p;
      return { ...p, projectId: targetProject.id, position: idx };
    }),
  );

  scheduleActiveIdReset(droppedId);

  try {
    await updatePage({
      id: activePage.id,
      workspaceId: currentWorkspaceId,
      body: { projectId: targetProject.id },
    }).unwrap();
  } catch (err) {
    console.error('Ошибка перемещения в группу (updatePage):', err);
    revertPages(setLocalPages, serverPages);
    return true;
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

  return true;
};
