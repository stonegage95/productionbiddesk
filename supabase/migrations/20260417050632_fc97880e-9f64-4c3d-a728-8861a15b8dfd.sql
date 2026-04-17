-- Create support_messages table for clapperboard widget inquiries
CREATE TABLE public.support_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  name TEXT,
  email TEXT,
  topic TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- Anyone (anonymous or authenticated) can insert
CREATE POLICY "Anyone can submit support messages"
ON public.support_messages
FOR INSERT
TO public
WITH CHECK (true);

-- Only the authenticated owner can view their own messages
CREATE POLICY "Users can view own support messages"
ON public.support_messages
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
