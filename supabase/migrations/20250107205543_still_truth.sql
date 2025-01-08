/*
  # Update messages schema and relationships

  1. Changes
    - Ensure messages table has proper channel_id and sender_id relationships
    - Link messages to profiles for user information
*/

-- Recreate messages table with proper structure
DROP TABLE IF EXISTS messages;

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  channel_id UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);