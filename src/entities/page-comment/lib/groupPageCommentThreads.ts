import type { PageComment, PageCommentThread } from '../model/page-comment.types';

/**
 * Собирает обсуждения: комментарии с одним anchorId — одна ветка,
 * комментарий к странице — отдельная ветка. Ветка решена, когда решены все её комментарии.
 */
export const groupPageCommentThreads = (comments: PageComment[]): PageCommentThread[] => {
  const sorted = [...comments].sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
  const threads: Omit<PageCommentThread, 'resolved'>[] = [];
  const byAnchor = new Map<string, Omit<PageCommentThread, 'resolved'>>();

  for (const comment of sorted) {
    if (!comment.anchorId) {
      threads.push({ id: comment.id, anchorId: null, comments: [comment] });
      continue;
    }

    const existing = byAnchor.get(comment.anchorId);
    if (existing) {
      existing.comments.push(comment);
      continue;
    }

    const thread = {
      id: `anchor:${comment.anchorId}`,
      anchorId: comment.anchorId,
      comments: [comment],
    };
    byAnchor.set(comment.anchorId, thread);
    threads.push(thread);
  }

  return threads.map((thread) => ({
    ...thread,
    resolved: thread.comments.every(({ resolved }) => resolved),
  }));
};
