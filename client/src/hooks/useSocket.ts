import { useEffect, useRef, useState } from "react";
import { socket } from "../socket/socket";
import type { Stroke } from "../utils/types";

type UseSocketProps = {
  setOpponentStrokes: React.Dispatch<React.SetStateAction<Stroke[]>>;
};

export const useSocket = ({ setOpponentStrokes }: UseSocketProps) => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const currentOpponentStroke = useRef<Stroke | null>(null);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("waiting", (msg) => {
      console.log(msg.message);
    });

    socket.on("match-found", ({ roomId }) => {
      console.log("Match found:", roomId);
      setRoomId(roomId);
    });

    socket.on(
      "opponent-draw",
      (data: { type: "pencil" | "brush"; point: { x: number; y: number } }) => {
        setOpponentStrokes((prev) => {
          const updated = [...prev];

          if (!currentOpponentStroke.current) {
            const newStroke: Stroke = {
              type: data.type,
              points: [data.point],
            };
            currentOpponentStroke.current = newStroke;
            updated.push(newStroke);
          } else {
            currentOpponentStroke.current.points.push(data.point);
          }

          return [...updated];
        });
      }
    );

    socket.on("opponent-end", () => {
      currentOpponentStroke.current = null;
    });

    socket.on("opponent-clear", () => {
      setOpponentStrokes([]);
      currentOpponentStroke.current = null;
    });

    socket.on("opponent-left", () => {
      console.log("Opponent left");
    });

    return () => {
      socket.off("connect");
      socket.off("waiting");
      socket.off("match-found");
      socket.off("opponent-draw");
      socket.off("opponent-end");
      socket.off("opponent-clear");
      socket.off("opponent-left");
    };
  }, [setOpponentStrokes]);

  useEffect(() => {
    if (roomId) {
      socket.emit("join-room", roomId);
    }
  }, [roomId]);

  const emitDraw = (
    mode: "pencil" | "brush",
    point: { x: number; y: number }
  ) => {
    if (!roomId) return;

    socket.emit("draw", {
      roomId,
      data: {
        type: mode,
        point,
      },
    });
  };

  const emitDrawEnd = () => {
    if (!roomId) return;
    socket.emit("draw-end", { roomId });
  };

  const emitClear = () => {
    if (!roomId) return;
    socket.emit("clear", { roomId });
  };

  return {
    roomId,
    emitDraw,
    emitDrawEnd,
    emitClear,
  };
};