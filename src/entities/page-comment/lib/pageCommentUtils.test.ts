import { describe, expect, it } from 'vitest';
import type { PageComment } from '../model/page-comment.types';
import { groupPageCommentThreads } from './groupPageCommentThreads';
import { removePageComment, upsertPageComment } from './pageCommentsCache';

const anna = { id: 'u1', name: 'Анна', email: 'anna@example.com', avatarUrl: null };
const boris = { id: 'u2', name: 'Борис', email: 'boris@example.com', avatarUrl: null };

const makeComment = (overrides: Partial<PageComment>): PageComment => ({
  id: 'c1',
  pageId: 'p1',
  body: 'Текст',
  anchorId: null,
  resolved: false,
  resolvedAt: null,
  resolvedBy: null,
  createdAt: '2026-10-01T10:00:00.000Z',
  updatedAt: '2026-10-01T10:00:00.000Z',
  authorInfo: anna,
  ...overrides,
});

describe('groupPageCommentThreads', () => {
  it('объединяет комментарии одного якоря и сортирует по дате создания', () => {
    const threads = groupPageCommentThreads([
      makeComment({ id: 'reply', anchorId: 'a', createdAt: '2026-10-01T12:00:00.000Z' }),
      makeComment({ id: 'page', createdAt: '2026-10-01T11:00:00.000Z' }),
      makeComment({ id: 'root', anchorId: 'a', createdAt: '2026-10-01T10:00:00.000Z' }),
    ]);

    expect(threads.map((thread) => thread.comments.map(({ id }) => id))).toEqual([
      ['root', 'reply'],
      ['page'],
    ]);
    expect(threads.map(({ anchorId }) => anchorId)).toEqual(['a', null]);
  });

  it('считает ветку решённой, только когда решены все комментарии', () => {
    const [partly, fully] = groupPageCommentThreads([
      makeComment({ id: '1', anchorId: 'a', resolved: true }),
      makeComment({ id: '2', anchorId: 'a', resolved: false }),
      makeComment({ id: '3', anchorId: 'b', resolved: true }),
    ]);

    expect(partly.resolved).toBe(false);
    expect(fully.resolved).toBe(true);
  });

  it('берёт того, кто закрыл ветку последним', () => {
    const [thread] = groupPageCommentThreads([
      makeComment({
        id: '1',
        anchorId: 'a',
        resolved: true,
        resolvedAt: '2026-10-02T10:00:00.000Z',
        resolvedBy: anna,
      }),
      makeComment({
        id: '2',
        anchorId: 'a',
        resolved: true,
        resolvedAt: '2026-10-03T10:00:00.000Z',
        resolvedBy: boris,
      }),
    ]);

    expect(thread.resolvedBy).toEqual(boris);
  });

  it('не показывает автора закрытия у открытой ветки', () => {
    const [thread] = groupPageCommentThreads([
      makeComment({ id: '1', anchorId: 'a', resolved: true, resolvedBy: anna }),
      makeComment({ id: '2', anchorId: 'a' }),
    ]);

    expect(thread.resolvedBy).toBeNull();
  });

  it('держит комментарии к странице отдельными ветками', () => {
    const threads = groupPageCommentThreads([makeComment({ id: '1' }), makeComment({ id: '2' })]);

    expect(threads.map(({ id }) => id)).toEqual(['1', '2']);
  });
});

describe('upsertPageComment', () => {
  it('добавляет новый комментарий', () => {
    const list: PageComment[] = [];
    upsertPageComment(list, makeComment({ id: 'new' }));

    expect(list.map(({ id }) => id)).toEqual(['new']);
  });

  it('не перетирает свежую версию устаревшей', () => {
    const list = [makeComment({ body: 'новое', updatedAt: '2026-10-01T12:00:00.000Z' })];
    upsertPageComment(list, makeComment({ body: 'старое', updatedAt: '2026-10-01T11:00:00.000Z' }));

    expect(list[0].body).toBe('новое');
  });
});

describe('removePageComment', () => {
  it('удаляет комментарий по id', () => {
    const list = [makeComment({ id: 'c1' }), makeComment({ id: 'c2' })];
    removePageComment(list, 'c1');

    expect(list.map(({ id }) => id)).toEqual(['c2']);
  });
});
