import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useViewer } from "@/contexts/ViewerContext";
import {
  ChevronLeft,
  Hammer,
  Eye,
  Undo2,
  Redo2,
  Grid3X3,
  Magnet,
  Sun,
  Moon,
  Camera,
  Save,
  Share2,
  Maximize2,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ViewerHeader() {
  const { state, dispatch } = useViewer();

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-12 border-b border-border bg-card flex items-center px-3 gap-2 z-50"
    >
      {/* Left: Back + Project name */}
      <Link to="/dashboard">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </Link>
      <div className="flex items-center gap-2 mr-4">
        <div className="h-6 w-6 rounded bg-gradient-cardinal flex items-center justify-center">
          <span className="text-[10px] font-bold text-primary-foreground">VC</span>
        </div>
        <span className="text-sm font-medium text-foreground truncate max-w-40">Meridian Tower</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">Phase 2</span>
      </div>

      <div className="h-6 w-px bg-border" />

      {/* Mode toggle */}
      <div className="flex items-center bg-muted rounded-lg p-0.5 gap-0.5">
        <Button
          variant="ghost"
          size="sm"
          className={`h-7 px-3 text-xs gap-1.5 rounded-md ${
            state.mode === "view" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
          }`}
          onClick={() => dispatch({ type: "SET_MODE", payload: "view" })}
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`h-7 px-3 text-xs gap-1.5 rounded-md ${
            state.mode === "build" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
          }`}
          onClick={() => dispatch({ type: "SET_MODE", payload: "build" })}
        >
          <Hammer className="h-3.5 w-3.5" />
          Build
        </Button>
      </div>

      <div className="h-6 w-px bg-border" />

      {/* Undo/Redo */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"
            disabled={state.undoStack.length === 0}
            onClick={() => dispatch({ type: "UNDO" })}
          >
            <Undo2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"
            disabled={state.redoStack.length === 0}
            onClick={() => dispatch({ type: "REDO" })}
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
      </Tooltip>

      <div className="h-6 w-px bg-border" />

      {/* Grid & Snap */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost" size="icon"
            className={`h-8 w-8 ${state.gridVisible ? "text-primary" : "text-muted-foreground"}`}
            onClick={() => dispatch({ type: "SET_GRID_VISIBLE", payload: !state.gridVisible })}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Toggle Grid</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost" size="icon"
            className={`h-8 w-8 ${state.gridSnap ? "text-primary" : "text-muted-foreground"}`}
            onClick={() => dispatch({ type: "SET_GRID_SNAP", payload: !state.gridSnap })}
          >
            <Magnet className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Snap to Grid</TooltipContent>
      </Tooltip>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Day/Night */}
      <div className="flex items-center gap-2 w-32">
        <Moon className="h-3.5 w-3.5 text-muted-foreground" />
        <Slider
          value={[state.dayNightCycle * 100]}
          onValueChange={([v]) => dispatch({ type: "SET_DAY_NIGHT", payload: v / 100 })}
          max={100}
          step={1}
          className="flex-1"
        />
        <Sun className="h-3.5 w-3.5 text-muted-foreground" />
      </div>

      <div className="h-6 w-px bg-border" />

      {/* Actions */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <Camera className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Screenshot</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <Save className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Save Project</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <Share2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Share</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Fullscreen</TooltipContent>
      </Tooltip>
    </motion.header>
  );
}
