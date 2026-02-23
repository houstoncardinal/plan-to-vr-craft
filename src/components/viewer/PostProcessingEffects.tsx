import { EffectComposer, Bloom, Vignette, ChromaticAberration, N8AO } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";
import { useViewer } from "@/contexts/ViewerContext";

export default function PostProcessingEffects() {
  const { state } = useViewer();
  const isNight = state.dayNightCycle < 0.25 || state.dayNightCycle > 0.75;
  const isFPS = state.cameraMode === "firstPerson";

  return (
    <EffectComposer multisampling={8}>
      {/* High-quality ambient occlusion — depth in corners and crevices */}
      <N8AO
        aoRadius={1.8}
        intensity={isNight ? 4.2 : 3.0}
        distanceFalloff={0.45}
        quality="high"
        halfRes={false}
        screenSpaceRadius={false}
        color="black"
      />

      {/* Bloom — lights, glass, emissive surfaces glow realistically */}
      <Bloom
        intensity={isNight ? 2.2 : 0.55}
        luminanceThreshold={isNight ? 0.3 : 0.78}
        luminanceSmoothing={0.85}
        mipmapBlur
        radius={0.6}
        levels={8}
      />

      {/* Chromatic aberration — subtle lens fringing, stronger in FPS */}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new Vector2(isFPS ? 0.0006 : 0.0002, isFPS ? 0.0006 : 0.0002)}
        radialModulation={false}
        modulationOffset={0.5}
      />

      {/* Vignette — dark edges, immersive in FPS mode */}
      <Vignette
        offset={isFPS ? 0.32 : 0.42}
        darkness={isFPS ? 0.78 : 0.48}
        eskil={false}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
