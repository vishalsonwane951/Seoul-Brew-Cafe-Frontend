import { io } from "socket.io-client";

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

 export const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  autoConnect: true,
});

export { io };