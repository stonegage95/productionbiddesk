import { useTrialStatus } from "@/hooks/use-trial-status";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TrialBanner = () => {
  const { loading, trialActive, daysRemaining, isSubscribed } = useTrialStatus();
  const navigate = useNavigate();

  if (loading || isSubscribed || !trialActive) return null;

  return (
    <div className="w-full bg-[hsl(var(--gold))/.15] border-b border-[hsl(var(--gold))/.3] px-4 py-2 flex items-center justify-center gap-2 text-xs sm:text-sm flex-wrap">
      <Clock size={14} className="text-[hsl(var(--gold))]" />
      <span className="text-foreground">
        Free Trial:{" "}
        <strong className="text-[hsl(var(--gold))]">
          {daysRemaining} day{daysRemaining !== 1 ? "s" : ""}
        </strong>{" "}
        remaining
      </span>
      <button
        onClick={() => navigate("/pricing")}
        className="text-[hsl(var(--gold))] hover:brightness-110 underline font-semibold"
      >
        Upgrade
      </button>
    </div>
  );
};

export default TrialBanner;
