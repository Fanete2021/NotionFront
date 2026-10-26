import { describe, it, expect } from 'vitest';
import { buildProjectTree } from './buildProjectTree';
import { Project } from '@/entities/project';
import { Page } from '@/shared/const/pageType';

const makeProject = (project: Partial<Project> & Pick<Project, 'id' | 'name'>): Project => ({
  workspaceId: 'workspace-1',
  parentProjectId: null,
  color: null,
  icon: null,
  position: 0,
  childProjects: [],
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
  updatedById: null,
  position: 0,
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-01T00:00:00.000Z',
  ...page,
  parentPageId: page.parentPageId ?? null,
});

describe('buildProjectTree', () => {
  it('должна возвращать пустой массив, когда данных нет', () => {
    expect(buildProjectTree([], [])).toEqual([]);
  });

  it('должна строить дерево из childProjects (бэк отдаёт дерево)', () => {
    const tree = buildProjectTree(
      [
        makeProject({
          id: 'root',
          name: 'Продукт',
          childProjects: [
            makeProject({ id: 'child', name: 'Дизайн-система', parentProjectId: 'root' }),
          ],
        }),
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

  it('должна сортировать проекты по position, а документы по position', () => {
    const tree = buildProjectTree(
      [
        makeProject({
          id: 'first',
          name: 'А',
          position: 1,
          childProjects: [
            makeProject({ id: 'nested-2', name: 'Г', parentProjectId: 'first', position: 2 }),
            makeProject({ id: 'nested-1', name: 'В', parentProjectId: 'first', position: 1 }),
          ],
        }),
        makeProject({ id: 'second', name: 'Б', position: 2 }),
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
