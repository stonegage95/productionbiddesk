import { useTrialStatus } from "@/hooks/use-trial-status";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Logo from "@/components/Logo";

const Paywall = () => {
  const { loading, trialExpired, isSubscribed } = useTrialStatus();

  if (loading || isSubscribed || !trialExpired) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <Logo />
        <div className="mx-auto w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
          <Lock className="text-[#D4AF37]" size={28} />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Your free trial has ended</h2>
        <p className="text-muted-foreground">
          Upgrade to continue at <span className="text-[#D4AF37] font-semibold">$150/month</span>.
        </p>
        <Button
          size="lg"
          className="w-full bg-[#D4AF37] hover:bg-[#E5C44D] text-background font-semibold"
          onClick={() => {
            // Placeholder for Stripe checkout
            alert("Stripe checkout will be connected here. $150/month subscription.");
          }}
        >
          Start Subscription
        </Button>
      </div>
    </div>
  );
};

export default Paywall;
