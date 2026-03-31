import { useScrollFadeIn } from "@/hooks/use-scroll-fade-in";

const ProblemSection = () => {
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
        The Problem
      </p>
      <h2 className="text-[clamp(22px,3vw,36px)] font-extrabold tracking-tight text-foreground mb-6 text-center">
        Stop Guessing on Logistics and Budgets.
      </h2>
      <p className="text-muted-foreground text-base md:text-lg leading-relaxed text-center max-w-[60ch] mx-auto">
        Going into a pitch without knowing your exact budget, timeline, or talent requirements is a recipe for a messy production. Half the time, creatives don&apos;t even get producers involved early enough. You&apos;re left stumbling, guessing, and hoping the production company can magically make it work.
      </p>
      <p
        className="text-base md:text-lg leading-relaxed text-center max-w-[60ch] mx-auto mt-6 font-bold"
        style={{ color: "hsl(var(--gold))" }}
      >
        Production Bid Desk ends the scramble. It gives you the answers before you say a number.
      </p>
    </section>
  );
};

export default ProblemSection;
