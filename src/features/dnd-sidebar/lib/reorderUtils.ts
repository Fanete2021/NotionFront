import { Project } from '@/entities/project';
import { Page } from '@/entities/page';

export function getProjectSiblings(
  allProjects: Project[],
  parentProjectId: string | null | undefined,
): Project[] {
  return allProjects
    .filter((p) => p.parentProjectId === parentProjectId)
    .sort((a, b) => a.order - b.order);
}

export function getPageSiblings(allPages: Page[], projectId: string): Page[] {
  return allPages.filter((p) => p.projectId === projectId).sort((a, b) => a.position - b.position);
}

export function moveItem<T>(items: T[], from: number, to: number): T[] {
  const result = [...items];
  const [item] = result.splice(from, 1);
  result.splice(to, 0, item);
  return result;
}

export function isSyncedById<T extends { id: string }>(local: T[], server: T[]): boolean {
  if (local.length !== server.length) return false;
  const serverIds = new Set(server.map((item) => item.id));
  return local.every((item) => serverIds.has(item.id));
}
