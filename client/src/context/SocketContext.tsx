import React from 'react';
import { Socket } from 'socket.io-client';

type SocketContextType = {
  socket: Socket | null;
  setSocket: ch<React.SetStateAction<Socket | null>>;
};

export const SocketContext = React.createContext<SocketContextType>({
  socket: null,
  setSocket: () => {},
});
