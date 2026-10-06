import { DragEndEvent } from '@dnd-kit/core';
import { Project } from '@/entities/project';
import { Page } from '@/shared/const/pageType';

export interface DragTargets {
  activeProject: Project | undefined;
  overProject: Project | undefined;
  activePage: Page | undefined;
  overPage: Page | undefined;
  targetProject: Project | undefined;
  isOverGroup: boolean;
}

export interface SharedDragParams {
  droppedId: string;
  currentWorkspaceId: string;
  allProjects: Project[];
  allPages: Page[];
  fallbackProjects: Project[];
  fallbackPages: Page[];
  setLocalProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  setLocalPages: React.Dispatch<React.SetStateAction<Page[]>>;
  scheduleActiveIdReset: (id: string) => void;
}

export type { DragEndEvent };
