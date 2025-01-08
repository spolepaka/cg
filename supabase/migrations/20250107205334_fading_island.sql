/*
  # Update messages foreign key to reference profiles

  1. Changes
    - Modify messages.sender_id to reference profiles instead of auth.users
    
  2. Security
    - RLS remains disabled as requested
*/

-- Modify foreign key constraint on messages table
ALTER TABLE messages
DROP CONSTRAINT IF EXISTS messages_sender_id_fkey,
ADD CONSTRAINT messages_sender_id_fkey 
  FOREIGN KEY (sender_id) 
  REFERENCES profiles(id)
  ON DELETE CASCADE;