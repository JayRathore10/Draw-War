import React, { useEffect, useRef , useState} from "react";

const DrawBoard : React.FC = ()=>{

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing , setIsDrawing] = useState(false);

  useEffect(()=>{
    const canvas = canvasRef.current ;
    if(!canvas) return ;

    const ctx = canvas.getContext("2d");
    if(!ctx) return ;

    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "white";
  } , []);

  const startDrawing = (e : React.MouseEvent<HTMLCanvasElement>)=>{
    const ctx = canvasRef.current?.getContext("2d");
    if(!ctx) return ;

    ctx.beginPath();

    ctx.moveTo(e.nativeEvent.offsetX , e.nativeEvent.offsetY);
    setIsDrawing(true);
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) =>{
    if(!isDrawing) return ;
    const ctx = canvasRef.current?.getContext("2d");
    if(!ctx) return;

    ctx.lineTo(e.nativeEvent.offsetX , e.nativeEvent.offsetY);
    ctx.stroke();
  }

  const stopDrawing = ()=>{
    setIsDrawing(false);
  }

  return(
    <>
      <canvas 
        ref = {canvasRef}
        width={800}
        height={500}
        style ={{border : "2px solid black"}}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </>
  );
}

export default DrawBoard;