import { describe, it, expect, vi, beforeEach } from 'vitest';
import { outdentPage } from './outdentPage';
import { makeCtx, makePage, makeProject } from '../utils/makeCtx';

describe('outdentPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('false, если isOverOutdent = false', async () => {
    const ctx = makeCtx({ targets: { activePage: makePage({ id: 'p1', title: 'P1' }) } });
    expect(await outdentPage(ctx)).toBe(false);
  });

  it('false, если activePage = undefined', async () => {
    const ctx = makeCtx({
      targets: { isOverOutdent: true, outdentProject: makeProject({ id: 'root', name: 'R' }) },
    });
    expect(await outdentPage(ctx)).toBe(false);
  });

  it('no-op, если документ не принадлежит outdentProject', async () => {
    const ctx = makeCtx({
      targets: {
        isOverOutdent: true,
        outdentProject: makeProject({ id: 'root', name: 'R' }),
        activePage: makePage({ id: 'p1', title: 'P1', projectId: 'other' }),
      },
    });
    expect(await outdentPage(ctx)).toBe(true);
    expect(ctx.updatePage).not.toHaveBeenCalled();
    expect(ctx.scheduleActiveIdReset).toHaveBeenCalledWith('a');
  });

  it('отмена, если newParentId = null (в корень нельзя)', async () => {
    const root = makeProject({ id: 'root', name: 'R' });
    const ctx = makeCtx({
      targets: {
        isOverOutdent: true,
        outdentProject: root,
        activePage: makePage({ id: 'p1', title: 'P1', projectId: 'root' }),
      },
    });
    expect(await outdentPage(ctx)).toBe(true);
    expect(ctx.updatePage).not.toHaveBeenCalled();
  });

  it('выносит документ, oldSiblings пуст → reorderPages только для нового', async () => {
    const root = makeProject({ id: 'root', name: 'Root' });
    const parent = makeProject({ id: 'parent', name: 'Parent', parentProjectId: 'root' });
    const p1 = makePage({ id: 'p1', title: 'P1', projectId: 'parent' });
    const ctx = makeCtx({
      localPages: [p1],
      serverPages: [p1],
      localProjects: [root, parent],
      targets: { isOverOutdent: true, outdentProject: parent, activePage: p1 },
    });

    expect(await outdentPage(ctx)).toBe(true);

    expect(ctx.updatePage).toHaveBeenCalledWith({
      id: 'p1',
      workspaceId: 'workspace-1',
      body: { projectId: 'root' },
    });
    expect(ctx.reorderPages).toHaveBeenCalledTimes(1);
    expect(ctx.reorderPages).toHaveBeenCalledWith({
      workspaceId: 'workspace-1',
      body: { projectId: 'root', orderedIds: ['p1'] },
    });
  });

  it('выносит документ, пересчитывает old и new', async () => {
    const root = makeProject({ id: 'root', name: 'Root' });
    const parent = makeProject({ id: 'parent', name: 'Parent', parentProjectId: 'root' });
    const p1 = makePage({ id: 'p1', title: 'P1', projectId: 'parent', position: 0 });
    const p2 = makePage({ id: 'p2', title: 'P2', projectId: 'parent', position: 1 });
    const q1 = makePage({ id: 'q1', title: 'Q1', projectId: 'root', position: 0 });
    const ctx = makeCtx({
      localPages: [p1, p2, q1],
      serverPages: [p1, p2, q1],
      localProjects: [root, parent],
      targets: { isOverOutdent: true, outdentProject: parent, activePage: p1 },
    });

    expect(await outdentPage(ctx)).toBe(true);

    expect(ctx.updatePage).toHaveBeenCalledWith({
      id: 'p1',
      workspaceId: 'workspace-1',
      body: { projectId: 'root' },
    });
    expect(ctx.reorderPages).toHaveBeenCalledWith({
      workspaceId: 'workspace-1',
      body: { projectId: 'parent', orderedIds: ['p2'] },
    });
    expect(ctx.reorderPages).toHaveBeenCalledWith({
      workspaceId: 'workspace-1',
      body: { projectId: 'root', orderedIds: ['q1', 'p1'] },
    });
  });

  it('откатывает setLocalPages при ошибке updatePage', async () => {
    const root = makeProject({ id: 'root', name: 'Root' });
    const parent = makeProject({ id: 'parent', name: 'Parent', parentProjectId: 'root' });
    const p1 = makePage({ id: 'p1', title: 'P1', projectId: 'parent' });
    const serverPages = [p1];
    const ctx = makeCtx({
      localPages: [p1],
      serverPages,
      localProjects: [root, parent],
      targets: { isOverOutdent: true, outdentProject: parent, activePage: p1 },
    });

    ctx.updatePage.mockReturnValueOnce({
      unwrap: vi.fn().mockRejectedValue(new Error('Network')),
    });

    expect(await outdentPage(ctx)).toBe(true);
    expect(ctx.setLocalPages).toHaveBeenLastCalledWith(serverPages);
  });
});
