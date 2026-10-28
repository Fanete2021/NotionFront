import { describe, it, expect, vi, beforeEach } from 'vitest';
import { nestProject } from './nestProject';
import { makeCtx, makeProject } from '../utils/makeCtx';

describe('nestProject', () => {
  beforeEach(() => vi.clearAllMocks());

  it('false, если activeProject или targetProject отсутствуют', async () => {
    expect(await nestProject(makeCtx())).toBe(false);
    const ctx1 = makeCtx({ targets: { activeProject: makeProject({ id: 'a', name: 'A' }) } });
    expect(await nestProject(ctx1)).toBe(false);
  });

  it('false, если active.id === target.id', async () => {
    const p = makeProject({ id: 'a', name: 'A' });
    const ctx = makeCtx({ targets: { activeProject: p, targetProject: p } });
    expect(await nestProject(ctx)).toBe(false);
  });

  it('no-op, если active уже внутри target', async () => {
    const ctx = makeCtx({
      targets: {
        activeProject: makeProject({ id: 'a', name: 'A', parentProjectId: 'b' }),
        targetProject: makeProject({ id: 'b', name: 'B' }),
      },
    });
    expect(await nestProject(ctx)).toBe(true);
    expect(ctx.updateProject).not.toHaveBeenCalled();
  });

  it('отмена, если target — потомок active (цикл)', async () => {
    const a = makeProject({ id: 'a', name: 'A' });
    const b = makeProject({ id: 'b', name: 'B', parentProjectId: 'a' });
    const ctx = makeCtx({
      localProjects: [a, b],
      targets: { activeProject: a, targetProject: b },
    });
    expect(await nestProject(ctx)).toBe(true);
    expect(ctx.updateProject).not.toHaveBeenCalled();
  });

  it('вкладывает active в target (updateProject)', async () => {
    const a = makeProject({ id: 'a', name: 'A' });
    const b = makeProject({ id: 'b', name: 'B' });
    const ctx = makeCtx({
      localProjects: [a, b],
      serverProjects: [a, b],
      targets: { activeProject: a, targetProject: b },
    });

    expect(await nestProject(ctx)).toBe(true);
    expect(ctx.updateProject).toHaveBeenCalledWith({
      id: 'a',
      body: { parentProjectId: 'b' },
    });
    expect(ctx.reorderProjects).not.toHaveBeenCalled();
  });

  it('откатывает setLocalProjects при ошибке', async () => {
    const a = makeProject({ id: 'a', name: 'A' });
    const b = makeProject({ id: 'b', name: 'B' });
    const serverProjects = [a, b];
    const ctx = makeCtx({
      localProjects: [a, b],
      serverProjects,
      targets: { activeProject: a, targetProject: b },
    });

    ctx.updateProject.mockReturnValueOnce({
      unwrap: vi.fn().mockRejectedValue(new Error('Network')),
    });

    expect(await nestProject(ctx)).toBe(true);
    expect(ctx.setLocalProjects).toHaveBeenLastCalledWith(serverProjects);
  });
});
