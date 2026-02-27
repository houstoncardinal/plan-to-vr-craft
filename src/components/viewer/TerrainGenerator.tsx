import { useRef, useMemo } from "react";
import * as THREE from "three";

interface TerrainGeneratorProps {
  width?: number;
  height?: number;
  widthSegments?: number;
  heightSegments?: number;
  maxHeight?: number;
  seed?: number;
}

function noise(x: number, y: number, seed: number = 0): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 43.758) * 43758.5453;
  return n - Math.floor(n);
}

function fbm(x: number, y: number, octaves: number = 4, seed: number = 0): number {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;
  for (let i = 0; i < octaves; i++) {
    value += noise(x * frequency, y * frequency, seed + i) * amplitude;
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }
  return value / maxValue;
}

function generateColors(
  data: Float32Array,
  widthSegments: number,
  heightSegments: number,
  maxHeight: number
): Float32Array {
  const colors = new Float32Array(data.length * 3);
  for (let i = 0; i <= heightSegments; i++) {
    for (let j = 0; j <= widthSegments; j++) {
      const index = i * (widthSegments + 1) + j;
      const h = data[index] / maxHeight;
      let r: number, g: number, b: number;
      if (h < 0.3) { r = 0.1 + h * 0.2; g = 0.3 + h * 0.4; b = 0.5 + h * 0.3; }
      else if (h < 0.5) { const t = (h - 0.3) / 0.2; r = 0.2 + t * 0.1; g = 0.5 + t * 0.2; b = 0.2 + t * 0.1; }
      else if (h < 0.7) { const t = (h - 0.5) / 0.2; r = 0.3 + t * 0.3; g = 0.7 - t * 0.2; b = 0.3 - t * 0.1; }
      else if (h < 0.85) { const t = (h - 0.7) / 0.15; r = 0.6 - t * 0.1; g = 0.5 - t * 0.1; b = 0.4 - t * 0.05; }
      else { const t = (h - 0.85) / 0.15; r = 0.5 + t * 0.5; g = 0.4 + t * 0.6; b = 0.35 + t * 0.65; }
      colors[index * 3] = r;
      colors[index * 3 + 1] = g;
      colors[index * 3 + 2] = b;
    }
  }
  return colors;
}

export default function TerrainGenerator({
  width = 100,
  height = 100,
  widthSegments = 128,
  heightSegments = 128,
  maxHeight = 20,
  seed = 42,
}: TerrainGeneratorProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
    const vertices = geo.attributes.position.array as Float32Array;
    const heightData = new Float32Array((widthSegments + 1) * (heightSegments + 1));

    for (let i = 0; i <= heightSegments; i++) {
      for (let j = 0; j <= widthSegments; j++) {
        const x = (j / widthSegments) * width;
        const y = (i / heightSegments) * height;
        let hv = fbm(x * 0.01, y * 0.01, 6, seed) + fbm(x * 0.005, y * 0.005, 3, seed + 100) * 0.5;
        hv = ((hv + 1) * 0.5) ** 1.5 * maxHeight;
        const idx = i * (widthSegments + 1) + j;
        heightData[idx] = hv;
        vertices[idx * 3 + 2] = hv;
      }
    }

    const colors = generateColors(heightData, widthSegments, heightSegments, maxHeight);
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, [width, height, widthSegments, heightSegments, maxHeight, seed]);

  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8, metalness: 0.1 }),
    []
  );

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={[-width / 2, 0, -height / 2]}
      rotation={[-Math.PI / 2, 0, 0]}
      castShadow
      receiveShadow
    />
  );
}
