import { useTrialStatus } from "@/hooks/use-trial-status";
import { Clock } from "lucide-react";

const TrialBanner = () => {
  const { loading, trialActive, daysRemaining, isSubscribed } = useTrialStatus();

  if (loading || isSubscribed || !trialActive) return null;

  return (
    <div className="w-full bg-[#D4AF37]/15 border-b border-[#D4AF37]/30 px-4 py-2 flex items-center justify-center gap-3 text-sm">
      <Clock size={14} className="text-[#D4AF37]" />
      <span className="text-foreground">
        Free Trial: <strong className="text-[#D4AF37]">{daysRemaining} day{daysRemaining !== 1 ? "s" : ""}</strong> remaining
      </span>
      <button
        onClick={() => {
          // Placeholder for Stripe checkout
          alert("Stripe checkout will be connected here. $150/month subscription.");
        }}
        className="text-[#D4AF37] hover:text-[#E5C44D] underline font-medium ml-1"
      >
        Upgrade now
      </button>
    </div>
  );
};

export default TrialBanner;
