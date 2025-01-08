/*
  # Fix profiles table and trigger

  1. Changes
    - Drop and recreate profiles table with correct structure
    - Update trigger function to handle all required fields
*/

-- Recreate profiles table with proper structure
DROP TABLE IF EXISTS profiles CASCADE;

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT NOT NULL DEFAULT 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Update handle_new_user function with proper error handling
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
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'first_name', ''), 'User'),
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'last_name', ''), 'Unknown'),
    COALESCE(
      NULLIF(CONCAT(
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        ' ',
        COALESCE(NEW.raw_user_meta_data->>'last_name', '')
      ), ' '),
      NEW.raw_user_meta_data->>'full_name',
      NEW.email
    ),
    COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'avatar_url', ''),
      'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.id::text
    )
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;