import { findDragTargets } from '../findDragTargets/findDragTargets';
import { isProjectsSynced, isSyncedById } from '../reorderUtils/reorderUtils';
import type { HandleDragEndContext, HandleDragEndHandler, HandleDragEndParams } from './types';
import { outdentProject } from './handlers/outdentProject';
import { outdentPage } from './handlers/outdentPage';
import { nestProject } from './handlers/nestProject';
import { movePageToGroup } from './handlers/movePageToGroup';
import { moveProjectToRoot } from './handlers/moveProjectToRoot';
import { moveProjectToProject } from './handlers/moveProjectToProject';
import { reorderProjectSameLevel } from './handlers/reorderProjectSameLevel';
import { reorderPageSameGroup } from './handlers/reorderPageSameGroup';
import { movePageToAnotherGroup } from './handlers/movePageToAnotherGroup';

const handlers: HandleDragEndHandler[] = [
  outdentProject,
  outdentPage,
  nestProject,
  movePageToGroup,
  moveProjectToRoot,
  moveProjectToProject,
  reorderProjectSameLevel,
  reorderPageSameGroup,
  movePageToAnotherGroup,
];

export async function handleDragEnd(params: HandleDragEndParams): Promise<void> {
  const { event, localProjects, localPages, serverProjects, serverPages, scheduleActiveIdReset } =
    params;

  const { active, over } = event;
  const droppedId = String(active.id);

  if (!over || active.id === over.id || !params.currentWorkspaceId) {
    scheduleActiveIdReset(droppedId);
    return;
  }

  if (!isProjectsSynced(localProjects, serverProjects) || !isSyncedById(localPages, serverPages)) {
    console.warn('Локальный state рассинхронизирован с сервером, пропускаем reorder');
    scheduleActiveIdReset(droppedId);
    return;
  }

  const targets = findDragTargets(event, localProjects, localPages);
  const ctx: HandleDragEndContext = { ...params, targets, droppedId };

  for (const handler of handlers) {
    const handled = await handler(ctx);
    if (handled) return;
  }

  scheduleActiveIdReset(droppedId);
}
