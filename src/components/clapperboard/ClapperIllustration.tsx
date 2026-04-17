const stripeStyle = {
  backgroundImage:
    "repeating-linear-gradient(118deg, hsl(var(--background)) 0 18px, hsl(var(--foreground)) 18px 36px)",
};

type ClapperIllustrationProps = {
  raised: boolean;
  compact?: boolean;
  className?: string;
};

const rows = [
  { label: "SCENE", value: "HELP" },
  { label: "TAKE", value: "01" },
] as const;

export function ClapperIllustration({
  raised,
  compact = false,
  className = "",
}: ClapperIllustrationProps) {
  const widthClass = compact ? "w-[4.2rem]" : "w-[12rem]";
  const armHeightClass = compact ? "h-[0.82rem]" : "h-[1.05rem]";
  const bodyPaddingClass = compact ? "px-2 py-2" : "px-3 py-2.5";
  const titleClass = compact
    ? "text-[0.42rem] tracking-[0.22em]"
    : "text-[0.5rem] tracking-[0.28em]";
  const gridTextClass = compact ? "text-[0.32rem]" : "text-[0.42rem]";
  const valueClass = compact ? "text-[0.55rem]" : "text-[0.6rem]";

  return (
    <div className={`${widthClass} ${className}`.trim()} aria-hidden>
      <div
        className={`relative z-10 ml-1 origin-[0.45rem_100%] rounded-t-[0.7rem] border border-foreground/25 ${armHeightClass} transition-transform duration-200 ease-out`}
        style={{
          ...stripeStyle,
          transform: raised ? "rotate(-20deg)" : "rotate(0deg)",
        }}
      >
        <span className="absolute left-1 bottom-[0.16rem] h-1.5 w-1.5 rounded-full border border-foreground/40 bg-secondary" />
        <span className="absolute inset-x-0 bottom-0 h-px bg-foreground/25" />
      </div>

      <div className="-mt-[1px] overflow-hidden rounded-[0.9rem] border border-foreground/20 bg-card shadow-[0_14px_30px_hsl(var(--background)/0.45)]">
        <div className={`${bodyPaddingClass}`}>
          <div className="space-y-1.5">
            <div className={`font-semibold uppercase text-foreground ${titleClass}`}>
              Production Bid Desk
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-foreground/15 pt-1.5">
              {rows.map((row) => (
                <div key={row.label} className="space-y-0.5">
                  <div className={`font-semibold uppercase text-foreground/55 ${gridTextClass}`}>
                    {row.label}
                  </div>
                  <div className={`font-mono uppercase tracking-[0.18em] text-foreground ${valueClass}`}>
                    {row.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {!compact && (
          <div className="border-t border-foreground/15 bg-foreground px-3 py-2 text-sm font-medium text-background">
            Need help? Tap to chat
          </div>
        )}
      </div>
    </div>
  );
}
