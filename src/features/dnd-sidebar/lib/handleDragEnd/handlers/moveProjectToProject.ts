import { moveProjectInTree, moveProjectToRoot } from '../../reorderUtils/reorderUtils';
import { applyLocalProjects } from '../utils/applyLocal';
import { revertProjects } from '../utils/revert';
import { canMoveProjectTo } from '../utils/guards';
import type { HandleDragEndHandler } from '../types';

export const moveProjectToProject: HandleDragEndHandler = async (ctx) => {
  const {
    targets,
    localProjects,
    serverProjects,
    setLocalProjects,
    updateProject,
    scheduleActiveIdReset,
    droppedId,
  } = ctx;

  const { activeProject, overProject } = targets;

  if (!activeProject || !overProject) return false;

  if (activeProject.parentProjectId === overProject.parentProjectId) return false;

  const newParentId = overProject.parentProjectId ?? null;

  if (!canMoveProjectTo(localProjects, activeProject.id, newParentId)) {
    scheduleActiveIdReset(droppedId);
    return true;
  }

  const nextProjects = newParentId
    ? moveProjectInTree(localProjects, activeProject.id, newParentId)
    : moveProjectToRoot(localProjects, activeProject.id);

  applyLocalProjects(setLocalProjects, nextProjects);
  scheduleActiveIdReset(droppedId);

  try {
    await updateProject({
      id: activeProject.id,
      body: { parentProjectId: newParentId },
    }).unwrap();
  } catch (err) {
    console.error('Ошибка перемещения проекта:', err);
    revertProjects(setLocalProjects, serverProjects);
  }

  return true;
};
