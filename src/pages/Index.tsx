import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StatsBar from "@/components/StatsBar";
import PainPointSection from "@/components/PainPointSection";
import SectionDivider from "@/components/SectionDivider";
import GradientText from "@/components/GradientText";
import { useScrollFadeIn } from "@/hooks/use-scroll-fade-in";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight, Upload, FileText, BarChart3 } from "lucide-react";
import neoGenesisIcon from "@/assets/neo-genesis-hero.jpeg";

const pageBackground = `
  radial-gradient(900px 600px at 18% 10%, rgba(212,175,55,.12), transparent 60%),
  linear-gradient(180deg, hsl(222 60% 8%), hsl(222 60% 5%) 70%)
`;

const Index = () => {
  const [form, setForm] = useState({ name: "", email: "", company: "", interest: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const howFade = useScrollFadeIn(0.1);
  const tryFade = useScrollFadeIn(0.1);
  const ctaFade = useScrollFadeIn(0.1);

  useEffect(() => {
    document.title = "Production Bid Desk — AI-Powered Pre-Bid Analysis";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Pre-bid decision tool for producers, EPs, and cost consultants. Get risk flags, budget ranges, and timelines before you commit to a number.");
  }, []);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      // Placeholder for form submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setForm({ name: "", email: "", company: "", interest: "" });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: pageBackground }}>
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

      {/* Hero */}
      <section id="top" className="max-w-[1140px] mx-auto px-5 pt-20 pb-12">
        <div className="flex items-start gap-5 mb-8">
          <img
            src={neoGenesisIcon}
            alt="Production Bid Desk"
            className="w-20 h-20 rounded-xl object-cover border border-white/10 shadow-lg shadow-black/30 shrink-0 hidden sm:block"
          />
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide mb-4"
              style={{
                background: "hsl(var(--gold) / .1)",
                border: "1px solid hsl(var(--gold) / .2)",
                color: "hsl(var(--gold-bright))",
              }}
            >
              Pre-bid intelligence • Risk • Budget • Timeline
            </div>
            <h1 className="mb-3 text-[clamp(26px,4vw,42px)] leading-[1.08] tracking-tight font-extrabold">
              Stop guessing. <GradientText>Start knowing.</GradientText>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-[60ch]">
              Get honest ballparks, risk flags, and production timelines before you commit to a number. Built for producers, EPs, PMs, and cost consultants.
            </p>
          </div>
        </div>

        <a
          href="#get-access"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-extrabold transition-all hover:-translate-y-px no-underline"
          style={{ background: "hsl(var(--gold))", color: "hsl(222 50% 10%)" }}
        >
          Get Early Access <ArrowRight size={15} />
        </a>
      </section>

      {/* Stats */}
      <section className="max-w-[860px] mx-auto px-5 pb-12">
        <StatsBar
          stats={[
            { value: 60, suffix: "s", label: "Script to analysis" },
            { value: 3, suffix: "x", label: "Faster bid prep" },
            { value: 100, suffix: "%", label: "Of risks surfaced" },
          ]}
        />
      </section>

      <SectionDivider />

      {/* Pain Points */}
      <section className="max-w-[860px] mx-auto px-5 py-14">
        <PainPointSection
          title="The bidding problem"
          painPoints={[
            {
              pain: "You commit to a number before you fully understand the scope — then spend weeks defending it.",
              solution: "Bid Desk surfaces risks and assumptions upfront so you walk in prepared.",
            },
            {
              pain: "Budget estimates are based on gut feel and past projects that don't quite match.",
              solution: "Get data-driven budget ranges with key cost drivers broken down clearly.",
            },
            {
              pain: "Timelines get compressed because nobody flagged the post-production complexity early.",
              solution: "Timeline analysis includes post-production, VFX, and sound from the start.",
            },
            {
              pain: "Building bid decks takes days of formatting instead of strategic thinking.",
              solution: "Export a production deck outline you can lift directly into your bid.",
            },
          ]}
        />
      </section>

      <SectionDivider />

      {/* How it works */}
      <section
        id="how-it-works"
        ref={howFade.ref}
        className={`max-w-[1140px] mx-auto px-5 py-14 transition-all duration-700 ease-out ${howFade.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <h2 className="text-[clamp(20px,2.8vw,28px)] font-extrabold tracking-tight text-foreground mb-10 text-center">
          Three steps to a smarter bid
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: Upload, step: "01", title: "Drop in your materials", desc: "Upload a brief, script, or storyboard. Even rough concepts work." },
            { icon: FileText, step: "02", title: "Answer a few questions", desc: "Markets, timing, constraints — the context that shapes your bid." },
            { icon: BarChart3, step: "03", title: "Get your analysis", desc: "Risks, budget ranges, timeline, and a deck outline you can use." },
          ].map(({ icon: Icon, step, title, desc }, i) => (
            <div
              key={i}
              className="rounded-xl p-6 relative"
              style={{
                background: "linear-gradient(180deg, rgba(11,31,59,.7), rgba(11,31,59,.35))",
                border: "1px solid rgba(236,242,255,.08)",
              }}
            >
              <span className="text-[10px] font-bold tracking-widest mb-3 block" style={{ color: "hsl(var(--gold) / .5)" }}>
                STEP {step}
              </span>
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ background: "hsl(var(--gold) / .1)", border: "1px solid hsl(var(--gold) / .15)" }}
              >
                <Icon size={18} style={{ color: "hsl(var(--gold-bright))" }} />
              </div>
              <h3 className="font-extrabold text-foreground text-base mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* Try it */}
      <section
        id="try-it"
        ref={tryFade.ref}
        className={`max-w-[1140px] mx-auto px-5 py-14 transition-all duration-700 ease-out ${tryFade.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <h2 className="text-[clamp(20px,2.8vw,28px)] font-extrabold tracking-tight text-foreground mb-8 text-center">
          Try it on your work
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div
            className="rounded-xl p-6"
            style={{
              background: "linear-gradient(180deg, rgba(11,31,59,.7), rgba(11,31,59,.35))",
              border: "1px solid hsl(var(--gold) / .12)",
            }}
          >
            <h3 className="text-base font-bold mb-2 text-foreground">Drop in your storyboard</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Upload a de-branded storyboard. Get risks, budget ranges, and timelines in seconds.
            </p>
            <a
              href="#get-access"
              className="inline-flex items-center gap-1.5 text-sm font-semibold no-underline"
              style={{ color: "hsl(var(--gold-bright))" }}
            >
              Try now <ArrowRight size={13} />
            </a>
          </div>
          <div
            className="rounded-xl p-6"
            style={{
              background: "linear-gradient(180deg, rgba(11,31,59,.7), rgba(11,31,59,.35))",
              border: "1px solid hsl(var(--gold) / .12)",
            }}
          >
            <h3 className="text-base font-bold mb-2 text-foreground">Drop in your script</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Paste your script. We'll generate a storyboard and the same risks, budget, and timing readout.
            </p>
            <a
              href="#get-access"
              className="inline-flex items-center gap-1.5 text-sm font-semibold no-underline"
              style={{ color: "hsl(var(--gold-bright))" }}
            >
              Try now <ArrowRight size={13} />
            </a>
          </div>
        </div>

        <p className="text-muted-foreground text-xs leading-relaxed max-w-[70ch] mt-6">
          <strong className="text-foreground">Privacy:</strong> We use anonymized or generic boards for testing. For live projects, we're happy to sign a mutual NDA before any sensitive details are shared.
        </p>
      </section>

      <SectionDivider />

      {/* CTA */}
      <section
        id="get-access"
        ref={ctaFade.ref}
        className={`max-w-[1140px] mx-auto px-5 py-14 text-center transition-all duration-700 ease-out ${ctaFade.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <h2 className="text-[clamp(20px,2.8vw,28px)] font-extrabold tracking-tight text-foreground mb-4">
          Ready to bid smarter?
        </h2>
        <p className="text-muted-foreground text-sm mb-6 max-w-[50ch] mx-auto">
          Want a deeper walkthrough for your team or info on rates?
        </p>
        <div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setSubmitted(false); setError(""); } }}>
            <DialogTrigger asChild>
              <button
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-extrabold transition-all hover:-translate-y-px cursor-pointer"
                style={{ background: "hsl(var(--gold))", color: "hsl(222 50% 10%)" }}
              >
                Get early access <ArrowRight size={15} />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] border-white/10 bg-[hsl(222_60%_8%)] text-foreground shadow-2xl shadow-black/40">
              {submitted ? (
                <div className="py-6 text-center">
                  <p className="text-lg font-bold" style={{ color: "hsl(var(--gold))" }}>
                    Request received. We'll be in touch shortly.
                  </p>
                </div>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl font-extrabold tracking-tight">
                      Get early access
                    </DialogTitle>
                    <p className="text-muted-foreground text-center text-sm pt-1">
                      Stop guessing. Start walking into meetings prepared.
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
                    <Button type="submit" disabled={submitting} className="w-full font-extrabold" style={{ background: "hsl(var(--gold))", color: "hsl(222 50% 10%)" }}>
                      {submitting ? "Submitting…" : "Submit"}
                    </Button>
                  </form>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
