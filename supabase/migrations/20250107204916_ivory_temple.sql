-- Drop and recreate messages table with channel support
DROP TABLE IF EXISTS messages;

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  channel_id UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Disable RLS as requested
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;