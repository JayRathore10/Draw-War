import React, { useEffect, useRef, useState } from "react";

type shape = 
  |{
  type : "rectangle";
  x : number ;
  y : number ;
  width : number ;
  height : number ;
  }
  |{
    type : "circle" ;
    x : number ;
    y : number ;
    redius : number ;
  };

const DrawBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const snapshotRef = useRef<ImageData | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState<"pencil" | "rectangle" | "circle">("pencil");
  const [startPos, setStartPos] = useState<{ x: number, y: number } | null>(null);
  const [shapes , setShapes] = useState<Shape[]>([]);
  const [selectedIndex , setSelectedIndex] = useState<number | null>(null);
  const [isMoving , setIsMoving] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "white";
  }, []);

  const redrawCanvas = ()=>{
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if(!canvas || !ctx) return ;

    ctx.clearRect(0 , 0 ,canvas.width , canvas.height);

    shapes.forEach((shape)=>{
      ctx.beginPath();

      if(shape.type === "rectangle"){
        ctx.rect(shape.x , shape.y , shape.width, shape.height);
      }

      if(shape.type === "circle"){
        ctx.arc(shape.x , shape.y , shape.radius , 0 , 2 * Math.PI);
      }

      ctx.stroke();
    });
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    setStartPos({ x, y });
    setIsDrawing(true);

    if (mode === "pencil") {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    if (mode === "pencil") {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      if (snapshotRef.current) {
        ctx.putImageData(snapshotRef.current, 0, 0);
      }
      ctx.beginPath();

      if (mode == "rectangle") {
        ctx.rect(
          startPos.x,
          startPos.y,
          x - startPos.x,
          y - startPos.y
        );
      }
      if (mode === "circle") {
        const radius = Math.sqrt(
          Math.pow(x - startPos.x, 2) +
          Math.pow(y - startPos.y, 2)
        );

        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      }

      ctx.stroke();
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false);
    setStartPos(null);
  };

  return (
    <>

      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={() => setMode("pencil")}
        >pencil</button>
        <button
          onClick={() => setMode("rectangle")}
        >Rectangle</button>
        <button
          onClick={() => setMode("circle")}
        >Circle</button>
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        style={{ border: "2px solid black" }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </>
  );
}

export default DrawBoard;