/*
  # Create profiles for existing users

  1. Changes
    - Create profiles for any existing users that don't have one
*/

INSERT INTO profiles (id, full_name)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'full_name', email) as full_name
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles);