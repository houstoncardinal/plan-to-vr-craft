import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What file formats does VisitCardinal support?",
    answer: "We support PDF, DWG, DXF, PNG, JPG, and WEBP files. You can upload floor plans, elevations, site plans, and even photos of hand-drawn sketches. Multi-file batch upload is supported with files up to 50MB each.",
  },
  {
    question: "How accurate is the AI-generated 3D model?",
    answer: "Our AI achieves 98.4% accuracy on wall placement, door/window detection, and room identification. All AI detections can be manually overridden in the editor, giving you full control over the final output.",
  },
  {
    question: "Do I need to install any software or plugins?",
    answer: "No. VisitCardinal runs entirely in your browser using WebXR technology. There's nothing to install — just open the link and start building. It works on Chrome, Firefox, Safari, Edge, and even Meta Quest browsers.",
  },
  {
    question: "Can I share the 3D model with clients?",
    answer: "Yes! Every project generates a shareable VR link that your clients can open in any browser. They can orbit, walk through, and explore the space in full 3D — no account or login required.",
  },
  {
    question: "What export formats are available?",
    answer: "Professional and Enterprise plans support export to OBJ, glTF/GLB, and PDF formats. The glTF format preserves PBR materials and is compatible with Unreal Engine, Unity, Blender, and other 3D tools.",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use enterprise-grade encryption (AES-256 at rest, TLS 1.3 in transit), SOC 2 Type II compliance, and offer SSO/SAML authentication on Enterprise plans. Your architectural data never leaves our secure infrastructure.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel anytime with no penalties. Your projects remain accessible in read-only mode after cancellation. You can re-activate your plan at any time to regain full editing access.",
  },
  {
    question: "Do you offer team collaboration features?",
    answer: "Professional and Enterprise plans include real-time collaboration — multiple team members can view and edit the same project simultaneously, pin annotations, and share revision history.",
  },
];

export default function FAQSection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-[0.15em] mb-6 shadow-[var(--shadow-sm)]">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            FAQ
          </span>
          <h2 className="font-display text-3xl md:text-[3.25rem] font-bold text-foreground mb-6 leading-tight">
            Frequently asked
            <span className="text-gradient-cardinal"> questions</span>
          </h2>
          <p className="text-foreground/70 text-lg max-w-xl mx-auto leading-relaxed">
            Everything you need to know about the platform.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-border rounded-2xl px-6 bg-card data-[state=open]:shadow-[var(--shadow-md)] transition-shadow duration-300"
              >
                <AccordionTrigger className="text-left text-[15px] font-semibold text-foreground hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>

      {/* JSON-LD FAQPage schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </section>
  );
}
