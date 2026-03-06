import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useViewer } from "@/contexts/ViewerContext";
import FileMenu from "@/components/viewer/FileMenu";
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
  Share2,
  Maximize2,
  Leaf,
  Snowflake,
  Flower2,
  Home,
  Users,
  FilePlus2,
  SlidersHorizontal,
  Layers,
  Package,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CAMERA_PRESETS = [
  { value: "front", label: "Front" },
  { value: "back", label: "Back" },
  { value: "side", label: "Side" },
  { value: "top", label: "Top" },
  { value: "aerial", label: "Aerial" },
  { value: "street", label: "Street" },
];

const SEASONS = [
  { value: "spring", label: "Spring", icon: Flower2 },
  { value: "summer", label: "Summer", icon: Sun },
  { value: "autumn", label: "Autumn", icon: Leaf },
  { value: "winter", label: "Winter", icon: Snowflake },
];

export default function ViewerHeader() {
  const { state, dispatch } = useViewer();

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-12 border-b border-border bg-card flex items-center px-3 gap-2 z-50 relative"
    >
      <Link to="/dashboard">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </Link>

      {/* App logo + File menu */}
      <div className="flex items-center gap-1 mr-2">
        <div className="h-6 w-6 rounded bg-gradient-cardinal flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-bold text-primary-foreground">VC</span>
        </div>
        <div className="relative">
          <FileMenu />
        </div>
      </div>

      {/* Live project name */}
      <div className="flex items-center gap-2 mr-2">
        <span className="text-sm font-medium text-foreground truncate max-w-44">{state.projectName}</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium hidden sm:inline">
          {state.objects.length} obj
        </span>
      </div>

      {/* Quick "New" button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => {
              if (window.confirm("Start a new project? Current scene will be discarded.")) {
                dispatch({ type: "NEW_PROJECT" });
              }
            }}
          >
            <FilePlus2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>New Project (Ctrl+N)</TooltipContent>
      </Tooltip>

      <div className="h-6 w-px bg-border" />

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

      <div className="h-6 w-px bg-border" />

      <Select value={state.cameraPreset || "orbit"} onValueChange={(v) => dispatch({ type: "SET_CAMERA_PRESET", payload: v === "orbit" ? null : v })}>
        <SelectTrigger className="h-8 w-32 text-xs">
          <SelectValue placeholder="Camera View" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="orbit">Orbit (Free)</SelectItem>
          {CAMERA_PRESETS.map((preset) => (
            <SelectItem key={preset.value} value={preset.value} className="text-xs">{preset.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="h-6 w-px bg-border" />

      {/* Camera mode: Orbit / FPS */}
      <div className="flex items-center bg-muted rounded-lg p-0.5 gap-0.5">
        <Button
          variant="ghost" size="sm"
          className={`h-7 px-2.5 text-xs rounded-md ${state.cameraMode !== "firstPerson" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
          onClick={() => dispatch({ type: "SET_CAMERA_MODE", payload: "orbit" })}
        >
          Orbit
        </Button>
        <Button
          variant="ghost" size="sm"
          className={`h-7 px-2.5 text-xs rounded-md ${state.cameraMode === "firstPerson" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
          onClick={() => dispatch({ type: "SET_CAMERA_MODE", payload: "firstPerson" })}
        >
          FPS
        </Button>
      </div>

      <div className="h-6 w-px bg-border" />

      {/* World mode toggles */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost" size="sm"
            className={`h-7 px-2.5 text-xs gap-1.5 rounded-md ${state.neighborhoodMode ? "bg-primary/15 text-primary border border-primary/30" : "text-muted-foreground"}`}
            onClick={() => dispatch({ type: "TOGGLE_NEIGHBORHOOD_MODE" })}
          >
            <Home className="h-3.5 w-3.5" />
            Neighborhood
          </Button>
        </TooltipTrigger>
        <TooltipContent>Toggle neighborhood — your scene becomes the empty lot</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost" size="icon"
            className={`h-8 w-8 ${state.npcEnabled ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
            onClick={() => dispatch({ type: "TOGGLE_NPCS" })}
          >
            <Users className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Toggle NPCs</TooltipContent>
      </Tooltip>

      <div className="h-6 w-px bg-border" />

      <div className="flex items-center gap-1">
        {SEASONS.map((season) => (
          <Tooltip key={season.value}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${state.season === season.value ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
                onClick={() => dispatch({ type: "SET_SEASON", payload: season.value as any })}
              >
                <season.icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{season.label}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      <div className="h-6 w-px bg-border" />

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

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"
            onClick={() => {
              const canvas = document.querySelector("canvas");
              if (!canvas) return;
              const link = document.createElement("a");
              link.download = `${state.projectName.replace(/\s+/g, "-")}-${Date.now()}.png`;
              link.href = canvas.toDataURL("image/png");
              link.click();
            }}
          >
            <Camera className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Screenshot (PNG)</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"
            onClick={async () => {
              const url = window.location.href;
              try {
                await navigator.clipboard.writeText(url);
                // Use a simple toast-like feedback
                const el = document.createElement("div");
                el.textContent = "Link copied!";
                el.className = "fixed top-16 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium shadow-lg z-[100] animate-in fade-in";
                document.body.appendChild(el);
                setTimeout(() => el.remove(), 2000);
              } catch {
                window.prompt("Copy this link:", url);
              }
            }}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Share Link</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"
            onClick={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen();
              } else {
                document.documentElement.requestFullscreen();
              }
            }}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Fullscreen</TooltipContent>
      </Tooltip>

      {/* Spacer pushes panel toggles to the far right */}
      <div className="flex-1" />
      <div className="h-6 w-px bg-border" />

      {/* Right-panel toggle buttons — always visible regardless of screen size */}
      <div className="flex items-center gap-0.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost" size="sm"
              className={`h-8 px-2.5 text-xs gap-1.5 rounded-md ${state.rightPanel === "properties" ? "bg-primary/12 text-primary" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => dispatch({ type: "SET_RIGHT_PANEL", payload: "properties" })}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Properties</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Properties panel — position, scale, material</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost" size="sm"
              className={`h-8 px-2.5 text-xs gap-1.5 rounded-md ${state.rightPanel === "assets" ? "bg-primary/12 text-primary" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => dispatch({ type: "SET_RIGHT_PANEL", payload: "assets" })}
            >
              <Package className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Assets</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Asset library — place objects</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost" size="sm"
              className={`h-8 px-2.5 text-xs gap-1.5 rounded-md ${state.rightPanel === "layers" ? "bg-primary/12 text-primary" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => dispatch({ type: "SET_RIGHT_PANEL", payload: "layers" })}
            >
              <Layers className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Layers</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Layers panel — visibility per layer</TooltipContent>
        </Tooltip>
      </div>
    </motion.header>
  );
}
