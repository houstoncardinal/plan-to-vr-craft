import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Globe, Award, Target } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const values = [
  { icon: Target, title: "Precision First", description: "Every wall, every dimension, every material — we obsess over accuracy so architects can trust what they see." },
  { icon: Users, title: "Built for Teams", description: "Collaboration isn't an afterthought. Share, annotate, and iterate together in real time across disciplines." },
  { icon: Globe, title: "Accessible Everywhere", description: "WebXR-powered experiences run in any browser. No installs, no plugins, no barriers." },
  { icon: Award, title: "Enterprise Grade", description: "SOC 2 compliance, SSO, dedicated infrastructure. Security and reliability that firms demand." },
];

const stats = [
  { value: "10K+", label: "Projects Generated" },
  { value: "500+", label: "Architecture Firms" },
  { value: "98.4%", label: "Accuracy Rate" },
  { value: "<3min", label: "Avg. Generation Time" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="About VisitCardinal — Building the Future of Architecture"
        description="Learn about VisitCardinal's mission to make immersive architectural visualization accessible to every firm, from boutique studios to global enterprises."
        path="/about"
      />
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="container">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-24"
          >
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 leading-[1.1]">
              We're building the future
              <br />
              <span className="text-gradient-cardinal">of architecture</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
              VisitCardinal was founded with a simple belief: architects shouldn't spend weeks
              manually building 3D models from blueprints. AI can do it in minutes — with
              enterprise-grade precision.
            </p>
            <Link to="/viewer">
              <Button size="lg" className="bg-gradient-cardinal text-primary-foreground shadow-cardinal hover:opacity-95 h-14 px-12 text-[15px] font-semibold tracking-wide rounded-2xl transition-all duration-300 hover:-translate-y-0.5">
                Try It Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-gradient-dark p-10 md:p-14 grid grid-cols-2 md:grid-cols-4 gap-8 mb-24"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-primary-foreground/50 uppercase tracking-[0.2em] font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-14">
              Our principles
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-border bg-card p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="h-12 w-12 rounded-xl bg-cardinal-light flex items-center justify-center mb-5">
                    <v.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Mission statement */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <blockquote className="font-display text-2xl md:text-3xl font-semibold text-foreground leading-[1.4] italic">
              "Our mission is to make immersive architectural visualization
              accessible to every firm — from boutique studios to global enterprises."
            </blockquote>
            <p className="mt-6 text-sm text-muted-foreground">
              — Cardinal Consulting Leadership
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
