import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Refined grid */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(220_13%_91%/0.2)_1px,transparent_1px),linear-gradient(90deg,hsl(220_13%_91%/0.2)_1px,transparent_1px)] bg-[size:80px_80px]" />

      {/* Warm gradient orbs */}
      <div className="absolute top-1/4 right-1/3 w-[600px] h-[600px] rounded-full bg-gradient-cardinal opacity-[0.03] blur-[100px]" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-cardinal to-cardinal-dark opacity-[0.02] blur-[80px]" />

      <div className="container relative z-10 pt-32 pb-20">
        <div className="max-w-4xl">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-border bg-secondary/60 backdrop-blur-sm px-5 py-2 mb-10"
          >
            <span className="h-2 w-2 rounded-full bg-gradient-cardinal animate-pulse-glow" />
            <span className="text-xs font-semibold text-muted-foreground tracking-[0.15em] uppercase">
              AI-Powered Architecture
            </span>
          </motion.div>

          {/* Headline — balanced line breaks */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-[clamp(2.75rem,6vw,5.5rem)] font-bold leading-[1.05] tracking-[-0.025em] text-foreground mb-8"
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
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-[1.7] font-light"
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
            <Link to="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-cardinal text-primary-foreground shadow-cardinal hover:opacity-90 px-10 h-13 text-base font-medium rounded-xl"
              >
                Start Building
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="h-13 px-10 text-base border-border text-foreground hover:bg-secondary/80 font-medium rounded-xl"
            >
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats — refined with subtle dividers */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-24 flex items-center gap-0 max-w-lg"
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
                <div className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1.5 uppercase tracking-[0.2em] font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
