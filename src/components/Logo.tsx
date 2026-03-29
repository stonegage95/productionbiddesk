import logoSrc from "@/assets/aigroup-logo.png";

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <img
      src={logoSrc}
      alt="Production Bid Desk"
      className={`h-[40px] md:h-[52px] w-auto ${className}`}
    />
  );
};

export default Logo;
