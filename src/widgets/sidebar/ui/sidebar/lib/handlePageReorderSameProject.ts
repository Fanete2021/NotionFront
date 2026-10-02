import { flushSync } from 'react-dom';
import { getPageSiblings, moveItem } from './reorderUtils';
import { Page } from '@/entities/page';
import type { useReorderPagesMutation } from '@/entities/page';

type ReorderPagesTrigger = ReturnType<typeof useReorderPagesMutation>[0];

interface Params {
  activePage: Page;
  overPage: Page;
  currentWorkspaceId: string;
  allPages: Page[];
  fallbackPages: Page[];
  reorderPages: ReorderPagesTrigger;
  setLocalPages: React.Dispatch<React.SetStateAction<Page[]>>;
  scheduleActiveIdReset: (id: string) => void;
  droppedId: string;
}

export async function handlePageReorderSameProject({
  activePage,
  overPage,
  currentWorkspaceId,
  allPages,
  fallbackPages,
  reorderPages,
  setLocalPages,
  scheduleActiveIdReset,
  droppedId,
}: Params): Promise<void> {
  if (!activePage.projectId) {
    scheduleActiveIdReset(droppedId);
    return;
  }

  const siblings = getPageSiblings(allPages, activePage.projectId);
  const oldIndex = siblings.findIndex((p) => p.id === activePage.id);
  const newIndex = siblings.findIndex((p) => p.id === overPage.id);

  if (oldIndex === -1 || newIndex === -1) {
    scheduleActiveIdReset(droppedId);
    return;
  }

  const reordered = moveItem(siblings, oldIndex, newIndex);

  flushSync(() => {
    setLocalPages((prev) =>
      prev.map((p) => {
        const idx = reordered.findIndex((r) => r.id === p.id);
        return idx !== -1 ? { ...p, position: idx } : p;
      }),
    );
  });

  scheduleActiveIdReset(droppedId);

  try {
    await reorderPages({
      workspaceId: currentWorkspaceId,
      data: {
        projectId: activePage.projectId,
        orderedIds: reordered.map((p) => p.id),
      },
    }).unwrap();
  } catch (err) {
    console.error('Ошибка reorder страниц:', err);
    setLocalPages(fallbackPages);
  }
}
