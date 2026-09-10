import { SidebarItem } from '../model/types/sidebar';
import { Project } from '@/entities/project';
import { Page } from '@/entities/page';
import { ROUTES } from '@/shared/routes';

/**
 * Собирает дерево сайдбара: проекты вкладываются друг в друга через parentProjectId,
 * документы всегда лежат листьями внутри своего проекта.
 */
export function buildProjectTree(projects: Project[], pages: Page[]): SidebarItem[] {
  const subProjects = new Map<string | null, Project[]>();
  projects.forEach((project) => {
    const parentId = project.parentProjectId ?? null;
    const siblings = subProjects.get(parentId) ?? [];
    siblings.push(project);
    subProjects.set(parentId, siblings);
  });

  const projectPages = new Map<string, Page[]>();
  pages.forEach((page) => {
    if (!page.projectId) return;
    const siblings = projectPages.get(page.projectId) ?? [];
    siblings.push(page);
    projectPages.set(page.projectId, siblings);
  });

  const toDocumentItem = (page: Page): SidebarItem => ({
    id: page.id,
    title: page.title,
    type: 'document',
    href: `${ROUTES.documents}/${page.id}`,
    icon: page.icon || undefined,
    documentId: page.id,
    documentType: page.type,
    projectId: page.projectId ?? undefined,
  });

  const toProjectItem = (project: Project): SidebarItem => {
    const childProjects = (subProjects.get(project.id) ?? [])
      .slice()
      .sort((a, b) => a.order - b.order)
      .map(toProjectItem);

    const documents = (projectPages.get(project.id) ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map(toDocumentItem);

    return {
      id: project.id,
      title: project.name,
      type: 'group',
      projectId: project.id,
      icon: project.icon || undefined,
      color: project.color || undefined,
      children: [...childProjects, ...documents],
    };
  };

  return (subProjects.get(null) ?? [])
    .slice()
    .sort((a, b) => a.order - b.order)
    .map(toProjectItem);
}
