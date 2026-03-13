import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search } from "lucide-react";
import SEOHead from "@/components/SEOHead";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <SEOHead
        title="Page Not Found — VisitCardinal"
        description="The page you're looking for doesn't exist. Return to VisitCardinal."
        path="/404"
      />
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(hsl(var(--border)/0.4)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-gradient-cardinal opacity-[0.04] blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center px-6"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12 }}
          className="font-display text-[8rem] md:text-[12rem] font-bold text-gradient-cardinal leading-none mb-4"
        >
          404
        </motion.div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
          Page not found
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/">
            <Button className="bg-gradient-cardinal text-primary-foreground shadow-cardinal hover:opacity-95 rounded-xl h-12 px-8">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link to="/solutions">
            <Button variant="outline" className="rounded-xl h-12 px-8">
              <Search className="mr-2 h-4 w-4" />
              Explore Solutions
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
