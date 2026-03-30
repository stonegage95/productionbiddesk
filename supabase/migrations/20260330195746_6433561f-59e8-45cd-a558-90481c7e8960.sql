CREATE TABLE public.bid_desk_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  project_name TEXT NOT NULL DEFAULT 'Untitled',
  script TEXT,
  locations TEXT,
  shoot_days TEXT,
  talent_level TEXT,
  deliverables TEXT,
  risks TEXT,
  budget TEXT,
  timeline TEXT,
  raw_markdown TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.bid_desk_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reports"
  ON public.bid_desk_reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports"
  ON public.bid_desk_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports"
  ON public.bid_desk_reports FOR DELETE
  USING (auth.uid() = user_id);