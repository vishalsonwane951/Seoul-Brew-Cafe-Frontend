import { io } from "socket.io-client";

const socket = io('https://seoul-brew-cafe-backend-9d3v.onrender.com', {
  transports: ["websocket"],
  autoConnect: true,
});

export default socket;