const Footer = () => (
  <footer className="max-w-[1140px] mx-auto px-5">
    <div
      className="py-8 flex flex-col sm:flex-row items-center justify-between gap-4"
      style={{ borderTop: "1px solid hsl(var(--gold) / .12)" }}
    >
      <span className="font-bold text-[13px]" style={{ color: "hsl(var(--muted-foreground) / .6)" }}>
        © {new Date().getFullYear()} Production Bid Desk
      </span>
      <div className="flex items-center gap-6">
        {[
          { label: "How It Works", href: "#how-it-works" },
          { label: "Try It", href: "#try-it" },
          { label: "Get Access", href: "#get-access" },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-[12px] font-semibold no-underline transition-colors hover:text-foreground"
            style={{ color: "hsl(var(--muted-foreground) / .5)" }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
