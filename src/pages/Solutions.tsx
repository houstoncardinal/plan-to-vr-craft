import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, HardHat, Landmark, Home, Presentation, MapPin } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const solutions = [
  {
    icon: Building2,
    title: "Commercial Architecture",
    description: "Generate digital twins of office towers, retail spaces, and mixed-use developments. AI detects structural grids, MEP systems, and ADA-compliant pathways automatically.",
    features: ["Multi-story support", "MEP integration", "ADA compliance tools"],
  },
  {
    icon: Home,
    title: "Residential Design",
    description: "From single-family homes to luxury estates — upload floor plans and walk through your design in minutes. Perfect for client presentations and design reviews.",
    features: ["Interior furnishing AI", "Material libraries", "VR client walkthroughs"],
  },
  {
    icon: HardHat,
    title: "Construction & Pre-Build",
    description: "Visualize construction phases, identify clashes early, and coordinate trades with accurate 3D models generated directly from blueprints and specs.",
    features: ["Clash detection", "Phase visualization", "Trade coordination"],
  },
  {
    icon: Landmark,
    title: "Historic Preservation",
    description: "Document and reconstruct historic structures with precision. Our AI preserves architectural details while generating explorable 3D models for preservation planning.",
    features: ["Detail preservation", "Documentation export", "Restoration planning"],
  },
  {
    icon: Presentation,
    title: "Real Estate Marketing",
    description: "Create stunning virtual tours for pre-construction sales. Immersive 3D walkthroughs help buyers visualize spaces before a single brick is laid.",
    features: ["Virtual staging", "Shareable VR links", "Branded presentations"],
  },
  {
    icon: MapPin,
    title: "Urban Planning",
    description: "Model entire neighborhoods and developments. Combine multiple buildings, infrastructure, and landscape elements into cohesive urban visualizations.",
    features: ["Neighborhood mode", "Site analysis", "Environmental simulation"],
  },
];

export default function Solutions() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Solutions — VisitCardinal | Architectural Visualization for Every Project"
        description="From commercial towers to residential homes, VisitCardinal's AI adapts to your workflow. Explore solutions for every project type."
        path="/solutions"
      />
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-5 leading-[1.1]">
              Solutions for every
              <br />
              <span className="text-gradient-cardinal">project type</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Whether you're designing a luxury home or planning a city block,
              VisitCardinal adapts to your workflow.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">
            {solutions.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="group rounded-2xl border border-border bg-card p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                <div className="h-12 w-12 rounded-xl bg-cardinal-light flex items-center justify-center mb-6 group-hover:bg-gradient-cardinal transition-colors duration-300">
                  <s.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{s.description}</p>
                <div className="flex flex-wrap gap-2">
                  {s.features.map((f) => (
                    <span key={f} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-secondary text-muted-foreground border border-border">
                      {f}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link to="/viewer">
              <Button size="lg" className="bg-gradient-cardinal text-primary-foreground shadow-cardinal hover:opacity-95 h-14 px-12 text-[15px] font-semibold tracking-wide rounded-2xl transition-all duration-300 hover:-translate-y-0.5">
                Start Building Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
