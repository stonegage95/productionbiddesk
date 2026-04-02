import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GradientText from "@/components/GradientText";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import ROISection from "@/components/ROISection";
import FreeTrialBanner from "@/components/FreeTrialBanner";
import { useScrollFadeIn } from "@/hooks/use-scroll-fade-in";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight, Upload, Cpu, FileCheck, ChevronDown } from "lucide-react";

const Index = () => {
  const [form, setForm] = useState({ name: "", email: "", company: "", interest: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const phasesFade = useScrollFadeIn(0.1);
  const ctaFade = useScrollFadeIn(0.1);

  useEffect(() => {
    document.title = "Production Bid Desk — Never Go Into a Client Meeting Blind Again";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Drop in your creative board and instantly get ballpark budgets, timelines, and logistics. Catch red flags before they become expensive mistakes.");
  }, []);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setForm({ name: "", email: "", company: "", interest: "" });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const phases = [
    {
      icon: Upload,
      phase: "01",
      title: "Drop Your Board",
      desc: "Upload your brief, script, or storyboard. Even if it's just a rough concept, the system is ready to analyze it.",
    },
    {
      icon: Cpu,
      phase: "02",
      title: "Autonomous Analysis",
      desc: "Our AI immediately breaks down the creative to evaluate scope, mitigate risks, and map out the logistics.",
    },
    {
      icon: FileCheck,
      phase: "03",
      title: "Get Your Outline",
      desc: "Receive a professional, risk-mitigated bid outline detailing everything you need to know before your client meeting.",
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
        <h1 className="text-[clamp(28px,5vw,56px)] leading-[1.05] tracking-tight font-extrabold mb-6">
          Never Go Into a Client Meeting <GradientText>Blind Again.</GradientText>
        </h1>
        <p className="text-lg md:text-xl leading-relaxed font-semibold max-w-[52ch] mx-auto mb-4" style={{ color: "hsl(var(--gold))" }}>
          Production Bid Desk is your artificial intelligence partner for production strategy and logistical execution in global advertising.
        </p>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-[58ch] mx-auto mb-10">
          Drop in your creative board and instantly get production ballpark budgets, timelines, and logistics. Catch red flags before they become expensive mistakes, and walk into your client presentation with a clean, actionable outline. Built by a Producer with 20 years of global expertise, for the industry&apos;s best.
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

        <div className="relative">
          <div className="hidden md:block absolute left-1/2 -translate-x-px top-0 bottom-0 w-px" style={{ background: "hsl(var(--gold) / .15)" }} />

          <div className="space-y-12 md:space-y-24">
            {phases.map(({ icon: Icon, phase, title, desc }, i) => (
              <div key={i} className={`flex flex-col md:flex-row items-center gap-5 md:gap-8 ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 z-10 order-first md:order-none"
                  style={{
                    background: "hsl(var(--gold) / .08)",
                    border: "1px solid hsl(var(--gold) / .2)",
                    boxShadow: "0 0 30px hsl(43 72% 52% / .08)",
                  }}
                >
                  <Icon size={22} style={{ color: "hsl(var(--gold-bright))" }} strokeWidth={1.5} />
                </div>

                <div className={`flex-1 text-center md:text-left ${i % 2 !== 0 ? "md:text-left" : "md:text-right"}`}>
                  <span
                    className="text-[11px] font-bold tracking-[.2em] uppercase block mb-2"
                    style={{ color: "hsl(var(--gold) / .6)" }}
                  >
                    Phase {phase}
                  </span>
                  <h3 className="text-xl font-extrabold text-foreground mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-[38ch] mx-auto md:mx-0 md:ml-auto">{desc}</p>
                </div>

                <div className="hidden md:block flex-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ROI ─── */}
      <ROISection />

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
          Join the early access list to streamline your logistics, catch the red flags, and win more jobs.
        </p>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setSubmitted(false); setError(""); } }}>
          <DialogTrigger asChild>
            <button
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-sm font-extrabold transition-all hover:brightness-110 cursor-pointer"
              style={{ background: "hsl(var(--gold))", color: "hsl(var(--primary-foreground))" }}
            >
              Get Access <ArrowRight size={16} />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px] border-border bg-card text-foreground shadow-2xl">
            {submitted ? (
              <div className="py-6 text-center">
                <p className="text-lg font-bold" style={{ color: "hsl(var(--gold))" }}>
                  Request received. We&apos;ll be in touch shortly.
                </p>
              </div>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle className="text-center text-xl font-extrabold tracking-tight">
                    Get Access
                  </DialogTitle>
                  <p className="text-muted-foreground text-center text-sm pt-1">
                    Start bidding smarter today.
                  </p>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="pb-name">Name *</Label>
                      <Input id="pb-name" required maxLength={100} value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pb-email">Email *</Label>
                      <Input id="pb-email" type="email" required maxLength={255} value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@company.com" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pb-company">Company</Label>
                    <Input id="pb-company" maxLength={100} value={form.company} onChange={(e) => update("company", e.target.value)} placeholder="Company name" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pb-interest">What types of projects?</Label>
                    <Input id="pb-interest" maxLength={200} value={form.interest} onChange={(e) => update("interest", e.target.value)} placeholder="e.g. campaign bids, series production" />
                  </div>
                  {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full font-extrabold"
                    style={{ background: "hsl(var(--gold))", color: "hsl(var(--primary-foreground))" }}
                  >
                    {submitting ? "Submitting…" : "Submit"}
                  </Button>
                </form>
              </>
            )}
          </DialogContent>
        </Dialog>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
