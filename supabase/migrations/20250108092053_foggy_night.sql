/*
  # Cleanup users without profiles

  1. Changes
    - Delete auth.users entries that don't have corresponding profiles
    
  2. Safety
    - Only deletes users without profiles
    - Preserves all profile data
    - Maintains referential integrity
*/

DO $$ 
BEGIN
  -- Delete users that don't have corresponding profiles
  DELETE FROM auth.users
  WHERE id NOT IN (
    SELECT id FROM public.profiles
  );
END $$;