import { flushSync } from 'react-dom';
import { getProjectSiblings, moveItem } from './reorderUtils';
import { Project } from '@/entities/project';
import type { useReorderProjectsMutation } from '@/entities/project';

type ReorderProjectsTrigger = ReturnType<typeof useReorderProjectsMutation>[0];

interface Params {
  activeProject: Project;
  overProject: Project;
  currentWorkspaceId: string;
  allProjects: Project[];
  fallbackProjects: Project[];
  reorderProjects: ReorderProjectsTrigger;
  setLocalProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  scheduleActiveIdReset: (id: string) => void;
  droppedId: string;
}

export async function handleProjectReorder({
  activeProject,
  overProject,
  currentWorkspaceId,
  allProjects,
  fallbackProjects,
  reorderProjects,
  setLocalProjects,
  scheduleActiveIdReset,
  droppedId,
}: Params): Promise<void> {
  if (activeProject.parentProjectId !== overProject.parentProjectId) {
    scheduleActiveIdReset(droppedId);
    return;
  }

  const siblings = getProjectSiblings(allProjects, activeProject.parentProjectId);
  const oldIndex = siblings.findIndex((p) => p.id === activeProject.id);
  const newIndex = siblings.findIndex((p) => p.id === overProject.id);

  if (oldIndex === -1 || newIndex === -1) {
    scheduleActiveIdReset(droppedId);
    return;
  }

  const reordered = moveItem(siblings, oldIndex, newIndex);

  flushSync(() => {
    setLocalProjects((prev) =>
      prev.map((p) => {
        const idx = reordered.findIndex((r) => r.id === p.id);
        return idx !== -1 ? { ...p, order: idx } : p;
      }),
    );
  });

  scheduleActiveIdReset(droppedId);

  try {
    await reorderProjects({
      workspaceId: currentWorkspaceId,
      data: {
        parentProjectId: activeProject.parentProjectId ?? null,
        orderedIds: reordered.map((p) => p.id),
      },
    }).unwrap();
  } catch (err) {
    console.error('Ошибка reorder проектов', err);
    setLocalProjects(fallbackProjects);
  }
}
