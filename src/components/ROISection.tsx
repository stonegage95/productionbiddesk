import { useScrollFadeIn } from "@/hooks/use-scroll-fade-in";

const ROISection = () => {
  const fade = useScrollFadeIn(0.1);

  return (
    <section
      ref={fade.ref}
      className={`max-w-[800px] mx-auto px-6 py-24 transition-all duration-700 ease-out ${fade.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <p
        className="text-center text-xs font-bold tracking-[.2em] uppercase mb-3"
        style={{ color: "hsl(var(--gold) / .6)" }}
      >
        The ROI
      </p>
      <h2 className="text-[clamp(22px,3vw,36px)] font-extrabold tracking-tight text-foreground mb-6 text-center">
        Smoother, Faster, More Efficient Productions.
      </h2>
      <p className="text-muted-foreground text-base md:text-lg leading-relaxed text-center max-w-[60ch] mx-auto">
        Production Bid Desk isn&apos;t just about saving time—it&apos;s about protecting your production. By reevaluating risk mitigations and mapping out the heavy lifting upfront, your bids run smoother, your margins stay protected, and you never walk into a client meeting unprepared.
      </p>
    </section>
  );
};

export default ROISection;
