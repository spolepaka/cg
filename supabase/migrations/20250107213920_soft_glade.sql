/*
  # Update profiles schema

  1. Changes
    - Make first_name and last_name required
    - Add avatar_url validation
    - Update trigger function
*/

-- Ensure columns exist and are required
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT NOT NULL DEFAULT 'User',
ADD COLUMN IF NOT EXISTS last_name TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN IF NOT EXISTS avatar_url TEXT NOT NULL 
  DEFAULT 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (
    id,
    first_name,
    last_name,
    full_name,
    avatar_url
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'Unknown'),
    COALESCE(
      NULLIF(CONCAT(
        NEW.raw_user_meta_data->>'first_name', 
        ' ', 
        NEW.raw_user_meta_data->>'last_name'
      ), ' '),
      NEW.raw_user_meta_data->>'full_name',
      NEW.email
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.id::text
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;