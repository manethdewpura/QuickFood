
import { io } from 'socket.io-client';

const socket = io("http://localhost:5002", {
  transports: ['websocket'],
  upgrade: false
});

export default socket;
