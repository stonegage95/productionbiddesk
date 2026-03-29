import AnimatedCounter from "./AnimatedCounter";
import { useScrollFadeIn } from "@/hooks/use-scroll-fade-in";

interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

const StatsBar = ({ stats }: { stats: Stat[] }) => {
  const fade = useScrollFadeIn(0.2);
  return (
    <div
      ref={fade.ref}
      className={`transition-all duration-700 ease-out ${fade.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
    >
      <div
        className="rounded-2xl grid gap-0"
        style={{
          gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
          background: "linear-gradient(180deg, rgba(11,31,59,.7), rgba(11,31,59,.35))",
          border: "1px solid hsl(var(--gold) / .15)",
          boxShadow: "0 16px 50px rgba(0,0,0,.3)",
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            className="text-center py-8 px-4"
            style={{
              borderRight: i < stats.length - 1 ? "1px solid hsl(var(--gold) / .1)" : "none",
            }}
          >
            <div className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: "hsl(var(--gold))" }}>
              <AnimatedCounter end={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
            </div>
            <div className="text-muted-foreground text-xs md:text-sm mt-1 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsBar;
