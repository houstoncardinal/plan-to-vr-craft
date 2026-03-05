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
    <section className="py-32 bg-foreground relative overflow-hidden">
      {/* Grid texture */}
      <div className="absolute inset-0 bg-[radial-gradient(hsl(0_0%_100%/0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      {/* Decorative orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-cardinal opacity-[0.08] blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-cardinal opacity-[0.06] blur-[100px]" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-background/10 bg-background/5 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-background/60 uppercase tracking-[0.15em] mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            By The Numbers
          </span>
          <h2 className="font-display text-3xl md:text-[3.25rem] font-bold text-background mb-6 leading-tight">
            Built for enterprise
            <span className="text-gradient-cardinal"> scale</span>
          </h2>
          <p className="text-background/50 text-lg max-w-xl mx-auto leading-relaxed">
            Powering architectural visualization for firms of every size,
            from boutique studios to global enterprises.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group text-center p-8 rounded-2xl border border-background/[0.08] bg-background/[0.03] backdrop-blur-sm hover:bg-background/[0.07] hover:border-background/[0.15] transition-all duration-500"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-cardinal flex items-center justify-center mx-auto mb-5 shadow-cardinal group-hover:scale-110 transition-transform duration-500">
                <m.icon className="h-6 w-6 text-background" />
              </div>
              <div className="font-display text-4xl font-bold text-background mb-2 tracking-tight">
                {m.value}
              </div>
              <div className="text-sm font-semibold text-background/70 mb-1.5">
                {m.label}
              </div>
              <div className="text-xs text-background/40 leading-relaxed">
                {m.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
