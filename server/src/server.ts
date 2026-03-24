import app from "./app";
import {createServer} from "http";
import {Server} from "socket.io";

import { connectDatabase } from "./database/drawwar.database";

const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

const io = new Server(httpServer , {
  cors : {
    origin : "*"
  }
});

// matchMatching varibale 
// to understand player is waiting or not
let waitingPlayer: any = null;

io.on("connection" , (socket)=>{
  console.log("User connected" , socket.id);

  if(waitingPlayer){
    const roomId = `${waitingPlayer.id}#${socket.id}`;

    socket.join(roomId);
    waitingPlayer.join(roomId);

    io.to(roomId).emit("match-found", {
      roomId , 
      players : [waitingPlayer.id ,socket.id]
    });

    waitingPlayer = null;
  }else {
    waitingPlayer = socket;
  }

  socket.on("draw" , ({roomId , data})=>{
    socket.to(roomId).emit("opponent-draw" , data);
  })

  socket.on("clear", (roomId)=>{
    socket.to(roomId).emit("oppnent-clear");
  });

  socket.on("disconnect" , ()=>{
    console.log("Disconnected:" , socket.id);

    if(waitingPlayer?.id === socket.id){
      waitingPlayer = null;
    }
  });
});

httpServer.listen(PORT, async() => {
  await connectDatabase();
  console.log(`Server running on http://localhost:${PORT}`);
});
