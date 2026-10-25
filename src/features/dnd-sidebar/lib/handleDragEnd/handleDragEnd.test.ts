import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { DragEndEvent } from '@dnd-kit/core';
import { handleDragEnd } from './handleDragEnd';
import type { Project } from '@/entities/project';
import type { Page } from '@/shared/const/pageType';

vi.mock('react-dom', () => ({
  flushSync: vi.fn((fn: () => void) => fn()),
}));

const makeProject = (overrides: Partial<Project> & Pick<Project, 'id' | 'name'>): Project => ({
  workspaceId: 'workspace-1',
  parentProjectId: null,
  color: null,
  icon: null,
  position: 0,
  createdAt: '2026-10-06T00:00:00.000Z',
  updatedAt: '2026-10-06T00:00:00.000Z',
  ...overrides,
});

const makePage = (overrides: Partial<Page> & Pick<Page, 'id' | 'title'>): Page => ({
  workspaceId: 'workspace-1',
  projectId: null,
  parentPageId: null,
  icon: null,
  type: 'DOC',
  authorId: 'author-1',
  updatedById: null,
  position: 0,
  createdAt: '2026-10-06T00:00:00.000Z',
  updatedAt: '2026-10-06T00:00:00.000Z',
  ...overrides,
});

const makeEvent = (activeId: string, overId: string | null): DragEndEvent =>
  ({
    active: { id: activeId, data: { current: {} } },
    over: overId ? { id: overId, data: { current: {} } } : null,
  }) as unknown as DragEndEvent;

const makeTrigger = () => {
  const unwrap = vi.fn().mockResolvedValue(undefined);
  const trigger = vi.fn().mockReturnValue({ unwrap });
  return { trigger, unwrap };
};

const baseParams = () => {
  const { trigger: reorderProjects } = makeTrigger();
  const { trigger: reorderPages } = makeTrigger();
  const { trigger: updatePage } = makeTrigger();
  const { trigger: updateProject } = makeTrigger();

  return {
    currentWorkspaceId: 'workspace-1',
    localProjects: [] as Project[],
    localPages: [] as Page[],
    serverProjects: [] as Project[],
    serverPages: [] as Page[],
    setLocalProjects: vi.fn(),
    setLocalPages: vi.fn(),
    reorderProjects,
    reorderPages,
    updatePage,
    updateProject,
    scheduleActiveIdReset: vi.fn(),
  };
};

describe('handleDragEnd', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('вызывает scheduleActiveIdReset, если over === null', async () => {
    const params = baseParams();

    await handleDragEnd({ ...params, event: makeEvent('a', null) });

    expect(params.scheduleActiveIdReset).toHaveBeenCalledWith('a');
    expect(params.reorderProjects).not.toHaveBeenCalled();
    expect(params.reorderPages).not.toHaveBeenCalled();
    expect(params.updateProject).not.toHaveBeenCalled();
  });

  it('вызывает scheduleActiveIdReset, если active.id === over.id', async () => {
    const params = baseParams();

    await handleDragEnd({ ...params, event: makeEvent('a', 'a') });

    expect(params.scheduleActiveIdReset).toHaveBeenCalledWith('a');
  });

  it('вызывает scheduleActiveIdReset, если нет currentWorkspaceId', async () => {
    const params = baseParams();
    params.currentWorkspaceId = '';

    await handleDragEnd({ ...params, event: makeEvent('a', 'b') });

    expect(params.scheduleActiveIdReset).toHaveBeenCalledWith('a');
  });

  it('пропускает reorder, если localPages рассинхронизирован с serverPages', async () => {
    const params = baseParams();
    params.localPages = [makePage({ id: 'p1', title: 'P1' })];
    params.serverPages = [makePage({ id: 'p2', title: 'P2' })];

    await handleDragEnd({ ...params, event: makeEvent('p1', 'p2') });

    expect(params.scheduleActiveIdReset).toHaveBeenCalledWith('p1');
    expect(params.reorderPages).not.toHaveBeenCalled();
  });

  it('перемещает страницу в другую группу (updatePage + reorderPages)', async () => {
    const targetProject = makeProject({ id: 'proj-2', name: 'Project 2' });
    const params = baseParams();
    params.localProjects = [targetProject];
    params.serverProjects = [targetProject];
    params.localPages = [makePage({ id: 'p1', title: 'P1', projectId: 'proj-1', position: 0 })];
    params.serverPages = [...params.localPages];

    await handleDragEnd({
      ...params,
      event: makeEvent('p1', `group-proj-2`),
    });

    expect(params.updatePage).toHaveBeenCalledWith({
      id: 'p1',
      workspaceId: 'workspace-1',
      body: { projectId: 'proj-2' },
    });
    expect(params.reorderPages).toHaveBeenCalledWith({
      workspaceId: 'workspace-1',
      body: { projectId: 'proj-2', orderedIds: ['p1'] },
    });
  });

  it('не перемещает страницу, если она уже в целевой группе', async () => {
    const targetProject = makeProject({ id: 'proj-1', name: 'Project 1' });
    const params = baseParams();
    params.localProjects = [targetProject];
    params.serverProjects = [targetProject];
    params.localPages = [makePage({ id: 'p1', title: 'P1', projectId: 'proj-1', position: 0 })];
    params.serverPages = [...params.localPages];

    await handleDragEnd({
      ...params,
      event: makeEvent('p1', `group-proj-1`),
    });

    expect(params.updatePage).not.toHaveBeenCalled();
    expect(params.reorderPages).not.toHaveBeenCalled();
  });

  it('делает reorder проектов внутри одного родителя', async () => {
    const params = baseParams();
    params.localProjects = [
      makeProject({ id: 'a', name: 'A', position: 0 }),
      makeProject({ id: 'b', name: 'B', position: 1 }),
    ];
    params.serverProjects = [...params.localProjects];

    await handleDragEnd({ ...params, event: makeEvent('a', 'b') });

    expect(params.reorderProjects).toHaveBeenCalledWith({
      workspaceId: 'workspace-1',
      body: { parentProjectId: null, orderedIds: ['b', 'a'] },
    });
    expect(params.updateProject).not.toHaveBeenCalled();
  });

  it('перемещает проект к родителю overProject, если родители разные', async () => {
    const params = baseParams();
    params.localProjects = [
      makeProject({ id: 'a', name: 'A', parentProjectId: 'root-1' }),
      makeProject({ id: 'b', name: 'B', parentProjectId: 'root-2' }),
      makeProject({ id: 'root-1', name: 'Root 1' }),
      makeProject({ id: 'root-2', name: 'Root 2' }),
    ];
    params.serverProjects = [...params.localProjects];

    await handleDragEnd({ ...params, event: makeEvent('a', 'b') });

    expect(params.updateProject).toHaveBeenCalledWith({
      id: 'a',
      body: { parentProjectId: 'root-2' },
    });
    expect(params.reorderProjects).not.toHaveBeenCalled();
  });

  it('переставляет проект в начало его родителя, если тащат на родителя', async () => {
    const params = baseParams();
    params.localProjects = [
      makeProject({ id: 'root', name: 'Root', position: 0 }),
      makeProject({ id: 'a', name: 'A', parentProjectId: 'root', position: 0 }),
      makeProject({ id: 'b', name: 'B', parentProjectId: 'root', position: 1 }),
    ];
    params.serverProjects = [...params.localProjects];

    await handleDragEnd({ ...params, event: makeEvent('b', 'root') });

    expect(params.reorderProjects).toHaveBeenCalledWith({
      workspaceId: 'workspace-1',
      body: { parentProjectId: 'root', orderedIds: ['b', 'a'] },
    });
    expect(params.updateProject).not.toHaveBeenCalled();
  });

  it('делает reorder страниц внутри одного проекта', async () => {
    const params = baseParams();
    params.localPages = [
      makePage({ id: 'p1', title: 'P1', projectId: 'proj-1', position: 0 }),
      makePage({ id: 'p2', title: 'P2', projectId: 'proj-1', position: 1 }),
    ];
    params.serverPages = [...params.localPages];

    await handleDragEnd({ ...params, event: makeEvent('p1', 'p2') });

    expect(params.reorderPages).toHaveBeenCalledWith({
      workspaceId: 'workspace-1',
      body: { projectId: 'proj-1', orderedIds: ['p2', 'p1'] },
    });
  });

  it('вкладывает проект в другой через nest-зону', async () => {
    const params = baseParams();
    params.localProjects = [
      makeProject({ id: 'a', name: 'A', position: 0 }),
      makeProject({ id: 'b', name: 'B', position: 1 }),
    ];
    params.serverProjects = [...params.localProjects];

    await handleDragEnd({ ...params, event: makeEvent('a', `nest-b`) });

    expect(params.updateProject).toHaveBeenCalledWith({
      id: 'a',
      body: { parentProjectId: 'b' },
    });
    expect(params.reorderProjects).not.toHaveBeenCalled();
  });

  it('не вкладывает проект в своего потомка (цикл)', async () => {
    const params = baseParams();
    params.localProjects = [
      makeProject({ id: 'a', name: 'A', position: 0 }),
      makeProject({ id: 'b', name: 'B', parentProjectId: 'a', position: 0 }),
    ];
    params.serverProjects = [...params.localProjects];

    await handleDragEnd({ ...params, event: makeEvent('a', `nest-b`) });

    expect(params.updateProject).not.toHaveBeenCalled();
    expect(params.scheduleActiveIdReset).toHaveBeenCalledWith('a');
  });

  it('откатывает setLocalPages при ошибке updatePage', async () => {
    const targetProject = makeProject({ id: 'proj-2', name: 'Project 2' });
    const params = baseParams();
    params.localProjects = [targetProject];
    params.serverProjects = [targetProject];
    params.localPages = [makePage({ id: 'p1', title: 'P1', projectId: 'proj-1', position: 0 })];
    params.serverPages = [...params.localPages];

    params.updatePage.mockReturnValueOnce({
      unwrap: vi.fn().mockRejectedValue(new Error('Network error')),
    });

    await handleDragEnd({
      ...params,
      event: makeEvent('p1', `group-proj-2`),
    });

    expect(params.setLocalPages).toHaveBeenCalledWith(params.serverPages);
  });
});
