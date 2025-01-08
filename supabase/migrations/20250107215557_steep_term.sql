/*
  # Fix messages and profiles relationship

  1. Changes
    - Drop existing messages table
    - Recreate messages table with proper foreign key to profiles
*/

-- Drop existing messages table
DROP TABLE IF EXISTS messages;

-- Recreate messages table with proper relationships
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  channel_id UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Disable RLS as per current configuration
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;