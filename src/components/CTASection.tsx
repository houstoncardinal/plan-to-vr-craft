import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl bg-gradient-dark p-16 md:p-24 text-center overflow-hidden"
        >
          {/* Decorative orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gradient-cardinal opacity-10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-gradient-cardinal opacity-10 blur-3xl" />

          <h2 className="relative font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to transform your
            <br />
            architectural workflow?
          </h2>
          <p className="relative text-primary-foreground/70 text-lg max-w-xl mx-auto mb-10">
            Join leading firms using VisitCardinal to create immersive 3D
            experiences from architectural plans.
          </p>
          <Link to="/dashboard">
            <Button
              size="lg"
              className="relative bg-primary-foreground text-foreground hover:bg-primary-foreground/90 h-12 px-8 text-base font-semibold"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
