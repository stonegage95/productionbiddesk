import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Lock, ServerCrash, FileCheck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const securityPillars = [
  { icon: Lock, label: "End-to-End Encryption" },
  { icon: ServerCrash, label: "Zero Data Retention" },
  { icon: Shield, label: "Private-Instance APIs" },
  { icon: FileCheck, label: "NDA-Ready Architecture" },
];

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
];

const FAQ = () => {
  useEffect(() => {
    document.title = "FAQ & Security — Production Bid Desk";
    const meta = document.querySelector('meta[name="description"]');
    if (meta)
      meta.setAttribute(
        "content",
        "Security, confidentiality, and frequently asked questions about Production Bid Desk."
      );
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Security & Confidentiality block */}
      <section className="max-w-[720px] mx-auto px-6 pt-24 pb-12 text-center">
        <p className="text-xs font-bold tracking-[.2em] uppercase mb-3 text-muted-foreground">
          Security & Confidentiality
        </p>
        <h1 className="text-[clamp(24px,3.5vw,38px)] font-extrabold tracking-tight text-foreground mb-4">
          NDA-Compliant AI for Global Advertising
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-[52ch] mx-auto mb-10">
          All creative assets are processed via Tier-1 encrypted, private-instance APIs. Zero data retention for model training. Built for the world's leading agencies.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {securityPillars.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 py-4 rounded-lg"
              style={{
                background: "hsl(var(--gold) / .04)",
                border: "1px solid hsl(var(--gold) / .1)",
              }}
            >
              <Icon size={20} style={{ color: "hsl(var(--gold-bright))" }} strokeWidth={1.5} />
              <span className="text-xs font-semibold text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[720px] mx-auto px-6">
        <div style={{ borderTop: "1px solid hsl(var(--border))" }} />
      </div>

      {/* FAQ */}
      <section className="max-w-[720px] mx-auto px-6 pt-12 pb-28">
        <p className="text-center text-xs font-bold tracking-[.2em] uppercase mb-3 text-muted-foreground">
          FAQ
        </p>
        <h2 className="text-[clamp(22px,3vw,32px)] font-extrabold tracking-tight text-foreground mb-14 text-center">
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

export default FAQ;
