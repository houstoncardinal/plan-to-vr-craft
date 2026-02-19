import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(220_13%_91%/0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(220_13%_91%/0.3)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      {/* Gradient orb */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-cardinal opacity-[0.04] blur-3xl" />

      <div className="container relative z-10 pt-24">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 mb-8"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-cardinal animate-pulse-glow" />
            <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
              AI-Powered Architecture
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-foreground mb-6"
          >
            From blueprints{" "}
            <span className="text-gradient-cardinal">to reality</span>
            <br />in minutes
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed"
          >
            Upload architectural plans and watch AI transform them into
            immersive, walkable 3D environments. Enterprise-grade digital twins,
            generated instantly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-cardinal text-primary-foreground shadow-cardinal hover:opacity-90 px-8 h-12 text-base"
              >
                Start Building
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base border-border text-foreground hover:bg-secondary"
            >
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20 grid grid-cols-3 gap-8 max-w-lg"
          >
            {[
              { value: "98%", label: "Accuracy" },
              { value: "<3min", label: "Generation" },
              { value: "60fps", label: "VR Ready" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
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
