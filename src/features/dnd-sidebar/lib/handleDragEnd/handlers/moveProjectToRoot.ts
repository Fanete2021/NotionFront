import { moveProjectToRoot as moveToRoot } from '../../reorderUtils/reorderUtils';
import { applyLocalProjects } from '../utils/applyLocal';
import { revertProjects } from '../utils/revert';
import type { HandleDragEndHandler } from '../types';

export const moveProjectToRoot: HandleDragEndHandler = async (ctx) => {
  const {
    targets,
    localProjects,
    serverProjects,
    setLocalProjects,
    updateProject,
    scheduleActiveIdReset,
    droppedId,
  } = ctx;

  const { activeProject, isOverRoot } = targets;

  if (!activeProject || !isOverRoot) return false;

  if (activeProject.parentProjectId === null) {
    scheduleActiveIdReset(droppedId);
    return true;
  }

  applyLocalProjects(setLocalProjects, moveToRoot(localProjects, activeProject.id));
  scheduleActiveIdReset(droppedId);

  try {
    await updateProject({
      id: activeProject.id,
      body: { parentProjectId: null },
    }).unwrap();
  } catch (err) {
    console.error('Ошибка вытаскивания в корень:', err);
    revertProjects(setLocalProjects, serverProjects);
  }

  return true;
};
