import { motion } from "framer-motion";

const logos = [
  "Gensler", "HOK", "SOM", "Perkins&Will", "AECOM", "Zaha Hadid",
];

const testimonials = [
  {
    quote: "VisitCardinal cut our visualization pipeline from 2 weeks to 2 hours. Our clients walk through their buildings before construction even starts.",
    name: "Sarah Chen",
    role: "Principal, Chen Architecture Studio",
  },
  {
    quote: "The AI accuracy is remarkable. We upload blueprints and get a fully walkable 3D model that we barely need to touch up. Game-changing for our pre-sales workflow.",
    name: "Marcus Rivera",
    role: "VP of Design, Rivera Development Group",
  },
  {
    quote: "We evaluated every 3D platform on the market. VisitCardinal is the only one that handles our commercial-scale projects without breaking a sweat.",
    name: "James Whitfield",
    role: "CTO, Whitfield & Associates",
  },
];

export default function SocialProofSection() {
  return (
    <section className="py-24 border-t border-border">
      <div className="container">
        {/* Logo bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-8">
            Trusted by leading architecture firms worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {logos.map((logo) => (
              <span
                key={logo}
                className="text-lg font-display font-semibold text-muted-foreground/30 select-none"
              >
                {logo}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-8 flex flex-col"
            >
              <blockquote className="text-sm text-foreground leading-relaxed flex-1 mb-6">
                "{t.quote}"
              </blockquote>
              <div>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
