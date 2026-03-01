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

const DrawBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [mode, setMode] = useState<
    "rectangle" | "circle" | "pencil" | "brush" | "erase"
  >("rectangle");

  const [shapes, setShapes] = useState<Shape[]>([]);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [previewShape, setPreviewShape] = useState<Shape | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null
  );

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(
    null
  );

  const [history, setHistory] = useState<HistoryState[]>([]);
  const [redoStack, setRedoStack] = useState<HistoryState[]>([]);

  const saveHistory = useCallback(() => {
    setHistory((prev) => [...prev, { shapes, strokes }]);
    setRedoStack([]);
  }, [shapes, strokes]);

  const undo = () => {
    if (history.length === 0) return;
    const copy = [...history];
    const last = copy.pop()!;
    setRedoStack((r) => [...r, { shapes, strokes }]);
    setShapes(last.shapes);
    setStrokes(last.strokes);
    setHistory(copy);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
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

    const drawShape = (s: Shape) => {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "white";

      if (s.type === "rectangle") ctx.rect(s.x, s.y, s.width, s.height);
      if (s.type === "circle")
        ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);

      ctx.stroke();
    };

    shapes.forEach(drawShape);
    if (previewShape) drawShape(previewShape);
  }, [shapes, strokes, previewShape]);

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
        const dist = Math.sqrt((x - s.x) ** 2 + (y - s.y) ** 2);
        if (dist <= s.radius) return i;
      }
    }
    return null;
  };

  const getStrokeAtPosition = (x: number, y: number) => {
    for (let i = strokes.length - 1; i >= 0; i--) {
      for (const p of strokes[i].points) {
        const dist = Math.sqrt((x - p.x) ** 2 + (y - p.y) ** 2);
        if (dist < 8) return i;
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    const shapeIndex = getShapeAtPosition(x, y);

    if (mode === "erase") {
      const strokeIndex = getStrokeAtPosition(x, y);
      if (shapeIndex !== null) {
        saveHistory();
        setShapes((prev) => prev.filter((_, i) => i !== shapeIndex));
      } else if (strokeIndex !== null) {
        saveHistory();
        setStrokes((prev) => prev.filter((_, i) => i !== strokeIndex));
      }
      return;
    }

    if (shapeIndex !== null) {
      const s = shapes[shapeIndex];
      setSelectedIndex(shapeIndex);

      if (
        s.type === "rectangle" &&
        x >= s.x + s.width - 10 &&
        y >= s.y + s.height - 10
      ) {
        setIsResizing(true);
        return;
      }

      saveHistory();
      setIsMoving(true);
      setDragOffset({ x: x - s.x, y: y - s.y });
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
        prev.map((s, i) => {
          if (i !== selectedIndex) return s;
          if (s.type === "rectangle")
            return { ...s, width: x - s.x, height: y - s.y };
          if (s.type === "circle") {
            const radius = Math.sqrt((x - s.x) ** 2 + (y - s.y) ** 2);
            return { ...s, radius };
          }
          return s;
        })
      );
      return;
    }

    if (mode === "pencil" || mode === "brush") {
      if (!isDrawing) return;
      setStrokes((prev) => {
        const copy = [...prev];
        copy[copy.length - 1].points.push({ x, y });
        return copy;
      });
      return;
    }

    if (!isDrawing || !startPos) return;

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
        (x - startPos.x) ** 2 + (y - startPos.y) ** 2
      );
      setPreviewShape({
        type: "circle",
        x: startPos.x,
        y: startPos.y,
        radius,
      });
    }
  };

  const handleMouseUp = () => {
    if (previewShape) {
      saveHistory();
      setShapes((prev) => [...prev, previewShape]);
      setPreviewShape(null);
    }

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
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </>
  );
};

export default DrawBoard;