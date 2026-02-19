import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import BuildingModel from "@/components/BuildingModel";
import { Button } from "@/components/ui/button";
import {
  Layers,
  Ruler,
  Sun,
  Eye,
  Scissors,
  RotateCcw,
  Maximize2,
  ChevronLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

const tools = [
  { icon: Layers, label: "Layers", active: true },
  { icon: Ruler, label: "Measure" },
  { icon: Sun, label: "Lighting" },
  { icon: Scissors, label: "Section Cut" },
  { icon: Eye, label: "Walkthrough" },
  { icon: RotateCcw, label: "Reset View" },
];

export default function Viewer() {
  const [activeTool, setActiveTool] = useState("Layers");

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 flex pt-16">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-16 border-r border-border bg-card flex flex-col items-center py-4 gap-1"
        >
          <Link to="/dashboard">
            <Button variant="ghost" size="icon" className="mb-4 text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>

          {tools.map((tool) => (
            <Button
              key={tool.label}
              variant="ghost"
              size="icon"
              className={`h-10 w-10 ${
                activeTool === tool.label
                  ? "bg-cardinal-light text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTool(tool.label)}
              title={tool.label}
            >
              <tool.icon className="h-4.5 w-4.5" />
            </Button>
          ))}

          <div className="flex-1" />
          <Button variant="ghost" size="icon" className="text-muted-foreground" title="Fullscreen">
            <Maximize2 className="h-4.5 w-4.5" />
          </Button>
        </motion.aside>

        {/* 3D Canvas */}
        <div className="flex-1 relative">
          <Canvas
            shadows
            camera={{ position: [18, 14, 18], fov: 45 }}
            className="bg-surface"
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.4} />
              <directionalLight
                position={[10, 20, 10]}
                intensity={1.2}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
              <BuildingModel />
              <ContactShadows
                position={[0, -0.02, 0]}
                opacity={0.3}
                blur={2}
                far={20}
              />
              <OrbitControls
                enablePan
                enableZoom
                enableRotate
                minDistance={8}
                maxDistance={50}
                maxPolarAngle={Math.PI / 2.1}
              />
              <Environment preset="city" />
            </Suspense>
          </Canvas>

          {/* Info overlay */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-6 left-6 glass rounded-xl px-5 py-3"
          >
            <p className="text-xs font-medium text-foreground">Meridian Tower — Phase 2</p>
            <p className="text-[11px] text-muted-foreground">2 floors • 12 rooms • AI confidence: 94%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-6 right-6 glass rounded-xl px-5 py-3"
          >
            <p className="text-[11px] text-muted-foreground">Scroll to zoom • Drag to rotate • Right-click to pan</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
