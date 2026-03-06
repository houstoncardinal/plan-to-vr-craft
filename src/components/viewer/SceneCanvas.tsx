import { Suspense, useRef, useCallback, useState, useEffect, useMemo } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Grid, GizmoHelper, GizmoViewport, PointerLockControls, Line, Html } from "@react-three/drei";
import PostProcessingEffects from "@/components/viewer/PostProcessingEffects";
import SkyEnvironment from "@/components/viewer/SkyEnvironment";
import * as THREE from "three";
import { useViewer, SceneObject, MaterialType } from "@/contexts/ViewerContext";
import { PBR_MATERIALS } from "@/lib/materials";
import PlacementController from "@/components/viewer/PlacementController";
import { PhysicsPlayerController } from "@/components/viewer/PhysicsPlayerController";
import { NPCCharacter } from "@/components/viewer/NPCCharacter";
import { NeighborhoodScene, NPC_WAYPOINTS, NPC_COLORS } from "@/components/viewer/NeighborhoodScene";

// ─── Module-level drag state ──────────────────────────────────────────────────
// Using refs outside React so Three.js can update at 60fps without re-renders
const dragState = {
  active: false,
  objectId: null as string | null,
  objectY: 0,           // keep original Y during drag
  pos: new THREE.Vector3(),
};
// OrbitControls ref accessible by DragController
const orbitRef = { current: null as any };

// ─── Material color map ───────────────────────────────────────────────────────
const materialColors: Record<MaterialType, string> = {
  concrete: "#d4d0c8",
  brick: "#b5613c",
  glass: "#88b4d4",
  wood: "#a67c52",
  steel: "#8a8a8a",
  drywall: "#e8e4e0",
  stone: "#9a958e",
  asphalt: "#4a4a4a",
  "brushed-aluminum": "#c8c8c8",
  "copper-patina": "#7c9a8c",
  "stainless-steel": "#b0b0b0",
  "bronze-aged": "#8b7355",
  "oak-hardwood": "#c4a574",
  "walnut-finished": "#5c4033",
  "bamboo-natural": "#d4c080",
  "reclaimed-barn": "#7a5c3d",
  "marble-carrara": "#f0ede8",
  "travertine-tumbled": "#d4c9b0",
  "concrete-polished": "#a0a0a0",
  "slate-charcoal": "#5a5a5a",
  "glass-clear": "#a8c8d8",
  "glass-frosted": "#d8e0e8",
  "glass-bronze-tinted": "#8b7355",
  "ceramic-white-glossy": "#f5f5f5",
  "subway-tile-beveled": "#e8e8e8",
  "terracotta-tile": "#c4603c",
  "velvet-crushed": "#5a4070",
  "linen-natural": "#e8e4dc",
  "acrylic-clear": "#d0e8f0",
  "carbon-fiber": "#2a2a2a",
  "paint-matte": "#e0ddd8",
  "paint-semi-gloss": "#dedad4",
  "paint-high-gloss": "#f0ece8",
};

function createRealisticMaterial(color: string, type: MaterialType) {
  // Ultra-realistic PBR properties — tuned for architectural visualization
  const enhancements: Record<MaterialType, Partial<THREE.MeshPhysicalMaterialParameters>> = {
    concrete:              { roughness: 0.88, metalness: 0,    clearcoat: 0.12, clearcoatRoughness: 0.75, envMapIntensity: 0.5 },
    brick:                 { roughness: 0.93, metalness: 0,    envMapIntensity: 0.3 },
    // Physical glass: proper IOR 1.52, volumetric attenuation tints thick panes blue
    glass:                 { roughness: 0.02, metalness: 0.06, transmission: 0.97, thickness: 0.6, ior: 1.52, clearcoat: 1.0, clearcoatRoughness: 0.03, envMapIntensity: 3.5, attenuationColor: "#cce8ff", attenuationDistance: 0.5 },
    // Wood: anisotropic sheen follows grain direction
    wood:                  { roughness: 0.62, metalness: 0,    clearcoat: 0.42, clearcoatRoughness: 0.44, envMapIntensity: 0.85, anisotropy: 0.6, anisotropyRotation: 0 },
    // Steel: strong anisotropy for brushed mill-finish look
    steel:                 { roughness: 0.14, metalness: 0.97, clearcoat: 0.7,  clearcoatRoughness: 0.15, envMapIntensity: 2.6, anisotropy: 0.8 },
    drywall:               { roughness: 0.84, metalness: 0,    envMapIntensity: 0.2 },
    stone:                 { roughness: 0.76, metalness: 0.04, clearcoat: 0.22, clearcoatRoughness: 0.65, envMapIntensity: 0.55 },
    asphalt:               { roughness: 0.97, metalness: 0,    envMapIntensity: 0.1 },
    // Brushed aluminum: cross-grain anisotropy (rotation=90°)
    "brushed-aluminum":    { roughness: 0.24, metalness: 1.0,  clearcoat: 0.38, clearcoatRoughness: 0.35, envMapIntensity: 2.8, anisotropy: 0.9, anisotropyRotation: Math.PI / 2 },
    "copper-patina":       { roughness: 0.56, metalness: 0.78, envMapIntensity: 2.0 },
    "stainless-steel":     { roughness: 0.08, metalness: 0.99, clearcoat: 0.6,  clearcoatRoughness: 0.1,  envMapIntensity: 3.2, anisotropy: 0.85 },
    "bronze-aged":         { roughness: 0.52, metalness: 0.82, envMapIntensity: 2.2 },
    "oak-hardwood":        { roughness: 0.58, metalness: 0,    clearcoat: 0.52, clearcoatRoughness: 0.4,  envMapIntensity: 1.0,  anisotropy: 0.7, anisotropyRotation: 0 },
    "walnut-finished":     { roughness: 0.48, metalness: 0,    clearcoat: 0.62, clearcoatRoughness: 0.35, envMapIntensity: 1.1,  anisotropy: 0.65 },
    "bamboo-natural":      { roughness: 0.68, metalness: 0,    clearcoat: 0.2,  envMapIntensity: 0.55, anisotropy: 0.5 },
    "reclaimed-barn":      { roughness: 0.97, metalness: 0,    envMapIntensity: 0.18 },
    "marble-carrara":      { roughness: 0.05, metalness: 0,    clearcoat: 0.95, clearcoatRoughness: 0.04, envMapIntensity: 1.8 },
    "travertine-tumbled":  { roughness: 0.4,  metalness: 0,    clearcoat: 0.35, clearcoatRoughness: 0.55, envMapIntensity: 0.7 },
    "concrete-polished":   { roughness: 0.2,  metalness: 0.04, clearcoat: 0.6,  clearcoatRoughness: 0.25, envMapIntensity: 1.1 },
    "slate-charcoal":      { roughness: 0.78, metalness: 0.06, envMapIntensity: 0.4 },
    "glass-clear":         { roughness: 0.02, metalness: 0.04, transmission: 0.98, thickness: 0.5, ior: 1.52, clearcoat: 1.0, clearcoatRoughness: 0.02, envMapIntensity: 3.5, attenuationColor: "#e8f4ff", attenuationDistance: 0.8 },
    "glass-frosted":       { roughness: 0.4,  metalness: 0,    transmission: 0.65, thickness: 0.35, ior: 1.4,  clearcoat: 0.55, clearcoatRoughness: 0.45, envMapIntensity: 1.0 },
    "glass-bronze-tinted": { roughness: 0.03, metalness: 0.1,  transmission: 0.74, thickness: 0.55, ior: 1.52, clearcoat: 0.95, clearcoatRoughness: 0.05, envMapIntensity: 2.5, attenuationColor: "#c8a060", attenuationDistance: 0.4 },
    "ceramic-white-glossy":{ roughness: 0.03, metalness: 0,    clearcoat: 0.98, clearcoatRoughness: 0.03, envMapIntensity: 1.4 },
    "subway-tile-beveled": { roughness: 0.08, metalness: 0,    clearcoat: 0.86, clearcoatRoughness: 0.06, envMapIntensity: 1.1 },
    "terracotta-tile":     { roughness: 0.76, metalness: 0,    clearcoat: 0.14, envMapIntensity: 0.32 },
    "velvet-crushed":      { roughness: 0.96, metalness: 0,    sheen: 1.0, sheenRoughness: 0.35, envMapIntensity: 0.25 },
    "linen-natural":       { roughness: 0.9,  metalness: 0,    envMapIntensity: 0.18 },
    "acrylic-clear":       { roughness: 0.02, metalness: 0,    transmission: 0.94, thickness: 0.35, ior: 1.49, clearcoat: 0.9,  clearcoatRoughness: 0.04, envMapIntensity: 2.0, attenuationColor: "#f0f8ff", attenuationDistance: 1.0 },
    "carbon-fiber":        { roughness: 0.28, metalness: 0.85, clearcoat: 0.9,  clearcoatRoughness: 0.15, envMapIntensity: 2.4, anisotropy: 0.55 },
    "paint-matte":         { roughness: 0.88, metalness: 0,    envMapIntensity: 0.25 },
    "paint-semi-gloss":    { roughness: 0.42, metalness: 0,    clearcoat: 0.46, clearcoatRoughness: 0.52, envMapIntensity: 0.65 },
    "paint-high-gloss":    { roughness: 0.06, metalness: 0,    clearcoat: 0.96, clearcoatRoughness: 0.03, envMapIntensity: 1.0 },
  };
  return { color, ...(enhancements[type] || { roughness: 0.6, metalness: 0, envMapIntensity: 0.5 }) };
}

// ─── DragController ───────────────────────────────────────────────────────────
function DragController() {
  const { state, dispatch } = useViewer();
  const { camera, raycaster, pointer } = useThree();
  const planeRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const onUp = () => {
      if (!dragState.active || !dragState.objectId) return;
      const snap = state.gridSnap ? state.gridSize : 0.1;
      const x = Math.round(dragState.pos.x / snap) * snap;
      const z = Math.round(dragState.pos.z / snap) * snap;
      dispatch({
        type: "UPDATE_OBJECT",
        payload: { id: dragState.objectId, changes: { position: [x, dragState.objectY, z] } },
      });
      dragState.active = false;
      dragState.objectId = null;
      if (orbitRef.current) orbitRef.current.enabled = true;
    };
    window.addEventListener("pointerup", onUp);
    return () => window.removeEventListener("pointerup", onUp);
  }, [dispatch, state.gridSnap, state.gridSize]);

  useFrame(() => {
    if (!dragState.active || !planeRef.current) return;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObject(planeRef.current);
    if (hits.length > 0) {
      const snap = state.gridSnap ? state.gridSize : 0.1;
      const x = Math.round(hits[0].point.x / snap) * snap;
      const z = Math.round(hits[0].point.z / snap) * snap;
      dragState.pos.set(x, 0, z);
    }
  });

  return (
    <mesh ref={planeRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} visible={false}>
      <planeGeometry args={[1000, 1000]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

// ─── Scene object mesh ────────────────────────────────────────────────────────
function SceneObjectMesh({ obj, isSelected }: { obj: SceneObject; isSelected: boolean }) {
  const { state, dispatch } = useViewer();
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Memoize PBR material props — prevents re-creating the object every render
  const matProps = useMemo(() => {
    const matConfig = PBR_MATERIALS[obj.material];
    const color = matConfig?.properties.color || materialColors[obj.material] || "#cccccc";
    return createRealisticMaterial(color, obj.material);
  }, [obj.material]);

  // Memoize gable BufferGeometry — building it fresh every frame is expensive
  const gableGeo = useMemo(() => {
    if (obj.type !== "roof") return null;
    const style = obj.properties.style || "gable";
    if (style !== "gable") return null;
    const [rw, rh, rd] = obj.scale;
    const hw = rw / 2, hd = rd / 2;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array([
      -hw,0,hd,  hw,0,hd,  0,rh,hd,
      hw,0,-hd,  -hw,0,-hd,  0,rh,-hd,
      -hw,0,hd,  0,rh,hd,   0,rh,-hd, -hw,0,-hd,
      hw,0,hd,   hw,0,-hd,  0,rh,-hd,  0,rh,hd,
      -hw,0,-hd, -hw,0,hd,  hw,0,hd,  hw,0,-hd,
    ]), 3));
    geo.setIndex(new THREE.BufferAttribute(new Uint16Array([
      0,1,2,  3,4,5,
      6,7,8,  6,8,9,
      10,11,12, 10,12,13,
      14,15,16, 14,16,17,
    ]), 1));
    geo.computeVertexNormals();
    return geo;
  }, [obj.type, obj.scale[0], obj.scale[1], obj.scale[2], obj.properties.style]);

  // ── Pointer handlers ──────────────────────────────────────────────────────
  const handlePointerDown = useCallback(
    (e: any) => {
      if (state.mode !== "build" || state.activeTool !== "select" || obj.locked) return;
      e.stopPropagation();
      dispatch({ type: "SELECT_OBJECT", payload: obj.id });

      // Start drag
      dragState.active = true;
      dragState.objectId = obj.id;
      dragState.objectY = obj.position[1];
      dragState.pos.set(obj.position[0], 0, obj.position[2]);

      if (orbitRef.current) orbitRef.current.enabled = false;
    },
    [state.mode, state.activeTool, obj.id, obj.locked, obj.position, dispatch]
  );

  const handleClick = useCallback(
    (e: any) => {
      if (state.mode !== "build" || state.activeTool !== "select") return;
      e.stopPropagation();
      dispatch({ type: "SELECT_OBJECT", payload: obj.id });
    },
    [state.mode, state.activeTool, obj.id, dispatch]
  );

  // ── Real-time position update during drag (bypasses React state) ──────────
  useFrame(() => {
    if (!dragState.active || dragState.objectId !== obj.id) return;
    const snap = state.gridSnap ? state.gridSize : 0.1;
    const x = Math.round(dragState.pos.x / snap) * snap;
    const z = Math.round(dragState.pos.z / snap) * snap;
    const ref = groupRef.current || meshRef.current;
    if (ref) {
      ref.position.x = x;
      ref.position.z = z;
    }
  });

  if (!obj.visible) return null;

  // Check layer visibility
  const layer = state.layers.find((l) => l.id === obj.layer);
  if (layer && !layer.visible) return null;

  // ── Selection highlight helper ────────────────────────────────────────────
  const SelectBox = ({ s = obj.scale }: { s?: [number, number, number] }) => (
    isSelected ? (
      <mesh>
        <boxGeometry args={[s[0] + 0.06, s[1] + 0.06, s[2] + 0.06]} />
        <meshBasicMaterial color="#dc2626" wireframe />
      </mesh>
    ) : null
  );


  // ── Type-specific rendering ───────────────────────────────────────────────

  if (obj.type === "roof") {
    const style = obj.properties.style || "gable";
    const [rw, rh, rd] = obj.scale;
    const hw = rw / 2, hd = rd / 2;

    // Gable: custom triangular prism BufferGeometry
    const gableGeo = new THREE.BufferGeometry();
    gableGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array([
      -hw,0,hd,  hw,0,hd,  0,rh,hd,           // front tri
      hw,0,-hd,  -hw,0,-hd,  0,rh,-hd,         // back tri
      -hw,0,hd,  0,rh,hd,   0,rh,-hd, -hw,0,-hd, // left slope quad
      hw,0,hd,   hw,0,-hd,  0,rh,-hd,  0,rh,hd,  // right slope quad
      -hw,0,-hd, -hw,0,hd,  hw,0,hd,  hw,0,-hd,  // bottom quad
    ]), 3));
    gableGeo.setIndex(new THREE.BufferAttribute(new Uint16Array([
      0,1,2,  3,4,5,
      6,7,8,  6,8,9,
      10,11,12, 10,12,13,
      14,15,16, 14,16,17,
    ]), 1));
    gableGeo.computeVertexNormals();

    if (style === "flat") {
      return (
        <mesh ref={meshRef} position={obj.position} rotation={obj.rotation} castShadow receiveShadow onPointerDown={handlePointerDown} onClick={handleClick}>
          <boxGeometry args={obj.scale} />
          <meshPhysicalMaterial {...matProps} />
          <SelectBox />
        </mesh>
      );
    }
    if (style === "hip") {
      return (
        <mesh ref={meshRef} position={obj.position} rotation={obj.rotation} castShadow receiveShadow onPointerDown={handlePointerDown} onClick={handleClick}>
          <coneGeometry args={[Math.max(rw, rd) / 2, rh, 4]} />
          <meshPhysicalMaterial {...matProps} />
          <SelectBox />
        </mesh>
      );
    }
    // Gable (default)
    return (
      <group ref={meshRef as any} position={obj.position} rotation={obj.rotation} onPointerDown={handlePointerDown} onClick={handleClick}>
        <mesh geometry={gableGeo} castShadow receiveShadow>
          <meshPhysicalMaterial {...matProps} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0,  hd + 0.04]} castShadow>
          <boxGeometry args={[rw + 0.1, rh * 0.08, 0.04]} />
          <meshPhysicalMaterial color="#5a3e28" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, -hd - 0.04]} castShadow>
          <boxGeometry args={[rw + 0.1, rh * 0.08, 0.04]} />
          <meshPhysicalMaterial color="#5a3e28" roughness={0.8} />
        </mesh>
        <SelectBox s={[rw, rh, rd]} />
      </group>
    );
  }

  if (obj.type === "door") {
    const [dw, dh, dd] = obj.scale;
    const fw = 0.07; // frame width
    const fd = 0.06; // frame depth
    const goldMat = { color: "#c8a84b", metalness: 0.92, roughness: 0.08, clearcoat: 1.0 } as const;
    const panelH = dh * 0.38, panelW = dw * 0.7, panelD = 0.012;
    return (
      <group ref={groupRef} position={obj.position} rotation={obj.rotation} onPointerDown={handlePointerDown} onClick={handleClick}>
        {/* Door slab */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[dw, dh, dd]} />
          <meshPhysicalMaterial {...matProps} />
        </mesh>
        {/* Raised panels (front face) */}
        {[dh * 0.22, -dh * 0.22].map((py, i) => (
          <mesh key={i} position={[0, py, dd / 2 + panelD / 2]} castShadow>
            <boxGeometry args={[panelW, panelH, panelD]} />
            <meshPhysicalMaterial {...matProps} roughness={(matProps.roughness as number ?? 0.6) * 0.8} />
          </mesh>
        ))}
        {/* Door frame — top jamb */}
        <mesh position={[0, dh / 2 + fw / 2, 0]} castShadow>
          <boxGeometry args={[dw + fw * 2, fw, fd]} />
          <meshPhysicalMaterial color="#e8e4e0" roughness={0.5} />
        </mesh>
        {/* Side jambs */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * (dw / 2 + fw / 2), 0, 0]} castShadow>
            <boxGeometry args={[fw, dh, fd]} />
            <meshPhysicalMaterial color="#e8e4e0" roughness={0.5} />
          </mesh>
        ))}
        {/* Lever handle — front */}
        <mesh position={[dw * 0.35, -dh * 0.04, dd / 2 + 0.03]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.11, 10]} />
          <meshPhysicalMaterial {...goldMat} />
        </mesh>
        {/* Escutcheon plate */}
        <mesh position={[dw * 0.35, -dh * 0.04, dd / 2 + 0.018]}>
          <boxGeometry args={[0.035, 0.09, 0.01]} />
          <meshPhysicalMaterial {...goldMat} />
        </mesh>
        <SelectBox s={[dw + fw * 2, dh + fw, dd]} />
      </group>
    );
  }

  if (obj.type === "window") {
    const [ww, wh, wd] = obj.scale;
    const fw = 0.055; // frame rail width
    const glassMat = { color: "#cce8f4", transmission: 0.97, roughness: 0.02, metalness: 0.06, thickness: 0.5, ior: 1.52, clearcoat: 1.0, clearcoatRoughness: 0.03, envMapIntensity: 3.5 } as const;
    const frameMat = { color: "#f4f2f0", roughness: 0.38, metalness: 0.04, clearcoat: 0.3, clearcoatRoughness: 0.5, envMapIntensity: 0.6 } as const;
    return (
      <group ref={groupRef} position={obj.position} rotation={obj.rotation} onPointerDown={handlePointerDown} onClick={handleClick}>
        {/* Outer frame — 4 sides */}
        <mesh position={[0, wh / 2 - fw / 2, 0]} castShadow><boxGeometry args={[ww, fw, wd]} /><meshPhysicalMaterial {...frameMat} /></mesh>
        <mesh position={[0, -wh / 2 + fw / 2, 0]} castShadow><boxGeometry args={[ww, fw, wd]} /><meshPhysicalMaterial {...frameMat} /></mesh>
        <mesh position={[-ww / 2 + fw / 2, 0, 0]} castShadow><boxGeometry args={[fw, wh, wd]} /><meshPhysicalMaterial {...frameMat} /></mesh>
        <mesh position={[ww / 2 - fw / 2, 0, 0]} castShadow><boxGeometry args={[fw, wh, wd]} /><meshPhysicalMaterial {...frameMat} /></mesh>
        {/* Mullion (vertical centre bar) */}
        <mesh position={[0, 0, 0]} castShadow><boxGeometry args={[fw * 0.75, wh - fw * 2, wd]} /><meshPhysicalMaterial {...frameMat} /></mesh>
        {/* Rail (horizontal centre bar) */}
        <mesh position={[0, 0, 0]} castShadow><boxGeometry args={[ww - fw * 2, fw * 0.75, wd]} /><meshPhysicalMaterial {...frameMat} /></mesh>
        {/* 4 glass panes */}
        {[[-1, 1], [1, 1], [-1, -1], [1, -1]].map(([sx, sy], i) => (
          <mesh key={i} position={[sx * (ww / 4 + fw * 0.1), sy * (wh / 4 + fw * 0.1), 0]}>
            <boxGeometry args={[(ww - fw * 3) / 2, (wh - fw * 3) / 2, 0.022]} />
            <meshPhysicalMaterial {...glassMat} />
          </mesh>
        ))}
        {/* Window sill */}
        <mesh position={[0, -wh / 2 - 0.025, wd / 2 + 0.03]} castShadow receiveShadow>
          <boxGeometry args={[ww + 0.08, 0.04, wd + 0.08]} />
          <meshPhysicalMaterial color="#e8e4e0" roughness={0.5} />
        </mesh>
        <SelectBox s={[ww + fw, wh + fw, wd]} />
      </group>
    );
  }

  if (obj.type === "stair") {
    const steps = 12;
    const sh = obj.scale[1] / steps;
    const sd = obj.scale[2] / steps;
    const railingMat = { color: "#8a7060", roughness: 0.4, metalness: 0.3 } as const;
    const postSpacing = 3; // railing post every N steps
    return (
      <group ref={groupRef} position={obj.position} rotation={obj.rotation} onPointerDown={handlePointerDown} onClick={handleClick}>
        {/* Steps */}
        {Array.from({ length: steps }).map((_, i) => (
          <mesh key={i} position={[0, sh * (i + 0.5), sd * (i - steps / 2)]} castShadow receiveShadow>
            <boxGeometry args={[obj.scale[0], sh, sd]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
        ))}
        {/* Side stringers */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * (obj.scale[0] / 2 + 0.04), obj.scale[1] / 2, 0]}
            rotation={[Math.atan2(obj.scale[1], obj.scale[2]), 0, 0]} castShadow>
            <boxGeometry args={[0.04, Math.hypot(obj.scale[1], obj.scale[2]), 0.18]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
        ))}
        {/* Railing posts */}
        {Array.from({ length: Math.floor(steps / postSpacing) + 1 }).map((_, i) => {
          const si = i * postSpacing;
          const py = sh * si;
          const pz = sd * (si - steps / 2);
          return [-1, 1].map((s) => (
            <mesh key={`${s}-${i}`} position={[s * obj.scale[0] / 2, py + obj.scale[1] * 0.15, pz]} castShadow>
              <boxGeometry args={[0.035, obj.scale[1] * 0.28, 0.035]} />
              <meshPhysicalMaterial {...railingMat} />
            </mesh>
          ));
        })}
        {/* Handrails */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * obj.scale[0] / 2, obj.scale[1] * 0.9, 0]}
            rotation={[Math.atan2(obj.scale[1], obj.scale[2]), 0, 0]} castShadow>
            <boxGeometry args={[0.04, 0.04, Math.hypot(obj.scale[1], obj.scale[2])]} />
            <meshPhysicalMaterial {...railingMat} />
          </mesh>
        ))}
        {isSelected && (
          <mesh position={[0, obj.scale[1] / 2, 0]}>
            <boxGeometry args={[obj.scale[0] + 0.1, obj.scale[1] + 0.1, obj.scale[2] + 0.1]} />
            <meshBasicMaterial color="#dc2626" wireframe />
          </mesh>
        )}
      </group>
    );
  }

  if (obj.type === "road") {
    return (
      <group ref={groupRef} position={obj.position} rotation={obj.rotation} onPointerDown={handlePointerDown} onClick={handleClick}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={obj.scale} />
          <meshPhysicalMaterial color="#2a2a2a" roughness={0.95} metalness={0} />
        </mesh>
        {/* Centre dashes */}
        {Array.from({ length: Math.floor(obj.scale[0] / 1.5) }).map((_, i) => (
          <mesh key={i} position={[-obj.scale[0] / 2 + 0.75 + i * 1.5, obj.scale[1] / 2 + 0.005, 0]}>
            <boxGeometry args={[0.6, 0.01, 0.08]} />
            <meshBasicMaterial color="#f5f5f5" />
          </mesh>
        ))}
        {isSelected && <SelectBox s={obj.scale} />}
      </group>
    );
  }

  if (obj.type === "parking") {
    const lines = 6;
    return (
      <group ref={groupRef} position={obj.position} rotation={obj.rotation} onPointerDown={handlePointerDown} onClick={handleClick}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={obj.scale} />
          <meshPhysicalMaterial color="#2a2a2a" roughness={0.95} metalness={0} />
        </mesh>
        {Array.from({ length: lines }).map((_, i) => (
          <mesh key={i} position={[-obj.scale[0] / 2 + obj.scale[0] / (lines * 2) + i * (obj.scale[0] / lines), obj.scale[1] / 2 + 0.005, 0]}>
            <boxGeometry args={[0.05, 0.01, obj.scale[2] * 0.9]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
        {isSelected && <SelectBox s={obj.scale} />}
      </group>
    );
  }

  if (obj.type === "fence") {
    const posts = Math.max(2, Math.floor(obj.scale[0] / 1.2) + 1);
    return (
      <group ref={groupRef} position={obj.position} rotation={obj.rotation} onPointerDown={handlePointerDown} onClick={handleClick}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={obj.scale} />
          <meshPhysicalMaterial {...matProps} />
        </mesh>
        {Array.from({ length: posts }).map((_, i) => (
          <mesh key={i} position={[-obj.scale[0] / 2 + i * (obj.scale[0] / (posts - 1)), 0, 0]} castShadow>
            <boxGeometry args={[0.07, obj.scale[1] + 0.18, 0.07]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
        ))}
        {isSelected && <SelectBox s={obj.scale} />}
      </group>
    );
  }

  if (obj.type === "pool") {
    const [pw, ph, pd] = obj.scale;
    const wallThick = 0.18;
    return (
      <group ref={groupRef} position={obj.position} rotation={obj.rotation} onPointerDown={handlePointerDown} onClick={handleClick}>
        {/* Pool shell — 4 walls + floor */}
        {/* Floor */}
        <mesh position={[0, -ph / 2 + wallThick / 2, 0]} receiveShadow>
          <boxGeometry args={[pw, wallThick, pd]} />
          <meshPhysicalMaterial color="#d0e8f0" roughness={0.18} metalness={0} clearcoat={0.7} clearcoatRoughness={0.15} envMapIntensity={1.2} />
        </mesh>
        {/* Walls */}
        {[
          { pos: [0,  0, pd / 2 - wallThick / 2], scale: [pw, ph, wallThick] },
          { pos: [0,  0, -pd / 2 + wallThick / 2], scale: [pw, ph, wallThick] },
          { pos: [pw / 2 - wallThick / 2, 0, 0], scale: [wallThick, ph, pd] },
          { pos: [-pw / 2 + wallThick / 2, 0, 0], scale: [wallThick, ph, pd] },
        ].map((w, i) => (
          <mesh key={i} position={w.pos as [number,number,number]} castShadow receiveShadow>
            <boxGeometry args={w.scale as [number,number,number]} />
            <meshPhysicalMaterial color="#c8dce8" roughness={0.2} metalness={0} clearcoat={0.6} clearcoatRoughness={0.2} envMapIntensity={0.8} />
          </mesh>
        ))}
        {/* Water surface — animated shimmer */}
        <mesh position={[0, ph / 2 - 0.08, 0]}>
          <boxGeometry args={[pw - wallThick * 2, 0.04, pd - wallThick * 2]} />
          <meshPhysicalMaterial
            color="#1dd4f8"
            transparent
            opacity={0.82}
            roughness={0.04}
            metalness={0.08}
            transmission={0.88}
            thickness={3.0}
            ior={1.333}
            envMapIntensity={3.5}
            clearcoat={1.0}
            clearcoatRoughness={0.04}
          />
        </mesh>
        {/* Pool coping — stone lip around perimeter */}
        {[
          { pos: [0, ph / 2 + 0.04, pd / 2 + 0.05], scale: [pw + 0.22, 0.08, 0.12] },
          { pos: [0, ph / 2 + 0.04, -pd / 2 - 0.05], scale: [pw + 0.22, 0.08, 0.12] },
          { pos: [pw / 2 + 0.05, ph / 2 + 0.04, 0], scale: [0.12, 0.08, pd + 0.1] },
          { pos: [-pw / 2 - 0.05, ph / 2 + 0.04, 0], scale: [0.12, 0.08, pd + 0.1] },
        ].map((c, i) => (
          <mesh key={i} position={c.pos as [number,number,number]} castShadow receiveShadow>
            <boxGeometry args={c.scale as [number,number,number]} />
            <meshPhysicalMaterial color="#e8e2d8" roughness={0.38} metalness={0} clearcoat={0.55} clearcoatRoughness={0.35} envMapIntensity={0.7} />
          </mesh>
        ))}
        {isSelected && <SelectBox s={[pw + 0.3, ph + 0.15, pd + 0.3]} />}
      </group>
    );
  }

  if (obj.type === "deck") {
    return (
      <group ref={groupRef} position={obj.position} rotation={obj.rotation} onPointerDown={handlePointerDown} onClick={handleClick}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={obj.scale} />
          <meshPhysicalMaterial color="#8b6f4e" roughness={0.72} metalness={0} clearcoat={0.2} />
        </mesh>
        {/* Corner posts */}
        {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([sx, sz], i) => (
          <mesh key={i} position={[sx * (obj.scale[0] / 2 - 0.12), 0, sz * (obj.scale[2] / 2 - 0.12)]} castShadow>
            <boxGeometry args={[0.09, obj.scale[1], 0.09]} />
            <meshPhysicalMaterial color="#6b533e" roughness={0.78} />
          </mesh>
        ))}
        {isSelected && <SelectBox s={obj.scale} />}
      </group>
    );
  }

  if (obj.type === "landscape") {
    return (
      <group ref={groupRef} position={obj.position} rotation={obj.rotation} onPointerDown={handlePointerDown} onClick={handleClick}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={obj.scale} />
          <meshPhysicalMaterial color="#3d5c3d" roughness={0.95} metalness={0} />
        </mesh>
        {Array.from({ length: 9 }).map((_, i) => (
          <mesh key={i} position={[((i % 3) - 1) * 0.55, obj.scale[1] / 2 + 0.12, (Math.floor(i / 3) - 1) * 0.55]} castShadow>
            <sphereGeometry args={[0.1, 7, 5]} />
            <meshPhysicalMaterial color="#2d5a2d" roughness={0.9} />
          </mesh>
        ))}
        {isSelected && <SelectBox s={obj.scale} />}
      </group>
    );
  }

  if (obj.type === "kitchen") {
    return (
      <group ref={groupRef} position={obj.position} rotation={obj.rotation} onPointerDown={handlePointerDown} onClick={handleClick}>
        {/* Cabinet body */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={obj.scale} />
          <meshPhysicalMaterial {...matProps} />
        </mesh>
        {/* Countertop */}
        <mesh position={[0, obj.scale[1] / 2 + 0.02, 0]} castShadow>
          <boxGeometry args={[obj.scale[0], 0.04, obj.scale[2]]} />
          <meshPhysicalMaterial color="#d4cfc7" roughness={0.25} metalness={0.1} clearcoat={0.6} />
        </mesh>
        {/* Upper cabinets */}
        <mesh position={[0, obj.scale[1] / 2 + 0.65, -obj.scale[2] / 2 + 0.15]} castShadow>
          <boxGeometry args={[obj.scale[0], 0.55, 0.32]} />
          <meshPhysicalMaterial {...matProps} />
        </mesh>
        {isSelected && <SelectBox s={obj.scale} />}
      </group>
    );
  }

  if (obj.type === "bathroom") {
    return (
      <group ref={groupRef} position={obj.position} rotation={obj.rotation} onPointerDown={handlePointerDown} onClick={handleClick}>
        {/* Vanity */}
        <mesh position={[-obj.scale[0] / 4, 0, -obj.scale[2] / 4]} castShadow>
          <boxGeometry args={[obj.scale[0] / 2, 0.85, 0.5]} />
          <meshPhysicalMaterial color="#e8e4dc" roughness={0.3} metalness={0} />
        </mesh>
        {/* Toilet */}
        <mesh position={[obj.scale[0] / 4, 0.28, -obj.scale[2] / 4]} castShadow>
          <boxGeometry args={[0.38, 0.5, 0.5]} />
          <meshPhysicalMaterial color="#f5f5f5" roughness={0.2} metalness={0} />
        </mesh>
        {/* Bathtub */}
        <mesh position={[0, 0.2, obj.scale[2] / 4]} castShadow>
          <boxGeometry args={[obj.scale[0] * 0.75, 0.45, 0.72]} />
          <meshPhysicalMaterial color="#ffffff" roughness={0.15} metalness={0} clearcoat={0.8} />
        </mesh>
        {isSelected && <SelectBox s={obj.scale} />}
      </group>
    );
  }

  if (obj.type === "furniture") {
    const variant = obj.properties.variant || "sofa";

    if (variant.includes("bed")) {
      return (
        <group ref={groupRef} position={obj.position} rotation={obj.rotation} onPointerDown={handlePointerDown} onClick={handleClick}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[obj.scale[0], obj.scale[1] * 0.35, obj.scale[2]]} />
            <meshPhysicalMaterial color="#f5f0e8" roughness={0.8} metalness={0} />
          </mesh>
          {/* Headboard */}
          <mesh position={[0, obj.scale[1] * 0.45, -obj.scale[2] / 2 + 0.04]} castShadow>
            <boxGeometry args={[obj.scale[0], obj.scale[1] * 0.55, 0.08]} />
            <meshPhysicalMaterial {...matProps} roughness={0.5} />
          </mesh>
          {isSelected && <SelectBox s={obj.scale} />}
        </group>
      );
    }

    if (variant === "table") {
      const legH = obj.scale[1] * 0.82;
      const topThick = obj.scale[1] * 0.08;
      return (
        <group ref={groupRef} position={obj.position} rotation={obj.rotation} onPointerDown={handlePointerDown} onClick={handleClick}>
          {/* Tabletop */}
          <mesh position={[0, obj.scale[1] / 2 - topThick / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[obj.scale[0], topThick, obj.scale[2]]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          {/* 4 legs */}
          {[[-1,-1],[1,-1],[-1,1],[1,1]].map(([sx,sz],i) => (
            <mesh key={i} position={[sx*(obj.scale[0]/2-0.07), -obj.scale[1]/2+legH/2, sz*(obj.scale[2]/2-0.07)]} castShadow>
              <cylinderGeometry args={[0.028, 0.035, legH, 8]} />
              <meshPhysicalMaterial {...matProps} />
            </mesh>
          ))}
          {isSelected && <SelectBox s={obj.scale} />}
        </group>
      );
    }

    if (variant === "ottoman") {
      return (
        <group ref={groupRef} position={obj.position} rotation={obj.rotation} onPointerDown={handlePointerDown} onClick={handleClick}>
          {/* Body */}
          <mesh position={[0, obj.scale[1] * 0.3, 0]} castShadow receiveShadow>
            <boxGeometry args={[obj.scale[0], obj.scale[1] * 0.55, obj.scale[2]]} />
            <meshPhysicalMaterial {...matProps} roughness={0.72} />
          </mesh>
          {/* Legs */}
          {[[-1,-1],[1,-1],[-1,1],[1,1]].map(([sx,sz],i) => (
            <mesh key={i} position={[sx*(obj.scale[0]/2-0.06), -obj.scale[1]*0.18, sz*(obj.scale[2]/2-0.06)]} castShadow>
              <cylinderGeometry args={[0.022, 0.026, obj.scale[1] * 0.22, 6]} />
              <meshPhysicalMaterial color="#5c4033" roughness={0.7} />
            </mesh>
          ))}
          {isSelected && <SelectBox s={obj.scale} />}
        </group>
      );
    }

    // Sofa / chair — with individual cushions
    const isSofa = variant === "sofa";
    const cushionCount = isSofa ? 3 : 1;
    const cushionW = (obj.scale[0] - 0.28) / cushionCount;
    return (
      <group ref={groupRef} position={obj.position} rotation={obj.rotation} onPointerDown={handlePointerDown} onClick={handleClick}>
        {/* Base frame */}
        <mesh position={[0, -obj.scale[1] * 0.18, 0]} castShadow receiveShadow>
          <boxGeometry args={[obj.scale[0], obj.scale[1] * 0.22, obj.scale[2]]} />
          <meshPhysicalMaterial {...matProps} roughness={0.55} />
        </mesh>
        {/* Seat cushions */}
        {Array.from({ length: cushionCount }).map((_, i) => (
          <mesh key={i} position={[(-obj.scale[0]/2 + 0.14 + cushionW*(i+0.5)), obj.scale[1]*0.18, 0]} castShadow receiveShadow>
            <boxGeometry args={[cushionW - 0.04, obj.scale[1] * 0.32, obj.scale[2] * 0.72]} />
            <meshPhysicalMaterial {...matProps} roughness={0.72} />
          </mesh>
        ))}
        {/* Backrest */}
        <mesh position={[0, obj.scale[1] * 0.55, -obj.scale[2] / 2 + 0.07]} castShadow>
          <boxGeometry args={[obj.scale[0], obj.scale[1] * 0.55, 0.14]} />
          <meshPhysicalMaterial {...matProps} roughness={0.68} />
        </mesh>
        {/* Armrests */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * (obj.scale[0] / 2 - 0.07), obj.scale[1] * 0.28, 0]} castShadow>
            <boxGeometry args={[0.12, obj.scale[1] * 0.45, obj.scale[2]]} />
            <meshPhysicalMaterial {...matProps} roughness={0.55} />
          </mesh>
        ))}
        {/* Short legs */}
        {[[-1,-1],[1,-1],[-1,1],[1,1]].map(([sx,sz],i) => (
          <mesh key={i} position={[sx*(obj.scale[0]/2-0.1), -obj.scale[1]*0.32, sz*(obj.scale[2]/2-0.09)]} castShadow>
            <cylinderGeometry args={[0.025, 0.028, obj.scale[1]*0.16, 6]} />
            <meshPhysicalMaterial color="#4a3020" roughness={0.6} />
          </mesh>
        ))}
        {isSelected && <SelectBox s={obj.scale} />}
      </group>
    );
  }

  if (obj.type === "lighting") {
    const mount = (obj.properties.mount || "ceiling") as "ceiling" | "wall" | "floor";
    const intensity = obj.properties.intensity || 0.6;
    const isWall = mount === "wall";
    const isFloor = mount === "floor";
    const r = obj.scale[0];
    return (
      <group ref={groupRef} position={obj.position} rotation={obj.rotation} onPointerDown={handlePointerDown} onClick={handleClick}>
        {isFloor ? (
          /* Floor lamp: pole + shade */
          <>
            <mesh position={[0, obj.scale[1] * 0.4, 0]} castShadow>
              <cylinderGeometry args={[0.018, 0.022, obj.scale[1] * 0.8, 8]} />
              <meshPhysicalMaterial color="#c0c0c0" metalness={0.85} roughness={0.15} />
            </mesh>
            <mesh position={[0, obj.scale[1] * 0.82, 0]} castShadow>
              <cylinderGeometry args={[r * 0.55, r * 0.35, obj.scale[1] * 0.22, 16, 1, true]} />
              <meshPhysicalMaterial color="#f5f0e8" roughness={0.6} side={THREE.DoubleSide} />
            </mesh>
          </>
        ) : isWall ? (
          /* Wall sconce: backplate + arm + shade */
          <>
            <mesh position={[0, 0, -0.04]} castShadow>
              <boxGeometry args={[r * 0.9, r * 1.4, 0.06]} />
              <meshPhysicalMaterial color="#c8c8c8" metalness={0.7} roughness={0.2} />
            </mesh>
            <mesh position={[0, r * 0.5, r * 0.25]} castShadow>
              <cylinderGeometry args={[r * 0.38, r * 0.28, obj.scale[1] * 0.5, 12, 1, true]} />
              <meshPhysicalMaterial color="#f5f0e8" roughness={0.55} side={THREE.DoubleSide} />
            </mesh>
          </>
        ) : (
          /* Ceiling pendant: cord + shade */
          <>
            <mesh position={[0, obj.scale[1] * 0.42, 0]} castShadow>
              <cylinderGeometry args={[0.008, 0.008, obj.scale[1] * 0.65, 6]} />
              <meshPhysicalMaterial color="#333333" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0, 0]} castShadow>
              <cylinderGeometry args={[r * 0.52, r * 0.38, obj.scale[1] * 0.45, 16, 1, true]} />
              <meshPhysicalMaterial color="#e8e4dc" roughness={0.55} side={THREE.DoubleSide} />
            </mesh>
          </>
        )}
        {/* Bulb glow */}
        <mesh position={[0, isFloor ? obj.scale[1] * 0.78 : -obj.scale[1] * 0.1, 0]}>
          <sphereGeometry args={[r * 0.28, 10, 8]} />
          <meshBasicMaterial color="#fff9e0" />
        </mesh>
        <pointLight
          position={[0, isFloor ? obj.scale[1] * 0.75 : -obj.scale[1] * 0.2, 0]}
          intensity={intensity * 1.5}
          distance={8}
          color="#fff5e0"
          castShadow={false}
        />
        {isSelected && <SelectBox s={obj.scale} />}
      </group>
    );
  }

  if (obj.type === "vegetation") {
    const variant = obj.properties.variant || "oak";
    const tr = obj.scale[0] * 0.065;
    const th = obj.scale[1] * 0.42;
    const fr = obj.scale[0] * 0.5;
    const isPalm = variant === "palm";
    const isBirch = variant === "birch";
    const isMaple = variant === "maple";

    const leafColors: Record<string, string[]> = {
      oak:   ["#3a7044", "#3d7a48", "#2d6038"],
      maple: ["#4e8c3a", "#558040", "#3e7030"],
      birch: ["#5a9a40", "#62a848", "#4a8832"],
    };
    const leafPalette = leafColors[variant] || leafColors.oak;

    // Rich multi-cluster deciduous canopy
    const clusters = [
      { x: 0,          y: 0,          z: 0,          r: 1.0,  ci: 0 },
      { x: fr * 0.55,  y: fr * 0.28,  z: fr * 0.3,   r: 0.8,  ci: 1 },
      { x: -fr * 0.5,  y: fr * 0.22,  z: -fr * 0.3,  r: 0.78, ci: 2 },
      { x: fr * 0.22,  y: fr * 0.4,   z: -fr * 0.5,  r: 0.72, ci: 0 },
      { x: -fr * 0.35, y: -fr * 0.08, z: fr * 0.45,  r: 0.68, ci: 1 },
      { x: fr * 0.4,   y: fr * 0.15,  z: -fr * 0.2,  r: 0.6,  ci: 2 },
      { x: -fr * 0.25, y: fr * 0.5,   z: fr * 0.2,   r: 0.58, ci: 0 },
    ];

    return (
      <group ref={groupRef} position={obj.position} rotation={obj.rotation} onPointerDown={handlePointerDown} onClick={handleClick}>
        {/* Trunk */}
        <mesh position={[0, th / 2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[tr * 0.58, tr, th, 12]} />
          <meshPhysicalMaterial
            color={isBirch ? "#ddd8d0" : "#5d4037"}
            roughness={0.95}
            metalness={0}
            envMapIntensity={0.2}
          />
        </mesh>
        {/* Trunk bark detail band (birch marks) */}
        {isBirch && [th * 0.2, th * 0.45, th * 0.65].map((yy, i) => (
          <mesh key={i} position={[0, yy, 0]} castShadow>
            <cylinderGeometry args={[tr * 0.61, tr * 0.61, th * 0.04, 12]} />
            <meshPhysicalMaterial color="#1a1a1a" roughness={0.98} />
          </mesh>
        ))}

        {variant === "pine" ? (
          /* Pine: 4 layered cones — dense, dark, realistic */
          <>
            {[0.68, 0.46, 0.26, 0.10].map((yFrac, i) => (
              <mesh key={i} position={[0, th + obj.scale[1] * yFrac, 0]} castShadow>
                <coneGeometry args={[obj.scale[0] * (0.28 + i * 0.09), obj.scale[1] * 0.3, 8]} />
                <meshPhysicalMaterial
                  color={i === 0 ? "#243e24" : i === 1 ? "#2d4e2d" : "#345834"}
                  roughness={0.92}
                  metalness={0}
                  envMapIntensity={0.3}
                />
              </mesh>
            ))}
          </>
        ) : isPalm ? (
          /* Palm: thin segmented trunk + 9 arching fronds */
          <>
            {/* Trunk segments */}
            {Array.from({ length: 5 }).map((_, i) => (
              <mesh key={i} position={[0, th * 0.1 + (th * 0.18) * i, 0]} castShadow>
                <cylinderGeometry args={[tr * 0.52 - i * 0.008, tr * 0.58 - i * 0.008, th * 0.2, 10]} />
                <meshPhysicalMaterial color={i % 2 === 0 ? "#7a6040" : "#886848"} roughness={0.92} />
              </mesh>
            ))}
            {/* Fronds */}
            {Array.from({ length: 9 }).map((_, i) => {
              const angle = (i / 9) * Math.PI * 2;
              const droop = Math.PI / 5 + (i % 3) * 0.08;
              return (
                <mesh
                  key={i}
                  position={[Math.cos(angle) * fr * 0.12, th + obj.scale[1] * 0.4, Math.sin(angle) * fr * 0.12]}
                  rotation={[droop, angle, 0]}
                  castShadow
                >
                  <boxGeometry args={[fr * 0.1, fr * 1.2, 0.035]} />
                  <meshPhysicalMaterial color={i % 2 === 0 ? "#4a7a2a" : "#558030"} roughness={0.88} />
                </mesh>
              );
            })}
          </>
        ) : (
          /* Deciduous: rich 7-cluster canopy with colour variation */
          clusters.map((c, i) => (
            <mesh key={i} position={[c.x, th + obj.scale[1] * 0.3 + c.y, c.z]} castShadow receiveShadow>
              <sphereGeometry args={[fr * c.r, 10, 8]} />
              <meshPhysicalMaterial
                color={leafPalette[c.ci]}
                roughness={0.9}
                metalness={0}
                envMapIntensity={0.35}
                emissive={leafPalette[c.ci]}
                emissiveIntensity={isMaple ? 0.06 : 0.03}
              />
            </mesh>
          ))
        )}
        {isSelected && <SelectBox s={obj.scale} />}
      </group>
    );
  }

  // ── Default: wall / floor / terrain / generic ────────────────────────────
  return (
    <mesh
      ref={meshRef}
      position={obj.position}
      rotation={obj.rotation}
      castShadow
      receiveShadow
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      <boxGeometry args={obj.scale} />
      <meshPhysicalMaterial {...matProps} />
      {isSelected && (
        <mesh>
          <boxGeometry args={[obj.scale[0] + 0.06, obj.scale[1] + 0.06, obj.scale[2] + 0.06]} />
          <meshBasicMaterial color="#dc2626" wireframe />
        </mesh>
      )}
    </mesh>
  );
}

// ─── Scene objects collection ─────────────────────────────────────────────────
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


// ─── Dynamic lighting — ultra-realistic multi-source architectural illumination ──
function DynamicLighting() {
  const { state } = useViewer();
  const sunRef = useRef<THREE.DirectionalLight>(null!);
  const cycle = state.dayNightCycle;
  const season = state.season || "summer";

  const sunAngle = cycle * Math.PI * 2;
  const sinSun = Math.sin(sunAngle);
  const sunY = sinSun * 30;
  const sunX = Math.cos(sunAngle) * 25;
  const sunZ = Math.sin(sunAngle * 0.3) * 12;

  // Smooth intensity curves
  const rawSunIntensity = Math.max(0, sinSun);
  const sunIntensity = rawSunIntensity * rawSunIntensity * 3.2; // quadratic falloff
  const ambientIntensity = 0.08 + rawSunIntensity * 0.35;
  const isDusk = sinSun > -0.1 && sinSun < 0.3 && cycle > 0.4;
  const isNight = cycle < 0.22 || cycle > 0.78;

  const seasonColors: Record<string, { sky: [number, number, number]; ground: string; sun: string; dusk: string }> = {
    spring: { sky: [0.45, 0.72, 0.92], ground: "#4a7c4e", sun: "#fff5e0", dusk: "#ff9060" },
    summer: { sky: [0.38, 0.68, 0.96], ground: "#3d6b35", sun: "#fffaf0", dusk: "#ff8040" },
    autumn: { sky: [0.62, 0.52, 0.42], ground: "#5c4a3d", sun: "#ffe4b5", dusk: "#e06020" },
    winter: { sky: [0.72, 0.78, 0.88], ground: "#d8dce0", sun: "#f0f0ff", dusk: "#b080a0" },
  };
  const c = seasonColors[season] || seasonColors.summer;
  const sunColor = isDusk ? c.dusk : c.sun;

  return (
    <>
      {/* Primary sun — high-res cascaded shadow map */}
      <directionalLight
        ref={sunRef}
        position={[sunX, sunY, sunZ + 10]}
        intensity={sunIntensity}
        color={sunColor}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={160}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
        shadow-bias={-0.0002}
        shadow-normalBias={0.02}
        shadow-radius={3}
      />

      {/* Ambient base — subtle, prevents pitch-black areas */}
      <ambientLight intensity={ambientIntensity} color={new THREE.Color(...c.sky)} />

      {/* Hemisphere — sky-to-ground gradient fill */}
      <hemisphereLight args={[new THREE.Color(...c.sky), new THREE.Color(c.ground), 0.7]} />

      {/* Cool counter-key fill — softens harsh shadows from primary sun */}
      <directionalLight
        position={[-sunX * 0.6, Math.max(8, sunY * 0.65), -sunZ - 15]}
        intensity={sunIntensity * 0.22}
        color="#90b8e8"
      />

      {/* Rim / back light — adds depth and silhouette separation */}
      <directionalLight
        position={[-sunX * 0.3, sunY * 0.5 + 5, -20]}
        intensity={sunIntensity * 0.15}
        color="#c0d8f0"
      />

      {/* Warm ground bounce — simulates radiosity from sun-heated surfaces */}
      <directionalLight position={[0, -5, 0]} intensity={0.09} color={c.ground} />

      {/* Night: subtle cool moonlight when sun is down */}
      {isNight && (
        <>
          <directionalLight
            position={[-sunX, -sunY * 0.4 + 20, -10]}
            intensity={0.35}
            color="#8090c0"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={80}
            shadow-camera-left={-40}
            shadow-camera-right={40}
            shadow-camera-top={40}
            shadow-camera-bottom={-40}
            shadow-bias={-0.0005}
          />
          <ambientLight intensity={0.06} color="#404868" />
        </>
      )}

      {/* Dawn/dusk: warm atmospheric fill */}
      {isDusk && (
        <directionalLight
          position={[sunX * 1.5, 2, sunZ]}
          intensity={0.6}
          color="#ff7040"
        />
      )}
    </>
  );
}

// ─── Grid ─────────────────────────────────────────────────────────────────────
function SceneGrid() {
  const { state } = useViewer();
  if (!state.gridVisible) return null;
  return (
    <Grid
      position={[0, -0.01, 0]}
      args={[200, 200]}
      cellSize={state.gridSize}
      cellThickness={0.6}
      cellColor="#606060"
      sectionSize={state.gridSize * 5}
      sectionThickness={1.2}
      sectionColor="#404040"
      fadeDistance={80}
      fadeStrength={1.5}
      followCamera={false}
      infiniteGrid
    />
  );
}

// ─── Camera preset controller ─────────────────────────────────────────────────
const CAMERA_PRESETS: Record<string, { pos: [number, number, number]; look: [number, number, number] }> = {
  front:  { pos: [15, 8, 15],  look: [0, 0, 0] },
  back:   { pos: [-15, 8, -15], look: [0, 0, 0] },
  top:    { pos: [0, 35, 0],   look: [0, 0, 0] },
  side:   { pos: [22, 5, 0],   look: [0, 0, 0] },
  street: { pos: [10, 1.7, 10], look: [0, 2, 0] },
  aerial: { pos: [0, 55, 0],   look: [0, 0, 0] },
};

function CameraController() {
  const { camera } = useThree();
  const { state } = useViewer();
  useEffect(() => {
    if (state.cameraPreset && CAMERA_PRESETS[state.cameraPreset]) {
      const p = CAMERA_PRESETS[state.cameraPreset];
      camera.position.set(...p.pos);
      camera.lookAt(...p.look);
    }
  }, [state.cameraPreset, camera]);
  return null;
}

// ─── WASD keyboard navigation (orbit + non-physics FPS) ──────────────────────
// Disabled when physics is active — PhysicsPlayerController handles movement then.
function WASDCamera({ physicsActive }: { physicsActive: boolean }) {
  const { state } = useViewer();
  const { camera } = useThree();
  const keysRef = useRef(new Set<string>());
  const modeRef = useRef(state.cameraMode);
  modeRef.current = state.cameraMode;

  useEffect(() => {
    const keys = keysRef.current;
    const onDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT" || (e.target as HTMLElement)?.tagName === "TEXTAREA") return;
      keys.add(e.code);
    };
    const onUp = (e: KeyboardEvent) => keys.delete(e.code);
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      keys.clear();
    };
  }, []);

  useFrame((_, dt) => {
    // When physics is active in FPS mode, PhysicsPlayerController drives movement
    if (physicsActive && modeRef.current === "firstPerson") return;
    const keys = keysRef.current;
    if (keys.size === 0) return;
    const isFPS = modeRef.current === "firstPerson";
    const speed = (keys.has("ShiftLeft") || keys.has("ShiftRight") ? 14 : 6) * dt;

    const fwd = new THREE.Vector3();
    camera.getWorldDirection(fwd);
    if (!isFPS) { fwd.y = 0; fwd.normalize(); }
    const right = new THREE.Vector3().crossVectors(fwd, camera.up).normalize();

    const move = new THREE.Vector3();
    if (keys.has("KeyW")) move.addScaledVector(fwd, speed);
    if (keys.has("KeyS")) move.addScaledVector(fwd, -speed);
    if (keys.has("KeyA")) move.addScaledVector(right, -speed);
    if (keys.has("KeyD")) move.addScaledVector(right, speed);
    if (keys.has("KeyQ")) move.y += speed;
    if (keys.has("KeyE")) move.y -= speed;
    if (move.lengthSq() === 0) return;

    camera.position.add(move);
    // In orbit mode keep the target in sync so OrbitControls doesn't snap back
    if (!isFPS && orbitRef.current) {
      (orbitRef.current.target as THREE.Vector3).add(move);
    }
  });

  return null;
}

// ─── FOV controller — smoothly transitions between orbit (55°) and FPS (72°) ──
function FOVController() {
  const { camera } = useThree();
  const { state } = useViewer();
  useFrame(() => {
    const cam = camera as THREE.PerspectiveCamera;
    if (!cam.isPerspectiveCamera) return;
    const target = state.cameraMode === "firstPerson" ? 72 : 55;
    cam.fov += (target - cam.fov) * 0.08;
    cam.updateProjectionMatrix();
  });
  return null;
}

// ─── Measure Tool ─────────────────────────────────────────────────────────────
// Click once → place point A. Click again → place point B + show distance.
// Third click resets and starts a new measurement.
function MeasureTool() {
  const { state } = useViewer();
  const { camera, scene, gl } = useThree();
  const ptA = useRef<THREE.Vector3 | null>(null);
  const ptB = useRef<THREE.Vector3 | null>(null);
  const [tick, setTick] = useState(0); // force re-render when points change

  useEffect(() => {
    if (state.activeTool !== "measure") {
      ptA.current = null;
      ptB.current = null;
      setTick((t) => t + 1);
      return;
    }

    const raycaster = new THREE.Raycaster();

    const onClick = (e: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

      const targets: THREE.Object3D[] = [];
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh && obj.visible && !obj.userData.noCollide) {
          targets.push(obj);
        }
      });

      const hits = raycaster.intersectObjects(targets, false);
      if (hits.length === 0) return;
      const pt = hits[0].point.clone();

      if (!ptA.current) {
        ptA.current = pt;
        ptB.current = null;
      } else if (!ptB.current) {
        ptB.current = pt;
      } else {
        // Reset — start new
        ptA.current = pt;
        ptB.current = null;
      }
      setTick((t) => t + 1);
    };

    gl.domElement.addEventListener("click", onClick);
    return () => gl.domElement.removeEventListener("click", onClick);
  }, [state.activeTool, camera, scene, gl]);

  if (state.activeTool !== "measure") return null;

  const a = ptA.current;
  const b = ptB.current;
  const dist = a && b ? a.distanceTo(b) : null;
  const mid = a && b ? new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5) : null;

  return (
    <>
      {/* Point A */}
      {a && (
        <mesh position={a} userData={{ noCollide: true }}>
          <sphereGeometry args={[0.14, 10, 8]} />
          <meshBasicMaterial color="#ef4444" depthTest={false} />
        </mesh>
      )}
      {/* Point B */}
      {b && (
        <mesh position={b} userData={{ noCollide: true }}>
          <sphereGeometry args={[0.14, 10, 8]} />
          <meshBasicMaterial color="#ef4444" depthTest={false} />
        </mesh>
      )}
      {/* Measurement line */}
      {a && b && (
        <Line
          points={[a.toArray() as [number, number, number], b.toArray() as [number, number, number]]}
          color="#ef4444"
          lineWidth={2}
          dashed={false}
        />
      )}
      {/* Distance label */}
      {dist !== null && mid && (
        <Html
          position={mid.toArray() as [number, number, number]}
          center
          zIndexRange={[100, 0]}
        >
          <div
            style={{
              background: "rgba(0,0,0,0.82)",
              color: "#fff",
              fontSize: 12,
              fontFamily: "monospace",
              padding: "4px 10px",
              borderRadius: 8,
              whiteSpace: "nowrap",
              border: "1px solid rgba(239,68,68,0.6)",
              pointerEvents: "none",
            }}
          >
            ↔ {dist.toFixed(2)} m
          </div>
        </Html>
      )}
      {/* Hint when only A is placed */}
      {a && !b && (
        <Html
          position={a.toArray() as [number, number, number]}
          center
          zIndexRange={[100, 0]}
        >
          <div
            style={{
              background: "rgba(0,0,0,0.72)",
              color: "rgba(255,255,255,0.7)",
              fontSize: 10,
              fontFamily: "monospace",
              padding: "2px 8px",
              borderRadius: 6,
              whiteSpace: "nowrap",
              marginTop: -28,
              pointerEvents: "none",
            }}
          >
            Click second point
          </div>
        </Html>
      )}
    </>
  );
}

// ─── Section Tool ─────────────────────────────────────────────────────────────
// Clips the scene with a movable vertical plane so you can see inside buildings.
function SectionTool() {
  const { state } = useViewer();
  const { gl } = useThree();

  // Default: cut at x=0 (centre), normal pointing –x (shows right half)
  const [axis, setAxis] = useState<"x" | "y" | "z">("x");
  const [offset, setOffset] = useState(0);
  const planeRef = useRef(new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0));

  useEffect(() => {
    if (state.activeTool !== "section") {
      gl.clippingPlanes = [];
      return;
    }
    // Update plane based on current axis & offset
    const normals: Record<string, THREE.Vector3> = {
      x: new THREE.Vector3(-1, 0, 0),
      y: new THREE.Vector3(0, -1, 0),
      z: new THREE.Vector3(0, 0, -1),
    };
    planeRef.current.set(normals[axis], offset);
    gl.clippingPlanes = [planeRef.current];
    return () => {
      gl.clippingPlanes = [];
    };
  }, [state.activeTool, axis, offset, gl]);

  if (state.activeTool !== "section") return null;

  // Visual plane indicator
  const planePos: [number, number, number] =
    axis === "x" ? [offset, 0, 0] : axis === "y" ? [0, offset, 0] : [0, 0, offset];
  const planeRot: [number, number, number] =
    axis === "x" ? [0, Math.PI / 2, 0] : axis === "z" ? [0, 0, 0] : [-Math.PI / 2, 0, 0];

  const limits: Record<string, [number, number]> = { x: [-30, 30], y: [-1, 10], z: [-50, 50] };
  const [min, max] = limits[axis];

  return (
    <>
      {/* Visual cut plane */}
      <mesh position={planePos} rotation={planeRot} userData={{ noCollide: true }}>
        <planeGeometry args={[80, 40]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Cut edge line */}
      <mesh position={planePos} rotation={planeRot} userData={{ noCollide: true }}>
        <planeGeometry args={[80, 40]} />
        <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.25} />
      </mesh>

      {/* HTML control overlay */}
      <Html
        position={[planePos[0], planePos[1] + 12, planePos[2]]}
        center
        zIndexRange={[200, 0]}
      >
        <div
          style={{
            background: "rgba(0,0,0,0.85)",
            color: "#fff",
            fontSize: 11,
            fontFamily: "system-ui, sans-serif",
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid rgba(59,130,246,0.5)",
            userSelect: "none",
            minWidth: 200,
          }}
        >
          <div style={{ marginBottom: 6, fontWeight: 600, color: "#93c5fd" }}>
            Section Cut
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            {(["x", "y", "z"] as const).map((a) => (
              <button
                key={a}
                onClick={() => { setAxis(a); setOffset(0); }}
                style={{
                  padding: "2px 10px",
                  borderRadius: 6,
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: axis === a ? "#3b82f6" : "rgba(255,255,255,0.08)",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: axis === a ? 700 : 400,
                }}
              >
                {a.toUpperCase()}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>
            Offset: {offset.toFixed(1)} m
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={0.5}
            value={offset}
            onChange={(e) => setOffset(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#3b82f6" }}
          />
        </div>
      </Html>
    </>
  );
}

// ─── First-person pointer-lock wrapper ────────────────────────────────────────
function FPSCamera({ onLockChange }: { onLockChange: (locked: boolean) => void }) {
  return (
    <PointerLockControls
      onLock={() => onLockChange(true)}
      onUnlock={() => onLockChange(false)}
    />
  );
}

// ─── Main canvas ──────────────────────────────────────────────────────────────
export default function SceneCanvas() {
  const { state, dispatch } = useViewer();
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const isFPS = state.cameraMode === "firstPerson";
  const cameraModeRef = useRef(state.cameraMode);
  cameraModeRef.current = state.cameraMode;

  // Exit pointer lock when switching away from FPS via UI
  useEffect(() => {
    if (state.cameraMode !== "firstPerson" && document.pointerLockElement) {
      document.exitPointerLock();
    }
  }, [state.cameraMode]);

  // F key: toggle FPS mode
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT" || (e.target as HTMLElement)?.tagName === "TEXTAREA") return;
      if (e.key === "f" || e.key === "F") {
        if (cameraModeRef.current === "firstPerson") {
          document.exitPointerLock();
          dispatch({ type: "SET_CAMERA_MODE", payload: "orbit" });
        } else {
          dispatch({ type: "SET_CAMERA_MODE", payload: "firstPerson" });
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [dispatch]);

  return (
    <div className="flex-1 relative">
      <Canvas
        shadows="soft"
        camera={{ position: [22, 14, 22], fov: 50, near: 0.1, far: 2000 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          logarithmicDepthBuffer: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          powerPreference: "high-performance",
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.VSMShadowMap;
          gl.shadowMap.autoUpdate = true;
        }}
        onPointerMissed={() => {
          if (state.activeTool === "select" && !isFPS) {
            dispatch({ type: "SELECT_OBJECT", payload: null });
          }
        }}
      >
        <Suspense fallback={null}>
          {/* Environment map — powers reflections on metals, glass, marble */}
          <Environment preset="city" />

          <DynamicLighting />
          <SkyEnvironment />

          {/* Scene objects — always rendered; FPS controller handles collision via raycasting */}
          <SceneObjects />
          {state.neighborhoodMode && <NeighborhoodScene physicsActive={false} />}
          {/* FPS controller — pure raycasting, no WASM, no crashes */}
          {isFPS && <PhysicsPlayerController />}

          {/* NPCs — pure animation, no physics required */}
          {state.npcEnabled && NPC_WAYPOINTS.map((waypoints, i) => (
            <NPCCharacter
              key={i}
              startPosition={waypoints[0]}
              waypoints={waypoints}
              shirtColor={NPC_COLORS[i % NPC_COLORS.length].shirt}
              skinColor={NPC_COLORS[i % NPC_COLORS.length].skin}
              walkSpeed={2 + i * 0.3}
            />
          ))}

          <PlacementController />
          {!isFPS && <DragController />}
          <MeasureTool />
          <SectionTool />
          <SceneGrid />

          {!isFPS && (
            <ContactShadows
              position={[0, 0.005, 0]}
              opacity={0.38}
              blur={2.5}
              far={14}
              resolution={512}
              color="#000000"
              frames={1}
            />
          )}

          {/* WASD movement — skips FPS mode (PhysicsPlayerController handles that) */}
          <WASDCamera physicsActive={isFPS} />

          {/* Pointer-lock mouse-look for FPS mode */}
          {isFPS && <FPSCamera onLockChange={setIsPointerLocked} />}

          {/* OrbitControls only in non-FPS modes */}
          {!isFPS && (
            <OrbitControls
              ref={(c) => { orbitRef.current = c; }}
              enablePan
              enableZoom
              enableRotate
              minDistance={2}
              maxDistance={150}
              maxPolarAngle={Math.PI / 2.05}
              enableDamping
              dampingFactor={0.07}
              rotateSpeed={0.45}
              panSpeed={0.75}
              zoomSpeed={0.55}
              enabled={
                !dragState.active &&
                (state.mode !== "build" || state.activeTool === "select")
              }
            />
          )}

          <CameraController />
          <FOVController />

          <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
            <GizmoViewport labelColor="white" axisHeadScale={1} />
          </GizmoHelper>

          {/* Post-processing — bloom, AO, vignette, chromatic aberration */}
          <PostProcessingEffects />
        </Suspense>
      </Canvas>

      {/* FPS: click-to-enter overlay */}
      {isFPS && !isPointerLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-crosshair">
          <div className="bg-black/70 border border-white/10 rounded-2xl px-8 py-6 text-center">
            <div className="text-white font-semibold text-base mb-1">First-Person Mode</div>
            <div className="text-white/50 text-sm mb-4">Click anywhere to take control · Gravity &amp; collision active</div>
            <div className="flex flex-wrap justify-center gap-3 text-[11px] text-white/50">
              <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded mr-1">W A S D</kbd>move</span>
              <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded mr-1">Space</kbd>jump</span>
              <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded mr-1">Shift</kbd>sprint</span>
              <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded mr-1">F / Esc</kbd>exit</span>
            </div>
          </div>
        </div>
      )}

      {/* FPS: crosshair */}
      {isFPS && isPointerLocked && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-5 h-5">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/80 -translate-y-1/2" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/80 -translate-x-1/2" />
            <div className="absolute top-1/2 left-1/2 w-1 h-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60" />
          </div>
        </div>
      )}

      {/* FPS: hint strip */}
      {isFPS && isPointerLocked && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-black/50 rounded-lg px-3 py-1 pointer-events-none">
          <span className="text-white/50 text-[10px]">
            <kbd className="px-1 py-0.5 bg-white/10 rounded text-[9px]">Space</kbd> jump ·{" "}
            <kbd className="px-1 py-0.5 bg-white/10 rounded text-[9px]">Shift</kbd> sprint ·{" "}
            <kbd className="px-1 py-0.5 bg-white/10 rounded text-[9px]">F / Esc</kbd> exit FPS
          </span>
        </div>
      )}

      {/* Properties panel pull-tab — right edge of canvas, visible when object selected but panel is closed */}
      {state.selectedObjectId && !isFPS && state.rightPanel !== "properties" && (
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center justify-center gap-1 bg-card border border-border border-r-0 rounded-l-xl px-1.5 py-3 shadow-lg hover:bg-muted transition-colors"
          onClick={() => dispatch({ type: "SET_RIGHT_PANEL", payload: "properties" })}
          title="Open Properties panel"
        >
          <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <line x1="4" y1="6" x2="20" y2="6" strokeWidth="2" strokeLinecap="round"/>
            <line x1="4" y1="12" x2="14" y2="12" strokeWidth="2" strokeLinecap="round"/>
            <line x1="4" y1="18" x2="20" y2="18" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-[9px] font-semibold text-primary tracking-widest" style={{ writingMode: "vertical-rl" }}>PROPS</span>
        </button>
      )}

      {/* Floating selected-object action bar */}
      {state.selectedObjectId && !isFPS && (() => {
        const sel = state.objects.find(o => o.id === state.selectedObjectId);
        if (!sel) return null;
        return (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-black/75 backdrop-blur-md border border-white/12 rounded-xl px-2 py-1.5 shadow-xl">
            <span className="text-[11px] font-medium text-white/70 px-1.5 max-w-[140px] truncate">{sel.name}</span>
            <div className="w-px h-4 bg-white/15 mx-0.5" />
            <button
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] text-blue-300/80 hover:text-blue-200 hover:bg-blue-500/10 transition-colors"
              onClick={() => dispatch({ type: "SET_RIGHT_PANEL", payload: "properties" })}
              title="Open Properties panel"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="4" y1="6" x2="20" y2="6" strokeWidth="2" strokeLinecap="round"/><line x1="4" y1="12" x2="14" y2="12" strokeWidth="2" strokeLinecap="round"/><line x1="4" y1="18" x2="20" y2="18" strokeWidth="2" strokeLinecap="round"/></svg>
              Edit
            </button>
            <button
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              onClick={() => {
                if (!sel.locked) dispatch({ type: "DUPLICATE_OBJECT", payload: sel.id });
              }}
              title="Duplicate (Ctrl+D)"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="8" y="8" width="13" height="13" rx="2" strokeWidth="2"/><rect x="3" y="3" width="13" height="13" rx="2" strokeWidth="2"/></svg>
              Duplicate
            </button>
            <button
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              onClick={() => {
                if (!sel.locked) dispatch({ type: "DELETE_OBJECT", payload: sel.id });
              }}
              title="Delete (Del)"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" strokeWidth="2"/><path d="M19 6l-1 14H6L5 6" strokeWidth="2"/><path d="M10 11v6M14 11v6" strokeWidth="2"/></svg>
              Delete
            </button>
            <button
              className="ml-0.5 w-5 h-5 flex items-center justify-center rounded-md text-white/30 hover:text-white/70 hover:bg-white/10 transition-colors"
              onClick={() => dispatch({ type: "SELECT_OBJECT", payload: null })}
              title="Deselect (Esc)"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" strokeWidth="2.5"/><line x1="6" y1="6" x2="18" y2="18" strokeWidth="2.5"/></svg>
            </button>
          </div>
        );
      })()}

      {/* Status bar */}
      <div className="absolute bottom-3 left-3 glass rounded-lg px-3 py-1.5 flex items-center gap-3 pointer-events-none">
        <span className="text-[11px] font-semibold text-foreground">
          {state.mode === "build" ? "Build" : "View"}
        </span>
        <div className="h-3 w-px bg-border" />
        <span className="text-[10px] text-muted-foreground">{state.objects.length} objects</span>
        <div className="h-3 w-px bg-border" />
        <span className="text-[10px] text-muted-foreground capitalize">{state.activeTool}</span>
        <div className="h-3 w-px bg-border" />
        <span className="text-[10px] text-muted-foreground capitalize">{state.season} · {state.cameraMode}</span>
        {state.gridSnap && (
          <>
            <div className="h-3 w-px bg-border" />
            <span className="text-[10px] text-primary">⊞ Snap {state.gridSize}m</span>
          </>
        )}
      </div>

      {/* Hint bar */}
      <div className="absolute bottom-3 right-3 glass rounded-lg px-3 py-1.5 pointer-events-none">
        <p className="text-[10px] text-muted-foreground">
          {isFPS
            ? isPointerLocked
              ? "Mouse look · WASD move · Space jump · Shift sprint · F/Esc exit · Gravity active"
              : "Click to enter FPS · F to toggle · Gravity & collision active"
            : state.mode === "build" && state.activeTool !== "select"
            ? "Move mouse → place preview · Click → place · R rotate · Esc exit"
            : state.mode === "build"
            ? "Click select · Drag move · Del delete · Ctrl+D duplicate · WASD pan · F for FPS"
            : "Scroll zoom · Drag orbit · WASD fly · F for FPS mode"}
        </p>
      </div>
    </div>
  );
}
