
CREATE TABLE public.trial_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  trial_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  trial_end TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '3 days'),
  is_subscribed BOOLEAN NOT NULL DEFAULT false,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.trial_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trial" ON public.trial_users
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trial" ON public.trial_users
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trial" ON public.trial_users
  FOR UPDATE USING (auth.uid() = user_id);
