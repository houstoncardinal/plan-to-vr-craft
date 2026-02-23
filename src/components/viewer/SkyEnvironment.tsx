import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sky, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useViewer } from "@/contexts/ViewerContext";

// ─── Fog controller ────────────────────────────────────────────────────────────
function SceneFog() {
  const { state } = useViewer();
  const fogRef = useRef<THREE.Fog>(null!);

  const fogColors: Record<string, { day: string; night: string; dusk: string }> = {
    spring: { day: "#c8e8f8", night: "#0a1020", dusk: "#e88060" },
    summer: { day: "#b8dcf0", night: "#080e1a", dusk: "#f09050" },
    autumn: { day: "#d4c4a0", night: "#100c0a", dusk: "#d06040" },
    winter: { day: "#dce8f0", night: "#101820", dusk: "#9090b0" },
  };

  useFrame(() => {
    if (!fogRef.current) return;
    const cycle = state.dayNightCycle;
    const season = state.season || "summer";
    const c = fogColors[season] || fogColors.summer;
    const sunAngle = cycle * Math.PI * 2;
    const sinVal = Math.sin(sunAngle);
    const isDusk = sinVal > -0.15 && sinVal < 0.25 && cycle > 0.45 && cycle < 0.75;
    const isNight = cycle < 0.25 || cycle > 0.75;

    const targetColor = isNight ? c.night : isDusk ? c.dusk : c.day;
    fogRef.current.color.lerp(new THREE.Color(targetColor), 0.02);
    const targetDist = isNight ? 280 : isDusk ? 200 : 320;
    fogRef.current.far += (targetDist - fogRef.current.far) * 0.02;
  });

  return <fog ref={fogRef} attach="fog" args={["#b8dcf0", 60, 320]} />;
}

// ─── Ground plane ──────────────────────────────────────────────────────────────
function GroundPlane() {
  const { state } = useViewer();
  const matRef = useRef<THREE.MeshStandardMaterial>(null!);

  const seasonGroundColors: Record<string, string> = {
    spring: "#4a7c3f",
    summer: "#3d6b35",
    autumn: "#7a5c30",
    winter: "#c8d4d8",
  };

  useFrame(() => {
    if (!matRef.current) return;
    const season = state.season || "summer";
    const target = seasonGroundColors[season] || seasonGroundColors.summer;
    matRef.current.color.lerp(new THREE.Color(target), 0.02);
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
      <planeGeometry args={[800, 800, 64, 64]} />
      <meshStandardMaterial
        ref={matRef}
        color="#3d6b35"
        roughness={0.92}
        metalness={0}
        envMapIntensity={0.3}
      />
    </mesh>
  );
}

// ─── Mountain range ────────────────────────────────────────────────────────────
function MountainPeak({
  x, z, height, radius, snowCap, color,
}: {
  x: number; z: number; height: number; radius: number; snowCap: boolean; color: string;
}) {
  return (
    <group position={[x, 0, z]} userData={{ noCollide: true }}>
      {/* Main cone */}
      <mesh castShadow userData={{ noCollide: true }}>
        <coneGeometry args={[radius, height, 12, 4]} />
        <meshStandardMaterial color={color} roughness={0.9} metalness={0} />
      </mesh>
      {/* Snow cap */}
      {snowCap && (
        <mesh position={[0, height * 0.3, 0]} userData={{ noCollide: true }}>
          <coneGeometry args={[radius * 0.35, height * 0.25, 10, 2]} />
          <meshStandardMaterial color="#f0f4f8" roughness={0.55} />
        </mesh>
      )}
      {/* Mid-slope shadow cone (darker) */}
      <mesh position={[radius * 0.15, -height * 0.05, 0]} userData={{ noCollide: true }}>
        <coneGeometry args={[radius * 0.7, height * 0.85, 12, 4]} />
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.7).getStyle()} roughness={0.95} />
      </mesh>
    </group>
  );
}

function MountainRange() {
  const { state } = useViewer();

  // Far distant range (blue-grey)
  const farPeaks = useMemo(() => [
    { x: -200, z: -300, height: 90, radius: 55, snowCap: true, color: "#8090a8" },
    { x: -110, z: -290, height: 70, radius: 42, snowCap: true, color: "#8898b0" },
    { x: -30,  z: -310, height: 110, radius: 65, snowCap: true, color: "#7888a0" },
    { x:  80,  z: -295, height: 80, radius: 50, snowCap: true, color: "#8090a8" },
    { x:  175, z: -305, height: 95, radius: 58, snowCap: true, color: "#8898b0" },
    { x:  260, z: -280, height: 65, radius: 40, snowCap: false, color: "#9098a8" },
    { x: -280, z: -270, height: 55, radius: 36, snowCap: false, color: "#9098a8" },
  ], []);

  // Mid range (greener)
  const midPeaks = useMemo(() => [
    { x: -170, z: -190, height: 55, radius: 40, snowCap: false, color: "#506848" },
    { x:  -80, z: -200, height: 65, radius: 46, snowCap: false, color: "#4d6445" },
    { x:   30, z: -185, height: 45, radius: 34, snowCap: false, color: "#566e4e" },
    { x:  130, z: -195, height: 60, radius: 43, snowCap: false, color: "#506848" },
    { x:  220, z: -180, height: 50, radius: 37, snowCap: false, color: "#4d6445" },
  ], []);

  const season = state.season || "summer";
  const snowAll = season === "winter";

  return (
    <group>
      {farPeaks.map((p, i) => (
        <MountainPeak key={`far-${i}`} {...p} snowCap={p.snowCap || snowAll} />
      ))}
      {midPeaks.map((p, i) => (
        <MountainPeak key={`mid-${i}`} {...p} snowCap={snowAll} />
      ))}
    </group>
  );
}

// ─── Cloud cluster ─────────────────────────────────────────────────────────────
function CloudCluster({ position, speed, scale }: {
  position: [number, number, number];
  speed: number;
  scale: number;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const startX = useRef(position[0]);

  // Puff positions for this cloud
  const puffs = useMemo(() => [
    { x: 0,    y: 0,    z: 0,    r: 1.0 },
    { x: 1.4,  y: -0.2, z: 0.3,  r: 0.85 },
    { x: -1.3, y: -0.3, z: 0.2,  r: 0.8 },
    { x: 0.7,  y: 0.3,  z: -0.4, r: 0.7 },
    { x: -0.6, y: 0.25, z: -0.3, r: 0.65 },
    { x: 2.5,  y: -0.5, z: 0.1,  r: 0.6 },
    { x: -2.4, y: -0.5, z: 0.2,  r: 0.55 },
  ], []);

  useFrame((_, dt) => {
    if (!groupRef.current) return;
    groupRef.current.position.x += speed * dt;
    // Wrap around
    if (groupRef.current.position.x > 280) {
      groupRef.current.position.x = -280;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale} userData={{ noCollide: true }}>
      {puffs.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]} userData={{ noCollide: true }}>
          <sphereGeometry args={[p.r, 9, 7]} />
          <meshStandardMaterial color="#f4f6f8" roughness={1} metalness={0} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function CloudLayer() {
  const { state } = useViewer();

  const clouds = useMemo(() => [
    { position: [-120, 55, -80] as [number,number,number],  speed: 0.9,  scale: 7 },
    { position: [  40, 62, -100] as [number,number,number], speed: 0.7,  scale: 9 },
    { position: [ 160, 50, -70] as [number,number,number],  speed: 1.1,  scale: 6 },
    { position: [ -60, 68, -130] as [number,number,number], speed: 0.6,  scale: 11 },
    { position: [ 220, 58, -110] as [number,number,number], speed: 0.8,  scale: 8 },
    { position: [-200, 52, -90] as [number,number,number],  speed: 1.0,  scale: 7 },
    { position: [  90, 72, -150] as [number,number,number], speed: 0.5,  scale: 13 },
    { position: [-150, 65, -120] as [number,number,number], speed: 0.75, scale: 10 },
  ], []);

  const cycle = state.dayNightCycle;
  const isNight = cycle < 0.2 || cycle > 0.8;

  if (isNight) return null;
  return (
    <>
      {clouds.map((c, i) => (
        <CloudCluster key={i} {...c} />
      ))}
    </>
  );
}

// ─── Sun disc ──────────────────────────────────────────────────────────────────
function SunDisc() {
  const { state } = useViewer();
  const discRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.MeshBasicMaterial>(null!);
  const glowMatRef = useRef<THREE.MeshBasicMaterial>(null!);

  useFrame(() => {
    const cycle = state.dayNightCycle;
    const sunAngle = cycle * Math.PI * 2;
    const sunX = Math.cos(sunAngle) * 200;
    const sunY = Math.sin(sunAngle) * 160;
    const sunZ = -180;

    if (discRef.current) {
      discRef.current.position.set(sunX, sunY, sunZ);
    }
    if (glowRef.current) {
      glowRef.current.position.set(sunX, sunY, sunZ + 0.5);
    }

    // Color shifts at dawn/dusk
    const sinVal = Math.sin(sunAngle);
    const isDawn = sinVal > 0 && sinVal < 0.3;
    const isDusk = sinVal < 0 && sinVal > -0.3;
    const sunColor = isDawn || isDusk ? "#ff9040" : "#fff8e8";
    const glowColor = isDawn || isDusk ? "#ff6020" : "#ffe8a0";
    const opacity = Math.max(0, sinVal);

    if (matRef.current) {
      matRef.current.color.set(sunColor);
      matRef.current.opacity = opacity;
    }
    if (glowMatRef.current) {
      glowMatRef.current.color.set(glowColor);
      glowMatRef.current.opacity = opacity * 0.25;
    }
  });

  return (
    <>
      {/* Glow halo */}
      <mesh ref={glowRef} userData={{ noCollide: true }}>
        <circleGeometry args={[22, 32]} />
        <meshBasicMaterial ref={glowMatRef} color="#ffe8a0" transparent opacity={0.25} depthWrite={false} />
      </mesh>
      {/* Sun disc */}
      <mesh ref={discRef} userData={{ noCollide: true }}>
        <circleGeometry args={[9, 32]} />
        <meshBasicMaterial ref={matRef} color="#fff8e8" transparent opacity={1} depthWrite={false} />
      </mesh>
    </>
  );
}

// ─── Moon disc ─────────────────────────────────────────────────────────────────
function MoonDisc() {
  const { state } = useViewer();
  const discRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.MeshBasicMaterial>(null!);
  const glowMatRef = useRef<THREE.MeshBasicMaterial>(null!);

  useFrame(() => {
    const cycle = state.dayNightCycle;
    // Moon is offset 180° from sun
    const moonAngle = (cycle + 0.5) * Math.PI * 2;
    const moonX = Math.cos(moonAngle) * 190;
    const moonY = Math.sin(moonAngle) * 150;
    const moonZ = -175;

    if (discRef.current) discRef.current.position.set(moonX, moonY, moonZ);
    if (glowRef.current) glowRef.current.position.set(moonX, moonY, moonZ + 0.5);

    const sinVal = Math.sin(moonAngle);
    const opacity = Math.max(0, sinVal) * 0.95;

    if (matRef.current) matRef.current.opacity = opacity;
    if (glowMatRef.current) glowMatRef.current.opacity = opacity * 0.2;
  });

  return (
    <>
      <mesh ref={glowRef} userData={{ noCollide: true }}>
        <circleGeometry args={[16, 32]} />
        <meshBasicMaterial ref={glowMatRef} color="#c8d8f0" transparent opacity={0.2} depthWrite={false} />
      </mesh>
      <mesh ref={discRef} userData={{ noCollide: true }}>
        <circleGeometry args={[6, 32]} />
        <meshBasicMaterial ref={matRef} color="#e8eef8" transparent opacity={0} depthWrite={false} />
      </mesh>
    </>
  );
}

// ─── Sky shader ────────────────────────────────────────────────────────────────
function DynamicSky() {
  const { state } = useViewer();
  const cycle = state.dayNightCycle;
  const sunAngle = cycle * Math.PI * 2;
  const sunY = Math.sin(sunAngle) * 50;
  const sunX = Math.cos(sunAngle) * 100;
  const isNight = cycle < 0.22 || cycle > 0.78;

  return (
    <>
      <Sky
        distance={450000}
        sunPosition={[sunX, sunY, -180]}
        inclination={cycle}
        azimuth={0.25}
        rayleigh={state.season === "winter" ? 0.5 : state.season === "autumn" ? 1.2 : 2}
        mieCoefficient={0.005}
        mieDirectionalG={0.82}
      />
      {isNight && (
        <Stars radius={180} depth={60} count={6000} factor={5} saturation={0.1} fade speed={0.4} />
      )}
    </>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────
export default function SkyEnvironment() {
  return (
    <>
      <SceneFog />
      <GroundPlane />
      <DynamicSky />
      <SunDisc />
      <MoonDisc />
      <CloudLayer />
      <MountainRange />
    </>
  );
}
