import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What exactly does Production Bid Desk do?",
    a: "Production Bid Desk uses Autonomous AI Agents to analyse scripts, briefs, and storyboards — then generates a professional, risk-mitigated bid outline in about 60 seconds. Think of it as 20 years of line-producing instinct distilled into an instant second opinion on every bid.",
  },
  {
    q: "Is my creative material kept private and secure?",
    a: "Absolutely. Every file you upload is processed in a fully NDA-compliant, encrypted environment. Your scripts, budgets, and creative assets are never shared, stored long-term, or used to train any model. Privacy is non-negotiable.",
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
    q: "What does 'access' mean — is there a cost?",
    a: "Access lets you be among the first to use the platform and shape its roadmap. Pricing details will be shared directly with approved applicants. Book a demo to learn more about what's included.",
  },
];

const FAQ = () => {
  useEffect(() => {
    document.title = "FAQ — Production Bid Desk";
    const meta = document.querySelector('meta[name="description"]');
    if (meta)
      meta.setAttribute(
        "content",
        "Frequently asked questions about Production Bid Desk — AI-powered pre-bid analysis for producers and production teams."
      );
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="max-w-[720px] mx-auto px-6 pt-24 pb-28">
        <p className="text-center text-xs font-bold tracking-[.2em] uppercase mb-3 text-muted-foreground">
          Support
        </p>
        <h1 className="text-[clamp(26px,4vw,44px)] font-extrabold tracking-tight text-foreground mb-14 text-center">
          Frequently Asked Questions
        </h1>

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

export default FAQ;
