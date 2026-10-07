import { io } from 'socket.io-client';

export const createSocketConnection = (url: string, accessToken: string) => {
  return io(url, {
    autoConnect: false,
    transports: ['websocket'],
    withCredentials: true,
    auth: {
      token: accessToken,
    },
  });
};
