import { Server, Socket } from "socket.io";

export const setupSockets = (io: Server) => {
  let waitingPlayer: Socket | null = null;

  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    socket.emit("connected", { socketId: socket.id });

    if (waitingPlayer) {
      const roomId = `${waitingPlayer.id}#${socket.id}`;

      socket.join(roomId);
      waitingPlayer.join(roomId);

      io.to(roomId).emit("match-found", {
        roomId,
        players: [waitingPlayer.id, socket.id],
      });

      waitingPlayer = null;
    } else {
      waitingPlayer = socket;
      socket.emit("waiting", { message: "Waiting for opponent..." });
    }

    socket.on("draw", ({ roomId, data }) => {
      socket.to(roomId).emit("opponent-draw", data);
    });

    socket.on("clear", (roomId: string) => {
      socket.to(roomId).emit("opponent-clear");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      if (waitingPlayer?.id === socket.id) {
        waitingPlayer = null;
      }

      socket.rooms.forEach((roomId) => {
        if (roomId !== socket.id) {
          socket.to(roomId).emit("opponent-left");
        }
      });
    });
  });
};