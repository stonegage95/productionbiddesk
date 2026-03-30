import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GradientText from "@/components/GradientText";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "$499",
    period: "/month",
    description: "For independent producers and small shops.",
    features: [
      "Up to 10 bid analyses / month",
      "Script & brief upload",
      "AI-powered cost breakdown",
      "Standard turnaround",
      "Email support",
    ],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Pro",
    price: "$1,299",
    period: "/month",
    description: "For production companies scaling output.",
    features: [
      "Unlimited bid analyses",
      "Priority AI processing",
      "Historical bid comparison",
      "Custom deliverable templates",
      "Dedicated account manager",
      "API access",
    ],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For studios & networks with complex workflows.",
    features: [
      "Everything in Pro",
      "SSO & team management",
      "Custom AI model tuning",
      "On-premise deployment option",
      "SLA & priority support",
      "White-label reports",
    ],
    cta: "Contact Sales",
    featured: false,
  },
];

const Pricing = () => {
  useEffect(() => {
    document.title = "Pricing — Production Bid Desk";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-[Manrope]">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="pt-20 pb-12 text-center px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            <GradientText>Simple, Transparent Pricing</GradientText>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Choose the plan that fits your production volume. No hidden fees, cancel anytime.
          </p>
        </section>

        {/* Pricing Cards */}
        <section className="max-w-[1100px] mx-auto px-6 pb-24">
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-8 flex flex-col transition-all ${
                  tier.featured
                    ? "bg-card border-2 border-primary shadow-[0_0_40px_rgba(212,175,55,0.15)] scale-[1.03]"
                    : "bg-card border border-border"
                }`}
              >
                {tier.featured && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full"
                    style={{
                      background: "hsl(var(--gold))",
                      color: "hsl(var(--primary-foreground))",
                    }}
                  >
                    Most Popular
                  </span>
                )}

                <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                <p className="text-muted-foreground text-sm mb-6">{tier.description}</p>

                <div className="mb-8">
                  <span className="text-4xl font-extrabold">{tier.price}</span>
                  <span className="text-muted-foreground text-sm">{tier.period}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check
                        size={16}
                        className="mt-0.5 shrink-0"
                        style={{ color: "hsl(var(--gold))" }}
                      />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="/#get-access"
                  className={`inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-bold no-underline transition-all ${
                    tier.featured
                      ? "hover:brightness-110"
                      : "border border-border hover:border-primary hover:text-primary"
                  }`}
                  style={
                    tier.featured
                      ? {
                          background: "hsl(var(--gold))",
                          color: "hsl(var(--primary-foreground))",
                        }
                      : undefined
                  }
                >
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
