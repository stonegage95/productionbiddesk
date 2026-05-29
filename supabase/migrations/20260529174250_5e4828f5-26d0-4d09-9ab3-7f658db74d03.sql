-- Fix trial_users: prevent self-promotion to subscribed status
DROP POLICY IF EXISTS "Users can update own trial" ON public.trial_users;

CREATE OR REPLACE FUNCTION public.prevent_trial_self_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only block changes when the caller is the row owner (not admin/service)
  IF auth.uid() = OLD.user_id THEN
    IF NEW.is_subscribed IS DISTINCT FROM OLD.is_subscribed
       OR NEW.stripe_customer_id IS DISTINCT FROM OLD.stripe_customer_id
       OR NEW.trial_end IS DISTINCT FROM OLD.trial_end
       OR NEW.trial_start IS DISTINCT FROM OLD.trial_start
       OR NEW.user_id IS DISTINCT FROM OLD.user_id
       OR NEW.email IS DISTINCT FROM OLD.email THEN
      RAISE EXCEPTION 'Not allowed to modify protected fields';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trial_users_prevent_self_escalation ON public.trial_users;
CREATE TRIGGER trial_users_prevent_self_escalation
BEFORE UPDATE ON public.trial_users
FOR EACH ROW EXECUTE FUNCTION public.prevent_trial_self_escalation();

CREATE POLICY "Users can update own trial"
ON public.trial_users
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Fix user_roles: block self-assignment of admin
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Lock down SECURITY DEFINER function execution
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.grant_owner_admin() FROM PUBLIC, anon, authenticated;
