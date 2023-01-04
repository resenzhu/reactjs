import {Manager} from 'socket.io-client';

const socketManager = new Manager(process.env.REACT_APP_SERVER_SOCKET,
{
  autoConnect: false,
  transports: ['websocket', 'polling'],
  rejectUnauthorized: process.env.NODE_ENV === 'production'
});

export const mainSocket = socketManager.socket('/main');

export const theLoungeSocket = socketManager.socket('/the-lounge');
