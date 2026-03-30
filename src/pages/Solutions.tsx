import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompetitiveEdge from "@/components/CompetitiveEdge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollFadeIn } from "@/hooks/use-scroll-fade-in";

const faqs = [
  {
    q: "How do you handle my creative assets?",
    a: "We operate in a secure, private environment. Your data is never sold, shared, or used for public AI training.",
  },
  {
    q: "What exactly does Production Bid Desk do?",
    a: "Production Bid Desk uses Autonomous AI Agents to analyse scripts, briefs, and storyboards — then generates a professional, risk-mitigated bid outline in about 60 seconds. Think of it as 20 years of line-producing instinct distilled into an instant second opinion on every bid.",
  },
  {
    q: "Who is this built for?",
    a: "Producers, Executive Producers, Production Managers, Cost Consultants, and Heads of Production — anyone who needs to move faster on bids without sacrificing accuracy or margin.",
  },
  {
    q: "How does the AI handle complex, multi-location shoots?",
    a: "Our agents break the project down by location, crew requirements, permits, and logistics risk factors. The system flags hidden costs — things like weather windows, overtime exposure, and travel day padding — so your bid reflects real-world production realities, not just spreadsheet math.",
  },
  {
    q: "What does 'early access' mean — is there a cost?",
    a: "Early access lets you be among the first to use the platform and shape its roadmap. Pricing details will be shared directly with approved applicants. Book a demo to learn more about what's included.",
  },
];

const Solutions = () => {
  const faqFade = useScrollFadeIn(0.1);

  useEffect(() => {
    document.title = "Solutions — Production Bid Desk";
    const meta = document.querySelector('meta[name="description"]');
    if (meta)
      meta.setAttribute(
        "content",
        "Discover how Production Bid Desk delivers speed, scale, security, and margin protection for production bidding."
      );
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="max-w-[800px] mx-auto px-6 pt-24 pb-4 text-center">
        <p
          className="text-xs font-bold tracking-[.2em] uppercase mb-4"
          style={{ color: "hsl(var(--gold) / .6)" }}
        >
          Solutions
        </p>
        <h1 className="text-[clamp(26px,4.5vw,48px)] leading-[1.08] tracking-tight font-extrabold text-foreground mb-6">
          The ROI of Smarter Bidding
        </h1>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-[55ch] mx-auto">
          Speed. Scale. Security. Margin protection. Here's how Production Bid Desk gives you the competitive edge.
        </p>
      </section>

      <CompetitiveEdge />

      {/* FAQ */}
      <section
        ref={faqFade.ref}
        className={`max-w-[720px] mx-auto px-6 pb-28 transition-all duration-700 ease-out ${faqFade.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <p className="text-center text-xs font-bold tracking-[.2em] uppercase mb-3 text-muted-foreground">
          Questions
        </p>
        <h2 className="text-[clamp(22px,3vw,36px)] font-extrabold tracking-tight text-foreground mb-12 text-center">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border-none rounded-xl px-6 transition-colors"
              style={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
              }}
            >
              <AccordionTrigger
                className="text-left text-[15px] font-bold hover:no-underline py-5"
                style={{ color: "hsl(var(--gold-bright))" }}
              >
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <Footer />
    </div>
  );
};

export default Solutions;
