import { getProjectSiblings, moveItem } from '../../reorderUtils/reorderUtils';
import { applyLocalProjects } from '../utils/applyLocal';
import { revertProjects } from '../utils/revert';
import type { HandleDragEndHandler } from '../types';

export const reorderProjectSameLevel: HandleDragEndHandler = async (ctx) => {
  const {
    targets,
    currentWorkspaceId,
    localProjects,
    serverProjects,
    setLocalProjects,
    reorderProjects,
    scheduleActiveIdReset,
    droppedId,
  } = ctx;

  const { activeProject, overProject } = targets;

  if (!activeProject || !overProject) return false;

  if (activeProject.parentProjectId !== overProject.parentProjectId) return false;

  const siblings = getProjectSiblings(localProjects, activeProject.parentProjectId);
  const oldIndex = siblings.findIndex((p) => p.id === activeProject.id);
  const newIndex = siblings.findIndex((p) => p.id === overProject.id);

  if (oldIndex === -1 || newIndex === -1) {
    scheduleActiveIdReset(droppedId);
    return true;
  }

  const reordered = moveItem(siblings, oldIndex, newIndex);

  applyLocalProjects(setLocalProjects, (prev) =>
    prev.map((p) => {
      const idx = reordered.findIndex((r) => r.id === p.id);
      return idx !== -1 ? { ...p, position: idx } : p;
    }),
  );

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
    revertProjects(setLocalProjects, serverProjects);
  }

  return true;
};
