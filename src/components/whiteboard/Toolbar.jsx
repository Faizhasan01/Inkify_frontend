import { motion } from "framer-motion";
import { 
  Pencil, 
  Square, 
  Circle, 
  Type, 
  Eraser, 
  Undo2, 
  Redo2, 
  Download,
  MousePointer2,
  Trash2,
  Shapes,
  MoveRight,
  Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function Toolbar({
  activeTool,
  setActiveTool,
  color,
  setColor,
  strokeWidth,
  setStrokeWidth,
  onUndo,
  onRedo,
  onClear,
  onSave
}) {
  const isShapeTool = ["rectangle", "circle", "line", "arrow", "oval"].includes(activeTool);

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white dark:bg-neutral-900 border border-border shadow-xl rounded-2xl p-2 flex items-center gap-2 z-50"
    >
      <div className="flex items-center gap-1">
        <ToolButton 
          active={activeTool === "select"} 
          onClick={() => setActiveTool("select")}
          icon={<MousePointer2 className="w-4 h-4" />}
          label="Select"
        />
        <ToolButton 
          active={activeTool === "pencil"} 
          onClick={() => setActiveTool("pencil")}
          icon={<Pencil className="w-4 h-4" />}
          label="Pencil"
        />
        
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant={isShapeTool ? "default" : "ghost"}
              size="icon" 
              className={`h-9 w-9 rounded-xl transition-all ${isShapeTool ? 'shadow-md scale-105' : 'hover:bg-muted'}`}
            >
              <Shapes className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2 flex gap-1" side="top">
             <ToolButton 
              active={activeTool === "rectangle"} 
              onClick={() => setActiveTool("rectangle")}
              icon={<Square className="w-4 h-4" />}
              label="Rectangle"
            />
            <ToolButton 
              active={activeTool === "circle"} 
              onClick={() => setActiveTool("circle")}
              icon={<Circle className="w-4 h-4" />}
              label="Circle"
            />
            <ToolButton 
              active={activeTool === "oval"} 
              onClick={() => setActiveTool("oval")}
              icon={<div className="w-4 h-3 rounded-full border-2 border-current" />}
              label="Oval"
            />
             <ToolButton 
              active={activeTool === "line"} 
              onClick={() => setActiveTool("line")}
              icon={<Minus className="w-4 h-4 -rotate-45" />}
              label="Line"
            />
             <ToolButton 
              active={activeTool === "arrow"} 
              onClick={() => setActiveTool("arrow")}
              icon={<MoveRight className="w-4 h-4 -rotate-45" />}
              label="Arrow"
            />
          </PopoverContent>
        </Popover>

        <ToolButton 
          active={activeTool === "text"} 
          onClick={() => setActiveTool("text")}
          icon={<Type className="w-4 h-4" />}
          label="Text"
        />
        <ToolButton 
          active={activeTool === "eraser"} 
          onClick={() => setActiveTool("eraser")}
          icon={<Eraser className="w-4 h-4" />}
          label="Eraser"
        />
      </div>

      <Separator orientation="vertical" className="h-8 mx-1" />

      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <button 
              className="w-6 h-6 rounded-full border border-border shadow-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring"
              style={{ backgroundColor: color }}
            />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" side="top">
            <HexColorPicker color={color} onChange={setColor} />
          </PopoverContent>
        </Popover>

        <div className="flex flex-col gap-1 w-24">
           <input 
             type="range" 
             min="1" 
             max="20" 
             value={strokeWidth} 
             onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
             className="h-1.5 w-full bg-secondary/20 rounded-lg appearance-none cursor-pointer accent-primary"
           />
        </div>
      </div>

      <Separator orientation="vertical" className="h-8 mx-1" />

      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onUndo} className="h-8 w-8">
              <Undo2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onRedo} className="h-8 w-8">
              <Redo2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onSave} className="h-8 w-8">
              <Download className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save Project</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onClear} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Clear Canvas</TooltipContent>
        </Tooltip>
      </div>
    </motion.div>
  );
}

function ToolButton({ active, onClick, icon, label }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant={active ? "default" : "ghost"} 
          size="icon" 
          onClick={onClick}
          className={`h-9 w-9 rounded-xl transition-all ${active ? 'shadow-md scale-105' : 'hover:bg-muted'}`}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}
