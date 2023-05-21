import {Manager} from 'socket.io-client';

const socketManager = new Manager(process.env.REACT_APP_BACKEND,
{
  autoConnect: false,
  transports: ['websocket', 'polling'],
  rejectUnauthorized: process.env.NODE_ENV === 'production'
});

export const mainSocket = socketManager.socket('/main');
