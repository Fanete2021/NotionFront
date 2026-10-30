import { describe, it, expect, vi, beforeEach } from 'vitest';
import { moveProjectToProject } from './moveProjectToProject';
import { makeCtx, makeProject } from '../utils/makeCtx';

describe('moveProjectToProject', () => {
  beforeEach(() => vi.clearAllMocks());

  it('false, если activeProject или overProject отсутствуют', async () => {
    expect(await moveProjectToProject(makeCtx())).toBe(false);
  });

  it('false, если у них одинаковый parentProjectId (тот же уровень)', async () => {
    const ctx = makeCtx({
      targets: {
        activeProject: makeProject({ id: 'a', name: 'A', parentProjectId: 'root' }),
        overProject: makeProject({ id: 'b', name: 'B', parentProjectId: 'root' }),
      },
    });
    expect(await moveProjectToProject(ctx)).toBe(false);
  });

  it('перемещает к родителю overProject (updateProject)', async () => {
    const a = makeProject({ id: 'a', name: 'A', parentProjectId: 'root-1' });
    const b = makeProject({ id: 'b', name: 'B', parentProjectId: 'root-2' });
    const ctx = makeCtx({
      localProjects: [a, b],
      serverProjects: [a, b],
      targets: { activeProject: a, overProject: b },
    });

    expect(await moveProjectToProject(ctx)).toBe(true);
    expect(ctx.updateProject).toHaveBeenCalledWith({
      id: 'a',
      body: { parentProjectId: 'root-2' },
    });
    expect(ctx.reorderProjects).not.toHaveBeenCalled();
  });

  it('перемещает в корень, если overProject корневой', async () => {
    const a = makeProject({ id: 'a', name: 'A', parentProjectId: 'somewhere' });
    const b = makeProject({ id: 'b', name: 'B', parentProjectId: null });
    const ctx = makeCtx({
      localProjects: [a, b],
      serverProjects: [a, b],
      targets: { activeProject: a, overProject: b },
    });

    expect(await moveProjectToProject(ctx)).toBe(true);
    expect(ctx.updateProject).toHaveBeenCalledWith({
      id: 'a',
      body: { parentProjectId: null },
    });
  });

  it('отмена, если over — потомок active (цикл)', async () => {
    const a = makeProject({ id: 'a', name: 'A' });
    const b = makeProject({ id: 'b', name: 'B', parentProjectId: 'a' });
    const ctx = makeCtx({
      localProjects: [a, b],
      targets: { activeProject: a, overProject: b },
    });

    expect(await moveProjectToProject(ctx)).toBe(true);
    expect(ctx.updateProject).not.toHaveBeenCalled();
  });

  it('откатывает setLocalProjects при ошибке', async () => {
    const a = makeProject({ id: 'a', name: 'A', parentProjectId: 'root-1' });
    const b = makeProject({ id: 'b', name: 'B', parentProjectId: 'root-2' });
    const serverProjects = [a, b];
    const ctx = makeCtx({
      localProjects: [a, b],
      serverProjects,
      targets: { activeProject: a, overProject: b },
    });

    ctx.updateProject.mockReturnValueOnce({
      unwrap: vi.fn().mockRejectedValue(new Error('Network')),
    });

    expect(await moveProjectToProject(ctx)).toBe(true);
    expect(ctx.setLocalProjects).toHaveBeenLastCalledWith(serverProjects);
  });
});
