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

        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={async () => {
            const result = await lovable.auth.signInWithOAuth("google", {
              redirect_uri: `${window.location.origin}/app`,
            });
            if (result.error) {
              toast({ title: "Google sign-in failed", description: result.error.message, variant: "destructive" });
            }
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M21.6 12.227c0-.709-.064-1.39-.182-2.045H12v3.868h5.382a4.6 4.6 0 0 1-1.995 3.018v2.51h3.227c1.886-1.737 2.986-4.296 2.986-7.35z"/>
            <path fill="#34A853" d="M12 22c2.7 0 4.964-.895 6.618-2.422l-3.227-2.51c-.895.6-2.04.955-3.391.955-2.605 0-4.81-1.76-5.596-4.123H3.064v2.59A9.997 9.997 0 0 0 12 22z"/>
            <path fill="#FBBC05" d="M6.404 13.9a6.005 6.005 0 0 1 0-3.8V7.51H3.064a10.005 10.005 0 0 0 0 8.98l3.34-2.59z"/>
            <path fill="#EA4335" d="M12 5.977c1.468 0 2.786.505 3.823 1.496l2.864-2.864C16.96 2.99 14.696 2 12 2A9.997 9.997 0 0 0 3.064 7.51l3.34 2.59C7.19 7.736 9.395 5.977 12 5.977z"/>
          </svg>
          Continue with Google
        </Button>

        <p className="text-[11px] text-muted-foreground">
          Cancel anytime · Secure checkout
        </p>
      </div>
    </div>
  );
};

export default Paywall;
