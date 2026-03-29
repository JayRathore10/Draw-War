import { useState } from "react";
import type { Shape, Stroke } from "../utils/types";

const ERASER_SIZE = 30;

type Mode = "rectangle" | "circle" | "pencil" | "brush" | "erase";

interface UseCanvasProps {
  shapes: Shape[];
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
  strokes: Stroke[];
  setStrokes: React.Dispatch<React.SetStateAction<Stroke[]>>;
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  emitDraw: (type: "pencil" | "brush", point: { x: number; y: number }) => void;
  emitDrawEnd: () => void;
  saveHistory: () => void;
}

export const useCanvas = ({
  shapes,
  setShapes,
  setStrokes, 
  mode,
  setMode,
  emitDraw,
  emitDrawEnd,
  saveHistory,
} : UseCanvasProps ) => {
  const [previewShape, setPreviewShape] = useState<Shape | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [, setSelectedIndex] = useState<number | null>(null);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [, setDragOffset] = useState<{ x: number; y: number } | null>(null);

  const getShapeAt = (x: number, y: number) => {
    return shapes.findIndex((s) =>
      s.type === "rectangle"
        ? x >= s.x && x <= s.x + s.width && y >= s.y && y <= s.y + s.height
        : Math.hypot(x - s.x, y - s.y) <= s.radius
    );
  };

  const eraseAt = (x: number, y: number) => {
    const half = ERASER_SIZE / 2;

    setShapes((prev) =>
      prev.filter((s) =>
        s.type === "rectangle"
          ? !(s.x < x + half && s.x + s.width > x - half && s.y < y + half && s.y + s.height > y - half)
          : Math.hypot(s.x - x, s.y - y) > s.radius + half
      )
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

  const handleMouseDown = (x: number, y: number, button: number) => {
    if (button === 2) {
      setMode("erase");
      saveHistory();
      setIsDrawing(true);
      eraseAt(x, y);
      return;
    }

    const index = getShapeAt(x, y);

    if (index !== -1 && mode !== "erase") {
      setSelectedIndex(index);
      setDragOffset({ x: x - shapes[index].x, y: y - shapes[index].y });
      saveHistory();
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

  const handleMouseMove = (x: number, y: number) => {
    if (!isDrawing) return;

    if (mode === "erase") return eraseAt(x, y);

    if (mode === "pencil" || mode === "brush") {
      setStrokes((prev) => {
        const copy = [...prev];
        copy[copy.length - 1].points.push({ x, y });
        emitDraw(mode, { x, y });
        return copy;
      });
      return;
    }

    if (!startPos) return;

    setPreviewShape(
      mode === "rectangle"
        ? { type: "rectangle", x: startPos.x, y: startPos.y, width: x - startPos.x, height: y - startPos.y }
        : { type: "circle", x: startPos.x, y: startPos.y, radius: Math.hypot(x - startPos.x, y - startPos.y) }
    );
  };

  const handleMouseUp = () => {
    if (previewShape) {
      saveHistory();
      setShapes((prev) => [...prev, previewShape]);
      setPreviewShape(null);
    }

    if (mode === "pencil" || mode === "brush") {
      emitDrawEnd();
    }

    setIsDrawing(false);
    setSelectedIndex(null);
    setStartPos(null);
    setDragOffset(null);
  };

  return {
    previewShape,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };

}