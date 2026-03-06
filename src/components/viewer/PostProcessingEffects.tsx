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
  const sinSun = Math.sin(cycle * Math.PI * 2);
  const isNight = cycle < 0.22 || cycle > 0.78;
  const isDusk = sinSun > -0.1 && sinSun < 0.3 && cycle > 0.4;
  const isDawn = sinSun > 0 && sinSun < 0.3 && cycle < 0.4;
  const isGoldenHour = isDusk || isDawn;
  const isFPS = state.cameraMode === "firstPerson";

  return (
    <EffectComposer multisampling={0}>
      {/* ── Ambient Occlusion — ultra quality for architectural detail ──── */}
      <N8AO
        aoRadius={isNight ? 3.0 : 2.8}
        intensity={isNight ? 6.0 : 4.5}
        distanceFalloff={0.42}
        quality="ultra"
        halfRes={false}
        screenSpaceRadius={false}
        color={isNight ? "#0a0a18" : "#1a1a2a"}
      />

      {/* ── Bloom — cinematic light bleed ──────────────────────────────── */}
      <Bloom
        intensity={isNight ? 3.5 : isGoldenHour ? 1.4 : 0.8}
        luminanceThreshold={isNight ? 0.18 : isGoldenHour ? 0.42 : 0.62}
        luminanceSmoothing={0.92}
        mipmapBlur
        radius={0.72}
        levels={8}
      />

      {/* ── Color grading ─────────────────────────────────────────────── */}
      <HueSaturation
        blendFunction={BlendFunction.NORMAL}
        hue={isGoldenHour ? 0.04 : 0}
        saturation={isGoldenHour ? 0.28 : isNight ? -0.12 : 0.16}
      />

      {/* Filmic contrast lift */}
      <BrightnessContrast
        brightness={isNight ? -0.04 : isGoldenHour ? 0.02 : 0.0}
        contrast={isGoldenHour ? 0.14 : 0.12}
      />

      {/* ── Chromatic aberration — subtle lens realism ─────────────────── */}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new Vector2(isFPS ? 0.0006 : 0.00018, isFPS ? 0.0006 : 0.00018)}
        radialModulation={true}
        modulationOffset={0.7}
      />

      {/* ── Vignette — cinematic framing ──────────────────────────────── */}
      <Vignette
        offset={isFPS ? 0.25 : 0.32}
        darkness={isFPS ? 0.75 : isNight ? 0.6 : 0.42}
        eskil={false}
        blendFunction={BlendFunction.NORMAL}
      />

      {/* ── SMAA — final pass anti-aliasing ───────────────────────────── */}
      <SMAA />
    </EffectComposer>
  );
}
