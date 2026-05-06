import { useTrialStatus } from "@/hooks/use-trial-status";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Logo from "@/components/Logo";
import { useNavigate } from "react-router-dom";
import { lovable } from "@/integrations/lovable";
import { toast } from "@/hooks/use-toast";

const Paywall = () => {
  const { loading, trialExpired, isSubscribed } = useTrialStatus();
  const navigate = useNavigate();

  if (loading || isSubscribed || !trialExpired) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-md w-full text-center space-y-5 my-8">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="mx-auto w-14 h-14 rounded-full bg-[hsl(var(--gold))/.12] flex items-center justify-center">
          <Lock className="text-[hsl(var(--gold))]" size={26} />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Your free trial has ended</h2>
        <p className="text-muted-foreground text-sm">
          Pick a plan to keep bidding smarter.
        </p>

        <div className="grid grid-cols-3 gap-2 text-left">
          {[
            { name: "Solo", price: "$99", per: "/mo", note: "1 seat" },
            { name: "Agency", price: "$299", per: "/mo", note: "Up to 5 seats", featured: true },
            { name: "Enterprise", price: "Contact", per: "", note: "10+ seats" },
          ].map((t) => (
            <div
              key={t.name}
              className={`rounded-lg p-3 border ${
                t.featured
                  ? "border-[hsl(var(--gold))/.5] bg-[hsl(var(--gold))/.06]"
                  : "border-border bg-card"
              }`}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t.name}</p>
              <p className="text-base font-extrabold text-foreground mt-1">
                {t.price}
                <span className="text-[10px] font-medium text-muted-foreground">{t.per}</span>
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">{t.note}</p>
            </div>
          ))}
        </div>

        <Button
          size="lg"
          className="w-full font-bold"
          style={{ background: "hsl(var(--gold))", color: "hsl(var(--primary-foreground))" }}
          onClick={() => navigate("/pricing")}
        >
          Upgrade Now
        </Button>
        <p className="text-[11px] text-muted-foreground">
          Cancel anytime · Secure checkout
        </p>
      </div>
    </div>
  );
};

export default Paywall;
