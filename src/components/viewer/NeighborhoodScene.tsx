import { ReactNode } from "react";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Reusable building geometry helpers
// ---------------------------------------------------------------------------

function NeighborHouse({
  position,
  rotation = 0,
  wallColor = "#e8ddd0",
  roofColor = "#8b4513",
  trimColor = "#ffffff",
  variant = 0,
}: {
  position: [number, number, number];
  rotation?: number;
  wallColor?: string;
  roofColor?: string;
  trimColor?: string;
  variant?: number;
}) {
  const w = 6; // house width
  const d = 5; // house depth
  const h = 2.8; // wall height

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Foundation slab */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[w + 0.4, 0.2, d + 0.4]} />
        <meshStandardMaterial color="#aaa" roughness={0.8} />
      </mesh>
      {/* Front wall */}
      <mesh position={[0, h / 2, -d / 2]} castShadow receiveShadow>
        <boxGeometry args={[w, h, 0.25]} />
        <meshStandardMaterial color={wallColor} roughness={0.7} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, h / 2, d / 2]} castShadow receiveShadow>
        <boxGeometry args={[w, h, 0.25]} />
        <meshStandardMaterial color={wallColor} roughness={0.7} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-w / 2, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.25, h, d]} />
        <meshStandardMaterial color={wallColor} roughness={0.7} />
      </mesh>
      {/* Right wall */}
      <mesh position={[w / 2, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.25, h, d]} />
        <meshStandardMaterial color={wallColor} roughness={0.7} />
      </mesh>
      {/* Floor */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[w, 0.15, d]} />
        <meshStandardMaterial color="#c8b49a" roughness={0.9} />
      </mesh>
      {/* Ceiling */}
      <mesh position={[0, h, 0]}>
        <boxGeometry args={[w, 0.15, d]} />
        <meshStandardMaterial color={wallColor} roughness={0.8} />
      </mesh>
      {/* Gable roof */}
      <mesh position={[0, h + 1.1, 0]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[Math.sqrt(w * w + d * d) / 2 + 0.3, 2.2, 4]} />
        <meshStandardMaterial color={roofColor} roughness={0.6} />
      </mesh>
      {/* Chimney */}
      <mesh position={[w / 4, h + 1.5, 0]} castShadow>
        <boxGeometry args={[0.45, 1.2, 0.45]} />
        <meshStandardMaterial color="#8b3a3a" roughness={0.8} />
      </mesh>
      {/* Front door */}
      <mesh position={[0, 1.1, -d / 2 - 0.01]} castShadow>
        <boxGeometry args={[1.0, 2.2, 0.15]} />
        <meshStandardMaterial color="#5c3a1e" roughness={0.5} />
      </mesh>
      {/* Door knob */}
      <mesh position={[0.38, 1.1, -d / 2 - 0.1]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#d4a017" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Window left */}
      <mesh position={[-1.8, 1.4, -d / 2 - 0.01]}>
        <boxGeometry args={[1.0, 1.0, 0.1]} />
        <meshStandardMaterial color={trimColor} roughness={0.4} />
      </mesh>
      <mesh position={[-1.8, 1.4, -d / 2 - 0.05]}>
        <boxGeometry args={[0.85, 0.85, 0.06]} />
        <meshStandardMaterial color="#aaddff" transparent opacity={0.5} metalness={0.1} roughness={0.05} />
      </mesh>
      {/* Window right */}
      <mesh position={[1.8, 1.4, -d / 2 - 0.01]}>
        <boxGeometry args={[1.0, 1.0, 0.1]} />
        <meshStandardMaterial color={trimColor} roughness={0.4} />
      </mesh>
      <mesh position={[1.8, 1.4, -d / 2 - 0.05]}>
        <boxGeometry args={[0.85, 0.85, 0.06]} />
        <meshStandardMaterial color="#aaddff" transparent opacity={0.5} metalness={0.1} roughness={0.05} />
      </mesh>
      {/* Side window */}
      {variant === 1 && (
        <>
          <mesh position={[-w / 2 - 0.01, 1.4, 0.5]}>
            <boxGeometry args={[0.1, 1.0, 1.0]} />
            <meshStandardMaterial color={trimColor} roughness={0.4} />
          </mesh>
          <mesh position={[-w / 2 - 0.05, 1.4, 0.5]}>
            <boxGeometry args={[0.06, 0.85, 0.85]} />
            <meshStandardMaterial color="#aaddff" transparent opacity={0.5} />
          </mesh>
        </>
      )}
      {/* Porch step */}
      <mesh position={[0, 0.15, -d / 2 - 0.7]}>
        <boxGeometry args={[2.0, 0.3, 1.0]} />
        <meshStandardMaterial color="#c0b090" roughness={0.8} />
      </mesh>
      {/* Garage (variant 0) */}
      {variant === 0 && (
        <>
          <mesh position={[2.2, 1.2, -d / 2 - 0.01]}>
            <boxGeometry args={[2.2, 2.4, 0.2]} />
            <meshStandardMaterial color="#a0a0a0" roughness={0.5} />
          </mesh>
          {/* Garage door panels */}
          {[0, 0.6, 1.2, 1.8].map((y, i) => (
            <mesh key={i} position={[2.2, y + 0.3, -d / 2 - 0.12]}>
              <boxGeometry args={[2.0, 0.5, 0.05]} />
              <meshStandardMaterial color="#b8b8b8" roughness={0.4} />
            </mesh>
          ))}
        </>
      )}
      {/* Yard trees */}
      <YardTree position={[-w / 2 - 1.5, 0, -d / 2 + 1]} />
      <YardTree position={[w / 2 + 1, 0, -d / 2 + 1]} />
    </group>
  );
}

function YardTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 2.4, 8]} />
        <meshStandardMaterial color="#6b4226" roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.2, 0]} castShadow>
        <sphereGeometry args={[1.4, 10, 10]} />
        <meshStandardMaterial color="#2d7a3a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 4.0, 0]} castShadow>
        <sphereGeometry args={[1.0, 8, 8]} />
        <meshStandardMaterial color="#3a9b4a" roughness={0.8} />
      </mesh>
    </group>
  );
}

function StreetLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 5, 8]} />
        <meshStandardMaterial color="#4a4a5a" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0.4, 4.8, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 6]} />
        <meshStandardMaterial color="#4a4a5a" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.4, 4.8, 0]}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshStandardMaterial color="#fffde0" emissive="#fffde0" emissiveIntensity={0.8} />
      </mesh>
      <pointLight position={[0.4, 4.6, 0]} intensity={0.6} distance={12} color="#ffe8a0" castShadow />
    </group>
  );
}

function Mailbox({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.2, 6]} />
        <meshStandardMaterial color="#555" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.3, 0]}>
        <boxGeometry args={[0.35, 0.22, 0.5]} />
        <meshStandardMaterial color="#c0392b" roughness={0.5} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Empty Lot Markers
// ---------------------------------------------------------------------------

function EmptyLotMarkers() {
  const corners: [number, number, number][] = [
    [-9, 0, -9],
    [9, 0, -9],
    [9, 0, 9],
    [-9, 0, 9],
  ];
  const ropes: Array<[[number, number, number], [number, number, number]]> = [
    [[-9, 1.1, -9], [9, 1.1, -9]],
    [[9, 1.1, -9], [9, 1.1, 9]],
    [[9, 1.1, 9], [-9, 1.1, 9]],
    [[-9, 1.1, 9], [-9, 1.1, -9]],
  ];

  return (
    <group>
      {/* Corner posts */}
      {corners.map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.7, pos[2]]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 1.4, 8]} />
          <meshStandardMaterial color="#a0722a" roughness={0.8} />
        </mesh>
      ))}
      {/* Rope segments */}
      {ropes.map(([a, b], i) => {
        const mid: [number, number, number] = [(a[0] + b[0]) / 2, 1.1, (a[2] + b[2]) / 2];
        const len = Math.sqrt((b[0] - a[0]) ** 2 + (b[2] - a[2]) ** 2);
        const angle = Math.atan2(b[0] - a[0], b[2] - a[2]);
        return (
          <mesh key={i} position={mid} rotation={[0, angle, 0]}>
            <boxGeometry args={[0.04, 0.04, len]} />
            <meshStandardMaterial color="#d4a017" roughness={0.6} />
          </mesh>
        );
      })}
      {/* "YOUR LOT" sign */}
      <group position={[0, 0, -9.5]}>
        <mesh position={[0, 1.0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 2.0, 6]} />
          <meshStandardMaterial color="#8b6914" roughness={0.8} />
        </mesh>
        <mesh position={[0, 2.1, 0]}>
          <boxGeometry args={[2.4, 0.7, 0.08]} />
          <meshStandardMaterial color="#2c5282" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Main Neighborhood Scene
// ---------------------------------------------------------------------------

// House configurations: [x, z, rotation, wallColor, roofColor, variant]
const HOUSE_CONFIGS: Array<{
  pos: [number, number, number];
  rot: number;
  wall: string;
  roof: string;
  trim: string;
  variant: number;
}> = [
  // Left side (X = -20), facing right (+Z toward street)
  { pos: [-20, 0, -22], rot: Math.PI / 2,  wall: "#e8d5c0", roof: "#7a3b1e", trim: "#fff", variant: 0 },
  { pos: [-20, 0, -10], rot: Math.PI / 2,  wall: "#c8d8b0", roof: "#4a7a2e", trim: "#f5f5dc", variant: 1 },
  { pos: [-20, 0,  10], rot: Math.PI / 2,  wall: "#d0c8d8", roof: "#5a3a8a", trim: "#fff", variant: 0 },
  { pos: [-20, 0,  22], rot: Math.PI / 2,  wall: "#f0e0c8", roof: "#8a5a1e", trim: "#fff8f0", variant: 1 },
  // Right side (X = +20), facing left (-Z toward street)
  { pos: [20, 0, -22], rot: -Math.PI / 2,  wall: "#c0d0e0", roof: "#2a4a7a", trim: "#fff", variant: 0 },
  { pos: [20, 0, -10], rot: -Math.PI / 2,  wall: "#e0c8b0", roof: "#6a4020", trim: "#fff8f0", variant: 1 },
  { pos: [20, 0,  10], rot: -Math.PI / 2,  wall: "#d8e8c8", roof: "#3a6a2a", trim: "#f5f5e5", variant: 0 },
  { pos: [20, 0,  22], rot: -Math.PI / 2,  wall: "#e8d0c0", roof: "#8a3a3a", trim: "#fff", variant: 1 },
];

const NPC_WAYPOINTS: Array<[number, number, number][]> = [
  // NPC 1: walks along street
  [[-15, 0.05, 0], [15, 0.05, 0], [15, 0.05, 3], [-15, 0.05, 3]],
  // NPC 2: circles a left-side house
  [[-17, 0.05, -22], [-17, 0.05, -16], [-23, 0.05, -16], [-23, 0.05, -22]],
  // NPC 3: walks along sidewalk on right
  [[12, 0.05, -20], [12, 0.05, 20], [14, 0.05, 20], [14, 0.05, -20]],
  // NPC 4: wanders around center area
  [[-5, 0.05, -5], [5, 0.05, -5], [5, 0.05, 5], [-5, 0.05, 5]],
  // NPC 5: patrols near right house
  [[17, 0.05, 10], [23, 0.05, 10], [23, 0.05, 14], [17, 0.05, 14]],
];

const NPC_COLORS = [
  { shirt: "#e74c3c", skin: "#f5c5a3" },
  { shirt: "#2ecc71", skin: "#c68642" },
  { shirt: "#9b59b6", skin: "#f5c5a3" },
  { shirt: "#e67e22", skin: "#c68642" },
  { shirt: "#1abc9c", skin: "#f5c5a3" },
];

export function NeighborhoodScene({ physicsActive }: { physicsActive: boolean }) {
  // Street positions
  const streetLamps: [number, number, number][] = [
    [-8, 0, -20], [8, 0, -20],
    [-8, 0, 0],   [8, 0, 0],
    [-8, 0, 20],  [8, 0, 20],
  ];

  const mailboxes: [number, number, number][] = [
    [-14, 0, -22], [-14, 0, -10], [-14, 0, 10], [-14, 0, 22],
    [14, 0, -22],  [14, 0, -10],  [14, 0, 10],  [14, 0, 22],
  ];

  const StaticGeo = ({ children }: { children: ReactNode }) =>
    physicsActive ? (
      <RigidBody type="fixed" colliders="trimesh">
        {children}
      </RigidBody>
    ) : (
      <>{children}</>
    );

  return (
    <group>
      {/* ---- Ground extension beyond lot ---- */}
      {/* Far ground (outside the 0-centered lot) */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[80, 0.1, 80]} />
        <meshStandardMaterial color="#5a8a3a" roughness={0.9} />
      </mesh>

      {/* ---- Main Street ---- */}
      <StaticGeo>
        <mesh position={[0, 0.01, 0]} receiveShadow>
          <boxGeometry args={[10, 0.12, 60]} />
          <meshStandardMaterial color="#4a4a4a" roughness={0.85} />
        </mesh>
      </StaticGeo>
      {/* Center line */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.18, 0.02, 60]} />
        <meshStandardMaterial color="#f0d010" roughness={0.5} />
      </mesh>
      {/* Dashed center marks */}
      {[-20, -10, 0, 10, 20].map((z, i) => (
        <mesh key={i} position={[0, 0.09, z]}>
          <boxGeometry args={[0.14, 0.02, 3]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
      ))}

      {/* ---- Sidewalks ---- */}
      <StaticGeo>
        <mesh position={[-7, 0.06, 0]} receiveShadow>
          <boxGeometry args={[2.5, 0.12, 60]} />
          <meshStandardMaterial color="#c8c8b8" roughness={0.8} />
        </mesh>
      </StaticGeo>
      <StaticGeo>
        <mesh position={[7, 0.06, 0]} receiveShadow>
          <boxGeometry args={[2.5, 0.12, 60]} />
          <meshStandardMaterial color="#c8c8b8" roughness={0.8} />
        </mesh>
      </StaticGeo>

      {/* ---- Driveways ---- */}
      {[-22, -10, 10, 22].map((z, i) => (
        <StaticGeo key={`driveway-L-${i}`}>
          <mesh position={[-12, 0.05, z]} receiveShadow>
            <boxGeometry args={[5.5, 0.1, 3.5]} />
            <meshStandardMaterial color="#888" roughness={0.85} />
          </mesh>
        </StaticGeo>
      ))}
      {[-22, -10, 10, 22].map((z, i) => (
        <StaticGeo key={`driveway-R-${i}`}>
          <mesh position={[12, 0.05, z]} receiveShadow>
            <boxGeometry args={[5.5, 0.1, 3.5]} />
            <meshStandardMaterial color="#888" roughness={0.85} />
          </mesh>
        </StaticGeo>
      ))}

      {/* ---- Houses ---- */}
      {HOUSE_CONFIGS.map((cfg, i) => (
        <StaticGeo key={`house-${i}`}>
          <NeighborHouse
            position={cfg.pos}
            rotation={cfg.rot}
            wallColor={cfg.wall}
            roofColor={cfg.roof}
            trimColor={cfg.trim}
            variant={cfg.variant}
          />
        </StaticGeo>
      ))}

      {/* ---- Street Lamps ---- */}
      {streetLamps.map((pos, i) => (
        <StreetLamp key={`lamp-${i}`} position={pos} />
      ))}

      {/* ---- Mailboxes ---- */}
      {mailboxes.map((pos, i) => (
        <Mailbox key={`mail-${i}`} position={pos} />
      ))}

      {/* ---- Neighborhood trees (along street edges) ---- */}
      {[-22, -10, 10, 22].map((z, i) => (
        <YardTree key={`treeL-${i}`} position={[-9.5, 0, z]} />
      ))}
      {[-22, -10, 10, 22].map((z, i) => (
        <YardTree key={`treeR-${i}`} position={[9.5, 0, z]} />
      ))}

      {/* ---- Empty Lot Markers (user's build area) ---- */}
      <EmptyLotMarkers />
    </group>
  );
}

// Export NPC data for SceneCanvas to use
export { NPC_WAYPOINTS, NPC_COLORS };
