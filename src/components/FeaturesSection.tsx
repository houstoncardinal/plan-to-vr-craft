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
  },
  {
    icon: Brain,
    title: "AI Document Intelligence",
    description:
      "Multimodal AI detects walls, doors, windows, structural grids, MEP systems, and dimensions automatically.",
  },
  {
    icon: Box,
    title: "3D Reconstruction",
    description:
      "Parametric engine generates accurate wall extrusions, floor slabs, roof geometry, and multi-story support.",
  },
  {
    icon: Eye,
    title: "VR Walkthrough",
    description:
      "WebXR-ready viewer with orbit navigation, walkthrough mode, section cuts, and Meta Quest support.",
  },
  {
    icon: Pencil,
    title: "Real-Time Corrections",
    description:
      "Adjust walls, swap materials, move openings, and override AI detections — all updating live.",
  },
  {
    icon: Building2,
    title: "Enterprise Ready",
    description:
      "Multi-project dashboard, version history, shareable VR links, team collaboration, and annotation pins.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="py-32 bg-surface">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            The complete pipeline
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            From document upload to immersive VR — every step automated, every
            detail accurate.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className="group rounded-2xl border border-border bg-card p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="h-12 w-12 rounded-xl bg-cardinal-light flex items-center justify-center mb-6 group-hover:bg-gradient-cardinal transition-colors duration-300">
                <f.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {f.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {f.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
