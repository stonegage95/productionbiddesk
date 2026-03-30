import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShieldCheck, Lock, Eye, Server } from "lucide-react";
import { useScrollFadeIn } from "@/hooks/use-scroll-fade-in";

const pillars = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    desc: "Every file upload and data transfer is protected with enterprise-grade TLS encryption at rest and in transit.",
  },
  {
    icon: Server,
    title: "Private-Instance Processing",
    desc: "Your assets are processed on dedicated, isolated infrastructure — never co-mingled with other clients.",
  },
  {
    icon: Eye,
    title: "Zero Data Retention",
    desc: "Creative materials are purged immediately after analysis. Nothing is stored, indexed, or used for model training.",
  },
  {
    icon: ShieldCheck,
    title: "NDA-Ready Architecture",
    desc: "Our entire pipeline is designed to meet the confidentiality requirements of the world's leading agencies and studios.",
  },
];

const Security = () => {
  const fade = useScrollFadeIn(0.1);

  useEffect(() => {
    document.title = "Security & Confidentiality — Production Bid Desk";
    const meta = document.querySelector('meta[name="description"]');
    if (meta)
      meta.setAttribute(
        "content",
        "NDA-compliant AI for global advertising. Tier-1 encrypted, private-instance processing with zero data retention."
      );
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="max-w-[800px] mx-auto px-6 pt-24 pb-16 text-center">
        <p
          className="text-xs font-bold tracking-[.2em] uppercase mb-4"
          style={{ color: "hsl(var(--gold) / .6)" }}
        >
          Security & Confidentiality
        </p>
        <h1 className="text-[clamp(26px,4.5vw,48px)] leading-[1.08] tracking-tight font-extrabold text-foreground mb-6">
          NDA-Compliant AI for Global Advertising.
        </h1>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-[58ch] mx-auto">
          All creative assets — scripts, boards, treatments — are processed via
          Tier-1 encrypted, private-instance APIs. Zero data retention for model
          training. NDA-compliant architecture designed for the world's leading
          advertising agencies.
        </p>
      </section>

      <section
        ref={fade.ref}
        className={`max-w-[900px] mx-auto px-6 pb-28 transition-all duration-700 ease-out ${fade.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ background: "hsl(var(--border))" }}>
          {pillars.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-8 bg-background">
              <Icon
                size={22}
                strokeWidth={1.5}
                className="mb-4"
                style={{ color: "hsl(var(--gold-bright))" }}
              />
              <h3 className="text-base font-extrabold text-foreground mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Security;
