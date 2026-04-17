import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "@/components/Logo";

const navLinks = [
  { label: "Product", href: "/" },
  { label: "Demo", href: "/demo" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Open the App", href: "/app" },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{
        background: "hsl(var(--background) / .85)",
        borderBottom: "1px solid hsl(var(--border))",
      }}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-6 px-6 py-4">
        <a href="#top" className="no-underline flex items-center">
          <Logo />
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className={`text-sm font-medium no-underline transition-colors ${
                label === "Production Bid App"
                  ? "font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={label === "Production Bid App" ? { color: "hsl(var(--gold))" } : undefined}
            >
              {label}
            </a>
          ))}
          <a
            href="/auth"
            className="inline-flex items-center px-5 py-2 rounded-lg text-sm font-bold no-underline transition-all hover:brightness-110"
            style={{ background: "hsl(var(--gold))", color: "hsl(var(--primary-foreground))" }}
          >
            Start Free Trial
          </a>
        </nav>

        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} className="text-foreground" /> : <Menu size={22} className="text-foreground" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden flex flex-col gap-1 px-6 pb-5" style={{ background: "hsl(var(--background))" }}>
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className={`text-sm no-underline py-2.5 px-3 rounded-lg transition-colors ${
                label === "Production Bid App"
                  ? "font-bold"
                  : "font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              style={label === "Production Bid App" ? { color: "hsl(var(--gold))" } : undefined}
              onClick={() => setMobileMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <a
            href="/auth"
            className="inline-flex items-center justify-center px-5 py-3 rounded-lg text-sm font-bold no-underline mt-2 transition-all hover:brightness-110"
            style={{ background: "hsl(var(--gold))", color: "hsl(var(--primary-foreground))" }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Start Free Trial
          </a>
        </nav>
      )}
    </header>
  );
};

export default Header;
