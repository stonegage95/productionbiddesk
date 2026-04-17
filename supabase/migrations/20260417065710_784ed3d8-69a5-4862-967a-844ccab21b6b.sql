-- Allow admins to view all trial users for CRM dashboard
CREATE POLICY "Admins can view all trial users"
ON public.trial_users
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));