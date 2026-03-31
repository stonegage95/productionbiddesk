import { useScrollFadeIn } from "@/hooks/use-scroll-fade-in";
import {
  AlertTriangle,
  Calculator,
  CalendarRange,
  FileText,
  MessageSquareQuote,
  Users,
} from "lucide-react";

const features = [
  {
    icon: AlertTriangle,
    title: "Risk Mitigation & Red Flags",
    desc: "Spot production risks early, flag weak points in the plan, and surface the issues that could derail scope, budget, or execution before the meeting starts.",
  },
  {
    icon: Calculator,
    title: "Ballpark Budget Tiers",
    desc: "Get fast budget ranges and tiered cost framing so you can speak confidently about what the idea may require at different levels of execution.",
  },
  {
    icon: CalendarRange,
    title: "Schedule Logistics & Timelines",
    desc: "Map out timing, sequencing, and logistical realities in seconds so you know what the production actually demands before promising anything.",
  },
  {
    icon: Users,
    title: "Talent Negotiations",
    desc: "Pressure-test talent assumptions early and understand the negotiation implications before they become budget or scheduling surprises.",
  },
  {
    icon: MessageSquareQuote,
    title: "Post Inquiries & Questions",
    desc: "Generate the smart post questions that still need answers, so you walk into the conversation prepared instead of reacting in real time.",
  },
  {
    icon: FileText,
    title: "Bid Outlines",
    desc: "Turn the analysis into a clean, structured bid outline you can drop into your deck, organize quickly, and present with authority.",
  },
];

const SolutionSection = () => {
  const fade = useScrollFadeIn(0.1);

  return (
    <section
      ref={fade.ref}
      className={`max-w-[1000px] mx-auto px-6 py-24 transition-all duration-700 ease-out ${fade.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <p
        className="text-center text-xs font-bold tracking-[.2em] uppercase mb-3"
        style={{ color: "hsl(var(--gold) / .6)" }}
      >
        The Solution
      </p>
      <h2 className="text-[clamp(22px,3vw,36px)] font-extrabold tracking-tight text-foreground mb-16 text-center">
        Everything You Need to Present with Confidence.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {features.map(({ icon: Icon, title, desc }) => (
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
            <h3 className="text-lg font-extrabold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SolutionSection;
