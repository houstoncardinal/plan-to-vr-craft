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
    <section className="py-32 relative overflow-hidden">
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

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
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
            {logos.map((logo, i) => (
              <motion.span
                key={logo}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="text-lg font-display font-semibold text-muted-foreground/20 hover:text-muted-foreground/50 transition-colors duration-500 select-none cursor-default"
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
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-[0.15em] mb-6 shadow-[var(--shadow-sm)]">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Client Stories
          </span>
          <h2 className="font-display text-3xl md:text-[3.25rem] font-bold text-foreground leading-tight">
            Loved by
            <span className="text-gradient-cardinal"> architects</span>
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
              className="group rounded-2xl border border-border bg-card p-8 flex flex-col hover:shadow-[0_20px_60px_-15px_hsl(220_20%_12%/0.1)] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-cardinal scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              <div className="relative flex flex-col flex-1">
                <Quote className="h-8 w-8 text-primary/10 mb-4" />
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="text-[15px] text-foreground/75 leading-relaxed flex-1 mb-8">
                  "{t.quote}"
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-cardinal flex items-center justify-center shadow-cardinal">
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
