import React, { useCallback, useEffect, useRef, useState } from "react";

type Shape =
  | { type: "rectangle"; x: number; y: number; width: number; height: number }
  | { type: "circle"; x: number; y: number; radius: number };

type Stroke = {
  type: "pencil" | "brush";
  points: { x: number; y: number }[];
};

type HistoryState = {
  shapes: Shape[];
  strokes: Stroke[];
};

const ERASER_SIZE = 30;

const DrawBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(
    null
  );

  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null
  );

  const [history, setHistory] = useState<HistoryState[]>([]);
  const [redoStack, setRedoStack] = useState<HistoryState[]>([]);

  const saveHistory = useCallback(() => {
    setHistory((prev) => [...prev, { shapes, strokes }]);
    setRedoStack([]);
  }, [shapes, strokes]);

  const undo = () => {
    if (!history.length) return;
    const copy = [...history];
    const last = copy.pop()!;
    setRedoStack((r) => [...r, { shapes, strokes }]);
    setShapes(last.shapes);
    setStrokes(last.strokes);
    setHistory(copy);
  };

  const redo = () => {
    if (!redoStack.length) return;
    const copy = [...redoStack];
    const last = copy.pop()!;
    setHistory((h) => [...h, { shapes, strokes }]);
    setShapes(last.shapes);
    setStrokes(last.strokes);
    setRedoStack(copy);
  };

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

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

    const drawShape = (s: Shape, selected: boolean) => {
      ctx.beginPath();
      ctx.lineWidth = selected ? 3 : 2;
      ctx.strokeStyle = selected ? "yellow" : "white";

      if (s.type === "rectangle")
        ctx.rect(s.x, s.y, s.width, s.height);

      if (s.type === "circle")
        ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);

      ctx.stroke();

      if (selected && s.type === "rectangle") {
        ctx.fillStyle = "yellow";
        ctx.fillRect(
          s.x + s.width - 8,
          s.y + s.height - 8,
          8,
          8
        );
      }
    };

    shapes.forEach((s, i) =>
      drawShape(s, i === selectedIndex)
    );

    if (previewShape) drawShape(previewShape, false);
  }, [shapes, strokes, previewShape, selectedIndex]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  const getShapeAtPosition = (x: number, y: number) => {
    for (let i = shapes.length - 1; i >= 0; i--) {
      const s = shapes[i];

      if (s.type === "rectangle") {
        if (
          x >= s.x &&
          x <= s.x + s.width &&
          y >= s.y &&
          y <= s.y + s.height
        )
          return i;
      }

      if (s.type === "circle") {
        const dx = x - s.x;
        const dy = y - s.y;
        if (Math.sqrt(dx * dx + dy * dy) <= s.radius)
          return i;
      }
    }
    return null;
  };

  const eraseAtPosition = (x: number, y: number) => {
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
      prev.filter((stroke) =>
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

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    if (e.button === 2) {
      setPreviousMode(mode);
      setMode("erase");
      saveHistory();
      setIsDrawing(true);
      eraseAtPosition(x, y);
      return;
    }

    const shapeIndex = getShapeAtPosition(x, y);

    if (shapeIndex !== null && mode !== "erase") {
      const s = shapes[shapeIndex];

      if (
        s.type === "rectangle" &&
        x >= s.x + s.width - 10 &&
        y >= s.y + s.height - 10
      ) {
        setSelectedIndex(shapeIndex);
        setIsResizing(true);
        saveHistory();
        return;
      }

      setSelectedIndex(shapeIndex);
      setIsMoving(true);
      setDragOffset({ x: x - s.x, y: y - s.y });
      saveHistory();
      return;
    }

    if (mode === "erase") {
      saveHistory();
      setIsDrawing(true);
      eraseAtPosition(x, y);
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
      eraseAtPosition(x, y);
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
        copy[copy.length - 1].points.push({ x, y });
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
      const radius = Math.sqrt(
        (x - startPos.x) ** 2 +
        (y - startPos.y) ** 2
      );
      setPreviewShape({
        type: "circle",
        x: startPos.x,
        y: startPos.y,
        radius,
      });
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (previewShape) {
      saveHistory();
      setShapes((prev) => [...prev, previewShape]);
      setPreviewShape(null);
    }

    if (e.button === 2) setMode(previousMode);

    setIsDrawing(false);
    setIsMoving(false);
    setIsResizing(false);
    setSelectedIndex(null);
    setStartPos(null);
    setDragOffset(null);
  };

  return (
    <>
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setMode("rectangle")}>Rectangle</button>
        <button onClick={() => setMode("circle")}>Circle</button>
        <button onClick={() => setMode("pencil")}>Pencil</button>
        <button onClick={() => setMode("brush")}>Brush</button>
        <button onClick={() => setMode("erase")}>Eraser</button>
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
      </div>

      <canvas
        ref={canvasRef}
        width={900}
        height={550}
        style={{ border: "2px solid black", background: "#111" }}
        onContextMenu={(e) => e.preventDefault()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </>
  );
};

export default DrawBoard;