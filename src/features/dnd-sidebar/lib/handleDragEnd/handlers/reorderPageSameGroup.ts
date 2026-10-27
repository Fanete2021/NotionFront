import { getPageSiblings, moveItem } from '../../reorderUtils/reorderUtils';
import { applyLocalPages } from '../utils/applyLocal';
import { revertPages } from '../utils/revert';
import type { HandleDragEndHandler } from '../types';

export const reorderPageSameGroup: HandleDragEndHandler = async (ctx) => {
  const {
    targets,
    currentWorkspaceId,
    localPages,
    serverPages,
    setLocalPages,
    reorderPages,
    scheduleActiveIdReset,
    droppedId,
  } = ctx;

  const { activePage, overPage } = targets;

  if (!activePage || !overPage) return false;
  if (activePage.projectId !== overPage.projectId) return false;
  if (!activePage.projectId) {
    scheduleActiveIdReset(droppedId);
    return true;
  }

  const siblings = getPageSiblings(localPages, activePage.projectId);
  const oldIndex = siblings.findIndex((p) => p.id === activePage.id);
  const newIndex = siblings.findIndex((p) => p.id === overPage.id);

  if (oldIndex === -1 || newIndex === -1) {
    scheduleActiveIdReset(droppedId);
    return true;
  }

  const reordered = moveItem(siblings, oldIndex, newIndex);

  applyLocalPages(setLocalPages, (prev) =>
    prev.map((p) => {
      const idx = reordered.findIndex((r) => r.id === p.id);
      return idx !== -1 ? { ...p, position: idx } : p;
    }),
  );

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
    revertPages(setLocalPages, serverPages);
  }

  return true;
};
