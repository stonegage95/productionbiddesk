import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useScrollFadeIn } from "@/hooks/use-scroll-fade-in";

const FreeTrialBanner = () => {
  const navigate = useNavigate();
  const fade = useScrollFadeIn(0.1);

  return (
    <section
      ref={fade.ref}
      className={`max-w-[900px] mx-auto px-6 py-16 transition-all duration-700 ease-out ${fade.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div
        className="relative rounded-2xl px-8 py-10 md:py-12 text-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, hsl(var(--gold) / .08) 0%, hsl(var(--gold) / .02) 100%)",
          border: "1px solid hsl(var(--gold) / .2)",
        }}
      >
        {/* Glow effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, hsl(var(--gold) / .1) 0%, transparent 60%)",
          }}
        />

        <div className="relative z-10">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold tracking-[.12em] uppercase mb-5"
            style={{
              background: "hsl(var(--gold) / .12)",
              border: "1px solid hsl(var(--gold) / .25)",
              color: "hsl(var(--gold))",
            }}
          >
            <Sparkles size={10} />
            Limited Time Offer
          </span>

          <h2 className="text-[clamp(22px,3.5vw,36px)] font-extrabold tracking-tight text-foreground mb-3">
            Try Production Bid Desk Free for 3 Days
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-[50ch] mx-auto mb-6">
            No credit card required. Get full access to AI-powered bid analysis, risk detection, and production planning — completely free.
          </p>

          <p className="text-base md:text-lg font-extrabold tracking-tight mb-5" style={{ color: "hsl(var(--gold))" }}>
            Ready to revolutionize your production?
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              className="font-extrabold text-sm px-8"
              style={{ background: "hsl(var(--gold))", color: "hsl(var(--primary-foreground))" }}
              onClick={() => navigate("/auth")}
            >
              Start Free Trial <ArrowRight size={16} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="font-semibold text-sm px-8 border-border hover:border-[hsl(var(--gold)/.4)]"
              onClick={() => navigate("/pricing")}
            >
              View Pricing
            </Button>
          </div>

          <p className="text-muted-foreground text-xs mt-5">
            No strings attached · Cancel anytime · $150/mo after trial
          </p>
        </div>
      </div>
    </section>
  );
};

export default FreeTrialBanner;
