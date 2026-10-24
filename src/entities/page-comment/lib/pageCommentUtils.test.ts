import { describe, expect, it } from 'vitest';
import type { PageComment } from '../model/page-comment.types';
import { groupPageCommentThreads } from './groupPageCommentThreads';
import { applyPageCommentEvent, upsertPageComment } from './pageCommentsCache';

const author = { id: 'u1', name: 'Анна', email: 'anna@example.com', avatarUrl: null };

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
  authorInfo: author,
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
    expect(threads[0].anchorId).toBe('a');
    expect(threads[1].anchorId).toBeNull();
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

describe('applyPageCommentEvent', () => {
  it('обновляет комментарий по событию updated', () => {
    const list = [makeComment({})];
    applyPageCommentEvent(list, {
      pageId: 'p1',
      action: 'updated',
      commentId: 'c1',
      actorId: 'u2',
      comment: makeComment({ resolved: true, updatedAt: '2026-10-01T12:00:00.000Z' }),
    });

    expect(list[0].resolved).toBe(true);
  });

  it('удаляет комментарий по событию deleted', () => {
    const list = [makeComment({ id: 'c1' }), makeComment({ id: 'c2' })];
    applyPageCommentEvent(list, {
      pageId: 'p1',
      action: 'deleted',
      commentId: 'c1',
      actorId: 'u1',
    });

    expect(list.map(({ id }) => id)).toEqual(['c2']);
  });
});
