'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { createSocketConnection } from '@shared/api';
import { SocketContext, useAppSelector } from '@shared/lib';

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const socketRef = useRef<Socket | null>(null);
  const accessToken = useAppSelector((state) => state.session.accessToken);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!accessToken) {
      socketRef.current = null;
      return;
    }

    const existingSocket = socketRef.current;
    const socket =
      existingSocket ?? createSocketConnection('http://localhost:8000/pages', accessToken);

    socketRef.current = socket;

    socket.auth = {
      token: accessToken,
    };

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
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);

    socket.connect();
    setSocket(socket);

    return () => {
      socket.disconnect();

      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);

      setSocket(null);
    };
  }, [accessToken]);

  return <SocketContext.Provider value={{ socket: socket }}>{children}</SocketContext.Provider>;
};
