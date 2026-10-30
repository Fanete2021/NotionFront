import type { Project } from '@/entities/project';
import type { Page } from '@/shared/const/pageType';

export const revertProjects = (
  setLocalProjects: React.Dispatch<React.SetStateAction<Project[]>>,
  server: Project[],
) => {
  setLocalProjects(server);
};

export const revertPages = (
  setLocalPages: React.Dispatch<React.SetStateAction<Page[]>>,
  server: Page[],
) => {
  setLocalPages(server);
};
