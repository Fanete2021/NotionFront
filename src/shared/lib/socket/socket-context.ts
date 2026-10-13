import { Socket } from 'socket.io-client';
import { createContext } from 'react';

export interface SocketContextState {
  socket: Socket | null;
}

export const SocketContext = createContext<SocketContextState | null>(null);
