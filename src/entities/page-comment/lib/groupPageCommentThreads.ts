import type { PageComment, PageCommentThread } from '../model/page-comment.types';

const byDate = (a: string | null, b: string | null) => Date.parse(a ?? '') - Date.parse(b ?? '');

const getLastResolver = (comments: PageComment[]) =>
  comments
    .filter((comment) => comment.resolvedAt)
    .sort((a, b) => byDate(b.resolvedAt, a.resolvedAt))[0]?.resolvedBy ?? null;

export const groupPageCommentThreads = (comments: PageComment[]): PageCommentThread[] => {
  const groups = new Map<string, PageComment[]>();

  for (const comment of [...comments].sort((a, b) => byDate(a.createdAt, b.createdAt))) {
    const key = comment.anchorId ? `anchor:${comment.anchorId}` : comment.id;
    groups.set(key, [...(groups.get(key) ?? []), comment]);
  }

  return [...groups.entries()].map(([id, threadComments]) => {
    const resolved = threadComments.every((comment) => comment.resolved);

    return {
      id,
      anchorId: threadComments[0].anchorId,
      comments: threadComments,
      resolved,
      resolvedBy: resolved ? getLastResolver(threadComments) : null,
    };
  });
};
