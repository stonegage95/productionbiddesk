import { Zap, TrendingUp, ShieldCheck, PiggyBank } from "lucide-react";
import { useScrollFadeIn } from "@/hooks/use-scroll-fade-in";

const blocks = [
  {
    icon: Zap,
    title: "Speed",
    stat: "60-Second Analysis",
    desc: "From Script to Bid Outline in 1 Minute.",
  },
  {
    icon: TrendingUp,
    title: "Scale",
    stat: "3× Bidding Capacity",
    desc: "Scale your business without adding overhead.",
  },
  {
    icon: ShieldCheck,
    title: "Security",
    stat: "NDA-Compliant",
    desc: "100% Private, Secure Processing for your Creative Assets.",
  },
  {
    icon: PiggyBank,
    title: "Profit",
    stat: "Margin Protection",
    desc: "Advanced Risk Mitigation to protect your bottom line.",
  },
];

const CompetitiveEdge = () => {
  const fade = useScrollFadeIn(0.1);

  return (
    <section
      ref={fade.ref}
      className={`max-w-[1000px] mx-auto px-6 py-24 transition-all duration-700 ease-out ${fade.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <p className="text-center text-xs font-bold tracking-[.2em] uppercase mb-3 text-muted-foreground">
        Why Production Bid Desk
      </p>
      <h2 className="text-[clamp(22px,3vw,36px)] font-extrabold tracking-tight text-foreground mb-16 text-center">
        The Competitive Edge
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {blocks.map(({ icon: Icon, title, stat, desc }) => (
          <div
            key={title}
            className="rounded-xl p-6 transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              boxShadow: "0 4px 24px rgba(0,0,0,.3)",
            }}
          >
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center mb-4"
              style={{
                background: "hsl(var(--gold) / .1)",
                border: "1px solid hsl(var(--gold) / .15)",
              }}
            >
              <Icon size={20} style={{ color: "hsl(var(--gold-bright))" }} strokeWidth={1.5} />
            </div>
            <p
              className="text-[11px] font-bold tracking-[.15em] uppercase mb-1"
              style={{ color: "hsl(var(--gold) / .6)" }}
            >
              {title}
            </p>
            <h3 className="text-lg font-extrabold text-foreground mb-1.5">{stat}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CompetitiveEdge;
