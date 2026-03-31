import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GradientText from "@/components/GradientText";

const tiers = [
  {
    name: "Independent Producer",
    price: "$99",
    period: " / Month",
    bestFor: "Freelance PMs & Solopreneurs",
    features: [
      "Up to 3 Bids per month",
      "Standard AI Risk Mitigation",
      "Basic Export (PDF/CSV)",
    ],
    featured: false,
  },
  {
    name: "Production House",
    badge: "Recommended",
    price: "$399",
    period: " / Month",
    bestFor: "Boutique & Mid-Sized Houses",
    features: [
      "Unlimited Bids",
      "Advanced Logistics Analysis",
      "Priority Support",
      "Custom Branding on Exports",
    ],
    featured: true,
  },
  {
    name: "Agency Enterprise",
    price: "Contact for Pricing",
    period: "",
    bestFor: "Global Agencies & Networks",
    features: [
      "Multi-User Team Access",
      "Private API Instance",
      "Custom NDA Integration",
      "Dedicated Training",
    ],
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
        <section className="pt-20 pb-12 text-center px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            <GradientText>The "Executive" 3-Tier Pricing Model</GradientText>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Choose the plan that fits your production volume. No hidden fees, cancel anytime.
          </p>
        </section>

        <section className="max-w-[1100px] mx-auto px-6 pb-24">
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-8 flex flex-col transition-all ${
                  tier.featured
                    ? "border-2 border-primary shadow-[0_0_40px_rgba(212,175,55,0.15)] scale-[1.03]"
                    : "border border-border"
                }`}
                style={{ background: "hsl(var(--card))" }}
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

                {/* Best For */}
                <p className="text-muted-foreground text-sm mb-6">{tier.bestFor}</p>

                {/* Price */}
                <div className="mb-8">
                  <span className={`font-extrabold ${tier.period ? "text-4xl" : "text-2xl"}`}>
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-muted-foreground text-sm">{tier.period}</span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <span style={{ color: "hsl(var(--gold))" }} className="mt-0.5 shrink-0">•</span>
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="/#get-access"
                  className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-bold no-underline transition-all hover:brightness-110"
                  style={{
                    background: "hsl(var(--gold))",
                    color: "hsl(var(--primary-foreground))",
                  }}
                >
                  Get Started
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
