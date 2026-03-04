import { Link } from "react-router-dom";

const footerLinks = {
  Product: [
    { label: "3D Viewer", href: "/viewer" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "AI Copilot", href: "/viewer" },
    { label: "Blueprint Upload", href: "/viewer" },
  ],
  Solutions: [
    { label: "Commercial", href: "/solutions" },
    { label: "Residential", href: "/solutions" },
    { label: "Construction", href: "/solutions" },
    { label: "Urban Planning", href: "/solutions" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Pricing", href: "/pricing" },
    { label: "Careers", href: "/about" },
    { label: "Contact", href: "/about" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Community", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-7 w-7 rounded-md bg-gradient-cardinal flex items-center justify-center">
                <span className="text-[10px] font-bold text-primary-foreground">VC</span>
              </div>
              <span className="text-sm font-display font-semibold text-foreground">
                VisitCardinal
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed mb-6 max-w-[200px]">
              AI-powered architectural visualization. From blueprints to immersive 3D, in minutes.
            </p>
            <div className="flex gap-3">
              {["X", "Li", "Gh"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-[0.15em] mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 Cardinal Consulting. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
