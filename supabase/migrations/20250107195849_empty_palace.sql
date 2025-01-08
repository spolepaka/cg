/*
  # Fix duplicate messages tables

  1. Changes
    - Drop realtime.messages table
    - Ensure only one messages table exists in public schema
*/

DROP TABLE IF EXISTS realtime.messages;

-- Ensure messages exists only in public schema
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'messages'
  ) THEN
    RETURN;
  END IF;

  CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    sender_id UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
  );

  ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Messages are viewable by authenticated users"
    ON public.messages FOR SELECT
    TO authenticated
    USING (true);

  CREATE POLICY "Users can insert own messages"
    ON public.messages FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = sender_id);
END $$;