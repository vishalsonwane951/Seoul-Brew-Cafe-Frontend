import { io } from "socket.io-client";

// Use relative URL - Vite proxy will forward to backend
// In production, set VITE_API_URL to your production backend
const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || "";
console.log('socket url',import.meta.env.VITE_API_URL)
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: true,
});

export default socket;
