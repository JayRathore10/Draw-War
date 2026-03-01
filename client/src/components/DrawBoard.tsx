import React, { useEffect, useRef , useState} from "react";

const DrawBoard : React.FC = ()=>{
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing , setIsDrawing] = useState(false);
  const [mode , setMode] = useState<"pencil" | "rectangle" | "circle">("pencil");
  const [startPos , setStartPos] = useState<{x : number , y : number} | null> (null); 

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

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    if(mode === "pencil"){
      ctx.beginPath();
      ctx.moveTo(x , y);
    }
    setStartPos({x , y});
    setIsDrawing(true);
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) =>{
    if(!isDrawing || !startPos) return ;
    const ctx = canvasRef.current?.getContext("2d");
    if(!ctx) return;

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    if(mode === "pencil"){
      ctx.lineTo(x , y);
      ctx.stroke();
    }
  }

  const stopDrawing = (e : React.MouseEvent<HTMLCanvasElement>)=>{
    if(!isDrawing || !startPos) return ;

    const ctx = canvasRef.current?.getContext("2d");
    if(!ctx) return ;

    const endX = e.nativeEvent.offsetX;
    const endY = e.nativeEvent.offsetY;

    if(mode === "rectangle"){
      ctx.beginPath();
      ctx.rect(
        startPos.x  , 
        startPos.y , 
        endX - startPos.x ,
        endY - startPos.y
      )
      ctx.stroke();
    }

    if(mode === "circle"){
      const radius = Math.sqrt(
        Math.pow(endX - startPos.x , 2) + 
        Math.pow(endY - startPos.y , 2)
      );

      ctx.beginPath();
      ctx.arc(startPos.x , startPos.y ,radius , 0 , 2 * Math.PI);
      ctx.stroke();
    }

    setIsDrawing(false);
    setStartPos(null);
  }

  return(
    <>

      <div style={{marginBottom : "10px"}}>
        <button
          onClick={()=> setMode("pencil")}
        >pencil</button>
        <button
          onClick={()=> setMode("rectangle")}
        >Rectangle</button>
        <button
          onClick={()=> setMode("circle")}
        >Circle</button>
      </div>

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