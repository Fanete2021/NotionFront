import {
  getProjectSiblings,
  moveProjectInTree,
  moveProjectToRoot,
} from '../../reorderUtils/reorderUtils';
import { applyLocalProjects } from '../utils/applyLocal';
import { revertProjects } from '../utils/revert';
import { canMoveProjectTo } from '../utils/guards';
import type { HandleDragEndHandler } from '../types';

export const outdentProject: HandleDragEndHandler = async (ctx) => {
  const {
    targets,
    currentWorkspaceId,
    localProjects,
    serverProjects,
    setLocalProjects,
    updateProject,
    reorderProjects,
    scheduleActiveIdReset,
    droppedId,
  } = ctx;

  const { activeProject, outdentProject, isOverOutdent } = targets;

  if (!isOverOutdent || !outdentProject || !activeProject) return false;

  if (activeProject.parentProjectId !== outdentProject.id) {
    scheduleActiveIdReset(droppedId);
    return true;
  }

  const newParentId = outdentProject.parentProjectId ?? null;

  if (!canMoveProjectTo(localProjects, activeProject.id, newParentId)) {
    scheduleActiveIdReset(droppedId);
    return true;
  }

  const nextProjects = newParentId
    ? moveProjectInTree(localProjects, activeProject.id, newParentId)
    : moveProjectToRoot(localProjects, activeProject.id);

  const oldSiblings = getProjectSiblings(nextProjects, outdentProject.id);
  const newSiblings = getProjectSiblings(nextProjects, newParentId);

  applyLocalProjects(setLocalProjects, nextProjects);
  scheduleActiveIdReset(droppedId);

  try {
    await updateProject({
      id: activeProject.id,
      body: { parentProjectId: newParentId },
    }).unwrap();

    if (oldSiblings.length > 0) {
      await reorderProjects({
        workspaceId: currentWorkspaceId,
        body: {
          parentProjectId: outdentProject.id,
          orderedIds: oldSiblings.map((p) => p.id),
        },
      }).unwrap();
    }

    if (newSiblings.length > 0) {
      await reorderProjects({
        workspaceId: currentWorkspaceId,
        body: {
          parentProjectId: newParentId,
          orderedIds: newSiblings.map((p) => p.id),
        },
      }).unwrap();
    }
  } catch (err) {
    console.error('Ошибка выноса проекта на уровень выше:', err);
    revertProjects(setLocalProjects, serverProjects);
  }

  return true;
};
