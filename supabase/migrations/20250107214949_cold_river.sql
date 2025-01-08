/*
  # Fix existing user profiles

  1. Changes
    - Insert missing profile records for existing users
    - Update existing profiles with proper default values
*/

-- Insert profiles for users that don't have them
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
WHERE users.id NOT IN (SELECT id FROM profiles);