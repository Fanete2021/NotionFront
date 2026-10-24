import type { PageComment, PageCommentRealtimeEvent } from '../model/page-comment.types';

/** Кладёт комментарий в список. Более старая версия не перетирает новую. */
export const upsertPageComment = (comments: PageComment[], comment: PageComment): void => {
  const index = comments.findIndex(({ id }) => id === comment.id);

  if (index === -1) {
    comments.push(comment);
    return;
  }

  const current = comments[index];
  if (Date.parse(comment.updatedAt) >= Date.parse(current.updatedAt)) {
    comments[index] = comment;
  }
};

export const removePageComment = (comments: PageComment[], commentId: string): void => {
  const index = comments.findIndex(({ id }) => id === commentId);
  if (index !== -1) comments.splice(index, 1);
};

export const applyPageCommentEvent = (
  comments: PageComment[],
  event: PageCommentRealtimeEvent,
): void => {
  if (event.action === 'deleted') {
    removePageComment(comments, event.commentId);
    return;
  }

  if (event.comment) upsertPageComment(comments, event.comment);
};
