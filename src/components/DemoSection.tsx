import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Brain, Box, Eye, Paintbrush, Play, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const demoSteps = [
  {
    id: "upload",
    icon: Upload,
    label: "Upload",
    title: "Drag & Drop Your Blueprints",
    description: "Upload PDF, DWG, DXF floor plans or even photos of sketches. Our platform accepts all standard architectural file formats with multi-file batch support.",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md mx-auto"
        >
          {/* Simulated upload zone */}
          <div className="border-2 border-dashed border-primary/30 rounded-2xl p-10 bg-primary/[0.02] text-center">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Upload className="h-16 w-16 mx-auto text-primary/40 mb-4" />
            </motion.div>
            <p className="text-sm font-semibold text-foreground mb-1">Drop files here</p>
            <p className="text-xs text-muted-foreground">PDF, DWG, DXF, PNG, JPG</p>
          </div>
          {/* Uploaded file list */}
          <div className="mt-4 space-y-2">
            {["FloorPlan_Level1.pdf", "FloorPlan_Level2.pdf", "Site_Plan.dwg"].map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.3 }}
                className="flex items-center gap-3 rounded-xl bg-card border border-border px-4 py-3"
              >
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm text-foreground flex-1 truncate">{f}</span>
                <span className="text-xs text-muted-foreground">{(2.1 + i * 0.8).toFixed(1)} MB</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: "analyze",
    icon: Brain,
    label: "AI Analysis",
    title: "AI Detects Every Element",
    description: "Our multimodal AI identifies walls, doors, windows, structural grids, MEP systems, room labels, and dimensions with 98.4% accuracy — no manual input required.",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative w-full max-w-md">
          {/* Blueprint placeholder */}
          <div className="rounded-2xl bg-secondary/60 border border-border aspect-[4/3] relative overflow-hidden">
            {/* Grid lines to simulate blueprint */}
            <div className="absolute inset-4 border-2 border-muted-foreground/10 rounded-lg">
              <div className="absolute top-1/3 left-0 right-0 h-px bg-muted-foreground/10" />
              <div className="absolute top-2/3 left-0 right-0 h-px bg-muted-foreground/10" />
              <div className="absolute left-1/3 top-0 bottom-0 w-px bg-muted-foreground/10" />
              <div className="absolute left-2/3 top-0 bottom-0 w-px bg-muted-foreground/10" />
            </div>
            {/* Scanning line */}
            <motion.div
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            {/* Detection boxes */}
            {[
              { top: "15%", left: "10%", w: "35%", h: "30%", label: "Living Room", delay: 0.8 },
              { top: "15%", left: "55%", w: "35%", h: "25%", label: "Kitchen", delay: 1.2 },
              { top: "55%", left: "10%", w: "25%", h: "35%", label: "Bedroom", delay: 1.6 },
              { top: "55%", left: "45%", w: "20%", h: "20%", label: "Bath", delay: 2.0 },
            ].map((box, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: box.delay, duration: 0.4 }}
                className="absolute border-2 border-primary/50 rounded-lg bg-primary/5"
                style={{ top: box.top, left: box.left, width: box.w, height: box.h }}
              >
                <span className="absolute -top-5 left-1 text-[10px] font-semibold text-primary bg-card/90 px-1.5 py-0.5 rounded">
                  {box.label}
                </span>
              </motion.div>
            ))}
          </div>
          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4 }}
            className="mt-4 flex gap-3"
          >
            {[
              { label: "Walls", count: 24 },
              { label: "Doors", count: 8 },
              { label: "Windows", count: 12 },
              { label: "Rooms", count: 6 },
            ].map((s) => (
              <div key={s.label} className="flex-1 rounded-xl bg-card border border-border p-3 text-center">
                <div className="text-lg font-bold text-foreground">{s.count}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "generate",
    icon: Box,
    label: "3D Build",
    title: "Watch Your Model Come to Life",
    description: "The parametric engine extrudes walls, places openings, generates floor slabs and roof geometry, and constructs multi-story structures — all in real time.",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* 3D progress visualization */}
          <div className="rounded-2xl bg-foreground/[0.03] border border-border aspect-[4/3] relative overflow-hidden flex items-center justify-center">
            {/* Isometric building silhouette */}
            <motion.div className="relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Foundation */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="w-48 h-4 bg-muted-foreground/20 rounded origin-bottom"
              />
              {/* Floor 1 */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="w-48 h-20 bg-gradient-to-t from-primary/20 to-primary/10 border border-primary/20 rounded-t origin-bottom mt-px"
              >
                <div className="flex gap-2 p-2 pt-6">
                  {[1,2,3].map(i => (
                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 + i * 0.2 }}
                      className="flex-1 h-10 border border-primary/30 rounded bg-primary/5" />
                  ))}
                </div>
              </motion.div>
              {/* Floor 2 */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 1.6, duration: 0.5 }}
                className="w-48 h-20 bg-gradient-to-t from-primary/15 to-primary/5 border border-primary/15 rounded-t origin-bottom mt-px"
              >
                <div className="flex gap-2 p-2 pt-6">
                  {[1,2,3].map(i => (
                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 + i * 0.2 }}
                      className="flex-1 h-10 border border-primary/20 rounded bg-primary/5" />
                  ))}
                </div>
              </motion.div>
              {/* Roof */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 2.8, duration: 0.4 }}
                className="w-48 h-3 bg-primary/30 rounded-t origin-bottom"
              />
            </motion.div>
          </div>
          {/* Progress bar */}
          <div className="mt-4 rounded-xl bg-card border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-foreground">Building 3D Model</span>
              <motion.span
                className="text-xs font-bold text-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.span
                  initial={{ value: 0 }}
                  animate={{ value: 100 }}
                  transition={{ duration: 3, ease: "easeOut" }}
                >
                  100%
                </motion.span>
              </motion.span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full bg-gradient-cardinal rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "materials",
    icon: Paintbrush,
    label: "Materials",
    title: "PBR Materials Auto-Applied",
    description: "AI-selected physically based rendering materials are applied to every surface — wood floors, concrete walls, glass facades, metal fixtures — all with realistic reflections and textures.",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: "Oak Hardwood", color: "from-amber-700 to-amber-800" },
              { name: "Polished Concrete", color: "from-gray-400 to-gray-500" },
              { name: "Clear Glass", color: "from-sky-200/60 to-sky-300/40" },
              { name: "Brushed Steel", color: "from-slate-300 to-slate-400" },
              { name: "White Marble", color: "from-gray-100 to-gray-200" },
              { name: "Brick Red", color: "from-red-700 to-red-800" },
            ].map((mat, i) => (
              <motion.div
                key={mat.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
                className="group cursor-pointer"
              >
                <div className={`aspect-square rounded-xl bg-gradient-to-br ${mat.color} border border-border group-hover:ring-2 group-hover:ring-primary/50 transition-all duration-300 group-hover:scale-105`} />
                <p className="text-[10px] text-center text-muted-foreground mt-2 font-medium">{mat.name}</p>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-5 rounded-xl bg-card border border-border p-4 flex items-center gap-3"
          >
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">6 materials auto-applied</p>
              <p className="text-xs text-muted-foreground">Based on architectural context analysis</p>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "explore",
    icon: Eye,
    label: "Explore",
    title: "Walk Through Your Design",
    description: "Navigate your building in first-person VR, take section cuts, measure distances, pin annotations, and share immersive links with clients — all from the browser.",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Browser frame */}
          <div className="rounded-2xl overflow-hidden border border-border shadow-[var(--shadow-lg)]">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-secondary/40">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-destructive/50" />
                <div className="h-2.5 w-2.5 rounded-full bg-[hsl(45_80%_55%)]/50" />
                <div className="h-2.5 w-2.5 rounded-full bg-[hsl(140_50%_50%)]/50" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-background/80 border border-border rounded-md px-3 py-0.5 text-[10px] text-muted-foreground">
                  app.visitcardinal.com/viewer
                </div>
              </div>
            </div>
            <div className="aspect-video bg-gradient-to-br from-foreground/[0.04] to-foreground/[0.08] relative flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-16 w-16 rounded-full bg-gradient-cardinal flex items-center justify-center mx-auto mb-3 shadow-cardinal"
                >
                  <Play className="h-6 w-6 text-primary-foreground ml-1" />
                </motion.div>
                <p className="text-sm font-semibold text-foreground">Interactive 3D Viewer</p>
                <p className="text-xs text-muted-foreground mt-1">60 fps • WebXR Ready</p>
              </motion.div>
              {/* Floating controls */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-3 left-3 right-3 flex gap-2"
              >
                {["Orbit", "Walk", "Section", "Measure"].map((tool, i) => (
                  <motion.div
                    key={tool}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + i * 0.15 }}
                    className={`flex-1 text-center py-2 rounded-lg text-[10px] font-semibold ${
                      i === 0
                        ? "bg-primary text-primary-foreground"
                        : "bg-card/80 backdrop-blur-sm border border-border text-foreground"
                    }`}
                  >
                    {tool}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

export default function DemoSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-[0.15em] mb-6 shadow-[var(--shadow-sm)]">
            <Play className="h-3 w-3 fill-primary" />
            Interactive Demo
          </span>
          <h2 className="font-display text-3xl md:text-[3.25rem] font-bold text-foreground mb-6 leading-tight">
            See it in
            <span className="text-gradient-cardinal"> action</span>
          </h2>
          <p className="text-foreground/70 text-lg max-w-xl mx-auto leading-relaxed">
            Experience the complete blueprint-to-3D pipeline. Click each step to see how it works.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Step tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {demoSteps.map((step, i) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(i)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeStep === i
                    ? "bg-gradient-cardinal text-primary-foreground shadow-cardinal"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                <step.icon className="h-4 w-4" />
                {step.label}
              </button>
            ))}
          </div>

          {/* Content area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              {/* Text */}
              <div className="order-2 lg:order-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-gradient-cardinal flex items-center justify-center shadow-cardinal">
                    {(() => {
                      const Icon = demoSteps[activeStep].icon;
                      return <Icon className="h-6 w-6 text-primary-foreground" />;
                    })()}
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-semibold">
                      Step {activeStep + 1} of {demoSteps.length}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-foreground">
                      {demoSteps[activeStep].title}
                    </h3>
                  </div>
                </div>
                <p className="text-foreground/70 leading-relaxed mb-8">
                  {demoSteps[activeStep].description}
                </p>
                <div className="flex gap-3">
                  <Link to="/viewer">
                    <Button className="bg-gradient-cardinal text-primary-foreground shadow-cardinal hover:opacity-95 rounded-xl group">
                      Try It Yourself
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  {activeStep < demoSteps.length - 1 && (
                    <Button
                      variant="outline"
                      onClick={() => setActiveStep(activeStep + 1)}
                      className="rounded-xl"
                    >
                      Next Step
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Visual */}
              <div className="order-1 lg:order-2 min-h-[400px] rounded-2xl border border-border bg-card/50 p-6">
                {demoSteps[activeStep].visual}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
