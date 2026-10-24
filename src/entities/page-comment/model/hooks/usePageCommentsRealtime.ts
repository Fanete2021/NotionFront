import { useEffect } from 'react';
import { pageCommentApi, updateCachedComments } from '../../api/pageCommentApi';
import { applyPageCommentEvent } from '../../lib/pageCommentsCache';
import type { PageCommentRealtimeEvent } from '../page-comment.types';
import { useAppDispatch, useSocket } from '@shared/lib';

/** Держит список комментариев страницы в актуальном виде по событиям сокета. */
export const usePageCommentsRealtime = (pageId: string) => {
  const { socket } = useSocket();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket || !pageId) return;

    function handleComment(event: PageCommentRealtimeEvent) {
      if (event.pageId !== pageId) return;
      dispatch(updateCachedComments(pageId, (draft) => applyPageCommentEvent(draft, event)));
    }

    // Пока соединения не было, события могли потеряться — перечитываем список.
    function handleReconnect() {
      dispatch(pageCommentApi.util.invalidateTags([{ type: 'PageComment', id: pageId }]));
    }

    socket.on('page:comment', handleComment);
    socket.io.on('reconnect', handleReconnect);

    return () => {
      socket.off('page:comment', handleComment);
      socket.io.off('reconnect', handleReconnect);
    };
  }, [dispatch, pageId, socket]);
};
