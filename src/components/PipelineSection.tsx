import { motion } from "framer-motion";
import { Upload, Cpu, Shapes, Paintbrush, CheckCircle2 } from "lucide-react";

const steps = [
  { icon: Upload, label: "Upload Plans", color: "text-primary" },
  { icon: Cpu, label: "AI Analysis", color: "text-primary" },
  { icon: Shapes, label: "3D Generation", color: "text-primary" },
  { icon: Paintbrush, label: "Material Application", color: "text-primary" },
  { icon: CheckCircle2, label: "Ready to Explore", color: "text-primary" },
];

export default function PipelineSection() {
  return (
    <section className="py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Five steps to your digital twin
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Our AI pipeline handles the complexity so you can focus on design.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connection line */}
          <div className="absolute top-10 left-0 right-0 h-px bg-border hidden md:block" />

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative z-10 h-20 w-20 rounded-2xl border-2 border-border bg-card flex items-center justify-center mb-4 shadow-sm">
                  <step.icon className={`h-8 w-8 ${step.color}`} />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {step.label}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  Step {i + 1}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
