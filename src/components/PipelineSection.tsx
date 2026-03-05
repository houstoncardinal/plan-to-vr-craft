import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Upload, Cpu, Shapes, Paintbrush, CheckCircle2, ArrowRight } from "lucide-react";

const steps = [
  { icon: Upload, label: "Upload Plans", desc: "Drag & drop PDF, DWG, or images" },
  { icon: Cpu, label: "AI Analysis", desc: "Walls, doors & rooms detected" },
  { icon: Shapes, label: "3D Generation", desc: "Parametric model built live" },
  { icon: Paintbrush, label: "Materials", desc: "Surfaces auto-applied with PBR" },
  { icon: CheckCircle2, label: "Explore", desc: "Walk through in VR or 3D" },
];

export default function PipelineSection() {
  return (
    <section className="py-32 bg-secondary/30 relative overflow-hidden">
      {/* Top/bottom borders */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-[0.15em] mb-6 shadow-[var(--shadow-sm)]">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            How It Works
          </span>
          <h2 className="font-display text-3xl md:text-[3.25rem] font-bold text-foreground mb-6 leading-tight">
            Five steps to your
            <span className="text-gradient-cardinal"> digital twin</span>
          </h2>
          <p className="text-foreground/70 text-lg max-w-xl mx-auto leading-relaxed">
            Our AI pipeline handles the complexity so you can focus on design.
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connection line */}
          <div className="absolute top-16 left-[12%] right-[12%] h-px hidden md:block overflow-hidden">
            <div className="w-full h-full bg-border" />
            <motion.div
              className="absolute top-0 left-0 h-full w-1/5 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
              animate={{ x: ["0%", "400%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="relative z-10 h-32 w-32 rounded-2xl border border-border bg-card flex items-center justify-center mb-6 shadow-[var(--shadow-sm)] group-hover:shadow-[var(--shadow-lg)] group-hover:border-primary/30 group-hover:-translate-y-2 transition-all duration-500">
                  <step.icon className="h-10 w-10 text-primary transition-transform duration-500 group-hover:scale-110" />
                  <span className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-gradient-cardinal text-primary-foreground text-xs font-bold flex items-center justify-center shadow-cardinal">
                    {i + 1}
                  </span>
                </div>
                <span className="text-sm font-semibold text-foreground mb-1.5">
                  {step.label}
                </span>
                <span className="text-xs text-muted-foreground leading-snug max-w-[150px]">
                  {step.desc}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link
            to="/viewer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group"
          >
            Try it now — upload your first blueprint
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
