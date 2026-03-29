import type {  HistoryState  , Shape , Stroke} from "../utils/types";
import React, { useState } from "react";
export const useHistory = (
  shapes : Shape[] , 
  strokes :  Stroke[], 
  setShapes : React.Dispatch<React.SetStateAction<Shape[]>> ,
  setStrokes : React.Dispatch<React.SetStateAction<Stroke[]>> 
) => {
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [redoStack, setRedoStack] = useState<HistoryState[]>([]);

  const saveHistory = () => {
    setHistory(prev => [...prev, { shapes, strokes }]);
    setRedoStack([]);
  };

    const undo = () => {
    if (!history.length) return;
    const last = history[history.length - 1];
    setRedoStack(r => [...r, { shapes, strokes }]);
    setShapes(last.shapes);
    setStrokes(last.strokes);
    setHistory(h => h.slice(0, -1));
  };

  const redo = () => {
    if (!redoStack.length) return;
    const last = redoStack[redoStack.length - 1];
    setHistory(h => [...h, { shapes, strokes }]);
    setShapes(last.shapes);
    setStrokes(last.strokes);
    setRedoStack(r => r.slice(0, -1));
  };

  return { saveHistory, undo, redo }; 

}