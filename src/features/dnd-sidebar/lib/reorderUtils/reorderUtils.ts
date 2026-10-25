import { Project } from '@/entities/project';
import { Page } from '@/shared/const/pageType';

/**
 * Разворачивает дерево проектов (childProjects) в плоский список.
 * Бэк отдаёт дерево, а reorder-логика работает с плоским списком.
 */
export function flattenProjects(projects: Project[]): Project[] {
  const result: Project[] = [];
  const walk = (list: Project[]) => {
    list.forEach((project) => {
      result.push(project);
      if (project.childProjects && project.childProjects.length > 0) {
        walk(project.childProjects);
      }
    });
  };
  walk(projects);
  return result;
}

export function getProjectSiblings(
  allProjects: Project[],
  parentProjectId: string | null | undefined,
): Project[] {
  return flattenProjects(allProjects)
    .filter((p) => (p.parentProjectId ?? null) === (parentProjectId ?? null))
    .sort((a, b) => a.position - b.position);
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

export function isProjectsSynced(local: Project[], server: Project[]): boolean {
  const flatLocal = flattenProjects(local);
  const flatServer = flattenProjects(server);
  if (flatLocal.length !== flatServer.length) return false;
  const serverIds = new Set(flatServer.map((item) => item.id));
  return flatLocal.every((item) => serverIds.has(item.id));
}

export function isSyncedById<T extends { id: string }>(local: T[], server: T[]): boolean {
  if (local.length !== server.length) return false;
  const serverIds = new Set(server.map((item) => item.id));
  return local.every((item) => serverIds.has(item.id));
}

/**
 * Проверяет, является ли nodeId потомком ancestorId (рекурсивно вверх по parentProjectId).
 * Нужно для защиты от цикла при вложении/перемещении.
 */
export function isProjectDescendant(
  projects: Project[],
  ancestorId: string,
  nodeId: string,
): boolean {
  const flat = flattenProjects(projects);
  let current = flat.find((p) => p.id === nodeId);
  while (current?.parentProjectId) {
    if (current.parentProjectId === ancestorId) return true;
    current = flat.find((p) => p.id === current!.parentProjectId);
  }
  return false;
}

/**
 * Перемещает проект в нового родителя (newParentId — id группы).
 * Убирает из старого родителя, добавляет в childProjects нового (в конец).
 */
export function moveProjectInTree(
  projects: Project[],
  projectId: string,
  newParentId: string,
): Project[] {
  const remove = (list: Project[]): { list: Project[]; moved: Project | null } => {
    let moved: Project | null = null;

    const result = list
      .filter((p) => {
        if (p.id === projectId) {
          moved = { ...p, parentProjectId: newParentId };
          return false;
        }
        return true;
      })
      .map((p) => {
        if (p.childProjects && p.childProjects.length > 0) {
          const childResult = remove(p.childProjects);
          if (childResult.moved) moved = childResult.moved;
          return { ...p, childProjects: childResult.list };
        }
        return p;
      });

    return { list: result, moved };
  };

  const { list: withoutMoved, moved } = remove(projects);
  if (!moved) return projects;

  const insert = (list: Project[]): Project[] =>
    list.map((p) => {
      if (p.id === newParentId) {
        const children = p.childProjects ?? [];
        return {
          ...p,
          childProjects: [...children, { ...moved, position: children.length }],
        };
      }
      if (p.childProjects && p.childProjects.length > 0) {
        return { ...p, childProjects: insert(p.childProjects) };
      }
      return p;
    });

  return insert(withoutMoved);
}

/**
 * Перемещает проект в корень (parentProjectId = null).
 * Убирает из старого родителя, добавляет в конец корневого списка.
 */
export function moveProjectToRoot(projects: Project[], projectId: string): Project[] {
  let moved: Project | null = null;

  const remove = (list: Project[]): Project[] =>
    list
      .filter((p) => {
        if (p.id === projectId) {
          moved = { ...p, parentProjectId: null };
          return false;
        }
        return true;
      })
      .map((p) =>
        p.childProjects && p.childProjects.length > 0
          ? { ...p, childProjects: remove(p.childProjects) }
          : p,
      );

  const withoutMoved = remove(projects);
  if (!moved) return projects;

  const movedProject: Project = moved;
  return [...withoutMoved, { ...movedProject, position: withoutMoved.length }];
}
