import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Zap } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for exploring the platform and small projects.",
    features: [
      "1 active project",
      "Basic 3D viewer",
      "5 AI generations / month",
      "Community support",
      "Export to JSON",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$79",
    period: "/mo",
    description: "For architects and designers who need the full toolkit.",
    features: [
      "Unlimited projects",
      "Blueprint-to-3D AI conversion",
      "AI Copilot (unlimited)",
      "VR walkthrough mode",
      "Priority support",
      "Team sharing & collaboration",
      "Export to OBJ, glTF, PDF",
      "Custom materials library",
    ],
    cta: "Start 14-Day Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For firms and organizations with advanced requirements.",
    features: [
      "Everything in Professional",
      "SSO & SAML authentication",
      "Dedicated infrastructure",
      "Custom AI model training",
      "API access & webhooks",
      "SLA guarantee (99.9%)",
      "Onboarding & training",
      "Volume licensing",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto mb-20"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-1.5 mb-6">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">Simple Pricing</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-5 leading-[1.1]">
              Plans that scale
              <br />
              <span className="text-gradient-cardinal">with your vision</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Start free, upgrade when you're ready. No hidden fees, no surprises.
            </p>
          </motion.div>

          {/* Plans grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  plan.highlighted
                    ? "bg-gradient-dark text-primary-foreground border-2 border-primary/30 shadow-cardinal scale-[1.03]"
                    : "bg-card border border-border"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-cardinal text-primary-foreground text-[11px] font-bold tracking-widest uppercase px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className={`font-display text-xl font-semibold mb-2 ${plan.highlighted ? "text-primary-foreground" : "text-foreground"}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className={`text-4xl font-bold ${plan.highlighted ? "text-primary-foreground" : "text-foreground"}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`text-sm ${plan.highlighted ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className={`text-sm mb-8 leading-relaxed ${plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-emerald-400" : "text-primary"}`} />
                      <span className={`text-sm ${plan.highlighted ? "text-primary-foreground/85" : "text-foreground"}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/viewer">
                  <Button
                    className={`w-full h-12 rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                      plan.highlighted
                        ? "bg-primary-foreground text-foreground hover:bg-primary-foreground/95 shadow-lg"
                        : "bg-gradient-cardinal text-primary-foreground shadow-cardinal hover:opacity-95"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
