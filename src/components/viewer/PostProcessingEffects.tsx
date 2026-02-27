import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
  N8AO,
  SMAA,
  HueSaturation,
  BrightnessContrast,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";
import { useViewer } from "@/contexts/ViewerContext";

export default function PostProcessingEffects() {
  const { state } = useViewer();
  const cycle = state.dayNightCycle;
  const isNight = cycle < 0.25 || cycle > 0.75;
  const isDusk = cycle > 0.45 && cycle < 0.68;
  const isFPS = state.cameraMode === "firstPerson";

  return (
    // multisampling=0 — SMAA (final pass) handles all anti-aliasing.
    // Running MSAA + SMAA together rendered the scene at 4× resolution for zero gain.
    <EffectComposer multisampling={0}>
      {/* ── Ambient occlusion ─────────────────────────────────────────────── */}
      {/* N8AO: adds depth to corners, crevices, and contact areas            */}
      <N8AO
        aoRadius={2.4}
        intensity={isNight ? 5.2 : 3.8}
        distanceFalloff={0.38}
        quality="high"
        halfRes={false}
        screenSpaceRadius={false}
        color="black"
      />

      {/* ── Bloom ─────────────────────────────────────────────────────────── */}
      {/* Lights, emissive glass, and metal highlights glow realistically      */}
      <Bloom
        intensity={isNight ? 3.0 : isDusk ? 1.1 : 0.7}
        luminanceThreshold={isNight ? 0.22 : isDusk ? 0.52 : 0.68}
        luminanceSmoothing={0.88}
        mipmapBlur
        radius={0.68}
        levels={8}
      />

      {/* ── Colour grading ────────────────────────────────────────────────── */}
      {/* Slight saturation lift in daylight → punchier materials             */}
      {/* Desaturate at night → cooler, more cinematic                        */}
      <HueSaturation
        blendFunction={BlendFunction.NORMAL}
        hue={0}
        saturation={isDusk ? 0.22 : isNight ? -0.1 : 0.14}
      />

      {/* Micro-contrast boost — tightens perceived detail without crushing blacks */}
      <BrightnessContrast
        brightness={isNight ? -0.03 : 0.0}
        contrast={0.1}
      />

      {/* ── Lens effects ──────────────────────────────────────────────────── */}
      {/* Radial chromatic aberration — most visible at frame edges (realistic lens) */}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new Vector2(isFPS ? 0.00055 : 0.00016, isFPS ? 0.00055 : 0.00016)}
        radialModulation={true}
        modulationOffset={0.68}
      />

      {/* Vignette — subtly darkens edges, draws eye to centre */}
      <Vignette
        offset={isFPS ? 0.28 : 0.36}
        darkness={isFPS ? 0.7 : 0.4}
        eskil={false}
        blendFunction={BlendFunction.NORMAL}
      />

      {/* ── SMAA anti-aliasing (final pass) ───────────────────────────────── */}
      {/* Morphological AA — resolves sub-pixel edges better than MSAA alone  */}
      <SMAA />
    </EffectComposer>
  );
}
