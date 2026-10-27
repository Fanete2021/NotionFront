import { describe, it, expect, vi, beforeEach } from 'vitest';
import { moveProjectToRoot } from './moveProjectToRoot';
import { makeCtx, makeProject } from '../utils/makeCtx';

describe('moveProjectToRoot', () => {
  beforeEach(() => vi.clearAllMocks());

  it('false, если isOverRoot = false или activeProject нет', async () => {
    expect(await moveProjectToRoot(makeCtx())).toBe(false);
    const ctx = makeCtx({ targets: { activeProject: makeProject({ id: 'a', name: 'A' }) } });
    expect(await moveProjectToRoot(ctx)).toBe(false);
  });

  it('no-op, если проект уже в корне', async () => {
    const a = makeProject({ id: 'a', name: 'A', parentProjectId: null });
    const ctx = makeCtx({ targets: { activeProject: a, isOverRoot: true } });
    expect(await moveProjectToRoot(ctx)).toBe(true);
    expect(ctx.updateProject).not.toHaveBeenCalled();
  });

  it('перемещает в корень (updateProject parentProjectId = null)', async () => {
    const a = makeProject({ id: 'a', name: 'A', parentProjectId: 'root' });
    const ctx = makeCtx({
      localProjects: [a],
      serverProjects: [a],
      targets: { activeProject: a, isOverRoot: true },
    });

    expect(await moveProjectToRoot(ctx)).toBe(true);
    expect(ctx.updateProject).toHaveBeenCalledWith({
      id: 'a',
      body: { parentProjectId: null },
    });
  });

  it('откатывает setLocalProjects при ошибке', async () => {
    const a = makeProject({ id: 'a', name: 'A', parentProjectId: 'root' });
    const serverProjects = [a];
    const ctx = makeCtx({
      localProjects: [a],
      serverProjects,
      targets: { activeProject: a, isOverRoot: true },
    });

    ctx.updateProject.mockReturnValueOnce({
      unwrap: vi.fn().mockRejectedValue(new Error('Network')),
    });

    expect(await moveProjectToRoot(ctx)).toBe(true);
    expect(ctx.setLocalProjects).toHaveBeenLastCalledWith(serverProjects);
  });
});
