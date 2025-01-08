/*
  # Update profiles table with first and last name fields

  1. Changes
    - Add first_name and last_name columns to profiles table
    - Update existing profiles with split full_name data
    - Make first_name and last_name required fields

  2. Data Migration
    - Splits existing full_name values into first_name and last_name
    - Handles cases where full_name might be null
*/

-- Add new columns
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Update existing profiles by splitting full_name
UPDATE profiles 
SET 
  first_name = COALESCE(SPLIT_PART(full_name, ' ', 1), 'User'),
  last_name = COALESCE(NULLIF(SPLIT_PART(full_name, ' ', 2), ''), 'Unknown');

-- Make columns required
ALTER TABLE profiles 
ALTER COLUMN first_name SET NOT NULL,
ALTER COLUMN last_name SET NOT NULL;

-- Update handle_new_user function to use first and last name
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