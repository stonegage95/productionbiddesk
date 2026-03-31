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
            { label: "Demo", href: "/demo" },
            { label: "Pricing", href: "/pricing" },
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
        Production Bid Desk is an independent third-party solution. We respect your privacy and confidentiality: we do not sell user information or creative boards. All user-uploaded content is processed via private, secure APIs. AI-generated work and uploaded assets will never be shared with third parties or used for public model training.
      </p>
    </div>
  </footer>
);

export default Footer;
