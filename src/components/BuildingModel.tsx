import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Wall({ position, size, color = "#e8e4e0" }: { position: [number, number, number]; size: [number, number, number]; color?: string }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}

function Floor({ position, size }: { position: [number, number, number]; size: [number, number] }) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial color="#f0ece8" roughness={0.9} />
    </mesh>
  );
}

function Window({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[1.2, 1.4, 0.08]} />
      <meshPhysicalMaterial
        color="#88b4d4"
        transparent
        opacity={0.4}
        roughness={0.05}
        metalness={0.1}
        transmission={0.6}
      />
    </mesh>
  );
}

export default function BuildingModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ground floor */}
      <Floor position={[0, 0, 0]} size={[12, 10]} />

      {/* Exterior walls - Ground floor */}
      <Wall position={[0, 1.5, -5]} size={[12, 3, 0.2]} />
      <Wall position={[0, 1.5, 5]} size={[12, 3, 0.2]} />
      <Wall position={[-6, 1.5, 0]} size={[0.2, 3, 10]} />
      <Wall position={[6, 1.5, 0]} size={[0.2, 3, 10]} />

      {/* Interior walls - Ground floor */}
      <Wall position={[0, 1.5, 0]} size={[0.15, 3, 6]} color="#d9d5d0" />
      <Wall position={[-3, 1.5, 3]} size={[6, 3, 0.15]} color="#d9d5d0" />

      {/* Second floor slab */}
      <Floor position={[0, 3, 0]} size={[12, 10]} />

      {/* Exterior walls - Second floor */}
      <Wall position={[0, 4.5, -5]} size={[12, 3, 0.2]} />
      <Wall position={[0, 4.5, 5]} size={[12, 3, 0.2]} />
      <Wall position={[-6, 4.5, 0]} size={[0.2, 3, 10]} />
      <Wall position={[6, 4.5, 0]} size={[0.2, 3, 10]} />

      {/* Interior wall - Second floor */}
      <Wall position={[2, 4.5, 0]} size={[0.15, 3, 10]} color="#d9d5d0" />

      {/* Roof */}
      <mesh position={[0, 6.5, 0]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[8, 2.5, 4]} />
        <meshStandardMaterial color="#8b7d6b" roughness={0.7} />
      </mesh>

      {/* Windows */}
      <Window position={[-3, 1.5, -5.05]} />
      <Window position={[3, 1.5, -5.05]} />
      <Window position={[-3, 4.5, -5.05]} />
      <Window position={[3, 4.5, -5.05]} />
      <Window position={[-3, 1.5, 5.05]} />
      <Window position={[3, 1.5, 5.05]} />
      <Window position={[-3, 4.5, 5.05]} />
      <Window position={[3, 4.5, 5.05]} />
      <Window position={[-6.05, 1.5, -2]} rotation={[0, Math.PI / 2, 0]} />
      <Window position={[-6.05, 1.5, 2]} rotation={[0, Math.PI / 2, 0]} />
      <Window position={[6.05, 1.5, -2]} rotation={[0, Math.PI / 2, 0]} />
      <Window position={[6.05, 4.5, -2]} rotation={[0, Math.PI / 2, 0]} />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#d4d0c8" roughness={1} />
      </mesh>
    </group>
  );
}
