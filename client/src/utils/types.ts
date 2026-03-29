export type Shape =
  | { type: "rectangle"; x: number; y: number; width: number; height: number }
  | { type: "circle"; x: number; y: number; radius: number };

export type Stroke = {
  type: "pencil" | "brush";
  points: { x: number; y: number }[];
};

export type HistoryState = {
  shapes: Shape[];
  strokes: Stroke[];
};