import { Suspense, useRef, useMemo, useCallback } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Grid, GizmoHelper, GizmoViewport } from "@react-three/drei";
import * as THREE from "three";
import { useViewer, SceneObject, MaterialType } from "@/contexts/ViewerContext";
import BuildingModel from "@/components/BuildingModel";

const materialColors: Record<MaterialType, string> = {
  concrete: "#d4d0c8",
  brick: "#b5613c",
  glass: "#88b4d4",
  wood: "#a67c52",
  steel: "#8a8a8a",
  drywall: "#e8e4e0",
  stone: "#9a958e",
  asphalt: "#4a4a4a",
};

function SceneObjectMesh({ obj, isSelected }: { obj: SceneObject; isSelected: boolean }) {
  const { dispatch } = useViewer();
  const meshRef = useRef<THREE.Mesh>(null);

  const color = materialColors[obj.material] || "#cccccc";

  const handleClick = useCallback(
    (e: any) => {
      e.stopPropagation();
      dispatch({ type: "SELECT_OBJECT", payload: obj.id });
    },
    [dispatch, obj.id]
  );

  if (!obj.visible) return null;

  if (obj.type === "roof" && obj.properties.style === "gable") {
    return (
      <mesh
        ref={meshRef}
        position={obj.position}
        rotation={obj.rotation}
        castShadow
        onClick={handleClick}
      >
        <coneGeometry args={[obj.scale[0] / 2, obj.scale[1], 4]} />
        <meshStandardMaterial color={color} roughness={0.7} />
        {isSelected && (
          <lineSegments>
            <edgesGeometry args={[new THREE.ConeGeometry(obj.scale[0] / 2, obj.scale[1], 4)]} />
            <lineBasicMaterial color="#dc2626" linewidth={2} />
          </lineSegments>
        )}
      </mesh>
    );
  }

  if (obj.type === "vegetation") {
    return (
      <group position={obj.position} onClick={handleClick}>
        {/* Trunk */}
        <mesh position={[0, obj.scale[1] * 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.2, obj.scale[1] * 0.5, 8]} />
          <meshStandardMaterial color="#6b4423" roughness={0.9} />
        </mesh>
        {/* Canopy */}
        <mesh position={[0, obj.scale[1] * 0.6, 0]} castShadow>
          <sphereGeometry args={[obj.scale[0] / 2, 8, 6]} />
          <meshStandardMaterial color="#3a7d44" roughness={0.8} />
        </mesh>
        {isSelected && (
          <mesh position={[0, obj.scale[1] / 2, 0]}>
            <boxGeometry args={[obj.scale[0], obj.scale[1], obj.scale[2]]} />
            <meshBasicMaterial color="#dc2626" wireframe />
          </mesh>
        )}
      </group>
    );
  }

  const isGlass = obj.material === "glass" || obj.type === "window";

  return (
    <mesh
      ref={meshRef}
      position={obj.position}
      rotation={obj.rotation}
      castShadow={!isGlass}
      receiveShadow
      onClick={handleClick}
    >
      <boxGeometry args={obj.scale} />
      {isGlass ? (
        <meshPhysicalMaterial
          color="#88b4d4"
          transparent
          opacity={0.4}
          roughness={0.05}
          metalness={0.1}
          transmission={0.6}
        />
      ) : (
        <meshStandardMaterial color={color} roughness={0.8} />
      )}
      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(...obj.scale)]} />
          <lineBasicMaterial color="#dc2626" linewidth={2} />
        </lineSegments>
      )}
    </mesh>
  );
}

function DynamicLighting() {
  const { state } = useViewer();
  const cycle = state.dayNightCycle;

  // Sun position based on cycle
  const sunAngle = cycle * Math.PI;
  const sunY = Math.sin(sunAngle) * 25;
  const sunX = Math.cos(sunAngle) * 20;
  const intensity = Math.max(0.1, Math.sin(sunAngle)) * 1.5;
  const ambientIntensity = 0.15 + Math.sin(sunAngle) * 0.35;

  // Sky color
  const skyHue = cycle > 0.3 && cycle < 0.7 ? 0.58 : 0.08;
  const skySat = cycle > 0.3 && cycle < 0.7 ? 0.6 : 0.8;
  const skyLum = Math.max(0.05, Math.sin(sunAngle) * 0.6);

  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={[sunX, sunY, 10]}
        intensity={intensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={60}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <hemisphereLight
        args={[
          new THREE.Color().setHSL(skyHue, skySat, skyLum + 0.3),
          new THREE.Color().setHSL(0.1, 0.3, 0.1),
          0.4,
        ]}
      />
    </>
  );
}

function SceneGrid() {
  const { state } = useViewer();
  if (!state.gridVisible) return null;

  return (
    <Grid
      position={[0, -0.01, 0]}
      args={[100, 100]}
      cellSize={state.gridSize}
      cellThickness={0.5}
      cellColor="#a0a0a0"
      sectionSize={state.gridSize * 5}
      sectionThickness={1}
      sectionColor="#606060"
      fadeDistance={60}
      fadeStrength={1}
      followCamera={false}
      infiniteGrid
    />
  );
}

function ClickPlane() {
  const { state, addObject } = useViewer();

  const handleClick = useCallback(
    (e: any) => {
      if (state.mode !== "build" || state.activeTool === "select") return;
      e.stopPropagation();

      const point = e.point;
      const snap = state.gridSnap ? state.gridSize : 0.1;
      const x = Math.round(point.x / snap) * snap;
      const z = Math.round(point.z / snap) * snap;

      const toolToType: Record<string, SceneObject["type"]> = {
        wall: "wall",
        door: "door",
        window: "window",
        floor: "floor",
        roof: "roof",
        stair: "stair",
        terrain: "terrain",
        road: "road",
        parking: "parking",
        vegetation: "vegetation",
      };

      const type = toolToType[state.activeTool];
      if (!type) return;

      const defaults: Record<string, { scale: [number, number, number]; material: MaterialType; layer: string }> = {
        wall: { scale: [4, 3, 0.2], material: "drywall", layer: "architectural" },
        door: { scale: [1, 2.1, 0.1], material: "wood", layer: "architectural" },
        window: { scale: [1.2, 1.4, 0.08], material: "glass", layer: "architectural" },
        floor: { scale: [6, 0.15, 6], material: "concrete", layer: "architectural" },
        roof: { scale: [8, 2, 8], material: "wood", layer: "architectural" },
        stair: { scale: [1.2, 3, 3], material: "concrete", layer: "architectural" },
        terrain: { scale: [10, 0.5, 10], material: "stone", layer: "landscape" },
        road: { scale: [8, 0.1, 3], material: "asphalt", layer: "site" },
        parking: { scale: [12, 0.1, 8], material: "asphalt", layer: "site" },
        vegetation: { scale: [2, 5, 2], material: "wood", layer: "landscape" },
      };

      const d = defaults[type] || defaults.wall;

      addObject({
        type,
        position: [x, type === "wall" ? d.scale[1] / 2 : 0, z],
        rotation: [0, 0, 0],
        scale: d.scale,
        properties: type === "roof" ? { style: "gable" } : {},
        material: d.material,
        layer: d.layer,
        visible: true,
        locked: false,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${Date.now().toString().slice(-4)}`,
      });
    },
    [state.mode, state.activeTool, state.gridSnap, state.gridSize, addObject]
  );

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.02, 0]}
      onClick={handleClick}
      visible={false}
    >
      <planeGeometry args={[200, 200]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

function SceneObjects() {
  const { state } = useViewer();

  return (
    <>
      {state.objects.map((obj) => (
        <SceneObjectMesh
          key={obj.id}
          obj={obj}
          isSelected={state.selectedObjectId === obj.id}
        />
      ))}
    </>
  );
}

export default function SceneCanvas() {
  const { state, dispatch } = useViewer();

  return (
    <div className="flex-1 relative">
      <Canvas
        shadows
        camera={{ position: [20, 16, 20], fov: 45 }}
        className="bg-surface"
        onPointerMissed={() => dispatch({ type: "SELECT_OBJECT", payload: null })}
      >
        <Suspense fallback={null}>
          <DynamicLighting />

          {/* Show default building in view mode with no objects */}
          {state.mode === "view" && state.objects.length === 0 && <BuildingModel />}

          <SceneObjects />
          <ClickPlane />
          <SceneGrid />

          <ContactShadows
            position={[0, -0.02, 0]}
            opacity={0.25}
            blur={2}
            far={30}
          />

          <OrbitControls
            enablePan
            enableZoom
            enableRotate
            minDistance={5}
            maxDistance={80}
            maxPolarAngle={Math.PI / 2.05}
          />

          <Environment preset={state.dayNightCycle > 0.4 ? "city" : "night"} />

          <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
            <GizmoViewport labelColor="white" axisHeadScale={1} />
          </GizmoHelper>
        </Suspense>
      </Canvas>

      {/* Status bar */}
      <div className="absolute bottom-3 left-3 glass rounded-lg px-3 py-1.5 flex items-center gap-4">
        <p className="text-[11px] font-medium text-foreground">
          {state.mode === "build" ? "Build Mode" : "View Mode"}
        </p>
        <div className="h-3 w-px bg-border" />
        <p className="text-[10px] text-muted-foreground">{state.objects.length} objects</p>
        <div className="h-3 w-px bg-border" />
        <p className="text-[10px] text-muted-foreground capitalize">
          Tool: {state.activeTool}
        </p>
      </div>

      <div className="absolute bottom-3 right-3 glass rounded-lg px-3 py-1.5">
        <p className="text-[10px] text-muted-foreground">
          {state.mode === "build"
            ? "Click on ground to place • Select to edit • Right-click to pan"
            : "Scroll to zoom • Drag to rotate • Right-click to pan"}
        </p>
      </div>
    </div>
  );
}
