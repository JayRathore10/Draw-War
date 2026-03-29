type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setMode: (mode: any) => void;
  undo: () => void;
  redo: () => void;
  showOpponent: boolean;
  toggleOpponent: () => void;
};
export const Toolbar : React.FC<Props> = ({
  setMode  , 
  undo , 
  redo , 
  showOpponent  , 
  toggleOpponent 
}) =>{
  return (
        <div className="toolbar">
        <button className="tool-button" onClick={() => setMode("rectangle")}>Rectangle</button>
        <button className="tool-button" onClick={() => setMode("circle")}>Circle</button>
        <button className="tool-button" onClick={() => setMode("pencil")}>Pencil</button>
        <button className="tool-button" onClick={() => setMode("brush")}>Brush</button>
        <button className="tool-button" onClick={() => setMode("erase")}>Eraser</button>
        <button className="tool-button" onClick={undo}>Undo</button>
        <button className="tool-button" onClick={redo}>Redo</button>
        <button className="tool-button" onClick={toggleOpponent}>
          {showOpponent ? "Hide Opponent" : "Show Opponent"}
        </button>
      </div>
  )
}

// setShowOpponent(p => !p)