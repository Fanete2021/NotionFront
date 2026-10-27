import type { DragEndEvent } from '@dnd-kit/core';
import type { DragTargets } from '../../model/types';
import type { Project } from '@/entities/project';
import type { Page } from '@/shared/const/pageType';

export type ReorderProjectsTrigger = (args: {
  workspaceId: string;
  body: { parentProjectId: string | null; orderedIds: string[] };
}) => { unwrap: () => Promise<unknown> };

export type ReorderPagesTrigger = (args: {
  workspaceId: string;
  body: { projectId: string; orderedIds: string[] };
}) => { unwrap: () => Promise<unknown> };

export type UpdatePageTrigger = (args: {
  id: string;
  workspaceId: string;
  body: { projectId: string };
}) => { unwrap: () => Promise<unknown> };

export type UpdateProjectTrigger = (args: {
  id: string;
  body: { parentProjectId: string | null };
}) => { unwrap: () => Promise<unknown> };

export interface HandleDragEndParams {
  event: DragEndEvent;
  currentWorkspaceId: string;
  localProjects: Project[];
  localPages: Page[];
  serverProjects: Project[];
  serverPages: Page[];
  setLocalProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  setLocalPages: React.Dispatch<React.SetStateAction<Page[]>>;
  reorderProjects: ReorderProjectsTrigger;
  reorderPages: ReorderPagesTrigger;
  updatePage: UpdatePageTrigger;
  updateProject: UpdateProjectTrigger;
  scheduleActiveIdReset: (id: string) => void;
}

export interface HandleDragEndContext extends HandleDragEndParams {
  targets: DragTargets;
  droppedId: string;
}

export type HandleDragEndHandler = (ctx: HandleDragEndContext) => Promise<boolean>;
