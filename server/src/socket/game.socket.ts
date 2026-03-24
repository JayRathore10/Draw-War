import { Server, Socket } from "socket.io";

export const setupSockets = (io: Server) => {
  // matchMatching varibale 
  // to understand player is waiting or not
  let waitingPlayer: Socket | null = null;

  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

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
    }

    socket.on("draw", ({ roomId, data }) => {
      socket.to(roomId).emit("opponent-draw", data);
    });

    socket.on("disconnect", () => {
      if (waitingPlayer?.id === socket.id) {
        waitingPlayer = null;
      }
    });
  });
};