import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const logos = [
  "Gensler", "HOK", "SOM", "Perkins&Will", "AECOM", "Zaha Hadid", "Foster+Partners", "BIG",
];

const testimonials = [
  {
    quote: "VisitCardinal cut our visualization pipeline from 2 weeks to 2 hours. Our clients walk through their buildings before construction even starts.",
    name: "Sarah Chen",
    role: "Principal, Chen Architecture Studio",
    rating: 5,
  },
  {
    quote: "The AI accuracy is remarkable. We upload blueprints and get a fully walkable 3D model that we barely need to touch up. Game-changing for our pre-sales workflow.",
    name: "Marcus Rivera",
    role: "VP of Design, Rivera Development Group",
    rating: 5,
  },
  {
    quote: "We evaluated every 3D platform on the market. VisitCardinal is the only one that handles our commercial-scale projects without breaking a sweat.",
    name: "James Whitfield",
    role: "CTO, Whitfield & Associates",
    rating: 5,
  },
];

export default function SocialProofSection() {
  return (
    <section className="py-32 border-t border-border relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-cardinal opacity-[0.02] blur-[120px]" />
      
      <div className="container relative">
        {/* Logo bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-10">
            Trusted by leading architecture firms worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {logos.map((logo, i) => (
              <motion.span
                key={logo}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="text-lg font-display font-semibold text-muted-foreground/25 hover:text-muted-foreground/50 transition-colors duration-300 select-none cursor-default"
              >
                {logo}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4">
            Client Stories
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            Loved by architects
          </h2>
        </motion.div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group rounded-2xl border border-border bg-card p-8 flex flex-col hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden"
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative flex flex-col flex-1">
                {/* Quote icon */}
                <Quote className="h-8 w-8 text-primary/10 mb-4" />
                
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-primary text-primary" />
                  ))}
                </div>
                
                <blockquote className="text-sm text-foreground/80 leading-relaxed flex-1 mb-6">
                  "{t.quote}"
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-cardinal flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">
                      {t.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
