import { motion } from "framer-motion";
import {
  FileText,
  Brain,
  Box,
  Eye,
  Pencil,
  Building2,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Smart Upload",
    description:
      "Drag-and-drop PDF, DWG, DXF files. Multi-file support with real-time progress tracking.",
    accent: "from-primary/10 to-primary/5",
  },
  {
    icon: Brain,
    title: "AI Document Intelligence",
    description:
      "Multimodal AI detects walls, doors, windows, structural grids, MEP systems, and dimensions automatically.",
    accent: "from-primary/10 to-primary/5",
  },
  {
    icon: Box,
    title: "3D Reconstruction",
    description:
      "Parametric engine generates accurate wall extrusions, floor slabs, roof geometry, and multi-story support.",
    accent: "from-primary/10 to-primary/5",
  },
  {
    icon: Eye,
    title: "VR Walkthrough",
    description:
      "WebXR-ready viewer with orbit navigation, walkthrough mode, section cuts, and Meta Quest support.",
    accent: "from-primary/10 to-primary/5",
  },
  {
    icon: Pencil,
    title: "Real-Time Corrections",
    description:
      "Adjust walls, swap materials, move openings, and override AI detections — all updating live.",
    accent: "from-primary/10 to-primary/5",
  },
  {
    icon: Building2,
    title: "Enterprise Ready",
    description:
      "Multi-project dashboard, version history, shareable VR links, team collaboration, and annotation pins.",
    accent: "from-primary/10 to-primary/5",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="py-32 bg-surface relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(220_13%_91%/0.1)_1px,transparent_1px),linear-gradient(90deg,hsl(220_13%_91%/0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4">
            Platform Capabilities
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-5">
            The complete pipeline
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            From document upload to immersive VR — every step automated, every
            detail accurate.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              variants={item}
              className="group relative rounded-2xl border border-border bg-card p-8 hover:shadow-[var(--shadow-lg)] transition-all duration-500 hover:-translate-y-1.5 overflow-hidden"
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cardinal-light to-secondary flex items-center justify-center mb-6 group-hover:bg-gradient-cardinal transition-all duration-500 group-hover:shadow-cardinal">
                  <f.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-500" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {f.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
