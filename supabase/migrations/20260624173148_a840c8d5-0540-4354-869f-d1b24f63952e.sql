DROP TRIGGER IF EXISTS prevent_trial_self_escalation_trg ON public.trial_users;
CREATE TRIGGER prevent_trial_self_escalation_trg
BEFORE UPDATE ON public.trial_users
FOR EACH ROW EXECUTE FUNCTION public.prevent_trial_self_escalation();