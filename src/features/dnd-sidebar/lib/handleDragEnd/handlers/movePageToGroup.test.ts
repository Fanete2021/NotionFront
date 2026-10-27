import { describe, it, expect, vi, beforeEach } from 'vitest';
import { movePageToGroup } from './movePageToGroup';
import { makeCtx, makePage, makeProject } from '../utils/makeCtx';

describe('movePageToGroup', () => {
  beforeEach(() => vi.clearAllMocks());

  it('false, если activePage или targetProject отсутствуют', async () => {
    expect(await movePageToGroup(makeCtx())).toBe(false);
  });

  it('no-op, если документ уже в targetProject', async () => {
    const p1 = makePage({ id: 'p1', title: 'P1', projectId: 'proj-1' });
    const target = makeProject({ id: 'proj-1', name: 'Target' });
    const ctx = makeCtx({ targets: { activePage: p1, targetProject: target } });
    expect(await movePageToGroup(ctx)).toBe(true);
    expect(ctx.updatePage).not.toHaveBeenCalled();
  });

  it('перемещает документ в targetProject (updatePage + reorderPages)', async () => {
    const p1 = makePage({ id: 'p1', title: 'P1', projectId: 'proj-1' });
    const target = makeProject({ id: 'proj-2', name: 'Target' });
    const ctx = makeCtx({
      localPages: [p1],
      localProjects: [target],
      serverPages: [p1],
      targets: { activePage: p1, targetProject: target },
    });

    expect(await movePageToGroup(ctx)).toBe(true);

    expect(ctx.updatePage).toHaveBeenCalledWith({
      id: 'p1',
      workspaceId: 'workspace-1',
      body: { projectId: 'proj-2' },
    });
    expect(ctx.reorderPages).toHaveBeenCalledWith({
      workspaceId: 'workspace-1',
      body: { projectId: 'proj-2', orderedIds: ['p1'] },
    });
  });

  it('вставляет перед overPage, если overPage в targetProject', async () => {
    const p1 = makePage({ id: 'p1', title: 'P1', projectId: 'proj-1' });
    const p2 = makePage({ id: 'p2', title: 'P2', projectId: 'proj-2', position: 0 });
    const target = makeProject({ id: 'proj-2', name: 'Target' });
    const ctx = makeCtx({
      localPages: [p1, p2],
      localProjects: [target],
      targets: { activePage: p1, targetProject: target, overPage: p2 },
    });

    expect(await movePageToGroup(ctx)).toBe(true);
    expect(ctx.reorderPages).toHaveBeenCalledWith({
      workspaceId: 'workspace-1',
      body: { projectId: 'proj-2', orderedIds: ['p1', 'p2'] },
    });
  });

  it('откатывает setLocalPages при ошибке updatePage', async () => {
    const p1 = makePage({ id: 'p1', title: 'P1', projectId: 'proj-1' });
    const target = makeProject({ id: 'proj-2', name: 'Target' });
    const serverPages = [p1];
    const ctx = makeCtx({
      localPages: [p1],
      localProjects: [target],
      serverPages,
      targets: { activePage: p1, targetProject: target },
    });

    ctx.updatePage.mockReturnValueOnce({
      unwrap: vi.fn().mockRejectedValue(new Error('Network')),
    });

    expect(await movePageToGroup(ctx)).toBe(true);
    expect(ctx.setLocalPages).toHaveBeenLastCalledWith(serverPages);
    expect(ctx.reorderPages).not.toHaveBeenCalled();
  });
});
