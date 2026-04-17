import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-[52ch] mx-auto mb-10">
          See exactly how Production Bid Desk turns a creative board into a risk-mitigated bid outline in seconds.
        </p>

        <div
          className="relative w-full aspect-video rounded-xl overflow-hidden mx-auto"
          style={{
            background: "hsl(var(--secondary))",
            border: "1px solid hsl(var(--border))",
            boxShadow: "0 30px 80px -20px rgba(0,0,0,.6)",
          }}
        >
          <video
            src="/demo/production-bid-desk-demo.mp4"
            controls
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-contain bg-black"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Demo;
