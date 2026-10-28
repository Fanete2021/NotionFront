import { describe, it, expect, vi, beforeEach } from 'vitest';
import { reorderProjectSameLevel } from './reorderProjectSameLevel';
import { makeCtx, makeProject } from '../utils/makeCtx';

describe('reorderProjectSameLevel', () => {
  beforeEach(() => vi.clearAllMocks());

  it('false, если activeProject или overProject отсутствуют', async () => {
    expect(await reorderProjectSameLevel(makeCtx())).toBe(false);
  });

  it('false, если у них разные parentProjectId', async () => {
    const ctx = makeCtx({
      targets: {
        activeProject: makeProject({ id: 'a', name: 'A', parentProjectId: 'root-1' }),
        overProject: makeProject({ id: 'b', name: 'B', parentProjectId: 'root-2' }),
      },
    });
    expect(await reorderProjectSameLevel(ctx)).toBe(false);
  });

  it('переставляет (reorderProjects с обоими id)', async () => {
    const a = makeProject({ id: 'a', name: 'A', parentProjectId: null, position: 0 });
    const b = makeProject({ id: 'b', name: 'B', parentProjectId: null, position: 1 });
    const ctx = makeCtx({
      localProjects: [a, b],
      serverProjects: [a, b],
      targets: { activeProject: a, overProject: b },
    });

    expect(await reorderProjectSameLevel(ctx)).toBe(true);
    expect(ctx.reorderProjects).toHaveBeenCalledWith({
      workspaceId: 'workspace-1',
      body: { parentProjectId: null, orderedIds: ['b', 'a'] },
    });
  });

  it('no-op, если id не найдены в siblings', async () => {
    const ctx = makeCtx({
      localProjects: [],
      targets: {
        activeProject: makeProject({ id: 'a', name: 'A' }),
        overProject: makeProject({ id: 'b', name: 'B' }),
      },
    });
    expect(await reorderProjectSameLevel(ctx)).toBe(true);
    expect(ctx.reorderProjects).not.toHaveBeenCalled();
  });

  it('откатывает setLocalProjects при ошибке', async () => {
    const a = makeProject({ id: 'a', name: 'A', position: 0 });
    const b = makeProject({ id: 'b', name: 'B', position: 1 });
    const serverProjects = [a, b];
    const ctx = makeCtx({
      localProjects: [a, b],
      serverProjects,
      targets: { activeProject: a, overProject: b },
    });

    ctx.reorderProjects.mockReturnValueOnce({
      unwrap: vi.fn().mockRejectedValue(new Error('Network')),
    });

    expect(await reorderProjectSameLevel(ctx)).toBe(true);
    expect(ctx.setLocalProjects).toHaveBeenLastCalledWith(serverProjects);
  });
});
