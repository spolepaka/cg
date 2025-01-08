/*
  # Add Messages-Profiles Relationship

  1. Changes
    - Add foreign key relationship between messages.sender_id and profiles.id
    - Update RLS policies to reflect the relationship
*/

ALTER TABLE messages
DROP CONSTRAINT IF EXISTS messages_sender_id_fkey,
ADD CONSTRAINT messages_sender_id_fkey 
  FOREIGN KEY (sender_id) 
  REFERENCES profiles(id)
  ON DELETE CASCADE;