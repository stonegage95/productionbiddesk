import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "@/components/Logo";

const navLinks = [
  { label: "Home", href: "#top" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Try It", href: "#try-it" },
  { label: "Get Access", href: "#get-access" },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const linkStyle = { color: "#EAF0FF", fontWeight: 600, opacity: 0.92, textDecoration: "none" as const };

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "#070B14",
        borderBottom: "1px solid rgba(255,255,255,.10)",
      }}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-6" style={{ padding: "18px 28px" }}>
        <a href="#top" className="no-underline flex items-center gap-3">
          <Logo />
        </a>

        <nav className="hidden md:flex items-center gap-[26px]">
          {navLinks.map(({ label, href }) => (
            <a key={label} href={href} className="no-underline" style={linkStyle}>
              {label}
            </a>
          ))}
        </nav>

        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} color="#EAF0FF" /> : <Menu size={24} color="#EAF0FF" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden flex flex-col gap-4 px-7 pb-5" style={{ background: "#070B14" }}>
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="no-underline"
              style={linkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
