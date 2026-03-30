import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "@/components/Logo";

const navLinks = [
  { label: "Product", href: "/" },
  { label: "Solutions", href: "/solutions" },
  { label: "Security", href: "/security" },
  { label: "Watch Demo", href: "/#demo" },
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
              className="text-sm font-medium no-underline transition-colors text-muted-foreground hover:text-foreground"
            >
              {label}
            </a>
          ))}
          <a
            href="#get-access"
            className="inline-flex items-center px-5 py-2 rounded-lg text-sm font-bold no-underline transition-all hover:brightness-110"
            style={{ background: "hsl(var(--gold))", color: "hsl(var(--primary-foreground))" }}
          >
            Book a Demo
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
        <nav className="md:hidden flex flex-col gap-4 px-6 pb-5" style={{ background: "hsl(var(--background))" }}>
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-sm font-medium no-underline text-muted-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <a
            href="#get-access"
            className="inline-flex items-center justify-center px-5 py-2 rounded-lg text-sm font-bold no-underline"
            style={{ background: "hsl(var(--gold))", color: "hsl(var(--primary-foreground))" }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Book a Demo
          </a>
        </nav>
      )}
    </header>
  );
};

export default Header;
