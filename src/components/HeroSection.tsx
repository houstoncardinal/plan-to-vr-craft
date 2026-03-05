import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import heroPreview from "@/assets/hero-preview.jpg";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(hsl(var(--border)/0.4)_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Ambient gradient orbs */}
      <div className="absolute top-20 left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-cardinal-light to-transparent opacity-40 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-cardinal opacity-[0.03] blur-[120px] pointer-events-none" />

      <div className="container relative z-10 pt-32 pb-24">
        {/* Centered hero layout */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/80 backdrop-blur-sm px-5 py-2.5 mb-10 shadow-[var(--shadow-sm)]"
          >
            <span className="h-2 w-2 rounded-full bg-gradient-cardinal animate-pulse" />
            <span className="text-xs font-semibold text-foreground tracking-[0.12em] uppercase">
              AI-Powered Architecture Platform
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-[clamp(2.75rem,6vw,5.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-foreground mb-8"
          >
            Transform blueprints into
            <br />
            <span className="text-gradient-cardinal">immersive 3D worlds</span>
          </motion.h1>

          {/* Subheadline — black/foreground text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-12 leading-[1.8]"
          >
            Upload your architectural plans and watch AI transform them into
            photorealistic, walkable 3D environments — in minutes, not weeks.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-8"
          >
            <Link to="/viewer">
              <Button
                size="lg"
                className="bg-gradient-cardinal text-primary-foreground shadow-cardinal hover:shadow-[0_16px_48px_hsl(0_72%_51%/0.35)] hover:opacity-95 px-12 h-14 text-[15px] font-semibold tracking-wide rounded-2xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 group"
              >
                Start Building Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/solutions">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 text-[15px] font-semibold tracking-wide border-border text-foreground rounded-2xl hover:border-primary/30 hover:bg-primary/[0.03] transition-all duration-300"
              >
                <Play className="mr-2 h-4 w-4 fill-primary text-primary" />
                Watch Demo
              </Button>
            </Link>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            {["No credit card required", "Free 14-day trial", "Cancel anytime"].map((text) => (
              <span key={text} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                {text}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Hero visual — full-width browser mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-6xl mx-auto"
        >
          {/* Glow behind */}
          <div className="absolute -inset-6 bg-gradient-cardinal opacity-[0.06] blur-[80px] rounded-3xl pointer-events-none" />

          {/* Browser chrome */}
          <div className="relative rounded-2xl overflow-hidden border border-border/60 shadow-[0_25px_80px_-12px_hsl(220_20%_12%/0.18)] bg-card">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border bg-secondary/40">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-[hsl(45_80%_55%)]/60" />
                <div className="h-3 w-3 rounded-full bg-[hsl(140_50%_50%)]/60" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-background/80 border border-border rounded-lg px-4 py-1 text-[11px] text-muted-foreground font-medium tracking-wide">
                  app.visitcardinal.com/viewer
                </div>
              </div>
              <div className="w-14" />
            </div>

            {/* Preview image */}
            <img
              src={heroPreview}
              alt="VisitCardinal 3D architectural visualization — luxury modern building at dusk"
              className="w-full h-auto block"
              loading="eager"
            />
          </div>

          {/* Floating badge — bottom left */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="absolute -bottom-5 -left-4 md:left-8 bg-card border border-border rounded-2xl px-5 py-4 shadow-[var(--shadow-lg)] backdrop-blur-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-gradient-cardinal flex items-center justify-center shadow-cardinal">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">AI Processing Complete</p>
                <p className="text-xs text-muted-foreground mt-0.5">Blueprint → 3D Model in 2:34</p>
              </div>
            </div>
          </motion.div>

          {/* Floating badge — top right */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="absolute -top-4 -right-4 md:right-8 bg-card border border-border rounded-2xl px-5 py-4 shadow-[var(--shadow-lg)] backdrop-blur-sm"
          >
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-medium">Model Accuracy</p>
            <p className="text-2xl font-display font-bold text-foreground mt-0.5">98.4%</p>
          </motion.div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <div className="grid grid-cols-3 gap-0 rounded-2xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden">
            {[
              { value: "10,000+", label: "Models Generated" },
              { value: "<3 min", label: "Average Build Time" },
              { value: "60 fps", label: "VR-Ready Output" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`text-center py-6 px-4 ${i > 0 ? "border-l border-border" : ""}`}
              >
                <div className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1.5 uppercase tracking-[0.15em] font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
