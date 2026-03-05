import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroPreview from "@/assets/hero-preview.jpg";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Refined grid */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(220_13%_91%/0.15)_1px,transparent_1px),linear-gradient(90deg,hsl(220_13%_91%/0.15)_1px,transparent_1px)] bg-[size:80px_80px]" />

      {/* Warm gradient orbs */}
      <div className="absolute top-1/4 right-1/3 w-[600px] h-[600px] rounded-full bg-gradient-cardinal opacity-[0.04] blur-[120px]" />
      <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-cardinal to-cardinal-dark opacity-[0.03] blur-[100px]" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-gradient-cardinal opacity-[0.02] blur-[80px]" />

      <div className="container relative z-10 pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <div>
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-border bg-secondary/60 backdrop-blur-sm px-5 py-2 mb-10"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-muted-foreground tracking-[0.15em] uppercase">
                AI-Powered Architecture
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-[clamp(2.5rem,5.5vw,5rem)] font-bold leading-[1.05] tracking-[-0.025em] text-foreground mb-8"
            >
              From blueprints
              <br className="hidden sm:block" />
              {" "}
              <span className="text-gradient-cardinal">to reality,</span>
              <br />
              in minutes.
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-lg md:text-xl text-muted-foreground max-w-xl mb-12 leading-[1.7] font-light"
            >
              Upload architectural plans and watch AI transform them into
              immersive, walkable 3D environments. Enterprise-grade digital twins,
              generated instantly.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/viewer">
                <Button
                  size="lg"
                  className="bg-gradient-cardinal text-primary-foreground shadow-cardinal hover:shadow-[0_12px_40px_hsl(0_72%_51%/0.3)] hover:opacity-95 px-10 h-14 text-[15px] font-semibold tracking-wide rounded-2xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 group"
                >
                  Start Building
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link to="/solutions">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-10 text-[15px] font-semibold tracking-wide border-border/60 text-foreground backdrop-blur-sm rounded-2xl hover:border-primary/20 hover:bg-primary/[0.03]"
                >
                  <Play className="mr-2 h-4 w-4" />
                  See Solutions
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="mt-16 flex items-center gap-0 max-w-md"
            >
              {[
                { value: "98%", label: "Accuracy" },
                { value: "<3min", label: "Generation" },
                { value: "60fps", label: "VR Ready" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={`flex-1 ${i > 0 ? "border-l border-border pl-8" : ""}`}
                >
                  <div className="font-display text-3xl font-bold text-foreground tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1.5 uppercase tracking-[0.2em] font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Hero visual */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            {/* Glow behind image */}
            <div className="absolute -inset-8 bg-gradient-cardinal opacity-[0.06] blur-[60px] rounded-3xl" />
            
            {/* Main preview */}
            <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-[var(--shadow-lg)]">
              <img
                src={heroPreview}
                alt="VisitCardinal 3D architectural visualization interface"
                className="w-full h-auto"
                loading="eager"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl px-4 py-3 shadow-[var(--shadow-md)] backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-cardinal flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">AI Processing</p>
                  <p className="text-[10px] text-muted-foreground">Blueprint → 3D in 2:34</p>
                </div>
              </div>
            </motion.div>

            {/* Floating stats badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute -top-3 -right-3 bg-card border border-border rounded-xl px-4 py-3 shadow-[var(--shadow-md)] backdrop-blur-sm"
            >
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Accuracy</p>
              <p className="text-lg font-display font-bold text-foreground">98.4%</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
