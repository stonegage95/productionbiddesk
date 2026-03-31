import { useScrollFadeIn } from "@/hooks/use-scroll-fade-in";
import { AlertTriangle, Calculator, FileText } from "lucide-react";

const features = [
  {
    icon: AlertTriangle,
    title: "Catch Red Flags Early",
    desc: "Instantly identify hidden logistical nightmares, talent issues, and budget drains upfront—before you commit to a shoot unprepared.",
  },
  {
    icon: Calculator,
    title: "Ballpark Budgets & Timelines",
    desc: "Get realistic budget breakdowns and high-level timelines in seconds. Know exactly what it takes to pull the job off.",
  },
  {
    icon: FileText,
    title: "A Clean, Client-Ready Outline",
    desc: "No more scrambling to organize your thoughts. Get a perfectly structured outline that you can drop straight into your deck and present to the client with absolute authority.",
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
