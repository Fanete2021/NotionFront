import { flushSync } from 'react-dom';
import { getPageSiblings } from './reorderUtils';
import { Page } from '@/entities/page';
import type { useReorderPagesMutation, useUpdatePageMutation } from '@/entities/page';

type UpdatePageTrigger = ReturnType<typeof useUpdatePageMutation>[0];
type ReorderPagesTrigger = ReturnType<typeof useReorderPagesMutation>[0];

interface Params {
  activePage: Page;
  overPage: Page;
  currentWorkspaceId: string;
  allPages: Page[];
  fallbackPages: Page[];
  updatePage: UpdatePageTrigger;
  reorderPages: ReorderPagesTrigger;
  setLocalPages: React.Dispatch<React.SetStateAction<Page[]>>;
  scheduleActiveIdReset: (id: string) => void;
  droppedId: string;
}

export async function handlePageMoveToAnotherProject({
  activePage,
  overPage,
  currentWorkspaceId,
  allPages,
  fallbackPages,
  updatePage,
  reorderPages,
  setLocalPages,
  scheduleActiveIdReset,
  droppedId,
}: Params): Promise<void> {
  if (!activePage.projectId || !overPage.projectId) {
    scheduleActiveIdReset(droppedId);
    return;
  }

  flushSync(() => {
    setLocalPages((prev) =>
      prev.map((p) => (p.id === activePage.id ? { ...p, projectId: overPage.projectId } : p)),
    );
  });

  scheduleActiveIdReset(droppedId);

  try {
    await updatePage({
      id: activePage.id,
      workspaceId: currentWorkspaceId,
      data: { projectId: overPage.projectId },
    }).unwrap();
  } catch (err) {
    console.error('Ошибка перемещения страницы (updatePage):', err);
    setLocalPages(fallbackPages);
    return;
  }

  try {
    const targetSiblings = getPageSiblings(allPages, overPage.projectId);
    const overIndex = targetSiblings.findIndex((p) => p.id === overPage.id);
    const newOrder = [...targetSiblings];
    newOrder.splice(overIndex, 0, activePage);

    await reorderPages({
      workspaceId: currentWorkspaceId,
      data: {
        projectId: overPage.projectId,
        orderedIds: newOrder.map((p) => p.id),
      },
    }).unwrap();
  } catch (err) {
    console.error('Ошибка перемещения страницы (reorderPages):', err);
  }
}
