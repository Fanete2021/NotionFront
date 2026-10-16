'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { PageSessionContext, usePagePresence } from '@entities/page';
import { useGetMeQuery } from '@entities/user';
import { createSocketConnection, refreshAccessToken } from '@shared/api';
import { SocketContext, useAppSelector, useAppStore } from '@shared/lib';

const SOCKET_URL = process.env.NEXT_PUBLIC_BASE_SOCKET_URL ?? 'http://localhost:8000/pages';

interface SocketProviderProps {
  children: ReactNode;
  pageId: string;
}

const PageSessionProvider = ({ children, pageId }: SocketProviderProps) => {
  const presence = usePagePresence(pageId);

  return (
    <PageSessionContext.Provider value={{ pageId, ...presence }}>
      {children}
    </PageSessionContext.Provider>
  );
};

export const SocketProvider = ({ children, pageId }: SocketProviderProps) => {
  const store = useAppStore();
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const accessToken = useAppSelector((state) => state.session.accessToken);

  const { data: authData, isError: authError } = useGetMeQuery();
  const sessionReady = Boolean(authData) && !authError;

  useEffect(() => {
    if (!accessToken || !sessionReady) {
      return;
    }

    const existingSocket = socketRef.current;
    const socket = existingSocket ?? createSocketConnection(SOCKET_URL, accessToken);

    socketRef.current = socket;

    socket.auth = { token: accessToken };

    function handleConnect() {
      console.log('[socket] connected', {
        id: socket.id,
        connected: socket.connected,
      });
    }

    function handleDisconnect(reason: string) {
      console.log('[socket] disconnected:', reason);
    }

    async function handleConnectError(error: Error) {
      console.error('[socket] connect_error:', error.message);

      if (
        error.message?.toLowerCase().includes('unauthorized') ||
        error.message?.toLowerCase().includes('jwt') ||
        error.message?.toLowerCase().includes('token')
      ) {
        const newToken = await refreshAccessToken(store);

        if (newToken && socketRef.current) {
          socketRef.current.auth = { token: newToken };
          socketRef.current.connect();
        }
      }
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);

    if (!socket.connected) {
      socket.connect();
    }

    setSocket(socket);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);

      setSocket(null);
    };
  }, [accessToken, sessionReady, store]);

  return (
    <SocketContext.Provider value={{ socket }}>
      <PageSessionProvider pageId={pageId}>{children}</PageSessionProvider>
    </SocketContext.Provider>
  );
};
