const Footer = () => (
  <footer className="max-w-[1000px] mx-auto px-6">
    <div
      className="py-8 flex flex-col gap-5"
      style={{ borderTop: "1px solid hsl(var(--border))" }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-muted-foreground text-xs font-medium">
          © {new Date().getFullYear()} Production Bid Desk. All Rights Reserved.
        </span>
        <div className="flex items-center gap-6">
          {[
            { label: "Product", href: "/" },
            { label: "Solutions", href: "/solutions" },
            { label: "Security", href: "/security" },
            { label: "Demo", href: "/demo" },
            { label: "FAQ", href: "/faq" },
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
      <p className="text-[10px] leading-relaxed text-center text-muted-foreground/60">
        Legal Notice: All user-uploaded content is processed via private, secure APIs and is not used for public model training. Independent third-party solution.
      </p>
    </div>
  </footer>
);

export default Footer;
