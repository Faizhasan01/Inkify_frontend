import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";

export const Canvas = forwardRef(({ tool, color, strokeWidth, elements, setElements }, ref) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  const [startPoint, setStartPoint] = useState(null);
  const [currentPoint, setCurrentPoint] = useState(null);

  useImperativeHandle(ref, () => ({
    exportImage: () => {
      if (!canvasRef.current) return;
      
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvasRef.current.width;
      tempCanvas.height = canvasRef.current.height;
      const tempCtx = tempCanvas.getContext('2d');
      
      if (!tempCtx) return;
      
      tempCtx.fillStyle = '#ffffff';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      
      tempCtx.strokeStyle = '#e5e7eb';
      tempCtx.lineWidth = 1;
      tempCtx.beginPath();
      
      for (let x = 0; x <= tempCanvas.width; x += 24) {
        tempCtx.moveTo(x, 0);
        tempCtx.lineTo(x, tempCanvas.height);
      }
      
      for (let y = 0; y <= tempCanvas.height; y += 24) {
        tempCtx.moveTo(0, y);
        tempCtx.lineTo(tempCanvas.width, y);
      }
      tempCtx.stroke();
      
      tempCtx.drawImage(canvasRef.current, 0, 0);
      
      const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.9);
      const link = document.createElement('a');
      link.download = 'whiteboard-export.jpg';
      link.href = dataUrl;
      link.click();
    }
  }));

  const getCoords = (e) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawAll = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      elements.forEach(el => drawElement(ctx, el));

      if (isDrawing) {
        const tempElement = {
          id: "temp",
          type: tool,
          points: currentPath,
          start: startPoint || undefined,
          end: currentPoint || undefined,
          color: color,
          width: strokeWidth
        };
        drawElement(ctx, tempElement);
      }
    };

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        drawAll();
      }
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    drawAll();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [elements, isDrawing, currentPath, startPoint, currentPoint, tool, color, strokeWidth]);

  const drawElement = (ctx, el) => {
    ctx.strokeStyle = el.color;
    ctx.lineWidth = el.width;
    ctx.beginPath();

    if (el.type === "pencil" || el.type === "eraser") {
      if (el.points.length < 2) return;
      ctx.moveTo(el.points[0].x, el.points[0].y);
      for (let i = 1; i < el.points.length; i++) {
        ctx.lineTo(el.points[i].x, el.points[i].y);
      }
      if (el.type === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = el.width * 2;
      } else {
        ctx.globalCompositeOperation = "source-over";
      }
      ctx.stroke();
      ctx.globalCompositeOperation = "source-over";
    } else if (el.type === "rectangle" && el.start && el.end) {
      const w = el.end.x - el.start.x;
      const h = el.end.y - el.start.y;
      ctx.strokeRect(el.start.x, el.start.y, w, h);
    } else if (el.type === "circle" && el.start && el.end) {
      const radius = Math.sqrt(
        Math.pow(el.end.x - el.start.x, 2) + Math.pow(el.end.y - el.start.y, 2)
      );
      ctx.arc(el.start.x, el.start.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (el.type === "oval" && el.start && el.end) {
      const centerX = (el.start.x + el.end.x) / 2;
      const centerY = (el.start.y + el.end.y) / 2;
      const radiusX = Math.abs(el.end.x - el.start.x) / 2;
      const radiusY = Math.abs(el.end.y - el.start.y) / 2;
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (el.type === "line" && el.start && el.end) {
      ctx.moveTo(el.start.x, el.start.y);
      ctx.lineTo(el.end.x, el.end.y);
      ctx.stroke();
    } else if (el.type === "arrow" && el.start && el.end) {
      const headLength = el.width * 4;
      const angle = Math.atan2(el.end.y - el.start.y, el.end.x - el.start.x);
      
      ctx.moveTo(el.start.x, el.start.y);
      ctx.lineTo(el.end.x, el.end.y);
      
      ctx.lineTo(el.end.x - headLength * Math.cos(angle - Math.PI / 6), el.end.y - headLength * Math.sin(angle - Math.PI / 6));
      ctx.moveTo(el.end.x, el.end.y);
      ctx.lineTo(el.end.x - headLength * Math.cos(angle + Math.PI / 6), el.end.y - headLength * Math.sin(angle + Math.PI / 6));
      ctx.stroke();
    } else if (el.type === "text" && el.start && el.text) {
      ctx.font = `${el.width * 5 + 10}px 'Outfit', sans-serif`;
      ctx.fillStyle = el.color;
      ctx.fillText(el.text, el.start.x, el.start.y);
    }
  };

  const handleMouseDown = (e) => {
    if (tool === "select") return;
    const coords = getCoords(e);
    
    if (tool === "text") {
      const text = window.prompt("Enter text:");
      if (text) {
        const newElement = {
          id: Date.now().toString(),
          type: "text",
          points: [],
          start: coords,
          text: text,
          color: color,
          width: strokeWidth
        };
        setElements([...elements, newElement]);
      }
      return;
    }

    setIsDrawing(true);
    setStartPoint(coords);
    setCurrentPoint(coords);
    
    if (tool === "pencil" || tool === "eraser") {
      setCurrentPath([coords]);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const coords = getCoords(e);
    setCurrentPoint(coords);

    if (tool === "pencil" || tool === "eraser") {
      setCurrentPath(prev => [...prev, coords]);
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const newElement = {
      id: Date.now().toString(),
      type: tool,
      points: currentPath,
      start: startPoint || undefined,
      end: currentPoint || undefined,
      color: color,
      width: strokeWidth
    };
    
    if (tool !== "text") {
      setElements([...elements, newElement]);
    }

    setCurrentPath([]);
    setStartPoint(null);
    setCurrentPoint(null);
  };

  return (
    <div className="w-full h-full bg-white dark:bg-neutral-900 cursor-crosshair relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40 pattern-grid" />
      
      <canvas
        ref={canvasRef}
        className="w-full h-full touch-none relative z-10"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
});
