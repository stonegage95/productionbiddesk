import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TrialStatus {
  loading: boolean;
  trialActive: boolean;
  daysRemaining: number;
  isSubscribed: boolean;
  trialExpired: boolean;
}

export function useTrialStatus(): TrialStatus {
  const [status, setStatus] = useState<TrialStatus>({
    loading: true,
    trialActive: false,
    daysRemaining: 0,
    isSubscribed: false,
    trialExpired: false,
  });

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setStatus(s => ({ ...s, loading: false, trialExpired: true }));
        return;
      }

      const { data, error } = await supabase
        .from("trial_users")
        .select("trial_end, is_subscribed")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error || !data) {
        setStatus(s => ({ ...s, loading: false, trialExpired: true }));
        return;
      }

      if (data.is_subscribed) {
        setStatus({ loading: false, trialActive: true, daysRemaining: 0, isSubscribed: true, trialExpired: false });
        return;
      }

      const now = new Date();
      const end = new Date(data.trial_end);
      const diffMs = end.getTime() - now.getTime();
      const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

      setStatus({
        loading: false,
        trialActive: daysRemaining > 0,
        daysRemaining,
        isSubscribed: false,
        trialExpired: daysRemaining <= 0,
      });
    };

    check();
  }, []);

  return status;
}
