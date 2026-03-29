import { useEffect } from "react";
import {
  ArrowRight,
  BadgeDollarSign,
  CalendarRange,
  CheckCircle2,
  ClipboardList,
  Film,
  FolderOutput,
  ShieldAlert,
  Sparkles,
  TimerReset,
} from "lucide-react";

const navItems = [
  { label: "How it works", href: "#how-it-works" },
  { label: "What you get", href: "#deliverables" },
  { label: "Who it's for", href: "#audience" },
  { label: "Launch", href: "#launch" },
];

const quickStats = [
  { value: "60 sec", label: "to first analysis" },
  { value: "4 outputs", label: "from one brief" },
  { value: "Pre-bid", label: "clarity before commitment" },
];

const painPoints = [
  "You get pulled into budget conversations before the production realities are clear.",
  "Early bid numbers rely too heavily on gut feel, outdated references, or scattered notes.",
  "Hidden schedule and execution risks surface after the number is already in motion.",
  "Deck-building and scope framing steal time from actual strategic bid thinking.",
];

const deliverables = [
  {
    title: "Risk readout",
    description: "A sharp summary of production watch-outs before they become expensive surprises.",
    icon: ShieldAlert,
  },
  {
    title: "Budget ballpark",
    description: "A reasoned estimate range with the biggest cost drivers called out clearly.",
    icon: BadgeDollarSign,
  },
  {
    title: "Timeline view",
    description: "A fast schedule perspective covering production, post, and execution complexity.",
    icon: CalendarRange,
  },
  {
    title: "Deck outline",
    description: "A usable structure for the bid deck so your team can move faster with confidence.",
    icon: FolderOutput,
  },
];

const steps = [
  {
    title: "Drop in your materials",
    description: "Use a brief, script, storyboard, or treatment to start the analysis.",
    icon: ClipboardList,
  },
  {
    title: "Add practical context",
    description: "Layer in timing, market, constraints, references, and production realities.",
    icon: Film,
  },
  {
    title: "Review the output",
    description: "Get risks, budget logic, timeline direction, and a cleaner starting point for the bid.",
    icon: Sparkles,
  },
];

const audience = ["Producers", "Executive Producers", "Production Managers", "Cost Consultants", "Creative Operations Teams"];

const faqs = [
  {
    question: "What is Production Bid Desk?",
    answer:
      "Production Bid Desk is a pre-bid intelligence tool that helps production teams evaluate scope, risk, timing, and budget direction before committing to a number.",
  },
  {
    question: "What does it help with?",
    answer:
      "It helps teams walk into bid conversations with clearer assumptions, faster analysis, and more defensible starting points for pricing and planning.",
  },
  {
    question: "Who should use it?",
    answer:
      "It is designed for teams handling commercial, branded, and production-led bid workflows where speed and clarity matter early.",
  },
];

const Index = () => {
  useEffect(() => {
    document.title = "Production Bid Desk | Pre-Bid Analysis";

    const description = "Production Bid Desk gives producers and bid teams faster pre-bid clarity with risk flags, budget ballparks, timeline guidance, and deck-ready outputs.";

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", window.location.href);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Production Bid Desk",
            applicationCategory: "BusinessApplication",
            description:
              "Pre-bid analysis for production teams with risk flags, budget ballparks, timeline guidance, and deck-ready outputs.",
          }),
        }}
      />

      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <a href="#top" className="flex items-center gap-3 no-underline">
            <div className="brand-mark flex h-11 w-11 items-center justify-center rounded-2xl">
              <TimerReset className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.24em] text-muted-foreground uppercase">Production</p>
              <p className="text-lg font-black tracking-tight text-foreground">Bid Desk</p>
            </div>
          </a>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-muted-foreground no-underline transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a href="#launch" className="cta-secondary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold no-underline">
            Request access
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero-shell overflow-hidden px-5 pb-16 pt-8 md:px-8 md:pb-24 md:pt-12">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
                Standalone launch site
              </div>

              <div className="space-y-5">
                <h1 className="max-w-3xl text-5xl font-black leading-none tracking-[-0.05em] text-foreground md:text-7xl">
                  Stop guessing before the bid.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                  Production Bid Desk helps production teams pressure-test scope early with risk flags, budget ballparks,
                  timeline guidance, and deck-ready thinking before the number goes out.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a href="#launch" className="cta-primary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-black no-underline">
                  Launch Production Bid Desk
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#deliverables" className="cta-secondary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold no-underline">
                  See what you get
                </a>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {quickStats.map((stat) => (
                  <div key={stat.label} className="stat-chip rounded-3xl p-4">
                    <p className="text-2xl font-black tracking-tight text-foreground">{stat.value}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-visual relative min-h-[520px] rounded-[2rem] p-4 md:p-6">
              <div className="glow-orb glow-orb-one" aria-hidden="true" />
              <div className="glow-orb glow-orb-two" aria-hidden="true" />

              <div className="relative flex h-full flex-col justify-between rounded-[1.75rem] border border-border/60 bg-card/80 p-5 shadow-[var(--shadow-elevated)] backdrop-blur-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">Bid snapshot</p>
                    <p className="mt-2 text-2xl font-black tracking-tight text-foreground">Production Bid Desk</p>
                  </div>
                  <div className="rounded-full border border-border/70 bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                    Pre-bid ready
                  </div>
                </div>

                <div className="grid gap-4">
                  <article className="panel-surface rounded-[1.5rem] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">Risk signal</p>
                        <p className="mt-2 text-xl font-black tracking-tight text-foreground">Moderate complexity</p>
                      </div>
                      <ShieldAlert className="h-8 w-8 text-primary" />
                    </div>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">
                      Key watch-outs include compressed prep, multi-location coordination, and post-production lift.
                    </p>
                  </article>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <article className="panel-surface rounded-[1.5rem] p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">Budget direction</p>
                      <p className="mt-2 text-2xl font-black tracking-tight text-foreground">Ballpark range</p>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">A fast estimate frame with major cost drivers surfaced early.</p>
                    </article>
                    <article className="panel-surface rounded-[1.5rem] p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">Timeline view</p>
                      <p className="mt-2 text-2xl font-black tracking-tight text-foreground">Schedule pressure</p>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">A clearer read on production, post, and delivery timing before alignment meetings.</p>
                    </article>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-border/60 bg-background/70 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">Output includes</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['Risk flags', 'Budget logic', 'Timeline guidance', 'Deck outline'].map((item) => (
                      <span key={item} className="rounded-full border border-border/70 bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border/60 bg-card/40 px-5 py-14 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary">Why it exists</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground md:text-5xl">
                Production Bid Desk is built for the messy part before pricing feels safe.
              </h2>
            </div>
            <div className="grid gap-4">
              {painPoints.map((item) => (
                <article key={item} className="panel-surface rounded-[1.5rem] p-5">
                  <p className="text-base leading-7 text-panel-foreground">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary">How it works</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground md:text-5xl">A faster path to a smarter starting point.</h2>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <article key={step.title} className="panel-surface rounded-[1.75rem] p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-black tracking-[0.24em] text-primary">0{index + 1}</span>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="mt-8 text-2xl font-black tracking-tight text-foreground">{step.title}</h3>
                    <p className="mt-3 text-base leading-7 text-muted-foreground">{step.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="deliverables" className="bg-card/50 px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary">What you get</p>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground md:text-5xl">Everything on this page speaks to one product only: Production Bid Desk.</h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-muted-foreground">
                This standalone site is focused on one message: faster pre-bid clarity for production teams.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {deliverables.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="panel-surface rounded-[1.75rem] p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-8 text-2xl font-black tracking-tight text-foreground">{item.title}</h3>
                    <p className="mt-3 text-base leading-7 text-muted-foreground">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="audience" className="px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary">Who it is for</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground md:text-5xl">Made for teams that need speed without bluffing the numbers.</h2>
            </div>

            <div className="space-y-5">
              <div className="flex flex-wrap gap-3">
                {audience.map((item) => (
                  <span key={item} className="rounded-full border border-border/70 bg-card px-4 py-2 text-sm font-semibold text-card-foreground">
                    {item}
                  </span>
                ))}
              </div>

              <div className="panel-surface rounded-[1.75rem] p-6">
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary">Launch note</p>
                <p className="mt-4 text-lg leading-8 text-panel-foreground">
                  Production Bid Desk is now positioned as its own standalone product so visitors no longer have to sort through mixed messaging or multiple offers.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-card/50 px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary">FAQ</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground md:text-5xl">Clear messaging for launch.</h2>
            </div>

            <div className="mt-10 space-y-4">
              {faqs.map((item) => (
                <article key={item.question} className="panel-surface rounded-[1.5rem] p-6">
                  <h3 className="text-xl font-black tracking-tight text-foreground">{item.question}</h3>
                  <p className="mt-3 text-base leading-7 text-muted-foreground">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="launch" className="px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="launch-band rounded-[2rem] p-8 md:p-12">
              <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary-foreground/80">Production Bid Desk</p>
                  <h2 className="mt-4 text-3xl font-black tracking-tight text-primary-foreground md:text-5xl">
                    Launch the standalone story with one product, one message, and one call to action.
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-primary-foreground/78">
                    Every header label, footer note, section headline, button, and supporting message on this page is now focused on Production Bid Desk only.
                  </p>
                </div>

                <div className="rounded-[1.75rem] border border-primary-foreground/15 bg-background/10 p-6 backdrop-blur-sm">
                  <ul className="space-y-3">
                    {[
                      'Standalone product header',
                      'Production Bid Desk-only navigation',
                      'Dedicated launch messaging',
                      'Focused footer and CTA language',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm font-medium text-primary-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <a href="#top" className="inline-flex items-center justify-center gap-2 rounded-full bg-background px-5 py-3 text-sm font-black text-foreground no-underline">
                      Review the page
                    </a>
                    <a href="mailto:hello@productionbiddesk.com?subject=Production%20Bid%20Desk%20Launch" className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-foreground/25 px-5 py-3 text-sm font-bold text-primary-foreground no-underline">
                      Contact launch team
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-background px-5 py-10 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary">Production Bid Desk</p>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              Standalone pre-bid analysis for production teams that need clearer risks, stronger budget logic, and faster launch-ready planning.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-3" aria-label="Footer">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-sm font-semibold text-muted-foreground no-underline transition-colors hover:text-foreground">
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-3 border-t border-border/60 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Production Bid Desk. All messaging on this site is dedicated to Production Bid Desk only.</p>
          <p>Pre-bid intelligence for production teams.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
