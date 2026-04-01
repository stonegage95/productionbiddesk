import iconSrc from "@/assets/production-bid-desk-icon.png";

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src={iconSrc}
        alt=""
        className="h-[32px] md:h-[38px] w-auto rounded-sm"
      />
      <div className="flex flex-col leading-none">
        <span className="text-sm md:text-base font-extrabold tracking-tight text-foreground">
          Production Bid Desk
        </span>
        <span
          className="text-[9px] md:text-[10px] font-medium tracking-[.08em] uppercase"
          style={{ color: "hsl(var(--gold) / .6)" }}
        >
          Strategic Production Solutions
        </span>
      </div>
    </div>
  );
};

export default Logo;
