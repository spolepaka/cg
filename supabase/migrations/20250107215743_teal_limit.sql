/*
  # Ensure profiles exist and fix messages relationship

  1. Changes
    - Ensure all users have profiles
    - Recreate messages table with proper profile reference
*/

-- First ensure all users have profiles
INSERT INTO profiles (
  id,
  first_name,
  last_name,
  full_name,
  avatar_url
)
SELECT 
  users.id,
  COALESCE(users.raw_user_meta_data->>'first_name', 'User'),
  COALESCE(users.raw_user_meta_data->>'last_name', 'Unknown'),
  COALESCE(
    NULLIF(CONCAT(
      COALESCE(users.raw_user_meta_data->>'first_name', ''),
      ' ',
      COALESCE(users.raw_user_meta_data->>'last_name', '')
    ), ' '),
    users.raw_user_meta_data->>'full_name',
    users.email
  ),
  'https://api.dicebear.com/7.x/avataaars/svg?seed=' || users.id::text
FROM auth.users
WHERE users.id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;

-- Recreate messages table with proper relationships
DROP TABLE IF EXISTS messages;

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  channel_id UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Disable RLS as per current configuration
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;