import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, CheckCircle2, Send, Building2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const contactInfo = [
  { icon: Mail, label: "Email", value: "hello@visitcardinal.com", href: "mailto:hello@visitcardinal.com" },
  { icon: Phone, label: "Phone", value: "+1 (555) 123-4567", href: "tel:+15551234567" },
  { icon: MapPin, label: "Office", value: "123 Architecture Ave, San Francisco, CA 94102", href: "#" },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Invalid email format";
    if (!formData.message.trim()) errs.message = "Message is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Contact Us — VisitCardinal"
        description="Get in touch with VisitCardinal. We'd love to hear from you about your architectural visualization needs."
        path="/contact"
      />
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto mb-20"
          >
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-5 leading-[1.1]">
              Get in
              <span className="text-gradient-cardinal"> touch</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Have a question or want a demo? We'd love to hear from you.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-8"
            >
              {contactInfo.map((c, i) => (
                <a
                  key={c.label}
                  href={c.href}
                  className="flex items-start gap-4 group"
                >
                  <div className="h-12 w-12 rounded-xl bg-cardinal-light flex items-center justify-center shrink-0 group-hover:bg-gradient-cardinal transition-colors duration-300">
                    <c.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-[0.15em] font-semibold mb-1">
                      {c.label}
                    </p>
                    <p className="text-sm text-foreground font-medium">{c.value}</p>
                  </div>
                </a>
              ))}

              <div className="rounded-2xl border border-border bg-card p-6 mt-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-cardinal flex items-center justify-center shadow-cardinal">
                    <Building2 className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Enterprise Sales</p>
                    <p className="text-xs text-muted-foreground">Custom solutions for firms</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Need SSO, dedicated infrastructure, or custom AI training? Our enterprise team will build a tailored solution for your firm.
                </p>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-border bg-card p-12 text-center"
                >
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                    Message Sent!
                  </h3>
                  <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                    Thank you for reaching out. Our team will respond within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-8 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="name" className="text-foreground mb-2 block">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className={errors.name ? "border-destructive" : ""}
                      />
                      {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-foreground mb-2 block">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@studio.com"
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="company" className="text-foreground mb-2 block">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Architecture Studio LLC"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-foreground mb-2 block">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your project or question..."
                      rows={5}
                      className={errors.message ? "border-destructive" : ""}
                    />
                    {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-cardinal text-primary-foreground shadow-cardinal hover:opacity-95 h-12 rounded-xl font-semibold"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
