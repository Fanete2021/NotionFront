import { DragEndEvent } from '@dnd-kit/core';
import type { DragTargets } from './types';
import { Project } from '@/entities/project';
import { Page } from '@/entities/page';

const GROUP_PREFIX = 'group-';

export function findDragTargets(
  event: DragEndEvent,
  allProjects: Project[],
  allPages: Page[],
): DragTargets {
  const { active, over } = event;

  if (!over) {
    return {
      activeProject: undefined,
      overProject: undefined,
      activePage: undefined,
      overPage: undefined,
      targetProject: undefined,
      isOverGroup: false,
    };
  }

  const activeProject = allProjects.find((p) => p.id === active.id);
  const overProject = allProjects.find((p) => p.id === over.id);
  const activePage = allPages.find((p) => p.id === active.id);
  const overPage = allPages.find((p) => p.id === over.id);

  const overIdStr = String(over.id);
  const isOverGroup = overIdStr.startsWith(GROUP_PREFIX);
  const targetProjectId = isOverGroup ? overIdStr.slice(GROUP_PREFIX.length) : null;

  const targetProject = targetProjectId
    ? allProjects.find((p) => p.id === targetProjectId)
    : overProject;

  return { activeProject, overProject, activePage, overPage, targetProject, isOverGroup };
}
