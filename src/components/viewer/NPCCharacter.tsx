import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface NPCProps {
  startPosition: [number, number, number];
  waypoints: [number, number, number][];
  shirtColor?: string;
  skinColor?: string;
  walkSpeed?: number;
}

export function NPCCharacter({
  startPosition,
  waypoints,
  shirtColor = "#4a90d9",
  skinColor = "#f5c5a3",
  walkSpeed = 2.5,
}: NPCProps) {
  const groupRef = useRef<THREE.Group>(null);
  const legLRef = useRef<THREE.Mesh>(null);
  const legRRef = useRef<THREE.Mesh>(null);
  const armLRef = useRef<THREE.Mesh>(null);
  const armRRef = useRef<THREE.Mesh>(null);
  const waypointIndex = useRef(0);
  const baseY = useRef(startPosition[1]);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group || waypoints.length === 0) return;

    const t = clock.getElapsedTime();
    const target = waypoints[waypointIndex.current];
    const targetVec = new THREE.Vector3(target[0], baseY.current, target[2]);
    const pos = group.position;

    const dir = new THREE.Vector3().subVectors(targetVec, pos);
    dir.y = 0;
    const dist = dir.length();

    if (dist < 0.4) {
      // Advance to next waypoint
      waypointIndex.current = (waypointIndex.current + 1) % waypoints.length;
    } else {
      // Move toward waypoint
      dir.normalize();
      pos.addScaledVector(dir, walkSpeed * 0.016);
      pos.y = baseY.current;

      // Face direction of movement
      group.rotation.y = Math.atan2(dir.x, dir.z);

      // Walk animation
      const swing = Math.sin(t * 6) * 0.5;
      if (legLRef.current) legLRef.current.rotation.x = swing;
      if (legRRef.current) legRRef.current.rotation.x = -swing;
      if (armLRef.current) armLRef.current.rotation.x = -swing * 0.6;
      if (armRRef.current) armRRef.current.rotation.x = swing * 0.6;

      // Body bob
      group.position.y = baseY.current + Math.abs(Math.sin(t * 6)) * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={startPosition}>
      {/* Head */}
      <mesh position={[0, 1.75, 0]} castShadow>
        <sphereGeometry args={[0.2, 10, 10]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      {/* Hair */}
      <mesh position={[0, 1.92, 0]}>
        <sphereGeometry args={[0.21, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#3a2010" />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[0.42, 0.6, 0.26]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>
      {/* Left Arm */}
      <mesh ref={armLRef} position={[-0.31, 1.2, 0]} castShadow>
        <boxGeometry args={[0.16, 0.5, 0.16]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>
      {/* Right Arm */}
      <mesh ref={armRRef} position={[0.31, 1.2, 0]} castShadow>
        <boxGeometry args={[0.16, 0.5, 0.16]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>
      {/* Left Hand */}
      <mesh position={[-0.31, 0.93, 0]}>
        <sphereGeometry args={[0.09, 6, 6]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      {/* Right Hand */}
      <mesh position={[0.31, 0.93, 0]}>
        <sphereGeometry args={[0.09, 6, 6]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      {/* Left Leg */}
      <mesh ref={legLRef} position={[-0.13, 0.6, 0]} castShadow>
        <boxGeometry args={[0.16, 0.55, 0.18]} />
        <meshStandardMaterial color="#1a3a6e" />
      </mesh>
      {/* Right Leg */}
      <mesh ref={legRRef} position={[0.13, 0.6, 0]} castShadow>
        <boxGeometry args={[0.16, 0.55, 0.18]} />
        <meshStandardMaterial color="#1a3a6e" />
      </mesh>
      {/* Left Shoe */}
      <mesh position={[-0.13, 0.3, 0.05]}>
        <boxGeometry args={[0.18, 0.1, 0.3]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Right Shoe */}
      <mesh position={[0.13, 0.3, 0.05]}>
        <boxGeometry args={[0.18, 0.1, 0.3]} />
        <meshStandardMaterial color="#222" />
      </mesh>
    </group>
  );
}
