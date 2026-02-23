import { useState, useCallback, useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useViewer, SceneObject, MaterialType } from "@/contexts/ViewerContext";
import GhostObject from "./GhostObject";

interface PlacementConfig {
  type: SceneObject["type"];
  scale: [number, number, number];
  material: MaterialType;
  properties?: Record<string, any>;
  layer: string;
  defaultRotation?: number;
  yOffset?: number; // how far off the ground Y-center sits
}

// Default configs per tool — overridden by state.toolConfigs
const TOOL_CONFIGS: Record<string, PlacementConfig> = {
  wall:       { type: "wall",       scale: [4, 3, 0.15],    material: "drywall",  layer: "architectural", yOffset: 1.5 },
  door:       { type: "door",       scale: [0.91, 2.1, 0.04], material: "wood",   layer: "architectural", yOffset: 1.05 },
  window:     { type: "window",     scale: [1.2, 1.4, 0.08], material: "glass",   layer: "architectural", yOffset: 1.2 },
  floor:      { type: "floor",      scale: [6, 0.15, 6],    material: "concrete", layer: "architectural", yOffset: 0.075 },
  roof:       { type: "roof",       scale: [8, 2, 8],       material: "wood",     layer: "architectural", yOffset: 4, properties: { style: "gable" } },
  stair:      { type: "stair",      scale: [1.2, 3, 3],     material: "concrete", layer: "architectural", yOffset: 1.5 },
  terrain:    { type: "terrain",    scale: [10, 0.5, 10],   material: "stone",    layer: "landscape",     yOffset: -0.1 },
  road:       { type: "road",       scale: [8, 0.1, 3],     material: "asphalt",  layer: "site",          yOffset: 0.05 },
  parking:    { type: "parking",    scale: [12, 0.05, 8],   material: "asphalt",  layer: "site",          yOffset: 0.025 },
  vegetation: { type: "vegetation", scale: [3, 5, 3],       material: "wood",     layer: "landscape",     yOffset: 2.5, properties: { variant: "oak" } },
  fence:      { type: "fence",      scale: [3, 1.8, 0.05],  material: "wood",     layer: "site",          yOffset: 0.9 },
  pool:       { type: "pool",       scale: [6, 1.5, 10],    material: "glass",    layer: "site",          yOffset: -0.5, properties: { shape: "rectangular" } },
  deck:       { type: "deck",       scale: [6, 0.3, 6],     material: "wood",     layer: "site",          yOffset: 0.15 },
  landscape:  { type: "landscape",  scale: [4, 0.2, 4],     material: "stone",    layer: "landscape",     yOffset: 0.1, properties: { element: "flower-bed" } },
  kitchen:    { type: "kitchen",    scale: [3, 0.9, 2],     material: "wood",     layer: "interior",      yOffset: 0.45, properties: { layout: "l-shape" } },
  bathroom:   { type: "bathroom",   scale: [2, 1, 2],        material: "stone",   layer: "interior",      yOffset: 0.5, properties: { fixture: "vanity" } },
  furniture:  { type: "furniture",  scale: [2, 0.85, 0.9],  material: "drywall",  layer: "interior",      yOffset: 0.4, properties: { variant: "sofa" } },
  lighting:   { type: "lighting",   scale: [0.3, 0.3, 0.3], material: "steel",   layer: "interior",      yOffset: 2.5, properties: { mount: "ceiling" } },
};

export default function PlacementController() {
  const { state, dispatch, addObject } = useViewer();
  const { camera, raycaster, pointer } = useThree();
  const [ghostPosition, setGhostPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [ghostRotation, setGhostRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [isValidPlacement, setIsValidPlacement] = useState(true);
  const [isPlacing, setIsPlacing] = useState(false);
  const planeRef = useRef<THREE.Mesh>(null);
  const rotationY = useRef(0);

  const activeBaseConfig = TOOL_CONFIGS[state.activeTool];

  // Merge base config with user-selected tool options from ToolOptionsPanel
  const toolUserConfig = state.toolConfigs[state.activeTool] || {};
  const activeConfig: PlacementConfig | null = activeBaseConfig
    ? {
        ...activeBaseConfig,
        material: (toolUserConfig.material || activeBaseConfig.material) as MaterialType,
        scale: (toolUserConfig.scale || activeBaseConfig.scale) as [number, number, number],
        properties: {
          ...activeBaseConfig.properties,
          ...toolUserConfig.properties,
        },
      }
    : null;

  // Keyboard shortcuts during placement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlacing) return;

      if (e.key === "r" || e.key === "R") {
        rotationY.current = (rotationY.current + Math.PI / 4) % (Math.PI * 2);
        setGhostRotation([0, rotationY.current, 0]);
      }
      if (e.key === "Escape") {
        cancelPlacement();
      }
      if (e.key === "Enter" || e.key === " ") {
        if (isValidPlacement) confirmPlacement();
      }

      const step = e.shiftKey ? 0.1 : state.gridSnap ? state.gridSize : 0.5;
      if (e.key === "ArrowLeft")  setGhostPosition((p) => [p[0] - step, p[1], p[2]]);
      if (e.key === "ArrowRight") setGhostPosition((p) => [p[0] + step, p[1], p[2]]);
      if (e.key === "ArrowUp")    setGhostPosition((p) => [p[0], p[1], p[2] - step]);
      if (e.key === "ArrowDown")  setGhostPosition((p) => [p[0], p[1], p[2] + step]);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlacing, isValidPlacement, state.gridSnap, state.gridSize]);

  // Enter/exit placement mode when tool changes
  useEffect(() => {
    if (state.mode === "build" && activeConfig && state.activeTool !== "select") {
      setIsPlacing(true);
      rotationY.current = activeBaseConfig?.defaultRotation || 0;
      setGhostRotation([0, rotationY.current, 0]);
    } else {
      setIsPlacing(false);
    }
  }, [state.mode, state.activeTool]);

  const cancelPlacement = useCallback(() => {
    setIsPlacing(false);
    dispatch({ type: "SET_TOOL", payload: "select" });
  }, [dispatch]);

  const confirmPlacement = useCallback(() => {
    if (!activeConfig || !isValidPlacement) return;

    const newId = addObject({
      type: activeConfig.type,
      position: [...ghostPosition] as [number, number, number],
      rotation: [...ghostRotation] as [number, number, number],
      scale: [...activeConfig.scale] as [number, number, number],
      material: activeConfig.material,
      properties: activeConfig.properties || {},
      layer: activeConfig.layer,
      visible: true,
      locked: false,
      name: toolUserConfig.label
        ? `${toolUserConfig.label}`
        : `${activeConfig.type.charAt(0).toUpperCase() + activeConfig.type.slice(1)}`,
    });

    // Select the newly placed object and open properties
    dispatch({ type: "SELECT_OBJECT", payload: newId });
    // Stay in placement mode for continuous painting — user presses Esc to stop
  }, [activeConfig, ghostPosition, ghostRotation, isValidPlacement, addObject, dispatch, toolUserConfig.label]);

  // Track mouse → move ghost
  useFrame(() => {
    if (!isPlacing || !planeRef.current || !activeConfig) return;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(planeRef.current);

    if (intersects.length > 0) {
      const point = intersects[0].point;
      const snap = state.gridSnap ? state.gridSize : 0.1;

      const x = Math.round(point.x / snap) * snap;
      const z = Math.round(point.z / snap) * snap;

      // Y determined by type (object centre above ground)
      const yOff = activeConfig.yOffset ?? activeConfig.scale[1] / 2;
      const y = yOff;

      setGhostPosition([x, y, z]);

      // Simple overlap check
      const isOverlapping = state.objects.some((obj) => {
        const dx = obj.position[0] - x;
        const dz = obj.position[2] - z;
        const minD = Math.min(activeConfig.scale[0], activeConfig.scale[2]) * 0.4;
        return Math.sqrt(dx * dx + dz * dz) < minD;
      });

      setIsValidPlacement(!isOverlapping);
    }
  });

  if (!isPlacing || !activeConfig) return null;

  return (
    <>
      {/* Invisible ground plane for raycasting */}
      <mesh ref={planeRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} visible={false}>
        <planeGeometry args={[500, 500]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Ghost preview — follows mouse */}
      <GhostObject
        type={activeConfig.type}
        position={ghostPosition}
        rotation={ghostRotation}
        scale={activeConfig.scale}
        material={activeConfig.material}
        properties={activeConfig.properties}
        isValid={isValidPlacement}
      />

      {/* Click handler on canvas surface */}
      <CanvasClickPlane
        onPlace={confirmPlacement}
        isActive={isPlacing}
      />

      {/* HUD overlay */}
      <PlacementHUD
        isValid={isValidPlacement}
        rotation={ghostRotation}
        toolName={toolUserConfig.label || activeConfig.type}
      />
    </>
  );
}

// Transparent plane that converts canvas click → placement
function CanvasClickPlane({ onPlace, isActive }: { onPlace: () => void; isActive: boolean }) {
  if (!isActive) return null;
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.001, 0]}
      visible={false}
      onClick={(e) => { e.stopPropagation(); onPlace(); }}
    >
      <planeGeometry args={[500, 500]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

function PlacementHUD({
  isValid,
  rotation,
  toolName,
}: {
  isValid: boolean;
  rotation: [number, number, number];
  toolName: string;
}) {
  return (
    <Html fullscreen style={{ pointerEvents: "none" }}>
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-xl px-5 py-3 text-center z-50 pointer-events-none">
        <div className="flex items-center gap-4 text-xs">
          <div className={`flex items-center gap-2 ${isValid ? "text-green-400" : "text-red-400"}`}>
            <div className={`w-2 h-2 rounded-full ${isValid ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
            <span className="font-semibold capitalize">{toolName}</span>
            <span className="text-white/60">{isValid ? "— Click to place" : "— Blocked"}</span>
          </div>
          <div className="h-4 w-px bg-white/20" />
          <span className="text-white/60">
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] mr-1">R</kbd>rotate
            <span className="mx-2">·</span>
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] mr-1">↑↓←→</kbd>nudge
            <span className="mx-2">·</span>
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] mr-1">Esc</kbd>exit
          </span>
          <div className="h-4 w-px bg-white/20" />
          <span className="text-white/50 text-[10px]">{Math.round((rotation[1] * 180) / Math.PI)}°</span>
        </div>
      </div>
    </Html>
  );
}
