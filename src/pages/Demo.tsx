import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";

const Demo = () => {
  useEffect(() => {
    document.title = "Watch Demo — Production Bid Desk";
    const meta = document.querySelector('meta[name="description"]');
    if (meta)
      meta.setAttribute(
        "content",
        "Watch how Production Bid Desk transforms scripts and briefs into risk-mitigated bid outlines in under 60 seconds."
      );
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="max-w-[900px] mx-auto px-6 pt-24 pb-28 text-center">
        <p className="text-xs font-bold tracking-[.2em] uppercase mb-3 text-muted-foreground">
          See It In Action
        </p>
        <h1 className="text-[clamp(26px,4vw,44px)] font-extrabold tracking-tight text-foreground mb-6">
          The Production Bid Desk Demo
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-[50ch] mx-auto mb-12">
          A full product walkthrough is coming soon. In the meantime, book a
          live demo with our team to see exactly how it works.
        </p>

        {/* Video placeholder */}
        <div
          className="relative w-full aspect-video rounded-xl overflow-hidden mx-auto mb-12"
          style={{
            background: "hsl(var(--secondary))",
            border: "1px solid hsl(var(--border))",
            boxShadow: "0 30px 80px -20px rgba(0,0,0,.6)",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: "hsl(var(--gold) / .15)",
                border: "2px solid hsl(var(--gold) / .4)",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="ml-1">
                <path d="M8 5v14l11-7L8 5z" fill="hsl(43, 72%, 52%)" />
              </svg>
            </div>
          </div>
          <p className="absolute bottom-4 left-0 right-0 text-center text-xs text-muted-foreground font-medium tracking-wide uppercase">
            Full Demo — Coming Soon
          </p>
        </div>

        <a
          href="/#get-access"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-sm font-extrabold transition-all hover:brightness-110 no-underline"
          style={{
            background: "hsl(var(--gold))",
            color: "hsl(var(--primary-foreground))",
          }}
        >
          Book a Live Demo <ArrowRight size={16} />
        </a>
      </section>

      <Footer />
    </div>
  );
};

export default Demo;
