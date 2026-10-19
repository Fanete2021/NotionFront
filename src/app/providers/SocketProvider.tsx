'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { useGetMeQuery } from '@entities/user';
import { createSocketConnection, refreshAccessToken } from '@shared/api';
import { SocketContext, useAppSelector, useAppStore } from '@shared/lib';

const SOCKET_URL = process.env.NEXT_PUBLIC_BASE_SOCKET_URL ?? 'http://localhost:8000/pages';

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const store = useAppStore();
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const accessToken = useAppSelector((state) => state.session.accessToken);

  const { data: authData, isError: authError } = useGetMeQuery();
  const sessionReady = Boolean(authData) && !authError;

  useEffect(() => {
    if (!accessToken || !sessionReady) return;

    const existingSocket = socketRef.current;
    const newSocket = existingSocket ?? createSocketConnection(SOCKET_URL, accessToken);

    socketRef.current = newSocket;
    newSocket.auth = { token: accessToken };

    async function handleConnectError(error: Error) {
      if (
        error.message?.toLowerCase().includes('unauthorized') ||
        error.message?.toLowerCase().includes('jwt')
      ) {
        const newToken = await refreshAccessToken(store);
        if (newToken && socketRef.current) {
          socketRef.current.auth = { token: newToken };
          socketRef.current.connect();
        }
      }
    }

    newSocket.on('connect_error', handleConnectError);
    if (!newSocket.connected) newSocket.connect();
    setSocket(newSocket);

    return () => {
      newSocket.off('connect_error', handleConnectError);
      newSocket.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [accessToken, sessionReady, store]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};
