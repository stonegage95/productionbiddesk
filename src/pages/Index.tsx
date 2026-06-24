import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GradientText from "@/components/GradientText";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import ROISection from "@/components/ROISection";
import FreeTrialBanner from "@/components/FreeTrialBanner";
import { useScrollFadeIn } from "@/hooks/use-scroll-fade-in";
import { ArrowRight, Upload, Cpu, FileCheck, Presentation, ChevronDown } from "lucide-react";

const Index = () => {
  const phasesFade = useScrollFadeIn(0.1);
  const ctaFade = useScrollFadeIn(0.1);

  useEffect(() => {
    document.title = "Production Bid Desk — Never Go Into a Client Meeting Blind Again";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Drop in your creative board and instantly get ballpark budgets, timelines, and logistics. Catch red flags before they become expensive mistakes.");
  }, []);


  const phases = [
    {
      icon: Upload,
      phase: "01",
      title: "Drop Your Generic Board",
      desc: "Upload script, treatment, or creative board — any format.",
    },
    {
      icon: Cpu,
      phase: "02",
      title: "AI Breaks It Down",
      desc: "Scene-by-scene mapping, logistics, crew, and location reads.",
    },
    {
      icon: FileCheck,
      phase: "03",
      title: "Get Insights",
      desc: "Ballpark budgets, timelines, red flags, production approach. Outline ready.",
    },
    {
      icon: Presentation,
      phase: "04",
      title: "Walk In Ready",
      desc: "Hit your client meeting with answers, not guesses.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Production Bid Desk",
            applicationCategory: "BusinessApplication",
            description: "AI-powered pre-bid decision tool for producers, EPs, PMs, and cost consultants.",
          }),
        }}
      />

      {/* ─── Hero ─── */}
      <section id="top" className="max-w-[900px] mx-auto px-6 pt-24 pb-16 text-center">
        <span
          className="inline-flex items-start gap-1.5 px-4 py-2 rounded-full text-[11px] font-semibold leading-snug max-w-[60ch] mb-8 text-left"
          style={{
            background: "hsl(var(--gold) / .08)",
            border: "1px solid hsl(var(--gold) / .2)",
            color: "hsl(var(--foreground))",
          }}
        >
          🔒 NDA-sensitive AI tools for global advertising teams, with secure customer login powered by Auth0 by Okta.
        </span>
        <h1 className="text-[clamp(28px,5vw,56px)] leading-[1.05] tracking-tight font-extrabold mb-4">
          Your AI partner for production strategy and <GradientText>logistical execution in global advertising.</GradientText>
        </h1>
        <p className="text-lg md:text-xl leading-relaxed font-semibold max-w-[60ch] mx-auto mb-8" style={{ color: "hsl(var(--gold))" }}>
          Production is changing — stay ahead of the game. Your bids run smoother, your margins stay protected, and you never walk into a client meeting unprepared.
        </p>

        {/* ─── Phases Outline (above video) ─── */}
        <div className="mb-8">
          <p
            className="text-[11px] font-bold tracking-[.2em] uppercase mb-4"
            style={{ color: "hsl(var(--gold) / .7)" }}
          >
            How It Works
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
            {phases.map(({ icon: Icon, phase, title, desc }, i) => (
              <div
                key={i}
                className="p-4 rounded-lg"
                style={{
                  background: "hsl(0 0% 100% / .03)",
                  border: "1px solid hsl(var(--gold) / .15)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      background: "hsl(var(--gold) / .1)",
                      border: "1px solid hsl(var(--gold) / .25)",
                    }}
                  >
                    <Icon size={14} style={{ color: "hsl(var(--gold-bright))" }} strokeWidth={1.75} />
                  </div>
                  <span className="text-[9px] font-mono tracking-widest text-muted-foreground">
                    {phase}/04
                  </span>
                </div>
                <h3 className="text-xs font-bold uppercase tracking-tight mb-1" style={{ color: "hsl(var(--gold))" }}>
                  {title}
                </h3>
                <p className="text-[11px] leading-snug text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs font-bold tracking-[.15em] uppercase text-muted-foreground mb-3">
          ▶ Production Is Changing
        </p>

        {/* ─── Inline Video ─── */}
        <div
          className="relative w-full aspect-video rounded-xl overflow-hidden mx-auto mt-2 mb-10"
          style={{
            background: "hsl(var(--secondary))",
            border: "1px solid hsl(var(--gold) / .2)",
            boxShadow: "0 30px 80px -20px rgba(0,0,0,.6)",
          }}
        >
          <video
            src="/demo/production-bid-desk-demo.mp4"
            controls
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-contain bg-black"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <a
          href="/app"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-sm font-extrabold no-underline transition-all hover:brightness-110"
          style={{ background: "hsl(var(--gold))", color: "hsl(var(--primary-foreground))" }}
        >
          Open the App <ArrowRight size={16} />
        </a>

        <a
          href="#the-problem"
          className="inline-flex flex-col items-center gap-1 no-underline mt-12 group"
          aria-label="Scroll to learn more"
        >
          <span className="text-[11px] font-bold tracking-[.15em] uppercase text-muted-foreground group-hover:text-foreground transition-colors">
            Discover
          </span>
          <ChevronDown
            size={20}
            className="text-muted-foreground group-hover:text-foreground transition-colors animate-bounce"
          />
        </a>
      </section>

      {/* ─── The Problem ─── */}
      <div id="the-problem">
        <ProblemSection />
      </div>

      {/* ─── The Solution ─── */}
      <SolutionSection />

      {/* ─── How It Works ─── */}
      <section
        id="how-it-works"
        ref={phasesFade.ref}
        className={`max-w-[1000px] mx-auto px-6 py-24 transition-all duration-700 ease-out ${phasesFade.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <p
          className="text-center text-xs font-bold tracking-[.2em] uppercase mb-3"
          style={{ color: "hsl(var(--gold) / .6)" }}
        >
          The Process
        </p>
        <h2 className="text-[clamp(22px,3vw,36px)] font-extrabold tracking-tight text-foreground mb-16 text-center">
          From Rough Concept to Solid Plan in Seconds.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
          {phases.map(({ icon: Icon, phase, title, desc }, i) => (
            <button
              key={i}
              type="button"
              className="group p-5 text-left transition-all hover:-translate-y-0.5"
              style={{
                background: "hsl(0 0% 100% / .03)",
                border: "1px solid hsl(var(--gold) / .15)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "hsl(var(--gold) / .5)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "hsl(var(--gold) / .15)"; }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: "hsl(var(--gold) / .1)",
                    border: "1px solid hsl(var(--gold) / .25)",
                  }}
                >
                  <Icon size={16} style={{ color: "hsl(var(--gold-bright))" }} strokeWidth={1.75} />
                </div>
                <span className="text-[10px] font-mono tracking-widest text-muted-foreground">
                  {phase}/03
                </span>
              </div>
              <h3 className="text-xs font-bold uppercase tracking-tight mb-1" style={{ color: "hsl(var(--gold))" }}>
                {title}
              </h3>
              <p className="text-[11px] text-muted-foreground">{desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ─── ROI ─── */}
      <ROISection />

      {/* ─── Free Trial Banner ─── */}
      <FreeTrialBanner />

      {/* ─── CTA ─── */}
      <section
        id="get-access"
        ref={ctaFade.ref}
        className={`max-w-[900px] mx-auto px-6 py-24 text-center transition-all duration-700 ease-out ${ctaFade.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <h2 className="text-[clamp(22px,3vw,36px)] font-extrabold tracking-tight text-foreground mb-4">
          Ready to take the guesswork out of your next bid?
        </h2>
        <p className="text-muted-foreground text-sm mb-8 max-w-[54ch] mx-auto">
          Start your free 3-day trial — no credit card required. Just your name, email, phone, and company.
        </p>
        <p className="text-foreground text-base md:text-lg font-semibold mb-6">
          Ready to revolutionize your production?
        </p>
        <a
          href="/app"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-sm font-extrabold no-underline transition-all hover:brightness-110"
          style={{ background: "hsl(var(--gold))", color: "hsl(var(--primary-foreground))" }}
        >
          Open the App <ArrowRight size={16} />
        </a>
        <p className="text-muted-foreground text-xs mt-4">
          Instant access · Cancel anytime
        </p>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
