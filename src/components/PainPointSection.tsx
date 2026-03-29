import { useScrollFadeIn } from "@/hooks/use-scroll-fade-in";
import { X, Check } from "lucide-react";

interface PainPoint {
  pain: string;
  solution: string;
}

const PainPointSection = ({ painPoints, title }: { painPoints: PainPoint[]; title?: string }) => {
  const fade = useScrollFadeIn(0.1);
  return (
    <section
      ref={fade.ref}
      className={`transition-all duration-700 ease-out ${fade.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
    >
      {title && (
        <h2 className="text-[clamp(20px,2.8vw,28px)] font-extrabold tracking-tight text-foreground mb-8 text-center">
          {title}
        </h2>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {painPoints.map((pp, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden"
            style={{
              background: "linear-gradient(180deg, rgba(11,31,59,.7), rgba(11,31,59,.35))",
              border: "1px solid rgba(236,242,255,.08)",
              boxShadow: "0 8px 32px rgba(0,0,0,.2)",
            }}
          >
            <div className="p-4 flex items-start gap-3" style={{ borderBottom: "1px solid rgba(236,242,255,.06)" }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "hsl(0 70% 50% / .15)" }}>
                <X size={12} style={{ color: "hsl(0 70% 60%)" }} />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{pp.pain}</p>
            </div>
            <div className="p-4 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "hsl(var(--gold) / .15)" }}>
                <Check size={12} style={{ color: "hsl(var(--gold))" }} />
              </div>
              <p className="text-sm text-foreground leading-relaxed font-medium">{pp.solution}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PainPointSection;
