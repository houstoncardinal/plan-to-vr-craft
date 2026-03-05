import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl bg-gradient-to-br from-card to-secondary p-16 md:p-24 text-center overflow-hidden border border-border"
        >
          {/* Background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(hsl(220_13%_91%/0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(220_13%_91%/0.3)_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          {/* Decorative orbs */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-cardinal opacity-[0.05] blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gradient-cardinal opacity-[0.05] blur-[60px]" />

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 backdrop-blur-sm px-4 py-1.5 mb-8"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Free to start</span>
            </motion.div>

            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Ready to transform your
              <br />
              <span className="text-gradient-cardinal">architectural workflow?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Join leading firms using VisitCardinal to create immersive 3D
              experiences from architectural plans.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/viewer">
                <Button
                  size="lg"
                  className="bg-gradient-cardinal text-primary-foreground h-14 px-12 text-[15px] font-semibold tracking-wide rounded-2xl shadow-cardinal hover:shadow-[0_12px_40px_hsl(0_72%_51%/0.3)] transition-all duration-300 hover:-translate-y-0.5 group"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-10 text-[15px] font-semibold tracking-wide rounded-2xl border-border text-foreground hover:bg-secondary"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
