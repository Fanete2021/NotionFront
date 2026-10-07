import { useContext } from 'react';
import { SocketContext } from '../socket/socket-context';

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error('useSocket must be used with SocketProvider');
  }

  return context;
};
