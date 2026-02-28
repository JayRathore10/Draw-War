import React, { useEffect, useRef } from "react";

const Canvas: React.FC = ()=>{
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(()=>{
    const canvas = canvasRef.current;
    if(!canvas) return;

    const ctx = canvas.getContext("2d");
    if(!ctx) return;

    ctx.fillStyle = "blue";
    ctx.fillRect(50 , 50 , 200 , 100);

    ctx.beginPath();
    ctx.arc(300 , 150, 50 , 0 , Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
  } , []);

  return(
    <>
      <canvas 
        ref = {canvasRef}
        width={600}
        height={400}
        style={{border : "1px solid black"}}
      />
    </>
  );

}

export default Canvas;