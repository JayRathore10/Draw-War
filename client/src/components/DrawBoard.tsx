import React, { useCallback, useEffect, useRef, useState } from "react";

type Shape =
  | {
      type: "rectangle";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      x: number;
      y: number;
      radius: number;
    };

type Stroke = {
  type: "pencil" | "brush";
  points: { x: number; y: number }[];
};

const DrawBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [mode, setMode] = useState<
    "rectangle" | "circle" | "pencil" | "brush"
  >("rectangle");

  const [shapes, setShapes] = useState<Shape[]>([]);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [previewShape, setPreviewShape] = useState<Shape | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null
  );

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(
    null
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineCap = "round";
  }, []);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    strokes.forEach((stroke) => {
      ctx.beginPath();
      ctx.lineWidth = stroke.type === "brush" ? 8 : 2;
      ctx.strokeStyle = "white";

      stroke.points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });

      ctx.stroke();
    });

    const drawShape = (shape: Shape) => {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "white";

      if (shape.type === "rectangle") {
        ctx.rect(shape.x, shape.y, shape.width, shape.height);
      }

      if (shape.type === "circle") {
        ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
      }

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

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    if (mode === "pencil" || mode === "brush") {
      setIsDrawing(true);
      setStrokes((prev) => [
        ...prev,
        { type: mode, points: [{ x, y }] },
      ]);
      return;
    }

    const index = getShapeAtPosition(x, y);

    if (index !== null) {
      const shape = shapes[index];
      setSelectedIndex(index);
      setIsMoving(true);
      setDragOffset({ x: x - shape.x, y: y - shape.y });
      return;
    }

    setStartPos({ x, y });
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    if (mode === "pencil" || mode === "brush") {
      if (!isDrawing) return;

      setStrokes((prev) => {
        const copy = [...prev];
        copy[copy.length - 1].points.push({ x, y });
        return copy;
      });
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

    if (!isDrawing || !startPos) return;

    if (mode === "rectangle") {
      setPreviewShape({
        type: "rectangle",
        x: startPos.x,
        y: startPos.y,
        width: x - startPos.x,
        height: y - startPos.y,
      });
    }

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
      setShapes((prev) => [...prev, previewShape]);
      setPreviewShape(null);
    }

    setIsDrawing(false);
    setIsMoving(false);
    setSelectedIndex(null);
    setStartPos(null);
    setDragOffset(null);
  };

  return (
    <>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setMode("rectangle")}>Rectangle</button>
        <button onClick={() => setMode("circle")}>Circle</button>
        <button onClick={() => setMode("pencil")}>Pencil</button>
        <button onClick={() => setMode("brush")}>Brush</button>
      </div>
    
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
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