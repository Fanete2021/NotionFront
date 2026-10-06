import { describe, it, expect } from 'vitest';
import type { DragEndEvent } from '@dnd-kit/core';
import { findDragTargets } from './findDragTargets';
import type { Project } from '@/entities/project';
import type { Page } from '@/shared/const/pageType';

const makeProject = (overrides: Partial<Project> & Pick<Project, 'id' | 'name'>): Project => ({
  workspaceId: 'workspace-1',
  parentProjectId: null,
  color: null,
  icon: null,
  order: 0,
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

describe('findDragTargets', () => {
  it('возвращает пустые поля, если over === null', () => {
    const result = findDragTargets(makeEvent('a', null), [], []);

    expect(result).toEqual({
      activeProject: undefined,
      overProject: undefined,
      activePage: undefined,
      overPage: undefined,
      targetProject: undefined,
      isOverGroup: false,
    });
  });

  it('находит activeProject и overProject по id', () => {
    const projects = [makeProject({ id: 'a', name: 'A' }), makeProject({ id: 'b', name: 'B' })];

    const result = findDragTargets(makeEvent('a', 'b'), projects, []);

    expect(result.activeProject?.id).toBe('a');
    expect(result.overProject?.id).toBe('b');
    expect(result.activePage).toBeUndefined();
    expect(result.overPage).toBeUndefined();
    expect(result.isOverGroup).toBe(false);
  });

  it('находит activePage и overPage по id', () => {
    const pages = [
      makePage({ id: 'p1', title: 'P1', projectId: 'proj' }),
      makePage({ id: 'p2', title: 'P2', projectId: 'proj' }),
    ];

    const result = findDragTargets(makeEvent('p1', 'p2'), [], pages);

    expect(result.activePage?.id).toBe('p1');
    expect(result.overPage?.id).toBe('p2');
    expect(result.activeProject).toBeUndefined();
    expect(result.overProject).toBeUndefined();
  });

  it('определяет isOverGroup по префиксу group-', () => {
    const projects = [makeProject({ id: 'proj-1', name: 'P' })];

    const result = findDragTargets(makeEvent('page-1', 'group-proj-1'), projects, []);

    expect(result.isOverGroup).toBe(true);
    expect(result.targetProject?.id).toBe('proj-1');
  });

  it('targetProject = overProject, если over — не группа', () => {
    const projects = [makeProject({ id: 'a', name: 'A' }), makeProject({ id: 'b', name: 'B' })];

    const result = findDragTargets(makeEvent('a', 'b'), projects, []);

    expect(result.isOverGroup).toBe(false);
    expect(result.targetProject?.id).toBe('b');
  });

  it('targetProject = undefined, если over — группа, но проект не найден', () => {
    const projects = [makeProject({ id: 'a', name: 'A' })];

    const result = findDragTargets(makeEvent('a', 'group-unknown'), projects, []);

    expect(result.isOverGroup).toBe(true);
    expect(result.targetProject).toBeUndefined();
  });
});
