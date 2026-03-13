import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import DemoSection from "@/components/DemoSection";
import PipelineSection from "@/components/PipelineSection";
import ShowcaseSection from "@/components/ShowcaseSection";
import SocialProofSection from "@/components/SocialProofSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="VisitCardinal — AI-Powered Architectural Visualization Platform"
        description="Transform architectural blueprints into immersive 3D walkthroughs in minutes. AI-powered digital twin generation for architects and developers."
        path="/"
      />
      {/* Organization JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "VisitCardinal",
            url: "https://cardinalbuilderai.lovable.app",
            logo: "https://cardinalbuilderai.lovable.app/favicon.ico",
            description: "AI-powered architectural visualization platform that transforms blueprints into immersive 3D environments.",
            sameAs: [],
            contactPoint: {
              "@type": "ContactPoint",
              email: "hello@visitcardinal.com",
              contactType: "sales",
            },
          }),
        }}
      />
      {/* SoftwareApplication JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "VisitCardinal",
            applicationCategory: "DesignApplication",
            operatingSystem: "Web",
            offers: [
              { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Starter" },
              { "@type": "Offer", price: "79", priceCurrency: "USD", name: "Professional" },
            ],
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              ratingCount: "487",
            },
          }),
        }}
      />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <PipelineSection />
      <ShowcaseSection />
      <SocialProofSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
