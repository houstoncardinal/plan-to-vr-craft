import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useViewer, BuildTool } from "@/contexts/ViewerContext";
import {
  MousePointer2,
  PenLine,
  DoorOpen,
  SquareDashedBottom,
  Layers,
  Triangle,
  Footprints,
  Mountain,
  Route,
  ParkingSquare,
  Trees,
  Ruler,
  Scissors,
  Boxes,
  Sparkles,
  Layers3,
  Palette,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ToolDef {
  tool: BuildTool;
  icon: any;
  label: string;
  group: string;
}

const buildTools: ToolDef[] = [
  { tool: "select", icon: MousePointer2, label: "Select", group: "general" },
  { tool: "wall", icon: PenLine, label: "Wall Tool", group: "building" },
  { tool: "door", icon: DoorOpen, label: "Door", group: "building" },
  { tool: "window", icon: SquareDashedBottom, label: "Window", group: "building" },
  { tool: "floor", icon: Layers, label: "Floor", group: "building" },
  { tool: "roof", icon: Triangle, label: "Roof", group: "building" },
  { tool: "stair", icon: Footprints, label: "Stairs", group: "building" },
  { tool: "terrain", icon: Mountain, label: "Terrain", group: "site" },
  { tool: "road", icon: Route, label: "Road", group: "site" },
  { tool: "parking", icon: ParkingSquare, label: "Parking", group: "site" },
  { tool: "vegetation", icon: Trees, label: "Vegetation", group: "site" },
  { tool: "measure", icon: Ruler, label: "Measure", group: "utility" },
  { tool: "section", icon: Scissors, label: "Section Cut", group: "utility" },
];

const viewTools: ToolDef[] = [
  { tool: "select", icon: MousePointer2, label: "Select", group: "general" },
  { tool: "measure", icon: Ruler, label: "Measure", group: "utility" },
  { tool: "section", icon: Scissors, label: "Section Cut", group: "utility" },
];

export default function ViewerToolbar() {
  const { state, dispatch } = useViewer();
  const tools = state.mode === "build" ? buildTools : viewTools;

  const groups = [...new Set(tools.map((t) => t.group))];

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-12 border-r border-border bg-card flex flex-col items-center py-2 gap-0.5 overflow-y-auto"
    >
      {groups.map((group, gi) => (
        <div key={group} className="flex flex-col items-center gap-0.5">
          {gi > 0 && <div className="w-6 h-px bg-border my-1.5" />}
          {tools
            .filter((t) => t.group === group)
            .map((tool) => (
              <Tooltip key={tool.tool} delayDuration={200}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-9 w-9 ${
                      state.activeTool === tool.tool
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => dispatch({ type: "SET_TOOL", payload: tool.tool })}
                  >
                    <tool.icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{tool.label}</TooltipContent>
              </Tooltip>
            ))}
        </div>
      ))}

      <div className="flex-1" />

      {/* Right panel toggles */}
      <div className="flex flex-col items-center gap-0.5">
        <div className="w-6 h-px bg-border my-1.5" />
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost" size="icon"
              className={`h-9 w-9 ${state.rightPanel === "assets" ? "text-primary" : "text-muted-foreground"}`}
              onClick={() => dispatch({ type: "SET_RIGHT_PANEL", payload: "assets" })}
            >
              <Boxes className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Asset Library</TooltipContent>
        </Tooltip>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost" size="icon"
              className={`h-9 w-9 ${state.rightPanel === "layers" ? "text-primary" : "text-muted-foreground"}`}
              onClick={() => dispatch({ type: "SET_RIGHT_PANEL", payload: "layers" })}
            >
              <Layers3 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Layers</TooltipContent>
        </Tooltip>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost" size="icon"
              className={`h-9 w-9 ${state.rightPanel === "properties" ? "text-primary" : "text-muted-foreground"}`}
              onClick={() => dispatch({ type: "SET_RIGHT_PANEL", payload: "properties" })}
            >
              <Palette className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Properties</TooltipContent>
        </Tooltip>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost" size="icon"
              className={`h-9 w-9 ${state.rightPanel === "ai" ? "text-primary" : "text-muted-foreground"}`}
              onClick={() => dispatch({ type: "SET_RIGHT_PANEL", payload: "ai" })}
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">AI Copilot</TooltipContent>
        </Tooltip>
      </div>
    </motion.aside>
  );
}
