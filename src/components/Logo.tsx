import logoSrc from "@/assets/production-bid-desk-logo.png";

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <img
      src={logoSrc}
      alt="Production Bid Desk"
      className={`h-[36px] md:h-[44px] w-auto ${className}`}
    />
  );
};

export default Logo;
