import React, { useEffect, useRef, useState } from "react";
import type { Shape, Stroke } from
  "../utils/types";
import { Toolbar } from "./Toolbar";
import { useHistory } from "../hooks/useHistory";
import { useSocket } from "../hooks/useSocket";
import "../styles/DrawBoard.css";

const ERASER_SIZE = 30;

const DrawBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const opponentCanvasRef = useRef<HTMLCanvasElement | null>(null);
  // const opponentStrokes = useRef<Stroke[]>([]);

  const [opponentStrokes, setOpponentStrokes] = useState<Stroke[]>([]);

  const [mode, setMode] = useState<
    "rectangle" | "circle" | "pencil" | "brush" | "erase"
  >("rectangle");

  const [previousMode, setPreviousMode] = useState(mode);

  const [shapes, setShapes] = useState<Shape[]>([]);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [previewShape, setPreviewShape] = useState<Shape | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);

  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);

  const [showOpponent, setShowOpponent] = useState(true);

  const { emitDraw, emitDrawEnd } = useSocket({
    setOpponentStrokes,
  });

  const { saveHistory, undo, redo } = useHistory(
    shapes, strokes, setShapes, setStrokes
  );

  const getShapeAt = (x: number, y: number) => {
    for (let i = shapes.length - 1; i >= 0; i--) {
      const s = shapes[i];

      if (s.type === "rectangle") {
        if (x >= s.x && x <= s.x + s.width && y >= s.y && y <= s.y + s.height)
          return i;
      }

      if (s.type === "circle") {
        const dx = x - s.x;
        const dy = y - s.y;
        if (Math.sqrt(dx * dx + dy * dy) <= s.radius) return i;
      }
    }
    return null;
  };

  const eraseAt = (x: number, y: number) => {
    const half = ERASER_SIZE / 2;

    setShapes((prev) =>
      prev.filter((s) => {
        if (s.type === "rectangle") {
          return !(
            s.x < x + half &&
            s.x + s.width > x - half &&
            s.y < y + half &&
            s.y + s.height > y - half
          );
        }
        if (s.type === "circle") {
          const dx = s.x - x;
          const dy = s.y - y;
          return Math.sqrt(dx * dx + dy * dy) > s.radius + half;
        }
        return true;
      })
    );

    setStrokes((prev) =>
      prev.filter(
        (stroke) =>
          !stroke.points.some(
            (p) =>
              p.x > x - half &&
              p.x < x + half &&
              p.y > y - half &&
              p.y < y + half
          )
      )
    );
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";

    strokes.forEach((stroke) => {
      ctx.beginPath();
      ctx.lineWidth = stroke.type === "brush" ? 8 : 2;
      ctx.strokeStyle = "white";
      stroke.points.forEach((p, i) =>
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
      );
      ctx.stroke();
    });

    shapes.forEach((s, i) => {
      ctx.beginPath();
      ctx.lineWidth = i === selectedIndex ? 3 : 2;
      ctx.strokeStyle = i === selectedIndex ? "yellow" : "white";

      if (s.type === "rectangle") ctx.rect(s.x, s.y, s.width, s.height);
      if (s.type === "circle") ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);

      ctx.stroke();
    });

    if (previewShape) {
      ctx.beginPath();
      ctx.strokeStyle = "gray";

      if (previewShape.type === "rectangle")
        ctx.rect(previewShape.x, previewShape.y, previewShape.width, previewShape.height);

      if (previewShape.type === "circle")
        ctx.arc(previewShape.x, previewShape.y, previewShape.radius, 0, 2 * Math.PI);

      ctx.stroke();
    }
  }, [strokes, shapes, previewShape, selectedIndex]);

  useEffect(() => {
    const canvas = opponentCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";

    opponentStrokes.forEach((stroke) => {
      ctx.beginPath();
      ctx.lineWidth = stroke.type === "brush" ? 8 : 2;
      ctx.strokeStyle = "white";

      stroke.points.forEach((p, i) =>
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
      );

      ctx.stroke();
    });
  }, [opponentStrokes]);


  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    if (e.button === 2) {
      setPreviousMode(mode);
      setMode("erase");
      saveHistory();
      setIsDrawing(true);
      eraseAt(x, y);
      return;
    }

    const index = getShapeAt(x, y);

    if (index !== null && mode !== "erase") {
      const s = shapes[index];

      if (
        s.type === "rectangle" &&
        x >= s.x + s.width - 10 &&
        y >= s.y + s.height - 10
      ) {
        setSelectedIndex(index);
        setIsResizing(true);
        saveHistory();
        return;
      }

      setSelectedIndex(index);
      setIsMoving(true);
      setDragOffset({ x: x - s.x, y: y - s.y });
      saveHistory();
      return;
    }

    if (mode === "erase") {
      saveHistory();
      setIsDrawing(true);
      eraseAt(x, y);
      return;
    }

    if (mode === "pencil" || mode === "brush") {
      saveHistory();
      setIsDrawing(true);
      setStrokes((prev) => [...prev, { type: mode, points: [{ x, y }] }]);
      return;
    }

    setStartPos({ x, y });
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    if (!isDrawing && !isMoving && !isResizing) return;

    if (mode === "erase") {
      eraseAt(x, y);
      return;
    }

    if (isMoving && selectedIndex !== null && dragOffset) {
      setShapes((prev) =>
        prev.map((s, i) =>
          i === selectedIndex
            ? { ...s, x: x - dragOffset.x, y: y - dragOffset.y }
            : s
        )
      );
      return;
    }

    if (isResizing && selectedIndex !== null) {
      setShapes((prev) =>
        prev.map((s, i) =>
          i === selectedIndex && s.type === "rectangle"
            ? { ...s, width: x - s.x, height: y - s.y }
            : s
        )
      );
      return;
    }

    if (mode === "pencil" || mode === "brush") {
      setStrokes((prev) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        const point = { x, y };
        last.points.push(point);
        emitDraw(mode, point);
        return copy;
      });
      return;
    }

    if (!startPos) return;

    if (mode === "rectangle")
      setPreviewShape({
        type: "rectangle",
        x: startPos.x,
        y: startPos.y,
        width: x - startPos.x,
        height: y - startPos.y,
      });

    if (mode === "circle") {
      const radius = Math.sqrt((x - startPos.x) ** 2 + (y - startPos.y) ** 2);
      setPreviewShape({ type: "circle", x: startPos.x, y: startPos.y, radius });
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (previewShape) {
      saveHistory();
      setShapes((prev) => [...prev, previewShape]);
      setPreviewShape(null);
    }

    if (e.button === 2) setMode(previousMode);
    if (mode === "pencil" || mode === "brush") {
      emitDrawEnd();
    }

    setIsDrawing(false);
    setIsMoving(false);
    setIsResizing(false);
    setSelectedIndex(null);
    setStartPos(null);
    setDragOffset(null);
  };

  const getCanvasImage = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return null;
    return canvas.toDataURL("image/png");
  };

  const captureBothCanvases = () => {
    const myCanvas = canvasRef.current;
    const opponentCanvas = opponentCanvasRef.current;

    const myImage = getCanvasImage(myCanvas);
    const opponentImage = getCanvasImage(opponentCanvas);

    console.log(":", myImage);
    console.log("Opponent Image:", opponentImage);

    return { myImage, opponentImage };
  };

  const toggleOpponent = () => {
    setShowOpponent(prev => !prev);
  };

  return (
    <div className="draw-container">

      <Toolbar
        setMode={setMode}
        undo={undo}
        redo={redo}
        showOpponent={showOpponent}
        toggleOpponent={toggleOpponent}
      />

      <div className={showOpponent ? "boards double" : "boards single"}>
        <div className="board">
          <p className="board-title">You</p>
          <div className="canvas-wrapper">
            <canvas
              ref={canvasRef}
              width={620}
              height={500}
              onContextMenu={(e) => e.preventDefault()}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>
        </div>

        {showOpponent && (
          <div className="board">
            <p className="board-title">Opponent</p>
            <div className="canvas-wrapper">
              <canvas ref={opponentCanvasRef} width={620} height={500} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DrawBoard;