const Footer = () => (
  <footer className="max-w-[1000px] mx-auto px-6">
    <div
      className="py-8 flex flex-col sm:flex-row items-center justify-between gap-4"
      style={{ borderTop: "1px solid hsl(var(--border))" }}
    >
      <span className="text-muted-foreground text-xs font-medium">
        © {new Date().getFullYear()} Production Bid Desk
      </span>
      <div className="flex items-center gap-6">
        {[
          { label: "How It Works", href: "#how-it-works" },
          { label: "Get Access", href: "#get-access" },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-xs font-medium no-underline text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
