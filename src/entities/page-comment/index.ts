export {
  useGetPageCommentsQuery,
  useCreatePageCommentMutation,
  useUpdatePageCommentMutation,
  useSetPageCommentResolvedMutation,
  useDeletePageCommentMutation,
} from './api/pageCommentApi';

export type {
  PageComment,
  PageCommentAuthor,
  PageCommentThread,
  CreatePageCommentDto,
  PageCommentRealtimeEvent,
} from './model/page-comment.types';
export { MAX_COMMENT_BODY_LENGTH } from './model/page-comment.types';

export { usePageCommentsRealtime } from './model/hooks/usePageCommentsRealtime';
export { groupPageCommentThreads } from './lib/groupPageCommentThreads';

export { CommentCard } from './ui/comment-card/CommentCard';
