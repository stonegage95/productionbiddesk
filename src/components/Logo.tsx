import logoSrc from "@/assets/production-bid-desk-logo.png";

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src={logoSrc}
        alt=""
        className="h-[36px] md:h-[44px] w-auto"
      />
      <div className="flex flex-col leading-none">
        <span
          className="text-sm md:text-base font-extrabold tracking-tight text-foreground"
        >
          Production Bid Desk
        </span>
        <span
          className="text-[9px] md:text-[10px] font-medium tracking-[.08em] uppercase"
          style={{ color: "hsl(var(--gold) / .6)" }}
        >
          Smart Bidding Solutions
        </span>
      </div>
    </div>
  );
};

export default Logo;
