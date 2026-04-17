import iconSrc from "@/assets/production-bid-desk-icon.png";

type ClapperIllustrationProps = {
  raised: boolean;
  compact?: boolean;
  className?: string;
};

export function ClapperIllustration({
  raised,
  compact = false,
  className = "",
}: ClapperIllustrationProps) {
  const sizeClass = compact ? "w-[3.5rem] h-[3.5rem]" : "w-[5rem] h-[5rem]";

  return (
    <div className={`${sizeClass} ${className}`.trim()} aria-hidden>
      <img
        src={iconSrc}
        alt=""
        className={`w-full h-full object-contain rounded-md transition-transform duration-200 ease-out ${
          raised ? "-translate-y-0.5 rotate-[-6deg]" : ""
        }`}
        style={{
          filter: "drop-shadow(0 6px 16px hsl(var(--background) / 0.55))",
        }}
      />
    </div>
  );
}
