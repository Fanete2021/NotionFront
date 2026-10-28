import { describe, it, expect, vi, beforeEach } from 'vitest';
import { movePageToAnotherGroup } from './movePageToAnotherGroup';
import { makeCtx, makePage } from '../utils/makeCtx';

describe('movePageToAnotherGroup', () => {
  beforeEach(() => vi.clearAllMocks());

  it('false, если activePage или overPage отсутствуют', async () => {
    expect(await movePageToAnotherGroup(makeCtx())).toBe(false);
  });

  it('false, если projectId одинаковые (тот же проект)', async () => {
    const ctx = makeCtx({
      targets: {
        activePage: makePage({ id: 'p1', title: 'P1', projectId: 'a' }),
        overPage: makePage({ id: 'p2', title: 'P2', projectId: 'a' }),
      },
    });
    expect(await movePageToAnotherGroup(ctx)).toBe(false);
  });

  it('отмена, если projectId = null', async () => {
    const ctx = makeCtx({
      targets: {
        activePage: makePage({ id: 'p1', title: 'P1', projectId: null }),
        overPage: makePage({ id: 'p2', title: 'P2', projectId: 'proj' }),
      },
    });
    expect(await movePageToAnotherGroup(ctx)).toBe(true);
    expect(ctx.updatePage).not.toHaveBeenCalled();
  });

  it('перемещает в проект overPage (updatePage + reorderPages)', async () => {
    const p1 = makePage({ id: 'p1', title: 'P1', projectId: 'proj-1' });
    const p2 = makePage({ id: 'p2', title: 'P2', projectId: 'proj-2', position: 0 });
    const ctx = makeCtx({
      localPages: [p1, p2],
      serverPages: [p1, p2],
      targets: { activePage: p1, overPage: p2 },
    });

    expect(await movePageToAnotherGroup(ctx)).toBe(true);
    expect(ctx.updatePage).toHaveBeenCalledWith({
      id: 'p1',
      workspaceId: 'workspace-1',
      body: { projectId: 'proj-2' },
    });
    expect(ctx.reorderPages).toHaveBeenCalledWith({
      workspaceId: 'workspace-1',
      body: { projectId: 'proj-2', orderedIds: ['p1', 'p2'] },
    });
  });

  it('откатывает setLocalPages при ошибке updatePage', async () => {
    const p1 = makePage({ id: 'p1', title: 'P1', projectId: 'proj-1' });
    const p2 = makePage({ id: 'p2', title: 'P2', projectId: 'proj-2' });
    const serverPages = [p1, p2];
    const ctx = makeCtx({
      localPages: [p1, p2],
      serverPages,
      targets: { activePage: p1, overPage: p2 },
    });

    ctx.updatePage.mockReturnValueOnce({
      unwrap: vi.fn().mockRejectedValue(new Error('Network')),
    });

    expect(await movePageToAnotherGroup(ctx)).toBe(true);
    expect(ctx.setLocalPages).toHaveBeenLastCalledWith(serverPages);
    expect(ctx.reorderPages).not.toHaveBeenCalled();
  });
});
