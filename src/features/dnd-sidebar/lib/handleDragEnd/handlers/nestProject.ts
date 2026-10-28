import { moveProjectInTree } from '../../reorderUtils/reorderUtils';
import { applyLocalProjects } from '../utils/applyLocal';
import { revertProjects } from '../utils/revert';
import { canMoveProjectTo } from '../utils/guards';
import type { HandleDragEndHandler } from '../types';

export const nestProject: HandleDragEndHandler = async (ctx) => {
  const {
    targets,
    localProjects,
    serverProjects,
    setLocalProjects,
    updateProject,
    scheduleActiveIdReset,
    droppedId,
  } = ctx;

  const { activeProject, targetProject } = targets;

  if (!activeProject || !targetProject) return false;
  if (activeProject.id === targetProject.id) return false;

  if (activeProject.parentProjectId === targetProject.id) {
    scheduleActiveIdReset(droppedId);
    return true;
  }

  if (!canMoveProjectTo(localProjects, activeProject.id, targetProject.id)) {
    scheduleActiveIdReset(droppedId);
    return true;
  }

  applyLocalProjects(
    setLocalProjects,
    moveProjectInTree(localProjects, activeProject.id, targetProject.id),
  );
  scheduleActiveIdReset(droppedId);

  try {
    await updateProject({
      id: activeProject.id,
      body: { parentProjectId: targetProject.id },
    }).unwrap();
  } catch (err) {
    console.error('Ошибка вложения проекта (updateProject):', err);
    revertProjects(setLocalProjects, serverProjects);
  }

  return true;
};
