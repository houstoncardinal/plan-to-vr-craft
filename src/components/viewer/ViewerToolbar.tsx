import { motion, AnimatePresence } from "framer-motion";
import { useViewer, BuildTool } from "@/contexts/ViewerContext";
import {
  MousePointer2,
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
  Home,
  Lightbulb,
  Fence,
  Grid3X3,
  Package,
  Sofa,
  Cloud,
  Waves,
  Flower2,
  Droplets,
  Square,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import ToolOptionsPanel from "./ToolOptionsPanel";

interface ToolDef {
  tool: BuildTool;
  icon: any;
  label: string;
  group: string;
  hasOptions?: boolean;
}

const buildTools: ToolDef[] = [
  { tool: "select", icon: MousePointer2, label: "Select", group: "general" },
  { tool: "wall", icon: Square, label: "Wall", group: "structure", hasOptions: true },
  { tool: "door", icon: DoorOpen, label: "Door", group: "structure", hasOptions: true },
  { tool: "window", icon: SquareDashedBottom, label: "Window", group: "structure", hasOptions: true },
  { tool: "floor", icon: Layers, label: "Floor", group: "structure", hasOptions: true },
  { tool: "roof", icon: Triangle, label: "Roof", group: "structure", hasOptions: true },
  { tool: "stair", icon: Footprints, label: "Stairs", group: "structure", hasOptions: true },
  { tool: "kitchen", icon: Home, label: "Kitchen", group: "interior", hasOptions: true },
  { tool: "bathroom", icon: Droplets, label: "Bathroom", group: "interior", hasOptions: true },
  { tool: "furniture", icon: Sofa, label: "Furniture", group: "interior", hasOptions: true },
  { tool: "lighting", icon: Lightbulb, label: "Lighting", group: "interior", hasOptions: true },
  { tool: "terrain", icon: Mountain, label: "Terrain", group: "site", hasOptions: true },
  { tool: "road", icon: Route, label: "Road", group: "site", hasOptions: true },
  { tool: "parking", icon: ParkingSquare, label: "Parking", group: "site", hasOptions: true },
  { tool: "vegetation", icon: Trees, label: "Vegetation", group: "site", hasOptions: true },
  { tool: "landscape", icon: Flower2, label: "Landscape", group: "site", hasOptions: true },
  { tool: "fence", icon: Fence, label: "Fence", group: "site", hasOptions: true },
  { tool: "pool", icon: Waves, label: "Pool", group: "site", hasOptions: true },
  { tool: "deck", icon: Grid3X3, label: "Deck", group: "site", hasOptions: true },
  { tool: "components", icon: Package, label: "Components", group: "advanced" },
  { tool: "materials", icon: Palette, label: "Materials", group: "advanced" },
  { tool: "measure", icon: Ruler, label: "Measure", group: "utility" },
  { tool: "section", icon: Scissors, label: "Section", group: "utility" },
  { tool: "weather", icon: Cloud, label: "Weather", group: "environment" },
  { tool: "particles", icon: Sparkles, label: "Particles", group: "environment" },
];

const viewTools: ToolDef[] = [
  { tool: "select", icon: MousePointer2, label: "Select", group: "general" },
  { tool: "measure", icon: Ruler, label: "Measure", group: "utility" },
  { tool: "section", icon: Scissors, label: "Section", group: "utility" },
];

const groupLabels: Record<string, string> = {
  general: "General",
  structure: "Structure",
  interior: "Interior",
  site: "Site & Landscape",
  advanced: "Advanced",
  utility: "Utilities",
  environment: "Environment",
};

const panelDefs = [
  { id: "assets" as const, icon: Boxes, label: "Asset Library" },
  { id: "layers" as const, icon: Layers3, label: "Layers" },
  { id: "properties" as const, icon: Palette, label: "Properties" },
  { id: "ai" as const, icon: Sparkles, label: "AI Copilot" },
];

export default function ViewerToolbar() {
  const { state, dispatch } = useViewer();
  const tools = state.mode === "build" ? buildTools : viewTools;
  const groups = [...new Set(tools.map((t) => t.group))];
  const [showOptions, setShowOptions] = useState(false);

  const activeToolDef = tools.find((t) => t.tool === state.activeTool);
  const showToolOptions = showOptions && activeToolDef?.hasOptions;

  return (
    <div className="relative">
      <motion.aside
        initial={{ x: -24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-52 border-r border-border/60 bg-card flex flex-col overflow-hidden"
        style={{ height: "100%" }}
      >
        {/* Scrollable tools area */}
        <div className="flex-1 overflow-y-auto px-2 pt-3 pb-2 space-y-0.5 [scrollbar-width:thin] [scrollbar-color:hsl(var(--border))_transparent]">
          {groups.map((group, gi) => (
            <div key={group}>
              {/* Group header */}
              <div className={`flex items-center gap-2 px-1.5 ${gi === 0 ? "pb-1.5" : "pt-3 pb-1.5"}`}>
                <span className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground/40 font-semibold whitespace-nowrap">
                  {groupLabels[group] || group}
                </span>
                <div className="flex-1 h-px bg-border/30" />
              </div>

              {/* Tool rows */}
              {tools
                .filter((t) => t.group === group)
                .map((tool) => {
                  const isActive = state.activeTool === tool.tool;
                  const isOpen = isActive && showOptions && tool.hasOptions;

                  return (
                    <button
                      key={tool.tool}
                      onClick={() => {
                        const isSame = state.activeTool === tool.tool;
                        if (isSame && tool.tool !== "select") {
                          dispatch({ type: "SET_TOOL", payload: "select" });
                          setShowOptions(false);
                        } else {
                          dispatch({ type: "SET_TOOL", payload: tool.tool });
                          setShowOptions(tool.hasOptions ? !isSame || !showOptions : false);
                        }
                      }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-left transition-all duration-100 group relative ${
                        isActive
                          ? "bg-primary/12 text-primary"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <motion.div
                          layoutId="activeToolBar"
                          className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-primary"
                        />
                      )}

                      <tool.icon
                        className={`h-[14px] w-[14px] flex-shrink-0 transition-colors ${
                          isActive ? "text-primary" : "text-muted-foreground/70 group-hover:text-foreground"
                        }`}
                      />

                      <span
                        className={`text-[12px] leading-none font-medium flex-1 transition-colors ${
                          isActive ? "text-primary" : ""
                        }`}
                      >
                        {tool.label}
                      </span>

                      {/* Options chevron / dot */}
                      {tool.hasOptions && (
                        <ChevronRight
                          className={`h-3 w-3 flex-shrink-0 transition-all duration-150 ${
                            isOpen
                              ? "text-primary rotate-90"
                              : isActive
                              ? "text-primary/50 rotate-0"
                              : "text-muted-foreground/30 rotate-0 opacity-0 group-hover:opacity-100"
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
            </div>
          ))}
        </div>

        {/* Panel toggles — pinned bottom */}
        <div className="border-t border-border/50 px-2 pt-2.5 pb-3">
          <div className="flex items-center gap-2 px-1.5 pb-1.5">
            <span className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground/40 font-semibold">
              Panels
            </span>
            <div className="flex-1 h-px bg-border/30" />
          </div>

          {panelDefs.map(({ id, icon: Icon, label }) => {
            const isActive = state.rightPanel === id;
            return (
              <button
                key={id}
                onClick={() => dispatch({ type: "SET_RIGHT_PANEL", payload: id })}
                className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-left transition-all duration-100 group relative ${
                  isActive
                    ? "bg-primary/12 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePanelBar"
                    className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-primary"
                  />
                )}
                <Icon
                  className={`h-[14px] w-[14px] flex-shrink-0 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground/70 group-hover:text-foreground"
                  }`}
                />
                <span
                  className={`text-[12px] leading-none font-medium ${
                    isActive ? "text-primary" : ""
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </motion.aside>

      {/* Tool Options Panel */}
      <AnimatePresence>
        {showToolOptions && (
          <ToolOptionsPanel
            key={state.activeTool}
            selectedTool={state.activeTool}
            onClose={() => {
              setShowOptions(false);
              dispatch({ type: "SET_TOOL", payload: "select" });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
