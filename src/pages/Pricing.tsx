import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GradientText from "@/components/GradientText";

const tiers = [
  {
    name: "Solo",
    price: "$79",
    period: " / Month",
    bestFor: "1 seat",
    features: [],
    featured: false,
  },
  {
    name: "Agency",
    price: "$299",
    period: " / Month",
    bestFor: "Up to 5 seats",
    features: [],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Contact Us",
    period: "",
    bestFor: "10+ seats",
    features: [],
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
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
            <GradientText>The "Executive" 3-Tier Pricing Model</GradientText>
          </h1>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Choose the plan that fits your production volume. No hidden fees, cancel anytime.
          </p>
        </section>

        <section className="max-w-[1100px] mx-auto px-6 pb-24">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
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

                {tier.name === "Enterprise" && (
                  <a
                    href="/auth"
                    className="inline-flex items-center justify-center self-start rounded-md px-3 py-1.5 text-xs font-semibold no-underline transition-all hover:brightness-110"
                    style={{
                      background: "hsl(var(--gold))",
                      color: "hsl(var(--primary-foreground))",
                    }}
                  >
                    Contact Us
                  </a>
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            3-day free trial · No credit card required · Cancel anytime
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
