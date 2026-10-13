import { describe, it, expect } from 'vitest';
import { getPageSiblings, getProjectSiblings, isSyncedById, moveItem } from './reorderUtils';
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

describe('getProjectSiblings', () => {
  it('фильтрует проекты по parentProjectId и сортирует по order', () => {
    const projects = [
      makeProject({ id: 'a', name: 'A', parentProjectId: 'root', order: 2 }),
      makeProject({ id: 'b', name: 'B', parentProjectId: 'root', order: 1 }),
      makeProject({ id: 'c', name: 'C', parentProjectId: 'other', order: 0 }),
    ];

    const result = getProjectSiblings(projects, 'root');

    expect(result.map((p) => p.id)).toEqual(['b', 'a']);
  });

  it('работает с parentProjectId = null', () => {
    const projects = [
      makeProject({ id: 'a', name: 'A', parentProjectId: null, order: 1 }),
      makeProject({ id: 'b', name: 'B', parentProjectId: 'root', order: 0 }),
    ];

    const result = getProjectSiblings(projects, null);

    expect(result.map((p) => p.id)).toEqual(['a']);
  });

  it('работает с parentProjectId = undefined', () => {
    const projects = [makeProject({ id: 'a', name: 'A', parentProjectId: null, order: 1 })];

    const result = getProjectSiblings(projects, undefined);

    expect(result.map((p) => p.id)).toEqual(['a']);
  });

  it('возвращает пустой массив, если нет проектов с таким parentProjectId', () => {
    const projects = [makeProject({ id: 'a', name: 'A', parentProjectId: 'root' })];

    const result = getProjectSiblings(projects, 'unknown');

    expect(result).toEqual([]);
  });
});

describe('getPageSiblings', () => {
  it('фильтрует страницы по projectId и сортирует по position', () => {
    const pages = [
      makePage({ id: 'p1', title: 'P1', projectId: 'proj', position: 2 }),
      makePage({ id: 'p2', title: 'P2', projectId: 'proj', position: 0 }),
      makePage({ id: 'p3', title: 'P3', projectId: 'other', position: 1 }),
    ];

    const result = getPageSiblings(pages, 'proj');

    expect(result.map((p) => p.id)).toEqual(['p2', 'p1']);
  });

  it('возвращает пустой массив, если нет страниц с таким projectId', () => {
    const pages = [makePage({ id: 'p1', title: 'P1', projectId: 'proj' })];

    const result = getPageSiblings(pages, 'unknown');

    expect(result).toEqual([]);
  });
});

describe('moveItem', () => {
  it('перемещает элемент вперёд', () => {
    const items = ['a', 'b', 'c', 'd'];

    expect(moveItem(items, 0, 2)).toEqual(['b', 'c', 'a', 'd']);
  });

  it('перемещает элемент назад', () => {
    const items = ['a', 'b', 'c', 'd'];

    expect(moveItem(items, 3, 1)).toEqual(['a', 'd', 'b', 'c']);
  });

  it('возвращает копию, не мутируя оригинал', () => {
    const items = ['a', 'b', 'c'];
    const result = moveItem(items, 0, 2);

    expect(result).not.toBe(items);
    expect(items).toEqual(['a', 'b', 'c']);
  });

  it('работает с одним элементом', () => {
    expect(moveItem(['a'], 0, 0)).toEqual(['a']);
  });

  it('работает с пустым массивом', () => {
    expect(moveItem([], 0, 0)).toEqual([]);
  });
});

describe('isSyncedById', () => {
  it('возвращает true, если массивы совпадают по id', () => {
    const local = [{ id: 'a' }, { id: 'b' }];
    const server = [{ id: 'b' }, { id: 'a' }];

    expect(isSyncedById(local, server)).toBe(true);
  });

  it('возвращает false, если длины разные', () => {
    const local = [{ id: 'a' }];
    const server = [{ id: 'a' }, { id: 'b' }];

    expect(isSyncedById(local, server)).toBe(false);
  });

  it('возвращает false, если id не совпадают', () => {
    const local = [{ id: 'a' }, { id: 'b' }];
    const server = [{ id: 'a' }, { id: 'c' }];

    expect(isSyncedById(local, server)).toBe(false);
  });

  it('возвращает true для двух пустых массивов', () => {
    expect(isSyncedById([], [])).toBe(true);
  });
});
