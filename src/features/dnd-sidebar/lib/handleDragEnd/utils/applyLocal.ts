import { flushSync } from 'react-dom';
import type { Project } from '@/entities/project';
import type { Page } from '@/shared/const/pageType';

export const applyLocalProjects = (
  setLocalProjects: React.Dispatch<React.SetStateAction<Project[]>>,
  next: Project[] | ((prev: Project[]) => Project[]),
) => {
  flushSync(() => setLocalProjects(next));
};

export const applyLocalPages = (
  setLocalPages: React.Dispatch<React.SetStateAction<Page[]>>,
  next: Page[] | ((prev: Page[]) => Page[]),
) => {
  flushSync(() => setLocalPages(next));
};
