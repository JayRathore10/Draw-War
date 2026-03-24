import app from "./app";
import {createServer} from "http";
import {Server} from "socket.io";
import { setupSockets } from "./socket/game.socket";
import { connectDatabase } from "./database/drawwar.database";

const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

const io = new Server(httpServer , {
  cors : {
    origin : "*"
  }
});

setupSockets(io);

httpServer.listen(PORT, async() => {
  await connectDatabase();
  console.log(`Server running on http://localhost:${PORT}`);
});
