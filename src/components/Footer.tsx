export default function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-gradient-cardinal flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary-foreground">VC</span>
          </div>
          <span className="text-sm font-display font-semibold text-foreground">
            VisitCardinal
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          © 2026 Cardinal Consulting. All rights reserved.
        </p>
        <div className="flex gap-6">
          {["Privacy", "Terms", "Contact"].map((link) => (
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
    </footer>
  );
}
