import { describe, it, expect, vi, beforeEach } from 'vitest';
import { outdentProject } from './outdentProject';
import { makeCtx, makeProject } from '../utils/makeCtx';

describe('outdentProject', () => {
  beforeEach(() => vi.clearAllMocks());

  it('false, если isOverOutdent = false', async () => {
    const ctx = makeCtx({ targets: { activeProject: makeProject({ id: 'a', name: 'A' }) } });
    expect(await outdentProject(ctx)).toBe(false);
    expect(ctx.updateProject).not.toHaveBeenCalled();
  });

  it('false, если outdentProject = undefined', async () => {
    const ctx = makeCtx({
      targets: { isOverOutdent: true, activeProject: makeProject({ id: 'a', name: 'A' }) },
    });
    expect(await outdentProject(ctx)).toBe(false);
  });

  it('false, если activeProject = undefined', async () => {
    const ctx = makeCtx({
      targets: { isOverOutdent: true, outdentProject: makeProject({ id: 'root', name: 'R' }) },
    });
    expect(await outdentProject(ctx)).toBe(false);
  });

  it('no-op (scheduleActiveIdReset), если active не ребёнок outdentProject', async () => {
    const ctx = makeCtx({
      targets: {
        isOverOutdent: true,
        outdentProject: makeProject({ id: 'root', name: 'R' }),
        activeProject: makeProject({ id: 'a', name: 'A', parentProjectId: 'other' }),
      },
    });
    expect(await outdentProject(ctx)).toBe(true);
    expect(ctx.updateProject).not.toHaveBeenCalled();
    expect(ctx.scheduleActiveIdReset).toHaveBeenCalledWith('a');
  });

  it('выносит в корень, если outdentProject корневой (oldSiblings пуст)', async () => {
    const root = makeProject({ id: 'root', name: 'Root' });
    const a = makeProject({ id: 'a', name: 'A', parentProjectId: 'root' });
    const ctx = makeCtx({
      localProjects: [root, a],
      serverProjects: [root, a],
      targets: { isOverOutdent: true, outdentProject: root, activeProject: a },
    });

    expect(await outdentProject(ctx)).toBe(true);

    expect(ctx.updateProject).toHaveBeenCalledWith({
      id: 'a',
      body: { parentProjectId: null },
    });
    expect(ctx.reorderProjects).toHaveBeenCalledTimes(1);
    expect(ctx.reorderProjects).toHaveBeenCalledWith({
      workspaceId: 'workspace-1',
      body: { parentProjectId: null, orderedIds: ['root', 'a'] },
    });
  });

  it('пересчитывает позиции old и new, если есть siblings', async () => {
    const root = makeProject({ id: 'root', name: 'Root' });
    const a = makeProject({ id: 'a', name: 'A', parentProjectId: 'root', position: 0 });
    const b = makeProject({ id: 'b', name: 'B', parentProjectId: 'root', position: 1 });
    const ctx = makeCtx({
      localProjects: [root, a, b],
      serverProjects: [root, a, b],
      targets: { isOverOutdent: true, outdentProject: root, activeProject: a },
    });

    expect(await outdentProject(ctx)).toBe(true);

    expect(ctx.reorderProjects).toHaveBeenCalledWith({
      workspaceId: 'workspace-1',
      body: { parentProjectId: 'root', orderedIds: ['b'] },
    });
    expect(ctx.reorderProjects).toHaveBeenCalledWith({
      workspaceId: 'workspace-1',
      body: { parentProjectId: null, orderedIds: ['root', 'a'] },
    });
  });

  it('откатывает setLocalProjects при ошибке updateProject', async () => {
    const root = makeProject({ id: 'root', name: 'Root' });
    const a = makeProject({ id: 'a', name: 'A', parentProjectId: 'root' });
    const serverProjects = [root, a];
    const ctx = makeCtx({
      localProjects: [root, a],
      serverProjects,
      targets: { isOverOutdent: true, outdentProject: root, activeProject: a },
    });

    ctx.updateProject.mockReturnValueOnce({
      unwrap: vi.fn().mockRejectedValue(new Error('Network')),
    });

    expect(await outdentProject(ctx)).toBe(true);
    expect(ctx.setLocalProjects).toHaveBeenLastCalledWith(serverProjects);
  });
});
