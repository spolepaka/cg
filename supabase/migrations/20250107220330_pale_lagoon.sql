/*
  # Improve avatar support and user profiles

  1. Changes
    - Add status field to profiles
    - Add last_seen field to profiles
    - Ensure high quality avatars for all users
*/

-- Add new fields to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS last_seen TIMESTAMPTZ DEFAULT now();

-- Update existing avatars to use better quality ones
UPDATE profiles
SET avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || id::text || '&backgroundColor=b6e3f4,c0aede,d1d4f9&backgroundType=gradientLinear'
WHERE avatar_url LIKE 'https://api.dicebear.com/7.x/avataaars/svg%';