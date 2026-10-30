import { isProjectDescendant } from '../../reorderUtils/reorderUtils';
import type { Project } from '@/entities/project';

export const canMoveProjectTo = (
  localProjects: Project[],
  activeId: string,
  newParentId: string | null,
): boolean => {
  if (!newParentId) return true;
  if (newParentId === activeId) return false;
  return !isProjectDescendant(localProjects, activeId, newParentId);
};
