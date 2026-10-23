import { useEffect, useState } from 'react';
import { PagePresenceData, UserPageData } from '../page.types';
import { useSocket } from '@shared/lib';

type PresenceStatus = 'connecting' | 'ready' | 'disconnected';

export const usePagePresence = (pageId: string) => {
  const { socket } = useSocket();
  const [users, setUsers] = useState<UserPageData[]>([]);
  const [status, setStatus] = useState<PresenceStatus>('connecting');

  useEffect(() => {
    if (!socket || !pageId) {
      // eslint-disable-next-line
      setStatus('disconnected');
      setUsers([]);
      return;
    }

    function handlePresence(data: PagePresenceData) {
      if (data.pageId !== pageId) return;
      setUsers(data.users);
      setStatus('ready');
    }

    function handleDisconnect() {
      setStatus('disconnected');
      setUsers([]);
    }

    socket.on('page:presence', handlePresence);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('page:presence', handlePresence);
      socket.off('disconnect', handleDisconnect);
    };
  }, [pageId, socket]);

  return {
    users: status === 'ready' ? users : null,
    count: status === 'ready' ? users.length : null,
    status,
  };
};
