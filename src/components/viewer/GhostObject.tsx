import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MaterialType } from "@/contexts/ViewerContext";

interface GhostObjectProps {
  type: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  material: MaterialType;
  properties?: Record<string, any>;
  isValid: boolean;
}

export default function GhostObject({
  type,
  position,
  rotation,
  scale,
  isValid,
}: GhostObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Create materials ONCE — update imperatively to avoid dispose/recreate on every render
  const ghostMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#4ade80",
        transparent: true,
        opacity: 0.45,
        roughness: 0.4,
        metalness: 0.1,
        transmission: 0.25,
        thickness: 0.5,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    []
  );

  const wireMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#22c55e",
        wireframe: true,
        transparent: true,
        opacity: 0.9,
      }),
    []
  );

  // Update color when validity changes — imperative, no material recreation
  useEffect(() => {
    ghostMat.color.setStyle(isValid ? "#4ade80" : "#f87171");
    wireMat.color.setStyle(isValid ? "#22c55e" : "#ef4444");
  }, [isValid, ghostMat, wireMat]);

  // Pulse the ghost opacity smoothly each frame
  useFrame((state) => {
    const pulse = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
    ghostMat.opacity = isValid ? 0.35 + pulse : 0.15;
  });

  // ─── Wall ───────────────────────────────────────────────────────────────────
  if (type === "wall") {
    return (
      <group ref={groupRef} position={position} rotation={rotation}>
        <mesh castShadow>
          <boxGeometry args={scale} />
          <primitive object={ghostMat} attach="material" />
        </mesh>
        <mesh>
          <boxGeometry args={scale} />
          <primitive object={wireMat} attach="material" />
        </mesh>
        {/* Placement arrow above */}
        <mesh position={[0, scale[1] / 2 + 0.35, 0]}>
          <coneGeometry args={[0.2, 0.4, 6]} />
          <meshBasicMaterial color={isValid ? "#22c55e" : "#ef4444"} transparent opacity={0.9} />
        </mesh>
      </group>
    );
  }

  // ─── Door ────────────────────────────────────────────────────────────────────
  if (type === "door") {
    return (
      <group ref={groupRef} position={position} rotation={rotation}>
        <mesh ref={meshRef} castShadow>
          <boxGeometry args={scale} />
          <primitive object={ghostMat} attach="material" />
        </mesh>
        <mesh>
          <boxGeometry args={scale} />
          <primitive object={wireMat} attach="material" />
        </mesh>
        {/* Swing arc */}
        <mesh position={[scale[0] / 2, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[scale[0] * 0.9, scale[0], 16, 1, 0, Math.PI / 2]} />
          <meshBasicMaterial color="#4ade80" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      </group>
    );
  }

  // ─── Window ──────────────────────────────────────────────────────────────────
  if (type === "window") {
    return (
      <group ref={groupRef} position={position} rotation={rotation}>
        <mesh ref={meshRef} castShadow>
          <boxGeometry args={scale} />
          <primitive object={ghostMat} attach="material" />
        </mesh>
        <mesh>
          <boxGeometry args={scale} />
          <primitive object={wireMat} attach="material" />
        </mesh>
        {/* Cross dividers */}
        <mesh position={[0, 0, scale[2] / 2 + 0.01]}>
          <boxGeometry args={[scale[0], 0.04, 0.02]} />
          <meshBasicMaterial color="#4ade80" transparent opacity={0.8} />
        </mesh>
        <mesh position={[0, 0, scale[2] / 2 + 0.01]}>
          <boxGeometry args={[0.04, scale[1], 0.02]} />
          <meshBasicMaterial color="#4ade80" transparent opacity={0.8} />
        </mesh>
      </group>
    );
  }

  // ─── Floor ───────────────────────────────────────────────────────────────────
  if (type === "floor") {
    return (
      <group ref={groupRef} position={position} rotation={rotation}>
        <mesh ref={meshRef} castShadow>
          <boxGeometry args={scale} />
          <primitive object={ghostMat} attach="material" />
        </mesh>
        <mesh position={[0, scale[1] / 2 + 0.01, 0]}>
          <boxGeometry args={scale} />
          <primitive object={wireMat} attach="material" />
        </mesh>
        <gridHelper
          args={[Math.max(scale[0], scale[2]), Math.max(2, Math.round(Math.max(scale[0], scale[2]))), "#4ade80", "#4ade80"]}
          position={[0, scale[1] / 2 + 0.02, 0]}
        />
      </group>
    );
  }

  // ─── Roof ────────────────────────────────────────────────────────────────────
  if (type === "roof") {
    return (
      <group ref={groupRef} position={position} rotation={rotation}>
        <mesh ref={meshRef} castShadow>
          <coneGeometry args={[scale[0] / 2, scale[1], 4]} />
          <primitive object={ghostMat} attach="material" />
        </mesh>
        <mesh>
          <coneGeometry args={[scale[0] / 2, scale[1], 4]} />
          <primitive object={wireMat} attach="material" />
        </mesh>
      </group>
    );
  }

  // ─── Stairs ──────────────────────────────────────────────────────────────────
  if (type === "stair") {
    const steps = 10;
    const sh = scale[1] / steps;
    const sd = scale[2] / steps;
    return (
      <group ref={groupRef} position={position} rotation={rotation}>
        {Array.from({ length: steps }).map((_, i) => (
          <mesh key={i} position={[0, sh * (i + 0.5), sd * (i - steps / 2)]}>
            <boxGeometry args={[scale[0], sh, sd]} />
            <primitive object={i === 0 ? ghostMat : ghostMat} attach="material" />
          </mesh>
        ))}
      </group>
    );
  }

  // ─── Vegetation ──────────────────────────────────────────────────────────────
  if (type === "vegetation") {
    return (
      <group ref={groupRef} position={position} rotation={rotation}>
        <mesh position={[0, scale[1] * 0.22, 0]}>
          <cylinderGeometry args={[scale[0] * 0.05, scale[0] * 0.08, scale[1] * 0.45, 8]} />
          <primitive object={ghostMat} attach="material" />
        </mesh>
        <mesh ref={meshRef} position={[0, scale[1] * 0.62, 0]}>
          <sphereGeometry args={[scale[0] / 2, 8, 6]} />
          <primitive object={ghostMat} attach="material" />
        </mesh>
        {/* Ground footprint */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <circleGeometry args={[scale[0] / 2, 16]} />
          <meshBasicMaterial color="#4ade80" transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
      </group>
    );
  }

  // ─── Fence ───────────────────────────────────────────────────────────────────
  if (type === "fence") {
    return (
      <group ref={groupRef} position={position} rotation={rotation}>
        <mesh ref={meshRef}>
          <boxGeometry args={scale} />
          <primitive object={ghostMat} attach="material" />
        </mesh>
        <mesh>
          <boxGeometry args={scale} />
          <primitive object={wireMat} attach="material" />
        </mesh>
      </group>
    );
  }

  // ─── Pool ────────────────────────────────────────────────────────────────────
  if (type === "pool") {
    return (
      <group ref={groupRef} position={position} rotation={rotation}>
        <mesh ref={meshRef}>
          <boxGeometry args={[scale[0], scale[1] * 0.3, scale[2]]} />
          <primitive object={ghostMat} attach="material" />
        </mesh>
        <mesh>
          <boxGeometry args={[scale[0], scale[1] * 0.3, scale[2]]} />
          <primitive object={wireMat} attach="material" />
        </mesh>
        <mesh position={[0, scale[1] * 0.12, 0]}>
          <boxGeometry args={[scale[0] - 0.2, 0.06, scale[2] - 0.2]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} />
        </mesh>
      </group>
    );
  }

  // ─── Deck ────────────────────────────────────────────────────────────────────
  if (type === "deck") {
    return (
      <group ref={groupRef} position={position} rotation={rotation}>
        <mesh ref={meshRef}>
          <boxGeometry args={scale} />
          <primitive object={ghostMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={scale} />
          <primitive object={wireMat} attach="material" />
        </mesh>
      </group>
    );
  }

  // ─── Terrain ─────────────────────────────────────────────────────────────────
  if (type === "terrain") {
    return (
      <group ref={groupRef} position={position} rotation={rotation}>
        <mesh ref={meshRef}>
          <boxGeometry args={scale} />
          <primitive object={ghostMat} attach="material" />
        </mesh>
        <mesh>
          <boxGeometry args={scale} />
          <primitive object={wireMat} attach="material" />
        </mesh>
      </group>
    );
  }

  // ─── Road / Parking ──────────────────────────────────────────────────────────
  if (type === "road" || type === "parking") {
    return (
      <group ref={groupRef} position={position} rotation={rotation}>
        <mesh ref={meshRef}>
          <boxGeometry args={scale} />
          <primitive object={ghostMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={scale} />
          <primitive object={wireMat} attach="material" />
        </mesh>
      </group>
    );
  }

  // ─── Landscape ───────────────────────────────────────────────────────────────
  if (type === "landscape") {
    return (
      <group ref={groupRef} position={position} rotation={rotation}>
        <mesh ref={meshRef}>
          <boxGeometry args={scale} />
          <primitive object={ghostMat} attach="material" />
        </mesh>
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={i} position={[(i - 2) * 0.4, scale[1] / 2 + 0.15, 0]}>
            <sphereGeometry args={[0.13, 6, 4]} />
            <meshBasicMaterial color="#4ade80" transparent opacity={0.6} />
          </mesh>
        ))}
      </group>
    );
  }

  // ─── Kitchen ─────────────────────────────────────────────────────────────────
  if (type === "kitchen") {
    return (
      <group ref={groupRef} position={position} rotation={rotation}>
        <mesh ref={meshRef}>
          <boxGeometry args={scale} />
          <primitive object={ghostMat} attach="material" />
        </mesh>
        <mesh position={[0, scale[1], 0]}>
          <boxGeometry args={[scale[0], 0.05, scale[2]]} />
          <primitive object={wireMat} attach="material" />
        </mesh>
      </group>
    );
  }

  // ─── Bathroom ────────────────────────────────────────────────────────────────
  if (type === "bathroom" || type === "furniture") {
    return (
      <group ref={groupRef} position={position} rotation={rotation}>
        <mesh ref={meshRef}>
          <boxGeometry args={scale} />
          <primitive object={ghostMat} attach="material" />
        </mesh>
        <mesh>
          <boxGeometry args={scale} />
          <primitive object={wireMat} attach="material" />
        </mesh>
      </group>
    );
  }

  // ─── Lighting ────────────────────────────────────────────────────────────────
  if (type === "lighting") {
    return (
      <group ref={groupRef} position={position} rotation={rotation}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[scale[0] * 0.6, 10, 7]} />
          <primitive object={ghostMat} attach="material" />
        </mesh>
        {/* Light range indicator */}
        <mesh>
          <sphereGeometry args={[2, 14, 10]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.06} side={THREE.DoubleSide} />
        </mesh>
      </group>
    );
  }

  // ─── Default fallback ────────────────────────────────────────────────────────
  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <mesh ref={meshRef}>
        <boxGeometry args={scale} />
        <primitive object={ghostMat} attach="material" />
      </mesh>
      <mesh>
        <boxGeometry args={scale} />
        <primitive object={wireMat} attach="material" />
      </mesh>
    </group>
  );
}
