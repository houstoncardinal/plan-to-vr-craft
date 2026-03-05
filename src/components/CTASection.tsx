import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl bg-foreground p-16 md:p-24 text-center overflow-hidden"
        >
          {/* Dot pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(hsl(0_0%_100%/0.04)_1px,transparent_1px)] bg-[size:24px_24px]" />

          {/* Decorative orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-cardinal opacity-[0.12] blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-gradient-cardinal opacity-[0.08] blur-[80px]" />

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full border border-background/10 bg-background/5 backdrop-blur-sm px-4 py-1.5 mb-8"
            >
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold text-background/70 tracking-[0.12em] uppercase">
                Free to start
              </span>
            </motion.div>

            <h2 className="font-display text-3xl md:text-[3.25rem] font-bold text-background mb-6 leading-tight">
              Ready to transform your
              <br className="hidden sm:block" />
              <span className="text-gradient-cardinal"> architectural workflow?</span>
            </h2>
            <p className="text-background/50 text-lg max-w-xl mx-auto mb-12 leading-relaxed">
              Join thousands of firms using VisitCardinal to create immersive 3D
              experiences from architectural plans.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/viewer">
                <Button
                  size="lg"
                  className="bg-gradient-cardinal text-primary-foreground h-14 px-12 text-[15px] font-semibold tracking-wide rounded-2xl shadow-cardinal hover:shadow-[0_16px_48px_hsl(0_72%_51%/0.35)] transition-all duration-300 hover:-translate-y-0.5 group"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-10 text-[15px] font-semibold tracking-wide rounded-2xl border-background/20 text-background hover:bg-background/10 hover:border-background/30 transition-all duration-300"
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
