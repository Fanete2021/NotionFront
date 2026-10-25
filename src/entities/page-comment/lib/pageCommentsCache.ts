import type { PageComment } from '../model/page-comment.types';

export const upsertPageComment = (comments: PageComment[], comment: PageComment): void => {
  const index = comments.findIndex(({ id }) => id === comment.id);

  if (index === -1) {
    comments.push(comment);
  } else if (Date.parse(comment.updatedAt) >= Date.parse(comments[index].updatedAt)) {
    comments[index] = comment;
  }
};

export const removePageComment = (comments: PageComment[], commentId: string): void => {
  const index = comments.findIndex(({ id }) => id === commentId);
  if (index !== -1) comments.splice(index, 1);
};
