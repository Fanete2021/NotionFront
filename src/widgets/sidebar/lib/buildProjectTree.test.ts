import { describe, it, expect } from 'vitest';
import { buildProjectTree } from './buildProjectTree';
import { Project } from '@/entities/project';
import { Page } from '@/entities/page';

const makeProject = (project: Partial<Project> & Pick<Project, 'id' | 'name'>): Project => ({
  workspaceId: 'workspace-1',
  parentProjectId: null,
  color: null,
  icon: null,
  order: 0,
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-01T00:00:00.000Z',
  ...project,
});

const makePage = (page: Partial<Page> & Pick<Page, 'id' | 'title'>): Page => ({
  workspaceId: 'workspace-1',
  projectId: null,
  icon: null,
  type: 'DOC',
  authorId: 'author-1',
  position: 0,
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-01T00:00:00.000Z',
  ...page,
});

describe('buildProjectTree', () => {
  it('должна возвращать пустой массив, когда данных нет', () => {
    expect(buildProjectTree([], [])).toEqual([]);
  });

  it('должна оставлять на верхнем уровне только проекты без родителя', () => {
    const tree = buildProjectTree(
      [
        makeProject({ id: 'root', name: 'Продукт' }),
        makeProject({ id: 'child', name: 'Дизайн-система', parentProjectId: 'root' }),
      ],
      [],
    );

    expect(tree).toHaveLength(1);
    expect(tree[0].id).toBe('root');
    expect(tree[0].children?.[0].id).toBe('child');
  });

  it('должна класть документы внутрь своего проекта', () => {
    const tree = buildProjectTree(
      [makeProject({ id: 'root', name: 'Продукт' })],
      [makePage({ id: 'page-1', title: 'Компоненты', projectId: 'root' })],
    );

    expect(tree[0].children).toHaveLength(1);
    expect(tree[0].children?.[0]).toMatchObject({
      id: 'page-1',
      title: 'Компоненты',
      type: 'document',
      href: '/documents/page-1',
    });
  });

  it('должна сортировать проекты по order, а документы по position', () => {
    const tree = buildProjectTree(
      [
        makeProject({ id: 'second', name: 'Б', order: 2 }),
        makeProject({ id: 'first', name: 'А', order: 1 }),
        makeProject({ id: 'nested-2', name: 'Г', parentProjectId: 'first', order: 2 }),
        makeProject({ id: 'nested-1', name: 'В', parentProjectId: 'first', order: 1 }),
      ],
      [
        makePage({ id: 'page-2', title: 'Второй', projectId: 'first', position: 2 }),
        makePage({ id: 'page-1', title: 'Первый', projectId: 'first', position: 1 }),
      ],
    );

    expect(tree.map((item) => item.id)).toEqual(['first', 'second']);

    expect(tree[0].children?.map((item) => item.id)).toEqual([
      'nested-1',
      'nested-2',
      'page-1',
      'page-2',
    ]);
  });

  it('должна игнорировать документы, не привязанные к проекту', () => {
    const tree = buildProjectTree(
      [makeProject({ id: 'root', name: 'Продукт' })],
      [makePage({ id: 'orphan', title: 'Без проекта', projectId: null })],
    );

    expect(tree[0].children).toEqual([]);
  });

  it('должна пробрасывать иконку, цвет и тип документа', () => {
    const tree = buildProjectTree(
      [makeProject({ id: 'root', name: 'Продукт', color: '#6366F1', icon: 'folder' })],
      [
        makePage({
          id: 'page-1',
          title: 'Статья',
          projectId: 'root',
          type: 'ARTICLE',
          icon: 'page',
        }),
      ],
    );

    expect(tree[0]).toMatchObject({ color: '#6366F1', icon: 'folder', projectId: 'root' });

    expect(tree[0].children?.[0]).toMatchObject({ icon: 'page', documentType: 'ARTICLE' });
  });
});
