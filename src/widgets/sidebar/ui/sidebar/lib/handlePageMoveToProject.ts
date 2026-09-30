import { flushSync } from 'react-dom';
import { getPageSiblings } from './reorderUtils';
import { Page } from '@/entities/page';
import { Project } from '@/entities/project';
import type { useReorderPagesMutation, useUpdatePageMutation } from '@/entities/page';

type UpdatePageTrigger = ReturnType<typeof useUpdatePageMutation>[0];
type ReorderPagesTrigger = ReturnType<typeof useReorderPagesMutation>[0];

interface Params {
  activePage: Page;
  targetProject: Project;
  currentWorkspaceId: string;
  allPages: Page[];
  fallbackPages: Page[];
  updatePage: UpdatePageTrigger;
  reorderPages: ReorderPagesTrigger;
  setLocalPages: React.Dispatch<React.SetStateAction<Page[]>>;
  scheduleActiveIdReset: (id: string) => void;
  droppedId: string;
}

export async function handlePageMoveToProject({
  activePage,
  targetProject,
  currentWorkspaceId,
  allPages,
  fallbackPages,
  updatePage,
  reorderPages,
  setLocalPages,
  scheduleActiveIdReset,
  droppedId,
}: Params): Promise<void> {
  if (activePage.projectId === targetProject.id) {
    scheduleActiveIdReset(droppedId);
    return;
  }

  flushSync(() => {
    setLocalPages((prev) =>
      prev.map((p) => (p.id === activePage.id ? { ...p, projectId: targetProject.id } : p)),
    );
  });

  scheduleActiveIdReset(droppedId);

  try {
    await updatePage({
      id: activePage.id,
      workspaceId: currentWorkspaceId,
      data: { projectId: targetProject.id },
    }).unwrap();
  } catch (err) {
    console.error('Ошибка перемещения в группу (updatePage):', err);
    setLocalPages(fallbackPages);
    return;
  }

  try {
    const targetSiblings = getPageSiblings(allPages, targetProject.id).filter(
      (p) => p.id !== activePage.id,
    );

    await reorderPages({
      workspaceId: currentWorkspaceId,
      data: {
        projectId: targetProject.id,
        orderedIds: [...targetSiblings.map((p) => p.id), activePage.id],
      },
    }).unwrap();
  } catch (err) {
    console.error('Ошибка перемещения в группу (reorderPages):', err);
  }
}
