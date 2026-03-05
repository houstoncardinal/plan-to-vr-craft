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
      "Drag-and-drop PDF, DWG, DXF files. Multi-file support with real-time progress tracking and instant validation.",
  },
  {
    icon: Brain,
    title: "AI Document Intelligence",
    description:
      "Multimodal AI detects walls, doors, windows, structural grids, MEP systems, and dimensions — automatically.",
  },
  {
    icon: Box,
    title: "3D Reconstruction",
    description:
      "Parametric engine generates accurate wall extrusions, floor slabs, roof geometry, and multi-story structures.",
  },
  {
    icon: Eye,
    title: "VR Walkthrough",
    description:
      "WebXR-ready viewer with orbit navigation, first-person walkthrough, section cuts, and Meta Quest support.",
  },
  {
    icon: Pencil,
    title: "Real-Time Editing",
    description:
      "Adjust walls, swap materials, move openings, and override AI detections — everything updates live in the viewport.",
  },
  {
    icon: Building2,
    title: "Enterprise Ready",
    description:
      "Multi-project dashboard, version history, shareable VR links, team collaboration, and annotation pinning.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="py-32 relative overflow-hidden">
      {/* Subtle top border fade */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-[0.15em] mb-6 shadow-[var(--shadow-sm)]">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Platform Capabilities
          </span>
          <h2 className="font-display text-3xl md:text-[3.25rem] font-bold text-foreground mb-6 leading-tight">
            Everything you need,
            <br className="hidden sm:block" />
            <span className="text-gradient-cardinal"> nothing you don't</span>
          </h2>
          <p className="text-foreground/70 text-lg max-w-xl mx-auto leading-relaxed">
            From document upload to immersive VR walkthrough — every step automated,
            every detail pixel-perfect.
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
              className="group relative rounded-2xl border border-border bg-card p-8 hover:shadow-[0_20px_60px_-15px_hsl(220_20%_12%/0.1)] transition-all duration-500 hover:-translate-y-1 overflow-hidden"
            >
              {/* Hover accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-cardinal scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              <div className="relative">
                <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-gradient-cardinal transition-all duration-500 group-hover:shadow-cardinal">
                  <f.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-500" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {f.title}
                </h3>
                <p className="text-foreground/60 text-[15px] leading-relaxed">
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
