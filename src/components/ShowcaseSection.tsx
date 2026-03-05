import { motion } from "framer-motion";
import { Zap, Shield, Globe, Clock } from "lucide-react";

const metrics = [
  { icon: Zap, value: "10,000+", label: "Projects Generated", description: "Architectural models created by firms worldwide" },
  { icon: Clock, value: "2.4 min", label: "Avg. Generation Time", description: "From blueprint upload to walkable 3D model" },
  { icon: Shield, value: "99.9%", label: "Uptime SLA", description: "Enterprise-grade infrastructure & reliability" },
  { icon: Globe, value: "47", label: "Countries", description: "Architecture firms across the globe trust us" },
];

export default function ShowcaseSection() {
  return (
    <section className="py-32 bg-gradient-dark relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-cardinal opacity-[0.08] blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-gradient-cardinal opacity-[0.06] blur-[80px]" />
      
      {/* Grid texture */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(0_0%_100%/0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(0_0%_100%/0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block text-xs font-semibold text-primary-foreground/60 uppercase tracking-[0.2em] mb-4">
            By The Numbers
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-5">
            Built for scale
          </h2>
          <p className="text-primary-foreground/60 text-lg max-w-xl mx-auto leading-relaxed">
            Powering architectural visualization for firms of every size, from boutique studios to global enterprises.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group text-center p-8 rounded-2xl border border-primary-foreground/[0.08] bg-primary-foreground/[0.03] backdrop-blur-sm hover:bg-primary-foreground/[0.06] hover:border-primary-foreground/[0.15] transition-all duration-500"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-cardinal flex items-center justify-center mx-auto mb-5 shadow-cardinal group-hover:scale-110 transition-transform duration-500">
                <m.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="font-display text-4xl font-bold text-primary-foreground mb-2 tracking-tight">
                {m.value}
              </div>
              <div className="text-sm font-semibold text-primary-foreground/80 mb-1.5">
                {m.label}
              </div>
              <div className="text-xs text-primary-foreground/40 leading-relaxed">
                {m.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
