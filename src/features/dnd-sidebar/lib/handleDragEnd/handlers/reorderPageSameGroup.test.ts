import { describe, it, expect, vi, beforeEach } from 'vitest';
import { reorderPageSameGroup } from './reorderPageSameGroup';
import { makeCtx, makePage } from '../utils/makeCtx';

describe('reorderPageSameGroup', () => {
  beforeEach(() => vi.clearAllMocks());

  it('false, если activePage или overPage отсутствуют', async () => {
    expect(await reorderPageSameGroup(makeCtx())).toBe(false);
  });

  it('false, если projectId разные', async () => {
    const ctx = makeCtx({
      targets: {
        activePage: makePage({ id: 'p1', title: 'P1', projectId: 'a' }),
        overPage: makePage({ id: 'p2', title: 'P2', projectId: 'b' }),
      },
    });
    expect(await reorderPageSameGroup(ctx)).toBe(false);
  });

  it('no-op, если projectId = null', async () => {
    const ctx = makeCtx({
      targets: {
        activePage: makePage({ id: 'p1', title: 'P1', projectId: null }),
        overPage: makePage({ id: 'p2', title: 'P2', projectId: null }),
      },
    });
    expect(await reorderPageSameGroup(ctx)).toBe(true);
    expect(ctx.reorderPages).not.toHaveBeenCalled();
  });

  it('переставляет (reorderPages)', async () => {
    const p1 = makePage({ id: 'p1', title: 'P1', projectId: 'proj', position: 0 });
    const p2 = makePage({ id: 'p2', title: 'P2', projectId: 'proj', position: 1 });
    const ctx = makeCtx({
      localPages: [p1, p2],
      serverPages: [p1, p2],
      targets: { activePage: p1, overPage: p2 },
    });

    expect(await reorderPageSameGroup(ctx)).toBe(true);
    expect(ctx.reorderPages).toHaveBeenCalledWith({
      workspaceId: 'workspace-1',
      body: { projectId: 'proj', orderedIds: ['p2', 'p1'] },
    });
  });

  it('откатывает setLocalPages при ошибке', async () => {
    const p1 = makePage({ id: 'p1', title: 'P1', projectId: 'proj', position: 0 });
    const p2 = makePage({ id: 'p2', title: 'P2', projectId: 'proj', position: 1 });
    const serverPages = [p1, p2];
    const ctx = makeCtx({
      localPages: [p1, p2],
      serverPages,
      targets: { activePage: p1, overPage: p2 },
    });

    ctx.reorderPages.mockReturnValueOnce({
      unwrap: vi.fn().mockRejectedValue(new Error('Network')),
    });

    expect(await reorderPageSameGroup(ctx)).toBe(true);
    expect(ctx.setLocalPages).toHaveBeenLastCalledWith(serverPages);
  });
});
