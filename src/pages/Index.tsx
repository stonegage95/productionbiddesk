import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GradientText from "@/components/GradientText";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import ROISection from "@/components/ROISection";
import FreeTrialBanner from "@/components/FreeTrialBanner";
import { useScrollFadeIn } from "@/hooks/use-scroll-fade-in";
import { ArrowRight, Upload, Cpu, FileCheck, ChevronDown } from "lucide-react";

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
      title: "Drop Board",
      desc: "Ingest scripts",
    },
    {
      icon: Cpu,
      phase: "02",
      title: "AI Analysis",
      desc: "Scene mapping",
    },
    {
      icon: FileCheck,
      phase: "03",
      title: "Get Insights",
      desc: "Outline optional",
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
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold tracking-[.12em] uppercase mb-8"
          style={{
            background: "hsl(var(--gold) / .08)",
            border: "1px solid hsl(var(--gold) / .2)",
            color: "hsl(var(--gold))",
          }}
        >
          🔒 NDA-Compliant AI for Global Advertising
        </span>
        <h1 className="text-[clamp(28px,5vw,56px)] leading-[1.05] tracking-tight font-extrabold mb-4">
          Never Go Into a Client Meeting <GradientText>Blind Again.</GradientText>
        </h1>
        <p className="text-[clamp(18px,2.4vw,26px)] font-extrabold tracking-tight text-foreground mb-6">
          Revolutionize your production.
        </p>
        <p className="text-lg md:text-xl leading-relaxed font-semibold max-w-[52ch] mx-auto mb-4" style={{ color: "hsl(var(--gold))" }}>
          Production Bid Desk is your artificial intelligence partner for production strategy and logistical execution in global advertising.
        </p>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-[58ch] mx-auto mb-8">
          Drop in your creative board and instantly get production ballpark budgets, timelines, risk mitigation, logistics, and a bid outline. Catch red flags before they become expensive mistakes, and walk into your client presentation with a clean, actionable outline. Built by a Producer with 23 years of global expertise, for the industry&apos;s best.
        </p>

        <p
          className="max-w-[52ch] mx-auto mb-10 text-xs md:text-sm leading-snug font-medium"
          style={{ color: "hsl(var(--gold))" }}
        >
          Powered by AI trained on real production data — keeping up with union rates, industry standards, and global logistics for accurate, up-to-date estimates.
        </p>


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
          href="/auth"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-sm font-extrabold no-underline transition-all hover:brightness-110"
          style={{ background: "hsl(var(--gold))", color: "hsl(var(--primary-foreground))" }}
        >
          Start Free Trial <ArrowRight size={16} />
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
