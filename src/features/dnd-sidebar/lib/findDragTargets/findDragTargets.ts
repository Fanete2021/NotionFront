import { DragEndEvent } from '@dnd-kit/core';
import type { DragTargets } from '../../model/types';
import { flattenProjects } from '../reorderUtils/reorderUtils';
import { Project } from '@/entities/project';
import { Page } from '@/shared/const/pageType';

const GROUP_PREFIX = 'group-';
const NEST_PREFIX = 'nest-';
const ROOT_ID = 'projects-root';
const OUTDENT_PREFIX = 'outdent-';

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
      isOverRoot: false,
      outdentProject: undefined,
      isOverOutdent: false,
    };
  }

  const flatProjects = flattenProjects(allProjects);

  const activeProject = flatProjects.find((p) => p.id === active.id);
  const overProject = flatProjects.find((p) => p.id === over.id);
  const activePage = allPages.find((p) => p.id === active.id);
  const overPage = allPages.find((p) => p.id === over.id);

  const overIdStr = String(over.id);
  const isOverOutdent = overIdStr.startsWith(OUTDENT_PREFIX);
  const isOverRoot = overIdStr === ROOT_ID;
  const isOverNest = overIdStr.startsWith(NEST_PREFIX);
  const isOverGroupDroppable = overIdStr.startsWith(GROUP_PREFIX);

  const outdentProjectId = isOverOutdent ? overIdStr.slice(OUTDENT_PREFIX.length) : null;

  const outdentProject = outdentProjectId
    ? flatProjects.find((project) => project.id === outdentProjectId)
    : undefined;

  const targetProjectId = isOverNest
    ? overIdStr.slice(NEST_PREFIX.length)
    : isOverGroupDroppable
      ? overIdStr.slice(GROUP_PREFIX.length)
      : null;

  const isActiveDocument = activePage !== undefined;

  const targetProject = targetProjectId
    ? flatProjects.find((p) => p.id === targetProjectId)
    : isActiveDocument && overProject
      ? overProject
      : undefined;

  return {
    activeProject,
    overProject,
    activePage,
    overPage,
    targetProject,
    isOverRoot,
    outdentProject,
    isOverOutdent,
  };
}
