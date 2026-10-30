import { useEffect } from 'react';
import { pageCommentApi, updateCachedComments } from '../../api/pageCommentApi';
import { removePageComment, upsertPageComment } from '../../lib/pageCommentsCache';
import type { PageCommentRealtimeEvent } from '../page-comment.types';
import { useAppDispatch, useSocket } from '@shared/lib';

export const usePageCommentsRealtime = (pageId: string) => {
  const { socket } = useSocket();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket || !pageId) return;

    const refetch = () =>
      dispatch(pageCommentApi.util.invalidateTags([{ type: 'PageComment', id: pageId }]));

    function handleComment({
      pageId: eventPageId,
      action,
      commentId,
      comment,
    }: PageCommentRealtimeEvent) {
      if (eventPageId !== pageId) return;

      if (action === 'deleted') {
        dispatch(updateCachedComments(pageId, (draft) => removePageComment(draft, commentId)));
      } else if (comment) {
        dispatch(updateCachedComments(pageId, (draft) => upsertPageComment(draft, comment)));
      } else {
        refetch();
      }
    }

    socket.on('page:comment', handleComment);
    socket.io.on('reconnect', refetch);

    return () => {
      socket.off('page:comment', handleComment);
      socket.io.off('reconnect', refetch);
    };
  }, [dispatch, pageId, socket]);
};
