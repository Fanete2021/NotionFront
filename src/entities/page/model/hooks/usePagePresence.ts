import { useEffect, useState } from 'react';
import { PageJoinResponse, PageLeaveResponse, PagePresenceData, UserPageData } from '../page.types';
import { useSocket } from '@shared/lib';

type PresenceStatus = 'connecting' | 'joining' | 'ready' | 'disconnected' | 'error';

export const usePagePresence = (pageId: string) => {
  const { socket } = useSocket();
  const [users, setUsers] = useState<UserPageData[]>([]);
  const [status, setStatus] = useState<PresenceStatus>('connecting');

  useEffect(() => {
    let active = true;

    if (!socket || !pageId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus('disconnected');
      setUsers([]);
      return;
    }

    function handlePresence(data: PagePresenceData) {
      if (data.pageId !== pageId) {
        return;
      }
      setUsers(data.users);
      setStatus('ready');
    }

    function handleJoinPage() {
      if (!socket?.connected || !active) {
        return;
      }
      setStatus('joining');
      socket
        .timeout(5000)
        .emit(
          'page:join',
          { pageId: pageId },
          (error: Error | null, response: PageJoinResponse | null) => {
            if (!active) {
              return;
            }

            if (error) {
              setStatus('error');
              console.log('Не удалось получить подтверждение от сервера за 5 секунд');
              return;
            }

            if (!response?.ok) {
              console.error('Сервер не подтвердил вход в документ');
              setStatus('error');
              return;
            }

            setUsers(response.users);
            setStatus('ready');
          },
        );
    }

    function handleLeavePage() {
      socket?.emit('page:leave', { pageId: pageId }, (response: PageLeaveResponse) => {
        if (!response.ok) {
          return;
        }
      });
    }

    function handleDisconnect() {
      setStatus('disconnected');
      setUsers([]);
    }

    socket?.on('disconnect', handleDisconnect);
    socket?.on('page:presence', handlePresence);
    socket?.on('connect', handleJoinPage);

    if (socket?.connected) {
      handleJoinPage();
    }

    return () => {
      active = false;
      socket.off('page:presence', handlePresence);
      socket.off('connect', handleJoinPage);
      socket.off('disconnect', handleDisconnect);

      if (socket.connected) {
        handleLeavePage();
      }
    };
  }, [pageId, socket]);

  return {
    users: status === 'ready' ? users : null,
    count: status === 'ready' ? users.length : null,
    status,
  };
};
